// Persisted-timeout scheduler: setTimeout wrappers that survive page reloads via localStorage.

var activeTimeouts = {};
// Maps a short handler name to a real function reference (see registerTimeoutHandler /
// setHandlerOnTimeOut) so persisted timers never need eval/new Function to survive a reload —
// those were found to be unreliable across some of Tampermonkey's execution contexts (CSP
// blocks them outright there).
var timeoutHandlers = {};

/**
 * Registers a function under a short name so persisted timers can call it by name later
 * (see setHandlerOnTimeOut), instead of serialising its source code for eval/new Function.
 * @param {string} name
 * @param {Function} fn
 */
function registerTimeoutHandler(name, fn) {
    timeoutHandlers[name] = fn;
}

/**
 * Schedules a function with a random extra delay to reduce bot patterns.
 * Persists the end time and serialised function to localStorage so the timeout
 * survives page reloads and can be restored by restoreTimeouts().
 * @param {string} id - Unique key for deduplication and storage.
 * @param {Function} func
 * @param {number} timeToRun - Base delay in milliseconds.
 * @param {number} [jitterMinMs=0] - Minimum random extra delay in milliseconds.
 * @param {number} [jitterMaxMs=180000] - Maximum random extra delay in milliseconds (default 3 min).
 */
function setFunctionOnTimeOut(id, func, timeToRun, jitterMinMs = 0, jitterMaxMs = 180000) {
    if (activeTimeouts[id]) {
        clearTimeout(activeTimeouts[id]);
    }

    // Narrower jitter range lets time-sensitive callers stay inside a tight window
    let randomExtraTime = jitterMinMs + Math.random() * (jitterMaxMs - jitterMinMs);
    let finalTimeToRun = Math.floor(timeToRun + randomExtraTime);

    let endTime = Math.floor(Date.now() + finalTimeToRun);
    localStorage.setItem('endTime_' + id, endTime);
    localStorage.setItem('function_' + id, func.toString());

    activeTimeouts[id] = setTimeout(() => {
        localStorage.removeItem('endTime_' + id);
        localStorage.removeItem('function_' + id);
        func();
        delete activeTimeouts[id];
    }, finalTimeToRun);
}

/**
 * Like setFunctionOnTimeOut, but for callers that need to bake arguments (e.g. a villageId) into
 * the persisted timer. Persists plain JSON {handlerName, args} instead of function source text —
 * restoreTimeouts() looks the handler up in timeoutHandlers and calls it directly, so no
 * eval/new Function is ever needed to survive a reload.
 * @param {string} id - Unique key for deduplication and storage.
 * @param {string} handlerName - Name registered via registerTimeoutHandler.
 * @param {Array} args - JSON-serialisable arguments to call the handler with.
 * @param {number} timeToRun - Base delay in milliseconds.
 * @param {number} [jitterMinMs=0] - Minimum random extra delay in milliseconds.
 * @param {number} [jitterMaxMs=180000] - Maximum random extra delay in milliseconds (default 3 min).
 */
function setHandlerOnTimeOut(id, handlerName, args, timeToRun, jitterMinMs = 0, jitterMaxMs = 180000) {
    if (activeTimeouts[id]) {
        clearTimeout(activeTimeouts[id]);
    }

    let randomExtraTime = jitterMinMs + Math.random() * (jitterMaxMs - jitterMinMs);
    let finalTimeToRun = Math.floor(timeToRun + randomExtraTime);

    let endTime = Math.floor(Date.now() + finalTimeToRun);
    localStorage.setItem('endTime_' + id, endTime);
    localStorage.setItem('handler_' + id, JSON.stringify({ handlerName, args }));

    activeTimeouts[id] = setTimeout(() => {
        localStorage.removeItem('endTime_' + id);
        localStorage.removeItem('handler_' + id);
        const handler = timeoutHandlers[handlerName];
        if (handler) handler(...args);
        else console.error('[TW] No timeout handler registered for "' + handlerName + '"');
        delete activeTimeouts[id];
    }, finalTimeToRun);
}

/**
 * Re-schedules any pending timeouts stored in localStorage by setFunctionOnTimeOut or
 * setHandlerOnTimeOut. If a timeout has already elapsed, it's executed immediately.
 * Handler-based entries (JSON) are dispatched directly; legacy function-source entries still
 * fall back to eval for backward compatibility with older persisted timers.
 */
function restoreTimeouts() {
    // Restore all pending timeouts from previous page loads
    for (var key in localStorage) {
        if (key.startsWith('endTime_')) {
            var id = key.replace('endTime_', '');

            var endTime = localStorage.getItem(key);
            var remainingTime = parseInt(endTime) - Date.now();

            var run = function (id) {
                var handlerRaw = localStorage.getItem('handler_' + id);
                if (handlerRaw) {
                    try {
                        var parsed = JSON.parse(handlerRaw);
                        var handler = timeoutHandlers[parsed.handlerName];
                        if (handler) handler(...parsed.args);
                        else console.error('[TW] No timeout handler registered for "' + parsed.handlerName + '" (restore)');
                    } catch (e) {
                        console.error('[TW] Failed to restore handler-based timeout ' + id, e);
                    }
                    return;
                }
                eval('(' + localStorage.getItem('function_' + id) + ')();');
            };

            if (remainingTime > 0) {
                setTimeout(function () { run(id); }, remainingTime);
            } else {
                run(id);
                localStorage.removeItem('endTime_' + id);
                localStorage.removeItem('function_' + id);
                localStorage.removeItem('handler_' + id);
                if (activeTimeouts[id]) {
                    clearTimeout(activeTimeouts[id]);
                }
            }
        }
    }
}
