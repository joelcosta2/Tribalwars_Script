var recruitResourceObserver = null;
var pendingTrainingDeduction = { wood: 0, stone: 0, iron: 0 };
var calculateMaxTroopsDebounceTimer = null;
var lastRecuitWidgetVillageId = null;
var recruitWidgetVillageCheckInterval = null;

function setButtonLoadingState(button, isLoading, fallbackLabel) {
    if (!button) return;

    if (isLoading) {
        if (button.dataset.originalContent == null) {
            button.dataset.originalContent = button.innerHTML;
        }
        button.disabled = true;
        button.innerHTML = '<img src="https://dsbr.innogamescdn.com/asset/f441272cc5/graphic/loading.gif" id="" alt="" class="">';
        return;
    }

    button.disabled = false;
    button.innerHTML = button.dataset.originalContent || fallbackLabel || button.textContent || '';
    delete button.dataset.originalContent;
}

function refreshRecruitWidgetAfterDelay(delayMs = 1000) {
    setTimeout(() => {
        if (typeof injectRecruitTroopsWidget === 'function') injectRecruitTroopsWidget();
    }, delayMs);
}

/**
 * Recalculates the maximum affordable quantity for every trainable unit given the
 * current available resources and the quantities already typed in other unit inputs.
 * Updates each input's max attribute and the clickable "(N)" shortcut beside it.
 * @param {string|null} [changedUnit=null] - The unit whose input just changed.
 */
function calculateMaxTroops(changedUnit = null) {
    const currentQueued = {};
    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + '_input');
        currentQueued[unit] = input ? Number(input.value) || 0 : 0;
    });

    const availPop = (game_data.village?.pop_max || 0) - (game_data.village?.pop || 0);
    const totalResources = {
        wood: Math.max(0, (Number(document.getElementById('wood')?.textContent.replace(/\D/g, '')) || 0) - pendingTrainingDeduction.wood),
        stone: Math.max(0, (Number(document.getElementById('stone')?.textContent.replace(/\D/g, '')) || 0) - pendingTrainingDeduction.stone),
        iron: Math.max(0, (Number(document.getElementById('iron')?.textContent.replace(/\D/g, '')) || 0) - pendingTrainingDeduction.iron),
        pop: availPop
    };

    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};

    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + '_input');
        if (!input || !unitData[unit]) return;
        const costs = unitData[unit];

        // absoluteMax = the true ceiling for THIS unit's input — the highest value it
        // could ever hold given what every OTHER unit's input already committed.
        // It does NOT shrink because of this unit's own typed value, so it's safe to use
        // as the HTML "max" attribute for validation/clamping without fighting the user.
        let absoluteMax = Infinity;

        Object.keys(costs).forEach(resource => {
            if (!(resource in totalResources)) return;
            const cost = costs[resource];
            if (!cost) return;

            // Consumption of every OTHER unit only (excluding this unit's own input)
            let consumptionOthers = 0;
            game_data.units.forEach(otherUnit => {
                if (otherUnit === unit) return;
                if (!unitData[otherUnit]) return;
                const otherCosts = unitData[otherUnit];
                if (!(resource in otherCosts)) return;
                consumptionOthers += currentQueued[otherUnit] * otherCosts[resource];
            });

            const available = totalResources[resource] - consumptionOthers;
            const possible = available > 0 ? Math.floor(available / cost) : 0;
            absoluteMax = Math.min(absoluteMax, possible);
        });

        if (!isFinite(absoluteMax) || absoluteMax < 0) absoluteMax = 0;

        // input.max is the absolute ceiling: never reduced by the unit's own value,
        // so simply typing into this same field never gets clamped back down.
        input.max = absoluteMax;

        // remaining = how many MORE of this unit could still be added on top of what's
        // already typed here. This is what gets displayed in the "(N)" shortcut, so it
        // visibly shrinks both when you type into this unit and when other units consume
        // the shared resource pool.
        const remaining = Math.max(0, absoluteMax - currentQueued[unit]);

        const maxElementId = unit + '_max';
        let maxElement = document.getElementById(maxElementId);
        if (!maxElement) {
            maxElement = document.createElement('a');
            maxElement.id = maxElementId;
            maxElement.style.marginLeft = '5px';
            maxElement.style.cursor = 'pointer';
            input.parentNode.appendChild(maxElement);
        }
        maxElement.textContent = '(' + remaining + ')';
        // Clicking fills the input up to its absolute max (not just the remaining delta),
        // otherwise it would overwrite/discard whatever was already typed.
        maxElement.onclick = (function (inp, val) {
            return function () { inp.value = val; inp.dispatchEvent(new Event('input')); calculateMaxTroops(unit); };
        }(input, absoluteMax));
    });
}

/**
 * Reads all non-zero unit input values, POSTs a train request to the barracks endpoint,
 * then refreshes the widget once the server-side training data has been re-fetched.
 */
async function submitTroops() {
    // Capture units to submit before any async work
    const submittedUnits = {};
    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + '_input');
        const qty = input ? Number(input.value) || 0 : 0;
        if (qty > 0) submittedUnits[unit] = qty;
    });

    if (!Object.keys(submittedUnits).length) return;

    const trainButton = document.getElementById('recruit_troops_btn');
    setButtonLoadingState(trainButton, true, 'Recruit');
    await new Promise(requestAnimationFrame);

    const bodyData = new URLSearchParams();
    Object.entries(submittedUnits).forEach(([unit, qty]) => {
        bodyData.append(`units[${unit}]`, qty);
    });
    bodyData.append('h', game_data.csrf);

    const resp = await fetch(`${game_data.link_base_pure}train&ajaxaction=train&mode=train`, {
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'priority': 'u=1, i',
            'tribalwars-ajax': '1',
            'x-requested-with': 'XMLHttpRequest',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        referrer: `${game_data.link_base_pure}train`,
        body: bodyData.toString(),
        method: 'POST',
        credentials: 'include'
    });

    if (resp.ok) {
        // Deduct resource costs immediately so DOM and widget maxes reflect the spend
        const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
        const totalCost = { wood: 0, stone: 0, iron: 0 };
        Object.entries(submittedUnits).forEach(([unit, qty]) => {
            const costs = unitData[unit] || {};
            totalCost.wood += (costs.wood || 0) * qty;
            totalCost.stone += (costs.stone || 0) * qty;
            totalCost.iron += (costs.iron || 0) * qty;
        });

        ['wood', 'stone', 'iron'].forEach(res => {
            // Update game_data so the tick handler re-renders the correct value on the next tick
            if (game_data.village[res + '_float'] != null) {
                game_data.village[res + '_float'] = Math.max(0, game_data.village[res + '_float'] - totalCost[res]);
                game_data.village[res] = Math.floor(game_data.village[res + '_float']);
            }
            // Update DOM immediately for instant visual feedback
            const el = document.getElementById(res);
            if (el) el.textContent = Math.max(0, (Number(el.textContent.replace(/\D/g, '')) || 0) - totalCost[res]);
        });

        // Accumulate spend so calculateMaxTroops stays correct even if the game tick
        // restores game_data.village.*_float before the widget is re-injected.
        pendingTrainingDeduction.wood += totalCost.wood;
        pendingTrainingDeduction.stone += totalCost.stone;
        pendingTrainingDeduction.iron += totalCost.iron;

        calculateMaxTroops();
        if (typeof showAutoHideBox === 'function') showAutoHideBox('Troops recruited!', false);
        setTimeout(() => partialReload(), 1000);
    } else {
        if (typeof showAutoHideBox === 'function') showAutoHideBox('Error recruiting troops.', true);
        setButtonLoadingState(trainButton, false, 'Recruit');
    }

    // Re-inject the widget only after the fetchTrainInfo AJAX call completes.
    // Clear pending deduction first — server data is now fresh so DOM will be correct.
    fetchTrainInfo(() => { pendingTrainingDeduction = { wood: 0, stone: 0, iron: 0 }; injectRecruitTroopsWidget(); });
}


/**
 * Sends troops to the training queue in interleaved single-unit batches.
 * Each round sends 1 of every unit type that still has remaining quantity,
 * creating an alternating pattern in the training queue.
 */
async function disperseTroops() {
    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
    const remaining = {};
    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + '_input');
        const qty = input ? Number(input.value) || 0 : 0;
        if (qty > 0) remaining[unit] = qty;
    });

    if (!Object.keys(remaining).length) return;

    const disperseButton = document.getElementById('disperse_troops_btn');
    setButtonLoadingState(disperseButton, true, 'Disperse');
    await new Promise(requestAnimationFrame);

    const totalCost = { wood: 0, stone: 0, iron: 0 };
    let batchCount = 0;
    let failed = false;

    while (Object.keys(remaining).length > 0 && !failed) {
        const batch = {};
        for (const unit of Object.keys(remaining)) {
            batch[unit] = 1;
            remaining[unit]--;
            if (remaining[unit] <= 0) delete remaining[unit];
        }

        const bodyData = new URLSearchParams();
        Object.entries(batch).forEach(([unit, qty]) => bodyData.append(`units[${unit}]`, qty));
        bodyData.append('h', game_data.csrf);

        try {
            const resp = await fetch(`${game_data.link_base_pure}train&ajaxaction=train&mode=train`, {
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'tribalwars-ajax': '1',
                    'x-requested-with': 'XMLHttpRequest',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                referrer: `${game_data.link_base_pure}train`,
                body: bodyData.toString(),
                method: 'POST',
                credentials: 'include'
            });

            if (resp.ok) {
                batchCount++;
                Object.entries(batch).forEach(([unit, qty]) => {
                    const costs = unitData[unit] || {};
                    totalCost.wood += (costs.wood || 0) * qty;
                    totalCost.stone += (costs.stone || 0) * qty;
                    totalCost.iron += (costs.iron || 0) * qty;
                });
                if (Object.keys(remaining).length > 0) await new Promise(r => setTimeout(r, 150));
            } else {
                failed = true;
            }
        } catch (e) {
            failed = true;
        }
    }

    ['wood', 'stone', 'iron'].forEach(res => {
        if (game_data.village[res + '_float'] != null) {
            game_data.village[res + '_float'] = Math.max(0, game_data.village[res + '_float'] - totalCost[res]);
            game_data.village[res] = Math.floor(game_data.village[res + '_float']);
        }
        const el = document.getElementById(res);
        if (el) el.textContent = Math.max(0, (Number(el.textContent.replace(/\D/g, '')) || 0) - totalCost[res]);
    });

    pendingTrainingDeduction.wood += totalCost.wood;
    pendingTrainingDeduction.stone += totalCost.stone;
    pendingTrainingDeduction.iron += totalCost.iron;

    if (batchCount > 0 && typeof showAutoHideBox === 'function')
        showAutoHideBox(`Dispersed in ${batchCount} batch${batchCount > 1 ? 'es' : ''}!`, false);
    if (failed && typeof showAutoHideBox === 'function')
        showAutoHideBox('Disperse stopped — a batch failed.', true);

    if (!failed && batchCount > 0) {
        setTimeout(() => partialReload(), 1000);
    } else {
        setButtonLoadingState(disperseButton, false, 'Disperse');
    }

    calculateMaxTroops();
    fetchTrainInfo(() => { pendingTrainingDeduction = { wood: 0, stone: 0, iron: 0 }; injectRecruitTroopsWidget(); });
}

/**
 * Builds and injects the Recruit Troops widget into the configured column.
 * Renders one row per trainable unit (image, name, in-village count, resource costs),
 * recruit and clear buttons, and the current training queue.
 * Attaches a MutationObserver on the resource counters to keep max values live.
 * Monitors village changes and reinjects with new village's data when switched.
 */
function injectRecruitTroopsWidget() {
    if (!settings_cookies.general['show__recruit_troops']) {
        // Clean up if widget is disabled
        if (recruitResourceObserver) recruitResourceObserver.disconnect();
        if (recruitWidgetVillageCheckInterval) clearInterval(recruitWidgetVillageCheckInterval);
        return;
    }

    const villageId = game_data.village?.id || 'unknown';
    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
    const villageUnitCounts = JSON.parse(localStorage.getItem(`village_unit_counts_${villageId}`) || '{}');
    const queueData = JSON.parse(localStorage.getItem(`train_queue_data_${villageId}`) || '{}');
    
    // If this village has no cached data yet, fetch training info now
    if (Object.keys(villageUnitCounts).length === 0 && typeof fetchTrainInfo === 'function') {
        fetchTrainInfo(() => injectRecruitTroopsWidget());
        return;
    }
    
    const lang = JSON.parse(localStorage.getItem('tw_lang')) || {};
    const widgetConfig = settings_cookies.widgets.find(function (w) { return w.name === 'recruit_troops'; });
    const columnToUse = widgetConfig ? widgetConfig.column : LEFT_COLUMN;

    const table = document.createElement('table');
    table.id = 'widget_recruit';
    table.className = 'vis';
    table.style.width = '100%';
    const tbody = document.createElement('tbody');

    for (const unit in unitData) {
        // Only render units available in this village's training buildings
        if (!villageUnitCounts[unit]) continue;

        const info = unitData[unit];
        const row = document.createElement('tr');

        // Unit cell: image + localized name + costs
        const unitCell = document.createElement('td');
        unitCell.style.cssText = 'padding: 3px 6px; vertical-align: middle; min-width: 0;';

        const unitTop = document.createElement('div');
        unitTop.style.cssText = 'display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-wrap: nowrap;';

        const img = document.createElement('img');
        img.src = info.img || ('graphic/unit/unit_' + unit + '.png');
        img.style.cssText = 'width: 22px; height: 22px; vertical-align: middle;';
        img.alt = unit;

        const nameSpan = document.createElement('span');
        nameSpan.style.cssText = 'font-size: 12px; white-space: nowrap; display: flex; align-items: center; gap: 2px;';
        nameSpan.textContent = info.name || (unit.charAt(0).toUpperCase() + unit.slice(1));

        // Show current in-village count alongside the unit name (only per-village data)
        if (villageUnitCounts[unit]) {
            const countText = villageUnitCounts[unit]; // Format: "596/596"
            const currentCount = countText.split('/')[1] || countText.split('/')[0] || '0';
            const queueCount = queueData[unit] || 0;
            
            const countSpan = document.createElement('small');
            countSpan.style.cssText = 'color: #888; font-size: 10px; white-space: nowrap; flex-shrink: 0;';
            
            // Show count format: (596+queueCount) where queue count is in orange
            if (queueCount > 0) {
                countSpan.innerHTML = '(' + currentCount + '<span style="color: #ff9900; font-weight: bold; font-size: 8px">+' + queueCount + '</span>)';
            } else {
                countSpan.textContent = '(' + currentCount + ')';
            }
            nameSpan.appendChild(countSpan);
        }
        unitTop.appendChild(img);
        unitTop.appendChild(nameSpan);
        unitCell.appendChild(unitTop);

        // Resource cost row: wood, stone, iron, population, and build time
        const costDiv = document.createElement('div');
        costDiv.style.cssText = 'display: flex; gap: 5px; flex-wrap: wrap; margin-top: 2px;';
        [['wood', 'wood'], ['stone', 'stone'], ['iron', 'iron'], ['pop', 'population']].forEach(function (pair) {
            const key = pair[0], iconClass = pair[1];
            if (!info[key]) return;
            const span = document.createElement('span');
            span.style.cssText = 'display: flex; align-items: center; gap: 1px; font-size: 10px; color: #555;';
            const icon = document.createElement('span');
            icon.className = 'icon header ' + iconClass;
            icon.style.cssText = 'width: 12px; height: 12px; display: inline-block;';
            const costText = document.createElement('span');
            costText.id = unit + '_cost_' + key;
            costText.dataset.base = info[key];
            costText.textContent = info[key];
            span.appendChild(icon);
            span.appendChild(costText);
            costDiv.appendChild(span);
        });
        let tSpan = null;
        if (info.build_time) {
            const ms = info.build_time;
            const h = Math.floor(ms / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            tSpan = document.createElement('span');
            tSpan.id = unit + '_cost_time';
            tSpan.dataset.baseMs = info.build_time;
            tSpan.style.cssText = 'font-size: 10px; color: #888; display: block; text-align: right; margin-top: 2px;';
            tSpan.textContent = h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        }
        unitCell.appendChild(costDiv);
        row.appendChild(unitCell);

        // Input + max link cell
        const inputCell = document.createElement('td');
        inputCell.style.cssText = 'text-align: right; padding: 3px 6px; white-space: nowrap; vertical-align: middle;';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        input.style.width = '55px';
        input.className = 'train-input train-' + unit;
        input.id = unit + '_input';
        input.dataset.unit = unit;
        input.addEventListener('change', (function (u) {
            return function () {
                // Clamp to max before recalculating so other units see the correct value
                const max = parseInt(this.max, 10);
                if (!isNaN(max) && Number(this.value) > max) {
                    this.value = max;
                    this.dispatchEvent(new Event('input'));
                }
                calculateMaxTroops(u);
            };
        }(unit)));

        input.addEventListener('input', (function (u) {
            return function () {
                const qty = Math.max(0, Number(this.value) || 0);
                const displayQty = qty <= 0 ? 1 : qty;
                ['wood', 'stone', 'iron', 'pop'].forEach(function (key) {
                    const el = document.getElementById(u + '_cost_' + key);
                    if (el) el.textContent = parseInt(el.dataset.base, 10) * displayQty;
                });
                const timeEl = document.getElementById(u + '_cost_time');
                if (timeEl && timeEl.dataset.baseMs) {
                    const totalMs = parseInt(timeEl.dataset.baseMs, 10) * displayQty;
                    const th = Math.floor(totalMs / 3600000);
                    const tm = Math.floor((totalMs % 3600000) / 60000);
                    const ts = Math.floor((totalMs % 60000) / 1000);
                    timeEl.textContent = th + ':' + String(tm).padStart(2, '0') + ':' + String(ts).padStart(2, '0');
                }
                // Recalculate max for all units during input to update other units' max in real-time
                if (calculateMaxTroopsDebounceTimer) clearTimeout(calculateMaxTroopsDebounceTimer);
                calculateMaxTroopsDebounceTimer = setTimeout(function () {
                    calculateMaxTroops(u);
                    calculateMaxTroopsDebounceTimer = null;
                }, 150);
            };
        }(unit)));

        const maxLink = document.createElement('a');
        maxLink.id = unit + '_max';
        // onclick is re-assigned by calculateMaxTroops after each recalculation
        maxLink.style.cssText = 'margin-left: 4px; cursor: pointer; font-size: 11px;';
        maxLink.textContent = '(-)';

        inputCell.appendChild(input);
        inputCell.appendChild(maxLink);
        if (tSpan) inputCell.appendChild(tSpan);
        row.appendChild(inputCell);
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display: flex; gap: 6px; margin-top: 6px;';

    const trainButton = document.createElement('button');
    trainButton.id = 'recruit_troops_btn';
    trainButton.textContent = lang['e1de43dd18d19451febfc1584ab33767'] || 'Recruit';
    trainButton.className = 'btn btn-default';
    trainButton.addEventListener('click', submitTroops);

    const disperseButton = document.createElement('button');
    disperseButton.id = 'disperse_troops_btn';
    disperseButton.textContent = 'Disperse';
    disperseButton.className = 'btn btn-default';
    disperseButton.title = 'Sends 1 of each unit type alternately until all are queued';
    disperseButton.addEventListener('click', disperseTroops);
    btnRow.appendChild(trainButton);
    btnRow.appendChild(disperseButton);

    const container = document.createElement('div');
    container.appendChild(table);
    container.appendChild(btnRow);

    createWidgetElement({
        identifier: 'Recruit',
        contents: container,
        columnToUse,
        update: true,
        extra_name: 'troops',
        description: 'Train your troops'
    });

    calculateMaxTroops();

    // Observe resource element changes to keep max counts live
    if (recruitResourceObserver) recruitResourceObserver.disconnect();
    recruitResourceObserver = new MutationObserver(function () { calculateMaxTroops(); });
    ['wood', 'stone', 'iron'].forEach(function (res) {
        const el = document.getElementById(res);
        if (el) recruitResourceObserver.observe(el, { childList: true, characterData: true, subtree: true });
    });

    // Monitor village changes: if player switches villages without page reload,
    // fetch new training data and reinject widget with correct village's data
    lastRecuitWidgetVillageId = villageId;
    if (recruitWidgetVillageCheckInterval) clearInterval(recruitWidgetVillageCheckInterval);
    recruitWidgetVillageCheckInterval = setInterval(function () {
        const currentVillageId = game_data.village?.id || 'unknown';
        if (currentVillageId !== lastRecuitWidgetVillageId) {
            lastRecuitWidgetVillageId = currentVillageId;
            // Village changed: fetch training data for new village and reinject widget
            if (typeof fetchTrainInfo === 'function') {
                fetchTrainInfo(function () { injectRecruitTroopsWidget(); });
            }
        }
    }, 500);
}