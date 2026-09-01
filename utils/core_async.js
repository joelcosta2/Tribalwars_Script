// Async/network helpers: delay, bounded concurrency, HTTP 429 retry, cross-origin GM fetch.

/**
 * Returns a Promise that resolves after the given number of seconds.
 * @param {number} seconds
 * @returns {Promise<void>}
 */
function wait(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

/**
 * Runs `worker` over `items` with at most `concurrency` calls in flight at once, waiting a
 * random delay in [minDelay, maxDelay] ms before every start (including slot refills) — used to
 * avoid bursting many simultaneous requests against the game server (which starts responding
 * with HTTP 429 after only a handful of concurrent requests). Never rejects — a worker's own
 * error is swallowed so one failed item doesn't stop the rest of the batch; callers that need to
 * know about failures should handle them inside `worker` itself.
 * @param {Array<*>} items
 * @param {(item:*, index:number) => Promise<*>} worker
 * @param {{concurrency?:number, minDelay?:number, maxDelay?:number}} [options]
 * @returns {Promise<void>} Resolves once every item has settled.
 */
function runWithConcurrencyLimit(items, worker, { concurrency = 2, minDelay = 150, maxDelay = 400 } = {}) {
    let nextIndex = 0;

    function runNext() {
        const index = nextIndex++;
        if (index >= items.length) return Promise.resolve();

        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        return wait(delay / 1000)
            .then(() => Promise.resolve(worker(items[index], index)).catch(() => {}))
            .then(runNext);
    }

    const lanes = Array.from({ length: Math.min(concurrency, items.length) }, runNext);
    return Promise.all(lanes);
}

/**
 * Resolves a Retry-After header value (either delay-seconds or an HTTP-date) to a millisecond
 * delay, falling back to the given value when the header is missing or unparsable.
 * @param {string|null|undefined} headerValue
 * @param {number} fallbackMs
 * @returns {number}
 */
function parseRetryAfterMs(headerValue, fallbackMs) {
    if (!headerValue) return fallbackMs;
    const seconds = Number(headerValue);
    if (!Number.isNaN(seconds)) return seconds * 1000;
    const dateMs = Date.parse(headerValue);
    return Number.isNaN(dateMs) ? fallbackMs : Math.max(0, dateMs - Date.now());
}

/**
 * Wraps `$.ajax` with automatic retry on HTTP 429 (rate limited): honors the response's
 * Retry-After header when present, else backs off exponentially (baseDelayMs * 2^attempt). Any
 * other error status/network failure rejects immediately, same as a bare `$.ajax` call would.
 * @param {Object} ajaxSettings - Passed through to $.ajax as-is (success/error are overridden).
 * @param {{maxRetries?:number, baseDelayMs?:number}} [options]
 * @returns {Promise<*>} Resolves with the response data on success.
 */
function fetchWithRetry429(ajaxSettings, { maxRetries = 3, baseDelayMs = 1000 } = {}) {
    function attempt(retryCount) {
        return new Promise((resolve, reject) => {
            $.ajax(Object.assign({}, ajaxSettings, { success: resolve, error: reject }));
        }).catch((jqXHR) => {
            if (jqXHR?.status === 429 && retryCount < maxRetries) {
                const fallbackMs = baseDelayMs * Math.pow(2, retryCount);
                const retryAfterMs = parseRetryAfterMs(jqXHR.getResponseHeader?.('Retry-After'), fallbackMs);
                return wait(retryAfterMs / 1000).then(() => attempt(retryCount + 1));
            }
            return Promise.reject(jqXHR);
        });
    }

    return attempt(0);
}

/**
 * Wraps GM_xmlhttpRequest in a Promise for use with async/await.
 * Needed for cross-origin fetches (e.g. twstats.com) that regular fetch() cannot
 * perform due to CORS restrictions on the game page.
 * @param {string} url
 * @param {{method?: string, data?: string}} [options] - method defaults to GET; data is a
 *   url-encoded form body, used e.g. for TWStats' POST-only ranking search.
 * @returns {Promise<string>} Response text
 */
function gmFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: options.method || 'GET',
            url: url,
            data: options.data,
            headers: options.data ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined,
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response.responseText);
                } else {
                    reject(new Error('HTTP ' + response.status + ' — ' + url));
                }
            },
            onerror: function () {
                reject(new Error('Network error fetching ' + url));
            }
        });
    });
}
