// Server-timezone detection and TW date/time string parsing + countdown display helpers.

// Server-to-UTC timezone offset in ms (e.g. BRT=UTC-3 → -10800000).
// Detected once on start() by comparing the TW server clock with Timing.getCurrentServerTime().
var serverTimezoneOffsetMs = 0;

/**
 * Detects the server's UTC offset in milliseconds by comparing the TW header clock
 * (server-local H:M:S) with Timing.getCurrentServerTime() (UTC epoch).
 * Example: BR server (BRT = UTC-3) returns -10800000.
 */
function detectServerTimezoneOffsetMs() {
    const clockEl = document.getElementById('serverTime') ||
                    document.querySelector('.servertimer');
    if (!clockEl) {
        console.warn('[TW] Server clock element not found — timezone offset defaults to 0');
        return 0;
    }
    const timeText = clockEl.textContent.trim();
    const parts = timeText.split(':');
    if (parts.length < 2) return 0;
    const displayedH = parseInt(parts[0], 10);
    const displayedM = parseInt(parts[1], 10);
    const displayedS = parts[2] ? parseInt(parts[2], 10) : 0;
    if (isNaN(displayedH) || isNaN(displayedM) || isNaN(displayedS)) return 0;

    const serverNowMs = Timing.getCurrentServerTime();
    const d = new Date(serverNowMs);
    const utcH = d.getUTCHours();
    const utcM = d.getUTCMinutes();
    const utcS = d.getUTCSeconds();

    let offsetS = (displayedH * 3600 + displayedM * 60 + displayedS) -
                  (utcH * 3600 + utcM * 60 + utcS);
    // Wrap to [-12h, +12h] to handle day-boundary reads
    const halfDayS = 12 * 3600;
    if (offsetS > halfDayS) offsetS -= 86400;
    if (offsetS < -halfDayS) offsetS += 86400;
    return offsetS * 1000;
}

/**
 * Converts a TW wall-clock time string (displayed in server timezone) to a UTC epoch in ms.
 * Use this instead of new Date().setHours() everywhere TW time strings are parsed.
 * @param {number} hora - Hour (0-23)
 * @param {number} minuto - Minute (0-59)
 * @param {number} segundo - Second (0-59)
 * @param {number} dayOffset - 0 = today, 1 = tomorrow, -1 = yesterday (relative to server's day)
 * @returns {number} UTC epoch in milliseconds
 */
function twWallClockToEpochMs(hora, minuto, segundo, dayOffset) {
    const serverNowMs = Timing.getCurrentServerTime();
    // Shift into server-local space so UTC arithmetic gives server-local H/M/S
    const serverLocalMs = serverNowMs + serverTimezoneOffsetMs;
    // Midnight of the server's current day (in server-local space)
    const serverLocalMidnightMs = serverLocalMs - (serverLocalMs % 86400000);
    // Build target in server-local space, then shift back to UTC
    return serverLocalMidnightMs
        + hora * 3600000
        + minuto * 60000
        + segundo * 1000
        + dayOffset * 86400000
        - serverTimezoneOffsetMs;
}

/**
 * Parses a TW localised build-time string (e.g. "hoje às 14:30:00") using tw_lang keys
 * and returns [dayOffset, H, M, S] as strings. dayOffset is "0" for today, "1" for tomorrow.
 * @param {string} stringHTML
 * @returns {string[]|undefined}
 */
function extractBuildTimeFromHTML(stringHTML) {
    const lang = JSON.parse(localStorage.getItem('tw_lang'));
    const stringToday = lang['aea2b0aa9ae1534226518faaefffdaad'];
    const stringTomorrow = lang['57d28d1b211fddbb7a499ead5bf23079'];
    let time;

    if (stringToday && stringTomorrow) {
        const modelosStrings = [stringToday, stringTomorrow];
        let day, hora, minuto, segundo;

        for (const [index, modeloString] of modelosStrings.entries()) {
            // Build a regex that also captures optional seconds
            const regexString = modeloString
                .replace(/\\/g, "\\\\")
                .replace(/%s/, "(\\d{1,2}):(\\d{2})(?::(\\d{2}))?"); // Segundos opcionais

            const regex = new RegExp(regexString);
            const match = stringHTML.match(regex);
            if (match) {
                day = index.toString();
                hora = match[1].toString();
                minuto = match[2].toString();
                segundo = match[3] ? match[3].toString() : "00"; // default to "00" if seconds are absent
                break;
            }
        }

        if (day && hora && minuto && segundo) {
            time = [day, hora, minuto, segundo];
            return time;
        }
    }

    showAutoHideBox(t('core.errorExtractBuildTime'));
    return time;
}

/**
 * Converts an explicit TW calendar date (day/month[/year]) plus a wall-clock time in the
 * server's timezone to a UTC epoch in ms. TW switches from "today"/"tomorrow" phrasing to an
 * explicit "DD.MM.[YYYY]" (or "MM.DD.[YYYY]" on the US market) date once an entry is more than
 * one day out — this is what queues render for the finish time when there's a long backlog.
 * @param {number} day
 * @param {number} month - 1-indexed
 * @param {number|null} year - Full or 2-digit year, or null/undefined if omitted from the string
 * @param {number} hora
 * @param {number} minuto
 * @param {number} segundo
 * @returns {number} UTC epoch in milliseconds
 */
function twCalendarDateToEpochMs(day, month, year, hora, minuto, segundo) {
    const serverNowMs = Timing.getCurrentServerTime();
    const serverLocalMs = serverNowMs + serverTimezoneOffsetMs;
    const serverLocalNow = new Date(serverLocalMs);
    const currentYear = serverLocalNow.getUTCFullYear();

    let targetYear = year;
    if (targetYear && targetYear < 100) targetYear += 2000;
    if (!targetYear) targetYear = currentYear;

    let targetLocalMs = Date.UTC(targetYear, month - 1, day, hora, minuto, segundo);

    // No year in the string and the resulting date is already in the past — it must be next year
    if (!year) {
        const todayLocalMidnightMs = Date.UTC(currentYear, serverLocalNow.getUTCMonth(), serverLocalNow.getUTCDate());
        if (targetLocalMs < todayLocalMidnightMs) {
            targetLocalMs = Date.UTC(targetYear + 1, month - 1, day, hora, minuto, segundo);
        }
    }

    return targetLocalMs - serverTimezoneOffsetMs;
}

/**
 * Like extractBuildTimeFromHTML but returns a UTC epoch in milliseconds,
 * corrected for the server timezone via twWallClockToEpochMs.
 * Handles "today"/"tomorrow" phrasing as well as the explicit "DD.MM. HH:MM[:SS]" date format
 * TW uses once a queue entry finishes more than a day from now (e.g. long training/build queues).
 * @param {string} stringHTML
 * @returns {number|null}
 */
function extractBuildTimestampFromHTML(stringHTML) {
    const lang = JSON.parse(localStorage.getItem('tw_lang'));
    if (!lang) {
        alert(t('core.errorExtractBuildTimestamp'));
        return null;
    }

    const stringToday = lang['aea2b0aa9ae1534226518faaefffdaad'];
    const stringTomorrow = lang['57d28d1b211fddbb7a499ead5bf23079'];

    if (stringToday && stringTomorrow) {
        const modelosStrings = [stringToday, stringTomorrow];

        for (const [index, modeloString] of modelosStrings.entries()) {
            const regexString = modeloString
                .replace(/\\/g, "\\\\")
                .replace(/%s/, "(\\d{1,2}):(\\d{2})(?::(\\d{2}))?");

            const regex = new RegExp(regexString);
            const match = stringHTML.match(regex);

            if (match) {
                const hora = parseInt(match[1]);
                const minuto = parseInt(match[2]);
                const segundo = match[3] ? parseInt(match[3]) : 0; // default to 0 if seconds are absent
                return twWallClockToEpochMs(hora, minuto, segundo, index); // index: 0 = today, 1 = tomorrow
            }
        }
    }

    // Not "today"/"tomorrow" — entries more than a day out use an explicit date instead.
    // TW has two variants of this template (with/without year in the surrounding sentence).
    const stringFutureWithYear = lang['0cb274c906d622fa8ce524bcfbb7552d'];
    const stringFutureNoYear = lang['850731037a4693bf4338a0e8b06bd2e4'];
    const isUsMarket = typeof game_data !== 'undefined' && game_data && game_data.market === 'us';
    const dateGroupRegex = "(\\d{1,2})\\.(\\d{1,2})\\.(\\d{2,4})?\\.?";

    for (const template of [stringFutureWithYear, stringFutureNoYear]) {
        if (!template) continue;

        const regexString = template
            .replace(/\\/g, "\\\\")
            .replace(/%1/, dateGroupRegex)
            .replace(/%2/, "(\\d{1,2}):(\\d{2})(?::(\\d{2}))?");

        const regex = new RegExp(regexString);
        const match = stringHTML.match(regex);

        if (match) {
            const first = parseInt(match[1]);
            const second = parseInt(match[2]);
            const year = match[3] ? parseInt(match[3]) : null;
            const day = isUsMarket ? second : first;
            const month = isUsMarket ? first : second;
            const hora = parseInt(match[4]);
            const minuto = parseInt(match[5]);
            const segundo = match[6] ? parseInt(match[6]) : 0;
            return twCalendarDateToEpochMs(day, month, year, hora, minuto, segundo);
        }
    }

    return null;
}

/**
 * Returns remaining time until a Unix timestamp (seconds) as [HH, MM, SS] strings,
 * or null if already elapsed. Uses the server's current time as 'now'.
 * @param {number} endtime - Unix timestamp in seconds.
 * @returns {string[]|null}
 */
function endTimeToTimer(endtime) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    if (remaining <= 0) {
        return null;
    } else {
        var hours = Math.floor(remaining / 3600);
        var minutes = Math.floor((remaining % 3600) / 60);
        var seconds = remaining % 60;
        return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')];
    }
}

/**
 * Converts an "HH:MM:SS" duration string to milliseconds.
 * @param {string} timeString
 * @returns {number}
 */
function timeToMilliseconds(timeString) {
    var parts = timeString.split(':');

    var hours = parseInt(parts[0], 10) * 60 * 60 * 1000;
    var minutes = parseInt(parts[1], 10) * 60 * 1000;
    var seconds = parseInt(parts[2], 10) * 1000;

    return hours + minutes + seconds;
}

/**
 * Converts a fractional-minutes value to an "H:MM:SS" string.
 * @param {number} minutes
 * @returns {string}
 */
function formatMinutesToTime(minutes) {
    const totalSeconds = Math.round(minutes * 60);

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Updates an element's text with the countdown to endtime, or 'END' when elapsed.
 * Intended to be called on a repeating interval.
 * @param {number} endtime - Unix timestamp in seconds.
 * @param {HTMLElement} element
 */
function startResourceTimerFull(endtime, element) {
    var remaining = endTimeToTimer(endtime);
    if (!remaining) {
        element.textContent = t('common.end');
        clearInterval(element.dataset.interval);
    } else {
        element.textContent = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
    }
    element.style.display = "block";
}

/**
 * Replaces the HH:MM:SS portion of an element's text content in-place with the
 * current countdown to endtime. Intended to be called on a repeating interval.
 * @param {number} endtime - Unix timestamp in seconds.
 * @param {HTMLElement} element
 */
function startTimerOnLabel(endtime, element) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;

    if (remaining <= 0) {
        element.textContent = '';
        clearInterval(element.dataset.interval);
    } else {
        var hours = Math.floor(remaining / 3600).toString().padStart(2, '0');
        var minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
        var seconds = (remaining % 60).toString().padStart(2, '0');

        var formattedTime = `${hours}:${minutes}:${seconds}`;

        // Anchored to end and using \d+ for hours so 3+ digit hour counts (100+) don't leave stray leading digits behind
        element.textContent = element.textContent.replace(/\d+:\d{2}:\d{2}$/, formattedTime);
    }
    element.style.display = "block";
}
