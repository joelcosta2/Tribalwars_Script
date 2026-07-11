

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
        if (!response.ok) return { success: false, returnMs: 0 };
        data = await response.json();
        // Response shape: { response: { squad_responses: [{ success, error }], villages: { ... } } }
        const squadResponse = data?.response?.squad_responses?.[0];
        if (!squadResponse?.success) {
            console.warn('[AutoScavenge] Send rejected:', squadResponse?.error ?? 'no squad_responses in response');
        }
    } catch (e) {
        console.error('[AutoScavenge] API send failed:', e);
        return { success: false, returnMs: 0 };
    }

    // Parse return time — attempted even on failure (troops from a different option may already be out).
    // Scan ALL options for the earliest active scavenging_squad.return_time so that when we fail to send
    // to option 1 because units are already in option 2, we still know when to retry.
    // return_time is an epoch timestamp in seconds.
    const success = data?.response?.squad_responses?.[0]?.success === true;
    let returnMs = 0;
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
            const waitMs = earliestRt ? Math.max(0, earliestRt * 1000 - Date.now()) : 0;
            console.log('[AutoScavenge] level=0: all options busy | earliest return_time:', earliestRt, '| waiting:', Math.round(waitMs / 60000), 'min.');
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
            console.log('[AutoScavenge] level=0: next run in', Math.round(fetchedResult.returnMs / 60000), 'min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, fetchedResult.returnMs);
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
        console.log('[AutoScavenge] Next run in', Math.round(result.returnMs / 60000), 'min.');
        setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, result.returnMs);
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
    const unitNames = Array.from(document.querySelectorAll('.candidate-squad-widget input[name]')).map(i => i.name);

    const panel = document.createElement('div');
    panel.id = 'scavenge_bot_config';
    panel.className = 'vis';
    panel.style.cssText = 'margin-top: 12px; width: 100%;';

    const header = document.createElement('h4');
    header.className = 'head with-button';
    header.style.cssText = 'display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 0;';
    const headerText = document.createElement('span');
    headerText.textContent = 'Auto-Scavenge — Village Configuration';
    header.appendChild(headerText);
    const toggleImg = document.createElement('img');
    toggleImg.src = 'https://dspt.innogamescdn.com/asset/95eda994/graphic//icons/slide_down.png';
    toggleImg.alt = 'Toggle';
    toggleImg.className = 'village-list-toggle';
    toggleImg.style.cssText = 'transform: rotate(180deg); transition: transform 0.2s; cursor: pointer;';
    header.appendChild(toggleImg);
    panel.appendChild(header);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'scavenge_bot_config_content';

    const table = document.createElement('table');
    table.className = 'vis';
    table.style.width = '100%';
    const tbody = document.createElement('tbody');

    // Enable/disable automation for this village
    const enableRow = tbody.insertRow();
    const ec0 = enableRow.insertCell(0);
    ec0.style.fontWeight = 'bold';
    ec0.textContent = 'Automation:';
    const ec1 = enableRow.insertCell(1);
    const enableLabel = document.createElement('label');
    const enableCheckbox = document.createElement('input');
    enableCheckbox.type = 'checkbox';
    enableCheckbox.id = 'scavenge_config_enabled';
    enableCheckbox.checked = config.enabled === true;
    enableCheckbox.style.marginRight = '5px';
    enableLabel.appendChild(enableCheckbox);
    enableLabel.appendChild(document.createTextNode('Enable Auto-Scavenge for this village'));
    ec1.appendChild(enableLabel);

    // Level selection row
    const levelRow = tbody.insertRow();
    const lc0 = levelRow.insertCell(0);
    lc0.style.fontWeight = 'bold';
    lc0.textContent = 'Level:';
    const lc1 = levelRow.insertCell(1);
    const levelSelect = document.createElement('select');
    levelSelect.id = 'scavenge_config_level';
    levelSelect.className = 'input-nicer';
    const autoOpt = document.createElement('option');
    autoOpt.value = '0';
    autoOpt.textContent = 'Highest available';
    levelSelect.appendChild(autoOpt);
    unlockedOptions.forEach((opt, i) => {
        const o = document.createElement('option');
        o.value = (i + 1).toString();
        const titleEl = opt.querySelector('.title');
        o.textContent = titleEl ? titleEl.textContent.trim() : 'Level ' + (i + 1);
        levelSelect.appendChild(o);
    });
    levelSelect.value = Math.min(config.level || 0, unlockedOptions.length).toString();
    lc1.appendChild(levelSelect);

    // All units toggle row
    const allRow = tbody.insertRow();
    allRow.insertCell(0);
    const allCell = allRow.insertCell(1);
    const allLabel = document.createElement('label');
    const allCheckbox = document.createElement('input');
    allCheckbox.type = 'checkbox';
    allCheckbox.id = 'scavenge_config_all';
    allCheckbox.checked = config.allUnits !== false;
    allCheckbox.style.marginRight = '5px';
    allLabel.appendChild(allCheckbox);
    allLabel.appendChild(document.createTextNode('Use all available troops'));
    allCell.appendChild(allLabel);

    // Units configuration row — always visible, inputs disabled when allUnits is checked
    const unitsRow = tbody.insertRow();
    unitsRow.id = 'scavenge_units_row';
    const unitsCell = unitsRow.insertCell(0);
    unitsCell.colSpan = 2;
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
    const isDisabled = allCheckbox.checked;

    unitNames.forEach(unit => {
        // Header: unit icon
        const th = document.createElement('th');
        th.style.cssText = 'text-align: center; padding: 2px 1px;';
        const img = document.createElement('img');
        img.src = assetBase + 'unit/unit_' + unit + '.png';
        img.style.cssText = 'width: 25px; height: 25px; display: block; margin: 0 auto;';
        img.title = unit;
        th.appendChild(img);
        imgRow.appendChild(th);

        // Body: input field
        const td = document.createElement('td');
        td.style.cssText = 'text-align: center; padding: 2px 1px;';
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = '0';
        inp.value = (config.units && config.units[unit] != null) ? config.units[unit].toString() : '0';
        inp.id = 'scavenge_config_unit_' + unit;
        inp.className = 'unitsInput input-nicer';
        inp.style.cssText = 'width: 38px; text-align: center;';
        inp.disabled = isDisabled;
        if (isDisabled) inp.style.opacity = '0.4';
        td.appendChild(inp);
        inputRow.appendChild(td);
    });

    unitsThead.appendChild(imgRow);
    unitsTbody.appendChild(inputRow);
    unitsTable.appendChild(unitsThead);
    unitsTable.appendChild(unitsTbody);
    unitsWrapper.appendChild(unitsTable);
    unitsCell.appendChild(unitsWrapper);

    table.appendChild(tbody);
    contentDiv.appendChild(table);

    allCheckbox.onchange = () => {
        const disabled = allCheckbox.checked;
        unitNames.forEach(unit => {
            const inp = document.getElementById('scavenge_config_unit_' + unit);
            if (inp) {
                inp.disabled = disabled;
                inp.style.opacity = disabled ? '0.4' : '1';
            }
        });
    };

    const saveBtn = document.createElement('a');
    saveBtn.className = 'btn btn-default';
    saveBtn.style.marginTop = '8px';
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => {
        const units = {};
        unitNames.forEach(unit => {
            const inp = document.getElementById('scavenge_config_unit_' + unit);
            units[unit] = inp ? (parseInt(inp.value, 10) || 0) : 0;
        });
        saveScavengeConfig({
            enabled: document.getElementById('scavenge_config_enabled').checked,
            level: parseInt(document.getElementById('scavenge_config_level').value, 10) || 0,
            allUnits: document.getElementById('scavenge_config_all').checked,
            units
        });
        if (typeof showAutoHideBox === 'function') showAutoHideBox('Configuration saved!', false);
    };
    contentDiv.appendChild(saveBtn);
    panel.appendChild(contentDiv);

    header.onclick = () => {
        const isVisible = contentDiv.style.display !== 'none';
        contentDiv.style.display = isVisible ? 'none' : '';
        toggleImg.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
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
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, waitTime);
        }
        return;
    }

    // --- API approach ---
    console.log('[AutoScavenge] runAutoScavengingAll: targetOption:', !!targetOption, '| level:', config.level, '| allUnits:', config.allUnits);
    if (targetOption) {
        // Fill unit inputs via DOM first so we can read the final counts.
        if (config.allUnits !== false) {
            // Click all units-entry-all except the last (paladin) to populate inputs.
            const unitAllButtons = document.querySelectorAll('.units-entry-all');
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
        document.querySelectorAll('.candidate-squad-widget input[name]').forEach(inp => {
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
            console.log('[AutoScavenge] runAutoScavengingAll: next run in', Math.round(result.returnMs / 60000), 'min.');
            setFunctionOnTimeOut('scavenging-auto', function () { triggerScavengingAuto(); }, result.returnMs);
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