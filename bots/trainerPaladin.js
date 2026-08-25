// Bot: Auto Paladin Trainer
// Trains the paladin via direct API calls — no page redirects needed.
//
// Flow:
//   1. checkAndSchedulePaladinTrainer() — called on every page load from start().
//      Guards against double-scheduling. Delegates to fetchAndStartPaladinTraining().
//   2. fetchAndStartPaladinTraining() — fetches screen=statue, parses knight data from
//      the BuildingStatue.receiveKnightsData() script block (all knight state is
//      embedded as JS, not static HTML). Then either re-schedules (training in
//      progress) or starts a new session.
//   3. _startPaladinTraining(knightId, regimenId, durationSec) — POSTs the training
//      request and schedules the next check via setFunctionOnTimeOut.

// ─── Public entry point ────────────────────────────────────────────────────────

/**
 * Called on every page load (from start()) and from the setFunctionOnTimeOut
 * callback after training finishes. Guards against double-scheduling.
 */
async function checkAndSchedulePaladinTrainer() {
    if (!window.PremiumFeaturesPrivateAutomations) return;
    if (!settings_cookies?.general?.show__auto_paladin_train?.enabled) return;

    // Clear any legacy redirect-based stored function from the old bot version
    const storedFn = localStorage.getItem('function_auto_trainer_paladin') || '';
    if (storedFn.includes('location.href')) {
        localStorage.removeItem('function_auto_trainer_paladin');
        localStorage.removeItem('endTime_auto_trainer_paladin');
    }

    // If a timer is still active and in the future, nothing to do
    const endTime = parseInt(localStorage.getItem('endTime_auto_trainer_paladin'), 10);
    if (endTime && endTime > Date.now()) return;

    await fetchAndStartPaladinTraining();
}

// ─── Core logic ────────────────────────────────────────────────────────────────

/**
 * Fetches screen=statue and parses knight state from the BuildingStatue script block.
 * Decides next action:
 *   - No paladin yet           → stop (nothing to train).
 *   - Max level reached        → stop.
 *   - Training in progress     → re-arm setFunctionOnTimeOut for when it finishes.
 *   - Training slot free       → start cheapest regimen.
 */
async function fetchAndStartPaladinTraining() {
    let doc;
    try {
        const resp = await fetch(game_data.link_base_pure + 'statue', { credentials: 'include' });
        if (!resp.ok) {
            console.error('[PaladinTrainer] Failed to fetch statue page:', resp.status);
            return;
        }
        doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    } catch (e) {
        console.error('[PaladinTrainer] Fetch exception:', e);
        return;
    }

    const knight = _parseKnightData(doc);
    if (!knight) return; // no paladin or parse failed — nothing to do

    // Cache end time for overview display
    if (knight.activity?.finish_time) {
        localStorage.setItem('statue_knight_endtime', String(knight.activity.finish_time));
    }

    // Check max level
    const maxLevel = settings_cookies.general['show__auto_paladin_train']?.maxLevel ?? 30;
    if (knight.level >= maxLevel) {
        console.log('[PaladinTrainer] Max level reached (' + knight.level + '/' + maxLevel + '). Stopping.');
        return;
    }

    // If training is already running, schedule next check for when it ends
    if (knight.current_regimen !== null) {
        const finishTimeSec = knight.activity?.finish_time;
        if (finishTimeSec) {
            const waitMs = Math.max(0, finishTimeSec * 1000 - Timing.getCurrentServerTime());
            if (waitMs > 0) {
                setFunctionOnTimeOut('auto_trainer_paladin', function () { checkAndSchedulePaladinTrainer(); }, waitMs);
                return;
            }
        }
        console.warn('[PaladinTrainer] Training in progress but end time not readable.');
        return;
    }

    // Training slot free — start cheapest (first) regimen
    const usableRegimens = knight.usable_regimens || [];
    if (!usableRegimens.length) {
        console.warn('[PaladinTrainer] No usable regimens found.');
        return;
    }

    const knightId   = String(knight.id);
    const regimenId  = String(usableRegimens[0].id);       // cheapest = first
    const durationSec = usableRegimens[0].duration ?? 0;   // fallback if API doesn't return endtime

    await _startPaladinTraining(knightId, regimenId, durationSec);
}

// ─── Parsing helper ────────────────────────────────────────────────────────────

/**
 * Extracts the first knight's data object from the BuildingStatue.receiveKnightsData()
 * script block embedded in the statue page HTML.
 *
 * The call looks like: BuildingStatue.receiveKnightsData([], { "4716": { id, level,
 *   current_regimen, usable_regimens, activity: { finish_time } } }, 0)
 *
 * @param {Document} doc - Parsed statue page document.
 * @returns {Object|null} Knight data, or null if not found / parse failed.
 */
function _parseKnightData(doc) {
    const scriptText = Array.from(doc.querySelectorAll('script'))
        .map(s => s.textContent)
        .find(t => t.includes('receiveKnightsData'));

    if (!scriptText) return null;

    const fnStart        = scriptText.indexOf('receiveKnightsData(');
    const firstBracket   = scriptText.indexOf('[', fnStart);
    const bracketClose   = scriptText.indexOf(']', firstBracket);
    const kStart         = scriptText.indexOf('{', bracketClose);
    if (kStart === -1) return null;

    // Brace-count to extract the full knights object
    let depth = 0, kPos = kStart;
    while (kPos < scriptText.length) {
        if (scriptText[kPos] === '{') depth++;
        else if (scriptText[kPos] === '}') { depth--; if (depth === 0) break; }
        kPos++;
    }

    let knightsData;
    try {
        knightsData = JSON.parse(scriptText.slice(kStart, kPos + 1));
    } catch (e) {
        console.error('[PaladinTrainer] Failed to parse knights data:', e);
        return null;
    }

    return Object.values(knightsData)[0] ?? null;
}

// ─── API call ─────────────────────────────────────────────────────────────────

/**
 * POSTs the training start request and schedules the next check.
 * @param {string} knightId     - Knight ID from parsed script data.
 * @param {string} regimenId    - Regimen ID (cheapest = first in usable_regimens).
 * @param {number} durationSec  - Regimen duration in seconds (used as fallback timer).
 */
async function _startPaladinTraining(knightId, regimenId, durationSec) {
    const csrf = game_data?.csrf;
    if (!csrf) {
        console.error('[PaladinTrainer] Missing CSRF token.');
        return;
    }

    const params = new URLSearchParams({ knight: knightId, regimen: regimenId, cheap: '0', h: csrf });

    let data;
    try {
        const resp = await fetch(
            game_data.link_base_pure + 'statue&ajaxaction=regimen',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'tribalwars-ajax': '1',
                    'x-requested-with': 'XMLHttpRequest',
                },
                body: params.toString(),
                credentials: 'include',
                mode: 'cors',
            }
        );
        if (!resp.ok) {
            console.error('[PaladinTrainer] API error:', resp.status, resp.statusText);
            return;
        }
        data = await resp.json();
    } catch (e) {
        console.error('[PaladinTrainer] API call exception:', e);
        return;
    }

    showAutoHideBox(t('trainerPaladin.trainingStarted'), false);

    // Update cached end time and refresh statue visual label on overview
    const finishTimeSec = data?.response?.knight?.activity?.finish_time ?? null;
    if (finishTimeSec) {
        localStorage.setItem('statue_knight_endtime', String(finishTimeSec));
    }
    if (game_data?.screen === 'overview' && typeof getStatueInfo === 'function') {
        getStatueInfo();
    }

    // Try to get end time from response (check both known paths)
    const endtimeRaw = finishTimeSec
        ?? data?.response?.endtime
        ?? data?.response?.end_time
        ?? null;
    if (endtimeRaw) {
        const epoch = typeof endtimeRaw === 'number'
            ? endtimeRaw * 1000
            : new Date(String(endtimeRaw).replace(' ', 'T')).getTime();
        const waitMs = Math.max(0, epoch - Timing.getCurrentServerTime());
        if (waitMs > 0) {
            setFunctionOnTimeOut('auto_trainer_paladin', function () { checkAndSchedulePaladinTrainer(); }, waitMs);
            return;
        }
    }

    // Fallback: use regimen duration from the parsed page data
    if (durationSec > 0) {
        setFunctionOnTimeOut('auto_trainer_paladin', function () { checkAndSchedulePaladinTrainer(); }, durationSec * 1000);
        return;
    }

    // Last resort: re-fetch the page in 5s to read finish_time
    console.warn('[PaladinTrainer] No endtime — will re-fetch in 5s.');
    setTimeout(_reschedulePaladinFromPage, 5000);
}

/**
 * Fallback: re-fetches the statue page and reads finish_time from parsed knight data.
 */
async function _reschedulePaladinFromPage() {
    let doc;
    try {
        const resp = await fetch(game_data.link_base_pure + 'statue', { credentials: 'include' });
        if (!resp.ok) return;
        doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    } catch (e) {
        console.error('[PaladinTrainer] Fallback fetch failed:', e);
        return;
    }

    const knight = _parseKnightData(doc);
    if (!knight?.activity?.finish_time) return;

    localStorage.setItem('statue_knight_endtime', String(knight.activity.finish_time));
    const waitMs = Math.max(0, knight.activity.finish_time * 1000 - Timing.getCurrentServerTime());
    if (waitMs > 0) {
        setFunctionOnTimeOut('auto_trainer_paladin', function () { checkAndSchedulePaladinTrainer(); }, waitMs);
    }
}

// ─── Statue-page hook ─────────────────────────────────────────────────────────

/**
 * Called when the user visits the statue screen directly.
 * Updates the cached knight endtime for overview display (reads live DOM, JS already ran).
 * Clears pending timers if the bot has been disabled.
 * Training is handled by checkAndSchedulePaladinTrainer() called from start().
 */
function injectScriptAutoTrainerPaladin() {
    if (!window.PremiumFeaturesPrivateAutomations) return;

    // Live DOM: JS has already executed, so #knight_activity is populated
    const endtimeEl = document.querySelector('#knight_activity span[data-endtime]');
    if (endtimeEl?.dataset?.endtime) {
        localStorage.setItem('statue_knight_endtime', endtimeEl.dataset.endtime);
    }

    if (!settings_cookies.general['show__auto_paladin_train']?.enabled) {
        localStorage.removeItem('function_auto_trainer_paladin');
        localStorage.removeItem('endTime_auto_trainer_paladin');
        if (activeTimeouts?.['auto_trainer_paladin']) {
            clearTimeout(activeTimeouts['auto_trainer_paladin']);
            delete activeTimeouts['auto_trainer_paladin'];
        }
    }
}
