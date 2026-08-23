

/**
 * Waits for the scavenge widget to be present in the DOM, then calls the callback.
 * Uses a MutationObserver to avoid polling.
 * @param {Function} callback - Function to call once the widget is detected.
 */
function waitForScavengeWidget(callback) {
    if (document.querySelector('.scavenge-screen-main-widget')) {
        callback();
        return;
    }
    const observer = new MutationObserver((_, obs) => {
        if (document.querySelector('.scavenge-screen-main-widget')) {
            obs.disconnect();
            callback();
        }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
}

/**
 * Returns the auto-scavenge configuration for the current village from localStorage.
 * Defaults to disabled with no specific unit settings if no config exists.
 * @returns {{ enabled: boolean, level: number, allUnits: boolean, units: Object, optionId?: number, lastUnitCounts?: Object }}
 */
function getScavengeConfig() {
    const configs = JSON.parse(localStorage.getItem('scavenge_configs') || '{}');
    const villageId = game_data?.village?.id;
    return configs[villageId] || { enabled: false, level: 0, allUnits: true, units: {} };
}

/**
 * Saves the auto-scavenge configuration for the current village to localStorage.
 * May also include optionId and lastUnitCounts, which are written back by the bot after a successful send.
 * @param {{ enabled: boolean, level: number, allUnits: boolean, units: Object, optionId?: number, lastUnitCounts?: Object }} config
 */
function saveScavengeConfig(config) {
    const configs = JSON.parse(localStorage.getItem('scavenge_configs') || '{}');
    const villageId = game_data?.village?.id;
    if (!villageId) return;
    configs[villageId] = config;
    localStorage.setItem('scavenge_configs', JSON.stringify(configs));
}

/**
 * Carry capacity per unit type, used to compute carry_max for the scavenge API call.
 * Values represent the number of resource tiles each unit can carry.
 */
const SCAVENGE_UNIT_CARRY = {
    spear: 25, sword: 15, axe: 10, archer: 10,
    spy: 0, light: 80, marcher: 50, heavy: 50,
    ram: 0, catapult: 0, knight: 100, snob: 0
};

/**
 * World speed multiplier for scavenge duration calculations (df = speed^-0.55).
 * Reads the live value from the world_settings cache populated by fetchAndCacheWorldSettings().
 * Falls back to 1 if the cache is not available.
 */
const SCAVENGE_WORLD_SPEED = 1; // kept as fallback constant only

function _scavGetWorldSpeed() {
    return typeof getWorldSpeed === 'function' ? getWorldSpeed() : SCAVENGE_WORLD_SPEED;
}

// Fixed scavenge tier ratios per slot index 0-3 (game constants)
const SCAVENGE_TIER_RATIOS = [0.10, 0.25, 0.50, 0.75];

/**
 * Returns a random delay between 5 and 10 minutes in milliseconds.
 * Added after each troop return to avoid predictable bot timing.
 */
function _scavRandomDelayMs() {
    return (5 + Math.random() * 5) * 60 * 1000;
}

// Unit order used in distribution calculations (excludes spy/ram/catapult/snob)
const SCAVENGE_UNIT_ORDER = ['spear', 'sword', 'axe', 'archer', 'light', 'marcher', 'heavy', 'knight'];

/**
 * Reads the live Tribal Wars scavenge widget and returns the unit list with the
 * maximum available count for each unit.
 * @returns {Array<{unit: string, maxCount: number}>}
 */
function getOriginalScavengeUnitMeta() {
    const originalWidget = getOriginalScavengeWidget();
    if (!originalWidget) return [];

    return Array.from(originalWidget.querySelectorAll('input[name]')).map(input => {
        const unit = input.name;
        const maxAttr = input.getAttribute('data-all-count')
            ?? input.getAttribute('data-all_count')
            ?? input.dataset.allCount
            ?? input.dataset.all_count;
        let maxCount = parseInt(maxAttr, 10);

        if (!Number.isFinite(maxCount) || maxCount < 0) {
            const fallbackButton = originalWidget.querySelector(`.units-entry-all[data-unit="${unit}"]`);
            const fallbackMatch = fallbackButton?.textContent?.match(/\d+/);
            maxCount = fallbackMatch ? parseInt(fallbackMatch[0], 10) : 0;
        }

        return { unit, maxCount };
    }).filter(item => !!item.unit);
}

function getOriginalScavengeWidget() {
    const widgets = Array.from(document.querySelectorAll('.candidate-squad-widget'));
    return widgets.find(widget => !widget.closest('#scavenge_bot_config')) || null;
}

function _scavengeSetInputValue(input, value) {
    if (!input) return;
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function _scavengeSchedulePageReload(delayMs = 1000) {
    setTimeout(() => partialReload(), delayMs);
}

// ---- Scavenge optimization math (adapted from scavenger_calculator.js) ----

function _scavDuration(cap, ratio) {
    const df = Math.pow(_scavGetWorldSpeed(), -0.55);
    return cap <= 0 ? 1800 * df : (Math.pow(Math.pow(cap, 2) * 100 * Math.pow(ratio, 2), 0.45) + 1800) * df;
}

function _scavCapGivenLambda(lambda, ratio) {
    if (lambda <= 0) return Infinity;
    const df = Math.pow(_scavGetWorldSpeed(), -0.55);
    const A = df * Math.pow(100 * ratio * ratio, 0.45), B = 1800 * df;
    const D = (360 * ratio + Math.sqrt(Math.pow(360 * ratio, 2) + 4 * lambda * 3240 * ratio * B)) / (2 * lambda);
    return D <= B ? 0 : Math.pow((D - B) / A, 10 / 9);
}

function _scavOptimizeBalanced(totalCap, activeTiers) {
    if (!activeTiers.length || totalCap <= 0) return activeTiers.map(() => 0);
    const df = Math.pow(_scavGetWorldSpeed(), -0.55);
    let lambdaMax = 0;
    activeTiers.forEach(t => { lambdaMax = Math.max(lambdaMax, 2 * t.ratio / df); });
    let lo = 0, hi = lambdaMax;
    for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        activeTiers.reduce((s, t) => s + _scavCapGivenLambda(mid, t.ratio), 0) > totalCap ? lo = mid : hi = mid;
    }
    const lam = (lo + hi) / 2;
    return activeTiers.map(t => { const c = _scavCapGivenLambda(lam, t.ratio); return isFinite(c) ? Math.max(0, c) : totalCap; });
}

function _scavCapForDuration(T, ratio) {
    const df = Math.pow(_scavGetWorldSpeed(), -0.55), inner = T / df - 1800;
    return inner <= 0 ? 0 : Math.sqrt(Math.max(0, Math.pow(inner, 1 / 0.45) / (100 * ratio * ratio)));
}

function _scavOptimizeFastest(totalCap, activeTiers) {
    if (!activeTiers.length || totalCap <= 0) return activeTiers.map(() => 0);
    const df = Math.pow(_scavGetWorldSpeed(), -0.55);
    let lo = 1800 * df, hi = lo + 1, g = 0;
    while (activeTiers.reduce((s, t) => s + _scavCapForDuration(hi, t.ratio), 0) < totalCap && g++ < 200) hi *= 2;
    for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        activeTiers.reduce((s, t) => s + _scavCapForDuration(mid, t.ratio), 0) < totalCap ? lo = mid : hi = mid;
    }
    const T = (lo + hi) / 2;
    return activeTiers.map(t => _scavCapForDuration(T, t.ratio));
}

function _scavDistributeTroops(unitCounts, activeTiers, capTargets, totalCap) {
    const fracs = capTargets.map(c => totalCap > 0 ? c / totalCap : 0), n = activeTiers.length, result = {};
    SCAVENGE_UNIT_ORDER.forEach(unit => {
        const count = unitCounts[unit] || 0;
        result[unit] = new Array(n).fill(0);
        if (!count || !n) return;
        const raw = fracs.map(f => count * f), floors = raw.map(Math.floor);
        const rem = count - floors.reduce((s, v) => s + v, 0);
        const ord = raw.map((_, i) => i).sort((a, b) => (raw[b] - floors[b]) - (raw[a] - floors[a]));
        floors.forEach((v, i) => { result[unit][i] = v; });
        for (let k = 0; k < rem; k++) result[unit][ord[k]]++;
    });
    return result;
}

/**
 * Computes optimal troop distribution across unlocked scavenge options.
 * @param {Object} unitCounts - { unit: count } total pool to distribute
 * @param {Array} unlockedOptsData - [{ base_id, ratio }] sorted by level (lowest first)
 * @param {string} mode - 'balanced' | 'fastest'
 * @returns {{ distributionByOption: Object, tableHtml: string }}
 */
function computeScavengeOptimizedDistribution(unitCounts, unlockedOptsData, mode) {
    const totalCap = SCAVENGE_UNIT_ORDER.reduce((s, u) => s + (unitCounts[u] || 0) * (SCAVENGE_UNIT_CARRY[u] || 0), 0);
    if (!totalCap || !unlockedOptsData.length) {
        return { distributionByOption: {}, tableHtml: '<p style="color:#e06060;">No units or no unlocked options to distribute.</p>' };
    }
    const capTargets = mode === 'fastest' ? _scavOptimizeFastest(totalCap, unlockedOptsData) : _scavOptimizeBalanced(totalCap, unlockedOptsData);
    const troopSplit = _scavDistributeTroops(unitCounts, unlockedOptsData, capTargets, totalCap);

    const distributionByOption = {};
    unlockedOptsData.forEach((opt, i) => {
        const units = {};
        let carryMax = 0;
        SCAVENGE_UNIT_ORDER.forEach(u => {
            const cnt = troopSplit[u]?.[i] || 0;
            if (cnt > 0) { units[u] = cnt; carryMax += cnt * (SCAVENGE_UNIT_CARRY[u] || 0); }
        });
        if (Object.keys(units).length > 0) distributionByOption[opt.base_id] = { units, carryMax };
    });

    const base = typeof image_base !== 'undefined' ? image_base : 'graphic/';
    const unitCols = SCAVENGE_UNIT_ORDER.filter(u => (unitCounts[u] || 0) > 0);
    let html = '<table class="vis" style="width:100%;font-size:11px;margin-top:8px;"><tr><th>' + t('scavenge.levelHeader') + '</th>';
    unitCols.forEach(u => { html += `<th><img src="${base}unit/unit_${u}.png" style="width:20px" title="${typeof getUnitDisplayName === 'function' ? getUnitDisplayName(u) : u}"/></th>`; });
    html += '<th>' + t('scavenge.capacityHeader') + '</th><th>' + t('scavenge.resourcesHeader') + '</th><th>' + t('scavenge.durationHeader') + '</th></tr>';
    unlockedOptsData.forEach((opt, i) => {
        let cap = 0;
        unitCols.forEach(u => { cap += (troopSplit[u]?.[i] || 0) * (SCAVENGE_UNIT_CARRY[u] || 0); });
        const res = cap > 0 ? Math.round(cap * opt.ratio) : 0;
        const dur = cap > 0 ? _scavDuration(cap, opt.ratio) : 0;
        const ds = dur > 0 ? `${String(Math.floor(dur/3600)).padStart(2,'0')}:${String(Math.floor((dur%3600)/60)).padStart(2,'0')}:${String(Math.round(dur%60)).padStart(2,'0')}` : '-';
        html += `<tr><td><b>Level ${i + 1}</b></td>`;
        unitCols.forEach(u => { html += `<td>${troopSplit[u]?.[i] || 0}</td>`; });
        html += `<td>${cap}</td><td>${res}</td><td>${ds}</td></tr>`;
    });
    html += '</table>';
    return { distributionByOption, tableHtml: html };
}

/**
 * Sends troops to all available scavenge options using the distribution stored in config.
 * Sends sequentially from highest level first. Disables auto-scavenge on any send failure.
 */
async function runOptimizedScavenge(forceRun = false) {
    const config = getScavengeConfig();
    if (!forceRun && !config.enabled) return;
    if (!config.optimizeMode) return;

    const distribution = config.distributionByOption;
    if (!distribution || !Object.keys(distribution).length) {
        console.warn('[AutoScavenge] Optimize: no distribution stored — save config first.');
        return;
    }

    let villageData;
    try {
        const resp = await fetch(game_data.link_base_pure + 'place&mode=scavenge', { credentials: 'include' });
        const scriptText = Array.from(new DOMParser().parseFromString(await resp.text(), 'text/html').querySelectorAll('script'))
            .map(s => s.textContent).find(t => t.includes('var village = {'));
        if (scriptText) {
            const vStart = scriptText.indexOf('var village = ') + 'var village = '.length;
            let depth = 0, vPos = vStart;
            while (vPos < scriptText.length) {
                if (scriptText[vPos] === '{') depth++;
                else if (scriptText[vPos] === '}') { depth--; if (depth === 0) break; }
                vPos++;
            }
            villageData = JSON.parse(scriptText.slice(vStart, vPos + 1));
        }
    } catch (e) {
        console.error('[AutoScavenge] Optimize: fetch failed:', e);
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 5 * 60 * 1000);
        return;
    }

    if (!villageData) {
        console.warn('[AutoScavenge] Optimize: could not parse village data. Retrying in 5 min.');
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 5 * 60 * 1000);
        return;
    }

    const optionsState = villageData.options || {};
    const optionIds = Object.keys(distribution).map(Number).sort((a, b) => b - a); // highest first
    let earliestReturn = null;

    for (const optionId of optionIds) {
        const optState = Object.values(optionsState).find(o => o.base_id === optionId);
        if (!optState || optState.is_locked) continue;

        if (optState.scavenging_squad) {
            const rt = optState.scavenging_squad.return_time;
            if (rt) {
                const rtMs = typeof rt === 'number' ? rt * 1000 : new Date(String(rt).replace(' ', 'T')).getTime();
                if (earliestReturn === null || rtMs < earliestReturn) earliestReturn = rtMs;
            }
            continue;
        }

        const { units, carryMax } = distribution[optionId];
        console.log(`[AutoScavenge] Optimize: sending optionId=${optionId} | carryMax=${carryMax}`);
        const result = await sendScavengeSquadApi(units, optionId, carryMax);

        if (!result.success) {
            console.error(`[AutoScavenge] Optimize: failed for optionId=${optionId}. Disabling auto-scavenge.`);
            saveScavengeConfig({ ...getScavengeConfig(), enabled: false });
            if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.disabledSendFailed', { optionId }), true);
            return;
        }

        console.log(`[AutoScavenge] Optimize: optionId=${optionId} sent | returnMs=${result.returnMs}`);
        if (result.returnMs > 0) {
            const retTime = Date.now() + result.returnMs;
            if (earliestReturn === null || retTime < earliestReturn) earliestReturn = retTime;
        }
    }

    if (earliestReturn) {
        const jitterMs = _scavRandomDelayMs();
        const waitMs = Math.max(0, earliestReturn - Date.now()) + jitterMs;
        localStorage.setItem('endTime_scavenging-auto', String(earliestReturn + jitterMs));
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, waitMs);
        console.log(`[AutoScavenge] Optimize: next check in ${Math.round(waitMs / 60000)} min (incl. ${Math.round(jitterMs / 60000)} min jitter).`);
    } else {
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
        console.warn('[AutoScavenge] Optimize: no return times found. Retrying in 30 min.');
    }

    if (game_data?.screen === 'overview' && typeof getPlaceInfo === 'function') getPlaceInfo();
}

/**
 * Sends an optimized scavenge distribution immediately without scheduling a follow-up run.
 * Used by the manual Send now path so multi-level calculation still works when auto-scavenge is off.
 */
async function sendOptimizedScavengeNow(units, unlockedOptsData, calcMode) {
    const { distributionByOption } = computeScavengeOptimizedDistribution(units, unlockedOptsData, calcMode);
    if (!distributionByOption || !Object.keys(distributionByOption).length) {
        if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.noOptionFound'), true);
        return { success: false };
    }

    let villageData;
    try {
        const resp = await fetch(game_data.link_base_pure + 'place&mode=scavenge', { credentials: 'include' });
        const scriptText = Array.from(new DOMParser().parseFromString(await resp.text(), 'text/html').querySelectorAll('script'))
            .map(s => s.textContent).find(t => t.includes('var village = {'));
        if (scriptText) {
            const vStart = scriptText.indexOf('var village = ') + 'var village = '.length;
            let depth = 0, vPos = vStart;
            while (vPos < scriptText.length) {
                if (scriptText[vPos] === '{') depth++;
                else if (scriptText[vPos] === '}') { depth--; if (depth === 0) break; }
                vPos++;
            }
            villageData = JSON.parse(scriptText.slice(vStart, vPos + 1));
        }
    } catch (e) {
        console.error('[AutoScavenge] Manual optimize: fetch failed:', e);
        return { success: false };
    }

    if (!villageData) {
        console.warn('[AutoScavenge] Manual optimize: could not parse village data.');
        return { success: false };
    }

    const optionsState = villageData.options || {};
    const optionIds = Object.keys(distributionByOption).map(Number).sort((a, b) => b - a);
    let earliestReturn = null;

    for (const optionId of optionIds) {
        const optState = Object.values(optionsState).find(o => o.base_id === optionId);
        if (!optState || optState.is_locked) continue;
        if (optState.scavenging_squad) continue;

        const { units: optionUnits, carryMax } = distributionByOption[optionId];
        const result = await sendScavengeSquadApi(optionUnits, optionId, carryMax);
        if (!result.success) {
            return result;
        }

        if (result.returnMs > 0) {
            const retTime = Date.now() + result.returnMs;
            if (earliestReturn === null || retTime < earliestReturn) earliestReturn = retTime;
        }
    }

    return { success: true, returnMs: earliestReturn ? Math.max(0, earliestReturn - Date.now()) : 0 };
}

/**
 * Sends a scavenge squad via the game API without requiring page interaction or form submission.
 * @param {Object<string, number>} unitCounts - Map of unit name to troop count.
 * @param {number|string} optionId - The scavenge option ID (read from the DOM data-option-id attribute).
 * @param {number} carryMax - Total carry capacity of the squad (sum of unit counts × per-unit carry).
 * @returns {Promise<{success: boolean, returnMs: number}>}
 *   success  – whether the server accepted the squad.
 *   returnMs – milliseconds until the squad returns (0 if unknown). Populated even on failure when troops are already out.
 */
async function sendScavengeSquadApi(unitCounts, optionId, carryMax) {
    const villageId = game_data?.village?.id;
    const csrf = game_data?.csrf;
    if (!villageId || !csrf) return { success: false, returnMs: 0 };

    const params = new URLSearchParams();
    params.set('squad_requests[0][village_id]', villageId);
    Object.entries(unitCounts).forEach(([unit, count]) => {
        params.set(`squad_requests[0][candidate_squad][unit_counts][${unit}]`, count);
    });
    params.set('squad_requests[0][candidate_squad][carry_max]', carryMax);
    params.set('squad_requests[0][option_id]', optionId);
    params.set('squad_requests[0][use_premium]', 'false');
    params.set('h', csrf);
    let data;
    let success = false;
    let returnMs = 0;
    let notificationText = `Scavenge ${optionId}: `;
    try {
        const response = await fetch(
            game_data.link_base_pure + 'scavenge_api&ajaxaction=send_squads',
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
        if (!response.ok) {
            notificationText += `failed for option ${optionId}`;
            if (typeof showAutoHideBox === 'function') showAutoHideBox(notificationText, true);
            return { success: false, returnMs: 0 };
        }
        data = await response.json();
        // Response shape: { response: { squad_responses: [{ success, error }], villages: { ... } } }
        const squadResponse = data?.response?.squad_responses?.[0];
        success = squadResponse?.success === true;
        if (!success) {
            console.warn('[AutoScavenge] Send rejected:', squadResponse?.error ?? 'no squad_responses in response');
        }

        notificationText += success ? `sent to option ${optionId}` : `failed for option ${optionId}`;
    } catch (e) {
        console.error('[AutoScavenge] API send failed:', e);
        notificationText += `failed for option ${optionId}`;
        if (typeof showAutoHideBox === 'function') showAutoHideBox(notificationText, true);
        return { success: false, returnMs: 0 };
    }

    // Parse return time — attempted even on failure (troops from a different option may already be out).
    // Scan ALL options for the earliest active scavenging_squad.return_time so that when we fail to send
    // to option 1 because units are already in option 2, we still know when to retry.
    // return_time is an epoch timestamp in seconds.
    const villageOptions = data?.response?.villages?.[String(villageId)]?.options ?? {};
    let earliestRt = null;
    for (const opt of Object.values(villageOptions)) {
        const rt = opt?.scavenging_squad?.return_time;
        if (rt && (earliestRt === null || rt < earliestRt)) earliestRt = rt;
    }
    if (earliestRt) {
        const epoch = typeof earliestRt === 'number' ? earliestRt * 1000 : new Date(String(earliestRt).replace(' ', 'T')).getTime();
        returnMs = Math.max(0, epoch - Date.now());
    }

    if (typeof showAutoHideBox === 'function') showAutoHideBox(notificationText, !success);

    return { success, returnMs };
}

/**
 * Scheduled entry point for auto-scavenge runs triggered by the timer on any page.
 * Reads unit counts and option ID from the existing scavenge_configs entry for this village.
 * For allUnits=true, relies on lastUnitCounts written back during the previous send.
 * Falls back to a page redirect when the required fields are not yet populated.
 */
async function triggerScavengingAuto() {
    // Skip if a timer is already scheduled and still in the future — avoids redundant API calls.
    const existingEndTime = parseInt(localStorage.getItem('endTime_scavenging-auto'), 10);
    if (existingEndTime && existingEndTime > Date.now()) {
        console.log('[AutoScavenge] Timer already active, skipping redundant call.');
        return;
    }

    const config = getScavengeConfig();
    if (!config.enabled) return;

    if (config.optimizeMode) {
        await runOptimizedScavenge();
        return;
    }

    // For level=0 ("highest available"), the correct option changes each cycle.
    // Fetch the scavenge page HTML to find the currently free option — no redirect needed.
    if (config.level === 0) {
        let doc;
        try {
            const resp = await fetch(game_data.link_base_pure + 'place&mode=scavenge', { credentials: 'include' });
            doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
        } catch (e) {
            console.error('[AutoScavenge] Failed to fetch scavenge page:', e);
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
            return;
        }

        // The scavenge UI is rendered client-side by JS — DOM queries won't find .scavenge-option etc.
        // Extract the village data from the embedded 'var village = {...}' script block instead.
        const scripts = Array.from(doc.querySelectorAll('script'));
        const villageScriptText = scripts.map(s => s.textContent).find(t => t.includes('var village = {'));
        let fetchedVillage;
        if (villageScriptText) {
            const vStart = villageScriptText.indexOf('var village = ') + 'var village = '.length;
            let depth = 0, vPos = vStart;
            while (vPos < villageScriptText.length) {
                if (villageScriptText[vPos] === '{') depth++;
                else if (villageScriptText[vPos] === '}') { depth--; if (depth === 0) break; }
                vPos++;
            }
            try { fetchedVillage = JSON.parse(villageScriptText.slice(vStart, vPos + 1)); } catch (e) {
                console.error('[AutoScavenge] level=0: failed to parse village data from script:', e);
            }
        }
        if (!fetchedVillage) {
            console.warn('[AutoScavenge] level=0: no village data in fetched HTML; retrying in 30 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
            return;
        }
        console.log('[AutoScavenge] level=0: village data parsed | options:', Object.keys(fetchedVillage.options || {}));

        // Find highest unlocked option with no active squad
        const fetchedAllOpts = Object.values(fetchedVillage.options || {}).sort((a, b) => a.base_id - b.base_id);
        const fetchedFreeOpts = fetchedAllOpts.filter(opt => !opt.is_locked && opt.scavenging_squad === null);
        const fetchedTarget = fetchedFreeOpts[fetchedFreeOpts.length - 1] || null;
        console.log('[AutoScavenge] level=0: free options:', fetchedFreeOpts.map(o => o.base_id), '| target base_id:', fetchedTarget?.base_id ?? 'none');

        if (!fetchedTarget) {
            // All options busy — find earliest return_time across active squads
            let earliestRt = null;
            fetchedAllOpts.forEach(opt => {
                const rt = opt?.scavenging_squad?.return_time;
                if (rt && (earliestRt === null || rt < earliestRt)) earliestRt = rt;
            });
            const jitterMs = _scavRandomDelayMs();
            const waitMs = earliestRt ? Math.max(0, earliestRt * 1000 - Date.now()) + jitterMs : 0;
            console.log('[AutoScavenge] level=0: all options busy | earliest return_time:', earliestRt, '| waiting:', Math.round(waitMs / 60000), 'min (incl. jitter).');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, waitMs > 0 ? waitMs : 30 * 60 * 1000);
            return;
        }

        const fetchedOptionId = fetchedTarget.base_id;
        console.log('[AutoScavenge] level=0: resolved optionId:', fetchedOptionId);

        // Use unit_counts_home for units (exclude militia and knight — bot intentionally skips paladin)
        let fetchedUnitCounts = {};
        if (config.allUnits !== false) {
            const home = fetchedVillage.unit_counts_home || {};
            fetchedUnitCounts = Object.fromEntries(
                Object.entries(home).filter(([unit, count]) => count > 0 && unit !== 'militia' && unit !== 'knight')
            );
            console.log('[AutoScavenge] level=0: unit counts from unit_counts_home:', JSON.stringify(fetchedUnitCounts));
            if (Object.keys(fetchedUnitCounts).length === 0 && config.lastUnitCounts) {
                console.warn('[AutoScavenge] level=0: no units at home — falling back to lastUnitCounts.');
                fetchedUnitCounts = config.lastUnitCounts;
            }
        } else {
            fetchedUnitCounts = config.units || {};
        }

        if (Object.keys(fetchedUnitCounts).length === 0) {
            console.warn('[AutoScavenge] level=0: no unit counts available; retrying in 30 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
            return;
        }

        saveScavengeConfig({ ...config, optionId: fetchedOptionId, lastUnitCounts: fetchedUnitCounts });
        const fetchedCarryMax = Object.entries(fetchedUnitCounts).reduce(
            (sum, [unit, count]) => sum + count * (SCAVENGE_UNIT_CARRY[unit] || 0), 0
        );
        console.log('[AutoScavenge] level=0: sending | optionId:', fetchedOptionId, '| carryMax:', fetchedCarryMax, '| units:', JSON.stringify(fetchedUnitCounts));
        const fetchedResult = await sendScavengeSquadApi(fetchedUnitCounts, fetchedOptionId, fetchedCarryMax);
        console.log('[AutoScavenge] level=0: result — success:', fetchedResult.success, '| returnMs:', fetchedResult.returnMs);
        if (fetchedResult.returnMs > 0) {
            const jitterMs = _scavRandomDelayMs();
            const totalMs = fetchedResult.returnMs + jitterMs;
            console.log('[AutoScavenge] level=0: next run in', Math.round(totalMs / 60000), 'min (incl.', Math.round(jitterMs / 60000), 'min jitter).');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, totalMs);
        } else if (fetchedResult.success) {
            console.warn('[AutoScavenge] level=0: send succeeded but no returnMs — retrying in 5 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 5 * 60 * 1000);
        } else {
            console.warn('[AutoScavenge] level=0: send failed with no returnMs — retrying in 30 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
        }
        if (game_data?.screen === 'overview' && typeof getPlaceInfo === 'function') { getPlaceInfo(); }
        return;
    }

    let unitCounts = config.allUnits !== false ? config.lastUnitCounts : config.units;
    let optionId = config.optionId;

    // Config not yet seeded for this fixed level — fetch the scavenge page once to extract optionId and unit counts
    if (!optionId || !unitCounts || Object.keys(unitCounts).length === 0) {
        console.log('[AutoScavenge] Config not seeded for level', config.level, '— fetching scavenge page.');
        let seedDoc;
        try {
            const seedResp = await fetch(game_data.link_base_pure + 'place&mode=scavenge', { credentials: 'include' });
            seedDoc = new DOMParser().parseFromString(await seedResp.text(), 'text/html');
            console.log('[AutoScavenge] Scavenge page fetched for seeding.');
        } catch (e) {
            console.error('[AutoScavenge] Failed to fetch scavenge page for seeding:', e);
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
            return;
        }

        // The scavenge UI is rendered client-side — extract village data from the embedded script block
        const seedScripts = Array.from(seedDoc.querySelectorAll('script'));
        const seedScriptText = seedScripts.map(s => s.textContent).find(t => t.includes('var village = {'));
        let seedVillage;
        if (seedScriptText) {
            const vStart = seedScriptText.indexOf('var village = ') + 'var village = '.length;
            let depth = 0, vPos = vStart;
            while (vPos < seedScriptText.length) {
                if (seedScriptText[vPos] === '{') depth++;
                else if (seedScriptText[vPos] === '}') { depth--; if (depth === 0) break; }
                vPos++;
            }
            try { seedVillage = JSON.parse(seedScriptText.slice(vStart, vPos + 1)); } catch (e) {
                console.error('[AutoScavenge] Seed: failed to parse village data:', e);
            }
        }
        if (!seedVillage) {
            console.warn('[AutoScavenge] Seed: no village data in fetched HTML; retrying in 30 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
            return;
        }
        console.log('[AutoScavenge] Seed: village data parsed | options:', Object.keys(seedVillage.options || {}));

        const seedAllOpts = Object.values(seedVillage.options || {}).sort((a, b) => a.base_id - b.base_id);
        const seedUnlocked = seedAllOpts.filter(opt => !opt.is_locked);
        const seedTarget = seedUnlocked[config.level - 1] || null;
        console.log('[AutoScavenge] Seed: unlocked options:', seedUnlocked.map(o => o.base_id), '| target index:', config.level - 1, '| found base_id:', seedTarget?.base_id ?? 'none');

        if (!seedTarget) {
            console.warn('[AutoScavenge] Level', config.level, 'not available; retrying in 30 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
            return;
        }

        optionId = seedTarget.base_id;
        console.log('[AutoScavenge] Seeded optionId:', optionId);

        if (config.allUnits !== false) {
            const home = seedVillage.unit_counts_home || {};
            const seedCounts = Object.fromEntries(
                Object.entries(home).filter(([unit, count]) => count > 0 && unit !== 'militia' && unit !== 'knight')
            );
            console.log('[AutoScavenge] Seeded unit counts from unit_counts_home:', JSON.stringify(seedCounts));
            if (Object.keys(seedCounts).length > 0) {
                unitCounts = seedCounts;
            } else {
                console.warn('[AutoScavenge] No units at home in fetched data; retrying in 30 min.');
                setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
                return;
            }
        } else {
            unitCounts = config.units || {};
        }
        saveScavengeConfig({ ...config, optionId, lastUnitCounts: unitCounts });
    }

    if (!unitCounts || Object.keys(unitCounts).length === 0) {
        console.warn('[AutoScavenge] No unit counts for level', config.level, '; retrying in 30 min.');
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
        return;
    }

    console.log('[AutoScavenge] Sending level', config.level, '| optionId:', optionId, '| units:', JSON.stringify(unitCounts));
    const carryMax = Object.entries(unitCounts).reduce(
        (sum, [unit, count]) => sum + count * (SCAVENGE_UNIT_CARRY[unit] || 0), 0
    );

    const result = await sendScavengeSquadApi(unitCounts, optionId, carryMax);
    console.log('[AutoScavenge] Result — success:', result.success, '| returnMs:', result.returnMs);
    if (result.returnMs > 0) {
        const jitterMs = _scavRandomDelayMs();
        const totalMs = result.returnMs + jitterMs;
        console.log('[AutoScavenge] Next run in', Math.round(totalMs / 60000), 'min (incl.', Math.round(jitterMs / 60000), 'min jitter).');
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, totalMs);
    } else if (result.success) {
        console.warn('[AutoScavenge] Send succeeded but no returnMs — retrying in 5 min.');
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 5 * 60 * 1000);
    } else {
        console.warn('[AutoScavenge] Send failed with no returnMs — retrying in 30 min.');
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
    }
    if (game_data?.screen === 'overview' && typeof getPlaceInfo === 'function') { getPlaceInfo(); }
}

/**
 * Injects the per-village auto-scavenge configuration panel into the scavenge screen.
 * Renders controls for enabling automation, choosing the scavenge level,
 * and optionally specifying exact unit amounts.
 */
function injectScavengeConfigPanel() {
    const container = document.querySelector('.scavenge-screen-main-widget');
    if (!container || document.getElementById('scavenge_bot_config')) return;

    const config = getScavengeConfig();
    const allOptions = Array.from(document.querySelectorAll('.scavenge-option'));
    const unlockedOptions = allOptions.filter(opt => !opt.querySelector('.locked-view'));
    const unitMeta = getOriginalScavengeUnitMeta();
    const unitNames = unitMeta.map(item => item.unit);

    const panel = document.createElement('div');
    panel.id = 'scavenge_bot_config';
    panel.className = 'vis';
    panel.style.cssText = 'width: 100%;';

    const header = document.createElement('h4');
    header.className = 'head with-button';
    header.style.cssText = 'display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 0;';
    const headerText = document.createElement('span');
    headerText.textContent = t('scavenge.panelTitle');
    header.appendChild(headerText);
    const toggleImg = document.createElement('img');
    toggleImg.src = 'https://dspt.innogamescdn.com/asset/95eda994/graphic//icons/slide_down.png';
    toggleImg.alt = t('button.collapse');
    toggleImg.className = 'village-list-toggle';
    toggleImg.style.cssText = 'transform: rotate(180deg); transition: transform 0.2s; cursor: pointer;';
    header.appendChild(toggleImg);
    panel.appendChild(header);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'scavenge_bot_config_content';

    const table = document.createElement('table');
    table.className = 'vis';
    table.style.cssText = 'width:100%;table-layout:fixed;';
    const colgroup = document.createElement('colgroup');
    const col0 = document.createElement('col');
    col0.style.width = '90px';
    const col1 = document.createElement('col');
    colgroup.appendChild(col0);
    colgroup.appendChild(col1);
    table.appendChild(colgroup);
    const tbody = document.createElement('tbody');

    // Enable/disable automation for this village
    const enableRow = tbody.insertRow();
    const ec0 = enableRow.insertCell(0);
    ec0.style.fontWeight = 'bold';
    ec0.textContent = t('scavenge.automationLabel');
    const ec1 = enableRow.insertCell(1);
    const enableLabel = document.createElement('label');
    const enableCheckbox = document.createElement('input');
    enableCheckbox.type = 'checkbox';
    enableCheckbox.id = 'scavenge_config_enabled';
    enableCheckbox.checked = config.enabled === true;
    enableCheckbox.style.marginRight = '5px';
    enableLabel.appendChild(enableCheckbox);
    enableLabel.appendChild(document.createTextNode(t('scavenge.enableLabel')));
    ec1.appendChild(enableLabel);

    // Optimized multi-level row
    const optimizeRow = tbody.insertRow();
    optimizeRow.insertCell(0);
    const optimizeCell = optimizeRow.insertCell(1);
    const optimizeLabel = document.createElement('label');
    const optimizeCheckbox = document.createElement('input');
    optimizeCheckbox.type = 'checkbox';
    optimizeCheckbox.id = 'scavenge_config_optimize';
    optimizeCheckbox.checked = config.optimizeMode === true;
    optimizeCheckbox.style.marginRight = '5px';
    optimizeLabel.appendChild(optimizeCheckbox);
    const optimizeSpan = document.createElement('span');
    optimizeSpan.textContent = t('scavenge.optimizeLabel');
    optimizeLabel.appendChild(optimizeSpan);
    optimizeCell.appendChild(optimizeLabel);
    const optimizeHint = document.createElement('div');
    optimizeHint.style.cssText = 'font-size:10px;color:#888;margin-top:2px;line-height:1.3;';
    optimizeHint.textContent = t('scavenge.optimizeHint');
    optimizeCell.appendChild(optimizeHint);

    // Level selection — checkboxes (one per unlocked level; single-select unless optimize mode is on)
    const levelRow = tbody.insertRow();
    levelRow.id = 'scavenge_levels_row';
    const lc0 = levelRow.insertCell(0);
    lc0.style.fontWeight = 'bold';
    function isScavengeOptionRunning(opt) {
        return !!opt?.querySelector('.return-countdown');
    }

    function syncLevelCheckboxState() {
        const autoEnabled = enableCheckbox.checked;
        levelCheckboxes.forEach((cb, idx) => {
            const opt = unlockedOptions[idx];
            const isRunning = isScavengeOptionRunning(opt);
            cb.disabled = !autoEnabled && isRunning;
            const label = cb.closest('label');
            if (label) label.style.opacity = cb.disabled ? '0.55' : '';
            if (cb.disabled) cb.checked = false;
        });

        const enabledBoxes = levelCheckboxes.filter(cb => !cb.disabled);

        if (!autoEnabled) {
            if (optimizeCheckbox.checked) {
                enabledBoxes.forEach(cb => { cb.checked = true; });
            } else {
                const checkedBoxes = enabledBoxes.filter(cb => cb.checked);
                if (checkedBoxes.length > 1) {
                    const keepBox = checkedBoxes[checkedBoxes.length - 1];
                    enabledBoxes.forEach(cb => { if (cb !== keepBox) cb.checked = false; });
                } else if (checkedBoxes.length === 0 && enabledBoxes.length > 0) {
                    enabledBoxes[enabledBoxes.length - 1].checked = true;
                }
            }
            return;
        }

        if (!optimizeCheckbox.checked) {
            const checkedBoxes = enabledBoxes.filter(cb => cb.checked);

            if (checkedBoxes.length > 1) {
                const keepBox = checkedBoxes[checkedBoxes.length - 1];
                enabledBoxes.forEach(cb => { if (cb !== keepBox) cb.checked = false; });
            } else if (checkedBoxes.length === 0 && enabledBoxes.length > 0) {
                enabledBoxes[enabledBoxes.length - 1].checked = true;
            }
        }
    }

    function syncActionButtons() {
        const autoEnabled = enableCheckbox.checked;
        startBtn.style.display = autoEnabled ? '' : 'none';
        sendNowBtn.style.display = autoEnabled ? 'none' : '';
        const modeRowEl = document.getElementById('scavenge_mode_row');
        if (modeRowEl) {
            modeRowEl.style.display = optimizeCheckbox.checked ? '' : 'none';
        }
    }

    function applyManualDefaults() {
        const selectableBoxes = levelCheckboxes.filter(cb => !cb.disabled);
        if (selectableBoxes.length > 0) {
            selectableBoxes.forEach(cb => { cb.checked = false; });
            selectableBoxes[selectableBoxes.length - 1].checked = true;
        }
        unitMeta.forEach(({ unit, maxCount }) => {
            const input = document.getElementById('scavenge_config_unit_' + unit);
            if (input) _scavengeSetInputValue(input, maxCount);
        });
    }

    function getCurrentUnits() {
        const units = {}
        unitNames.forEach(unit => {
            const inp = document.getElementById('scavenge_config_unit_' + unit);
            units[unit] = inp ? (parseInt(inp.value, 10) || 0) : 0;
        });
        return units;
    }

    lc0.textContent = t('scavenge.levelLabel');
    const lc1 = levelRow.insertCell(1);
    const levelCheckboxes = [];
    unlockedOptions.forEach((opt, i) => {
        const optAllIdx = allOptions.indexOf(opt);
        const label = document.createElement('label');
        label.style.cssText = 'margin-right:12px;white-space:nowrap;';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'scavenge_config_level_' + (i + 1);
        cb.dataset.levelIndex = String(i + 1);
        cb.dataset.baseId = String(parseInt(opt.dataset.optionId || opt.dataset.option_id || (optAllIdx + 1)));
        cb.dataset.ratio = String(SCAVENGE_TIER_RATIOS[optAllIdx] || 0);
        cb.style.marginRight = '4px';
        if (config.optimizeMode) {
            const saved = config.selectedLevelIndices || [];
            cb.checked = saved.length === 0 || saved.includes(i + 1);
        } else {
            const savedLevel = config.level != null ? config.level : unlockedOptions.length;
            cb.checked = savedLevel === i + 1 || (savedLevel === 0 && i === unlockedOptions.length - 1);
        }
        cb.onchange = () => {
            if (cb.disabled) {
                cb.checked = false;
                return;
            }
            if (!document.getElementById('scavenge_config_optimize').checked) {
                if (!cb.checked) { cb.checked = true; return; }
                levelCheckboxes.forEach(other => { if (other !== cb) other.checked = false; });
            }
            refreshDistributionPreview();
        };
        const titleEl = opt.querySelector('.title');
        label.appendChild(cb);
        label.appendChild(document.createTextNode(titleEl ? titleEl.textContent.trim() : t('scavenge.levelFallback', { level: i + 1 })));
        lc1.appendChild(label);
        levelCheckboxes.push(cb);
    });

    // Calculation mode row — visible only in optimize mode
    const modeRow = tbody.insertRow();
    modeRow.id = 'scavenge_mode_row';
    modeRow.style.display = config.optimizeMode ? '' : 'none';
    const mr0 = modeRow.insertCell(0);
    mr0.style.fontWeight = 'bold';
    mr0.textContent = t('scavenge.modeLabel');
    const mr1 = modeRow.insertCell(1);
    [['balanced', t('scavenge.modeBalanced')], ['fastest', t('scavenge.modeFastest')]].forEach(([val, lbl]) => {
        const label = document.createElement('label');
        label.style.marginRight = '10px';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'scavenge_optimize_mode';
        radio.value = val;
        radio.checked = (config.optimizeCalculationMode || 'balanced') === val;
        radio.style.marginRight = '4px';
        radio.onchange = () => refreshDistributionPreview();
        label.appendChild(radio);
        label.appendChild(document.createTextNode(lbl));
        mr1.appendChild(label);
    });

    // Units configuration row — always visible, inputs disabled when allUnits is checked
    const unitsRow = tbody.insertRow();
    unitsRow.id = 'scavenge_units_row';
    const unitsCell = unitsRow.insertCell(0);
    unitsCell.colSpan = 2;
    unitsCell.style.padding = '0';
    unitsCell.style.paddingTop = '6px';

    const unitsWrapper = document.createElement('div');
    unitsWrapper.className = 'candidate-squad-widget vis';
    unitsWrapper.style.cssText = 'padding: 4px 2px;';

    const unitsTable = document.createElement('table');
    unitsTable.className = 'vis';
    unitsTable.style.cssText = 'width: 100%; font-size: 11px; border-collapse: collapse;';
    const unitsThead = document.createElement('thead');
    const unitsTbody = document.createElement('tbody');
    const imgRow = document.createElement('tr');
    const inputRow = document.createElement('tr');
    const assetBase = typeof image_base !== 'undefined' ? image_base : 'graphic/';

    const troopMeta = unitMeta.filter(({ unit }) => unit !== 'knight');

    troopMeta.forEach(({ unit, maxCount }) => {
        // Header: unit icon
        const th = document.createElement('th');
        th.style.cssText = 'text-align: center; padding: 2px 1px;';
        const img = document.createElement('img');
        img.src = assetBase + 'unit/unit_' + unit + '.png';
        img.style.cssText = 'display: block; margin: 0 auto;';
        img.title = typeof getUnitDisplayName === 'function' ? getUnitDisplayName(unit) : unit;
        th.appendChild(img);
        imgRow.appendChild(th);

        // Body: input field + max shortcut
        const td = document.createElement('td');
        td.style.cssText = 'text-align: center; padding: 2px 1px; vertical-align: top;';
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = '0';
        inp.value = (config.units && config.units[unit] != null) ? config.units[unit].toString() : '0';
        inp.id = 'scavenge_config_unit_' + unit;
        inp.className = 'unitsInput input-nicer';
        inp.style.cssText = 'width: 42px; text-align: center;';
        inp.oninput = () => refreshDistributionPreview();
        td.appendChild(inp);

        td.appendChild(document.createElement('br'));
        const maxLink = document.createElement('a');
        maxLink.href = '#';
        maxLink.className = 'units-entry-all squad-village-required';
        maxLink.dataset.unit = unit;
        maxLink.dataset.allCount = String(maxCount);
        maxLink.textContent = `(${maxCount})`;
        maxLink.style.cssText = 'display: inline-block; margin-top: 2px;';
        maxLink.onclick = event => {
            event.preventDefault();
            const current = parseInt(inp.value, 10) || 0;
            _scavengeSetInputValue(inp, current === maxCount ? '' : maxCount);
        };
        td.appendChild(maxLink);

        inputRow.appendChild(td);
    });

    const allUnitsTh = document.createElement('th');
    allUnitsTh.className = 'squad-village-required';
    allUnitsTh.textContent = t('scavenge.allUnitsLabel');
    imgRow.appendChild(allUnitsTh);

    const allUnitsTd = document.createElement('td');
    allUnitsTd.className = 'squad-village-required';
    allUnitsTd.style.cssText = 'text-align: center; padding: 2px 1px;';
    const fillAllLink = document.createElement('a');
    fillAllLink.href = '#';
    fillAllLink.className = 'fill-all';
    fillAllLink.textContent = t('scavenge.fillAllUnits');
    fillAllLink.onclick = event => {
        event.preventDefault();
        unitMeta.forEach(({ unit, maxCount }) => {
            const input = document.getElementById('scavenge_config_unit_' + unit);
            _scavengeSetInputValue(input, maxCount);
        });
    };
    allUnitsTd.appendChild(fillAllLink);
    inputRow.appendChild(allUnitsTd);

    unitsThead.appendChild(imgRow);
    unitsTbody.appendChild(inputRow);
    unitsTable.appendChild(unitsThead);
    unitsTable.appendChild(unitsTbody);
    unitsWrapper.appendChild(unitsTable);
    unitsCell.appendChild(unitsWrapper);

    table.appendChild(tbody);
    contentDiv.appendChild(table);

    optimizeCheckbox.onchange = () => {
        const isOpt = optimizeCheckbox.checked;
        const autoEnabled = enableCheckbox.checked;
        const modeRowEl = document.getElementById('scavenge_mode_row');
        if (modeRowEl) modeRowEl.style.display = isOpt ? '' : 'none';
        if (!isOpt && autoEnabled) {
            // Switch to single-select: keep only the highest currently-checked level
            const checkedBoxes = levelCheckboxes.filter(cb => cb.checked);
            const keepBox = checkedBoxes[checkedBoxes.length - 1] || levelCheckboxes[levelCheckboxes.length - 1];
            levelCheckboxes.forEach(cb => { cb.checked = cb === keepBox; });
        }
        if (!autoEnabled) applyManualDefaults();
        syncLevelCheckboxState();
        refreshDistributionPreview();
    };

    function getSelectedUnlockedOptsData() {
        const selectedIndices = levelCheckboxes.filter(cb => cb.checked && !cb.disabled).map(cb => parseInt(cb.dataset.levelIndex));
        const allScavOpts = Array.from(document.querySelectorAll('.scavenge-option'));
        let unlockIdx = 0;
        return allScavOpts
            .map((opt, idx) => {
                if (opt.querySelector('.locked-view')) return null;
                unlockIdx++;
                if (!selectedIndices.includes(unlockIdx)) return null;
                return { el: opt, base_id: parseInt(opt.dataset.optionId || opt.dataset.option_id || (idx + 1)), ratio: SCAVENGE_TIER_RATIOS[idx] || 0 };
            })
            .filter(o => o && o.ratio > 0);
    }

    const startBtn = document.createElement('a');
    startBtn.className = 'btn btn-default';
    startBtn.style.marginTop = '8px';
    startBtn.textContent = 'Start';
    startBtn.style.display = enableCheckbox.checked ? '' : 'none';
    startBtn.onclick = async () => {
        const isOptimize = document.getElementById('scavenge_config_optimize').checked;
        const isEnabled = document.getElementById('scavenge_config_enabled').checked;
        const units = getCurrentUnits();

        if (isOptimize) {
            const calcMode = document.querySelector('input[name="scavenge_optimize_mode"]:checked')?.value || 'balanced';
            const unlockedOptsData = getSelectedUnlockedOptsData();
            const selectedLevelIndices = levelCheckboxes.filter(cb => cb.checked && !cb.disabled).map(cb => parseInt(cb.dataset.levelIndex));

            const { distributionByOption } = computeScavengeOptimizedDistribution(units, unlockedOptsData, calcMode);

            saveScavengeConfig({ enabled: isEnabled, level: 0, units, optimizeMode: true, optimizeCalculationMode: calcMode, distributionByOption, selectedLevelIndices });

            refreshDistributionPreview();

            if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.configurationSaved'), false);
        } else {
            const selectableBoxes = levelCheckboxes.filter(cb => !cb.disabled);
            const selectedCb = selectableBoxes.find(cb => cb.checked) || selectableBoxes[selectableBoxes.length - 1];
            const selectedLevel = selectedCb ? parseInt(selectedCb.dataset.levelIndex) : unlockedOptions.length;
            saveScavengeConfig({ enabled: true, level: selectedLevel, units, optimizeMode: false, distributionByOption: null });
            if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.configurationSaved'), false);
        }

        if (isEnabled) runAutoScavengingAll();
    };
    contentDiv.appendChild(startBtn);

    enableCheckbox.onchange = () => {
        syncActionButtons();
        syncLevelCheckboxState();
        if (!enableCheckbox.checked) {
            applyManualDefaults();
        }
        refreshDistributionPreview();
    };

    syncLevelCheckboxState();
    if (!enableCheckbox.checked) {
        applyManualDefaults();
    }

    const sendNowBtn = document.createElement('a');
    sendNowBtn.className = 'btn btn-default';
    sendNowBtn.style.cssText = 'margin-top:8px;margin-left:6px;';
    sendNowBtn.textContent = t('scavenge.sendNow');
    sendNowBtn.style.display = enableCheckbox.checked ? 'none' : '';
    sendNowBtn.onclick = async () => {
        const originalContent = sendNowBtn.innerHTML;
        sendNowBtn.disabled = true;
        sendNowBtn.innerHTML = '<img src="https://dsbr.innogamescdn.com/asset/f441272cc5/graphic/loading.gif" alt="" style="height:14px;vertical-align:middle;">';

        try {
            const isOptimize = document.getElementById('scavenge_config_optimize').checked;
            const units = getCurrentUnits();
            const isEnabled = document.getElementById('scavenge_config_enabled').checked;
            const useOptimizeMode = isOptimize;

            if (useOptimizeMode) {
                const calcMode = document.querySelector('input[name="scavenge_optimize_mode"]:checked')?.value || 'balanced';
                const unlockedOptsData = getSelectedUnlockedOptsData();
                const selectedLevelIndices = levelCheckboxes.filter(cb => cb.checked && !cb.disabled).map(cb => parseInt(cb.dataset.levelIndex));
                const { distributionByOption } = computeScavengeOptimizedDistribution(units, unlockedOptsData, calcMode);
                saveScavengeConfig({
                    enabled: isEnabled,
                    level: 0,
                    units,
                    optimizeMode: true,
                    optimizeCalculationMode: calcMode,
                    distributionByOption,
                    selectedLevelIndices,
                });
                await sendOptimizedScavengeNow(units, unlockedOptsData, calcMode);
                _scavengeSchedulePageReload();
            } else {
                // Manual send: use the current panel values, but do not enable automation.
                const selectableBoxes = levelCheckboxes.filter(cb => !cb.disabled);
                const selectedCb = selectableBoxes[selectableBoxes.length - 1] || null;
                if (!selectedCb) {
                    if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.noSelectableLevel'), true);
                    return;
                }
                const level = parseInt(selectedCb.dataset.levelIndex);

                const nonZeroUnits = Object.fromEntries(Object.entries(units).filter(([, v]) => v > 0));
                if (!Object.keys(nonZeroUnits).length) {
                    if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.noUnitsSpecified'), true);
                    return;
                }

                const allScavOpts = Array.from(document.querySelectorAll('.scavenge-option'));
                let targetOpt = null;
                if (level === 0) {
                    const available = allScavOpts.filter(opt => opt.querySelector('.inactive-view .free_send_button'));
                    targetOpt = available[available.length - 1] || null;
                } else {
                    const unlocked = allScavOpts.filter(opt => !opt.querySelector('.locked-view'));
                    targetOpt = unlocked[level - 1] || null;
                }

                if (!targetOpt) {
                    if (typeof showAutoHideBox === 'function') showAutoHideBox(t('scavenge.noOptionFound'), true);
                    return;
                }

                const optionId = parseInt(targetOpt.dataset.optionId || targetOpt.dataset.option_id || (allScavOpts.indexOf(targetOpt) + 1));
                const carryMax = Object.entries(nonZeroUnits).reduce((sum, [unit, count]) => sum + count * (SCAVENGE_UNIT_CARRY[unit] || 0), 0);
                const result = await sendScavengeSquadApi(nonZeroUnits, optionId, carryMax);

                if (result.success) {
                    saveScavengeConfig({ enabled: false, level, units, optimizeMode: false, allUnits: false, distributionByOption: null });
                }
                if (result.returnMs > 0 && isEnabled) {
                    setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, result.returnMs);
                }
                _scavengeSchedulePageReload();
            }
        } finally {
            sendNowBtn.disabled = false;
            sendNowBtn.innerHTML = originalContent;
        }
    };
    contentDiv.appendChild(sendNowBtn);

    function refreshDistributionPreview() {
        const optimizeEnabled = document.getElementById('scavenge_config_optimize')?.checked;
        const tableDiv = document.getElementById('scavenge_dist_table');
        if (!optimizeEnabled) {
            if (tableDiv) tableDiv.style.display = 'none';
            return;
        }

        const previewUnits = {};
        unitNames.forEach(unit => {
            const inp = document.getElementById('scavenge_config_unit_' + unit);
            previewUnits[unit] = inp ? (parseInt(inp.value, 10) || 0) : 0;
        });
        const calcMode = document.querySelector('input[name="scavenge_optimize_mode"]:checked')?.value || 'balanced';
        const unlockedOptsData = getSelectedUnlockedOptsData();
        const { tableHtml } = computeScavengeOptimizedDistribution(previewUnits, unlockedOptsData, calcMode);
        if (!tableDiv) {
            const newTableDiv = document.createElement('div');
            newTableDiv.id = 'scavenge_dist_table';
            contentDiv.appendChild(newTableDiv);
            newTableDiv.innerHTML = tableHtml;
            return;
        }

        tableDiv.style.display = '';
        tableDiv.innerHTML = tableHtml;
    }

    // Show table on load if optimize mode is already active
    refreshDistributionPreview();
    syncActionButtons();

    panel.appendChild(contentDiv);

    const toggleKey = 'scavenge_panel_collapsed_' + (game_data?.village?.id || '');
    const isCollapsed = localStorage.getItem(toggleKey) === '1';
    if (isCollapsed) {
        contentDiv.style.display = 'none';
        toggleImg.style.transform = 'rotate(0deg)';
        toggleImg.alt = t('button.expand');
        toggleImg.title = t('button.expand');
    } else {
        toggleImg.alt = t('button.collapse');
        toggleImg.title = t('button.collapse');
    }

    header.onclick = () => {
        const isVisible = contentDiv.style.display !== 'none';
        contentDiv.style.display = isVisible ? 'none' : '';
        toggleImg.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        toggleImg.alt = isVisible ? t('button.expand') : t('button.collapse');
        toggleImg.title = isVisible ? t('button.expand') : t('button.collapse');
        localStorage.setItem(toggleKey, isVisible ? '1' : '0');
    };

    container.insertBefore(panel, container.firstChild);
}

/**
 * Entry point called when the scavenge screen loads.
 * Injects the config panel and starts auto-scavenging if enabled for this village.
 */
function injectAutoScavengingOption() {
    injectScavengeConfigPanel();
    if(getScavengeConfig().enabled) {
        runAutoScavengingAll();
    }
}

/**
 * Main auto-scavenge loop. Selects the target scavenge option based on village config,
 * fills in the troops (all available or specific amounts), and sends via API.
 * If a mission is already in progress, schedules the next check and exits immediately.
 */
async function runAutoScavengingAll() {
    // Skip if a timer is already scheduled and still in the future — avoids redundant API calls on every page visit.
    const existingEndTime = parseInt(localStorage.getItem('endTime_scavenging-auto'), 10);
    if (existingEndTime && existingEndTime > Date.now()) {
        console.log('[AutoScavenge] Timer already active, skipping run.');
        return;
    }

    const config = getScavengeConfig();

    if (config.optimizeMode) {
        await runOptimizedScavenge();
        return;
    }

    // Resolve target .scavenge-option based on per-village config
    const allOptions = Array.from(document.querySelectorAll('.scavenge-option'));
    let targetOption = null;
    if (config.level === 0) {
        // Auto: highest available (last option with an active free_send_button)
        const available = allOptions.filter(opt => opt.querySelector('.inactive-view .free_send_button'));
        targetOption = available[available.length - 1] || null;
    } else {
        // Specific level index among unlocked options
        const unlocked = allOptions.filter(opt => !opt.querySelector('.locked-view'));
        targetOption = unlocked[config.level - 1] || null;
    }

    const returnTime = targetOption
        ? targetOption.querySelector('.return-countdown')
        : document.querySelector('.return-countdown');

    // If a mission is already in progress, schedule the next check and exit.
    if (returnTime) {
        const waitTime = Math.floor(timeToMilliseconds(returnTime.textContent));
        if (waitTime > 0) {
            const jitterMs = _scavRandomDelayMs();
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, waitTime + jitterMs);
        }
        return;
    }

    // --- API approach ---
    console.log('[AutoScavenge] runAutoScavengingAll: targetOption:', !!targetOption, '| level:', config.level, '| allUnits:', config.allUnits);
    if (targetOption) {
        // Fill unit inputs via DOM first so we can read the final counts.
        const originalWidget = getOriginalScavengeWidget();
        if (config.allUnits !== false) {
            // Click all units-entry-all except the last (paladin) to populate inputs.
            const unitAllButtons = originalWidget ? originalWidget.querySelectorAll('.units-entry-all') : document.querySelectorAll('.scavenge-option .units-entry-all');
            unitAllButtons.forEach((btn, index) => {
                if (index !== unitAllButtons.length - 1) btn.click();
            });
            await wait(0.1); // allow DOM to reflect updated values
        } else {
            Object.entries(config.units || {}).forEach(([unit, amount]) => {
                const input = document.querySelector(`input[name="${unit}"]`);
                if (input) {
                    input.value = amount.toString();
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        // Read unit counts from the now-filled candidate squad inputs.
        const unitCounts = {};
        const countInputs = originalWidget ? originalWidget.querySelectorAll('input[name]') : document.querySelectorAll('.candidate-squad-widget input[name]');
        countInputs.forEach(inp => {
            const val = parseInt(inp.value, 10) || 0;
            if (val > 0) unitCounts[inp.name] = val;
        });
        console.log('[AutoScavenge] runAutoScavengingAll: unitCounts:', JSON.stringify(unitCounts));

        const carryMax = Object.entries(unitCounts).reduce(
            (sum, [unit, count]) => sum + count * (SCAVENGE_UNIT_CARRY[unit] || 0), 0
        );

        // Derive option_id from the element's data attribute, fall back to 1-based position.
        const optionId = targetOption.dataset.optionId
            || targetOption.dataset.option_id
            || (allOptions.indexOf(targetOption) + 1);
        console.log('[AutoScavenge] runAutoScavengingAll: optionId:', optionId, '| carryMax:', carryMax);

        // Write optionId and lastUnitCounts back into scavenge_configs so triggerScavengingAuto
        // can reuse them on the next scheduled call without needing a page redirect.
        saveScavengeConfig({ ...config, optionId, lastUnitCounts: unitCounts });

        const result = await sendScavengeSquadApi(unitCounts, optionId, carryMax);
        console.log('[AutoScavenge] runAutoScavengingAll: result — success:', result.success, '| returnMs:', result.returnMs);
        if (result.returnMs > 0) {
            const jitterMs = _scavRandomDelayMs();
            const totalMs = result.returnMs + jitterMs;
            console.log('[AutoScavenge] runAutoScavengingAll: next run in', Math.round(totalMs / 60000), 'min (incl.', Math.round(jitterMs / 60000), 'min jitter).');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, totalMs);
        } else if (result.success) {
            console.warn('[AutoScavenge] runAutoScavengingAll: send succeeded but no returnMs — retrying in 5 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 5 * 60 * 1000);
        } else {
            console.warn('[AutoScavenge] runAutoScavengingAll: send failed with no returnMs — retrying in 30 min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, 30 * 60 * 1000);
        }
    } else {
        console.log('[AutoScavenge] runAutoScavengingAll: no targetOption — nothing to send.');
    }

    /* --- LEGACY: DOM click approach — uncomment block below to revert ---
    const startButton = targetOption ? targetOption.querySelector('.inactive-view .free_send_button') : null;
    if (startButton && !returnTime) {
        if (config.allUnits !== false) {
            // Click all units-entry-all except the last (paladin)
            const unitAllButtons = document.querySelectorAll('.units-entry-all');
            unitAllButtons.forEach((btn, index) => {
                if (index !== unitAllButtons.length - 1) btn.click();
            });
        } else {
            // Set specific unit amounts
            Object.entries(config.units || {}).forEach(([unit, amount]) => {
                const input = document.querySelector(`input[name="${unit}"]`);
                if (input) {
                    input.value = amount.toString();
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        startButton.style.color = 'red';
        startButton.click();
        await wait(1);
        const duration = targetOption
            ? targetOption.querySelector('.return-countdown')
            : document.querySelector('.return-countdown');
        if (duration) {
            var waitTime = timeToMilliseconds(duration.textContent);
            if (waitTime > 0) {
                setFunctionOnTimeOut('scavenging-auto', function () {
                    window.location.href = game_data.link_base_pure + 'place&mode=scavenge';
                }, waitTime);
            }
        }
    }
    --- END LEGACY --- */
}


// Not currently in use.
function stopAutoScavenging() {
    const form = document.querySelector('#auto_scavenging_form');
    const unitsInput = Array.from(form.querySelectorAll('input'));

    const unitsInputByName = {};
    unitsInput.forEach(input => {
        unitsInputByName[input.name] = input.value;
    });
}