var recruitResourceObserver = null;

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
        wood: Number(document.getElementById('wood')?.textContent.replace(/\D/g, '')) || 0,
        stone: Number(document.getElementById('stone')?.textContent.replace(/\D/g, '')) || 0,
        iron: Number(document.getElementById('iron')?.textContent.replace(/\D/g, '')) || 0,
        pop: availPop
    };

    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};

    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + '_input');
        if (!input || !unitData[unit]) return;
        const costs = unitData[unit];

        // maxAffordable = total of this unit you can train,
        // given the currently typed values of all OTHER units
        let maxAffordable = Infinity;

        Object.keys(costs).forEach(resource => {
            if (!(resource in totalResources)) return;
            const cost = costs[resource];
            if (!cost) return;

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
            maxAffordable = Math.min(maxAffordable, possible);
        });

        if (!isFinite(maxAffordable) || maxAffordable < 0) maxAffordable = 0;

        input.max = maxAffordable;

        const maxElementId = unit + '_max';
        let maxElement = document.getElementById(maxElementId);
        if (!maxElement) {
            maxElement = document.createElement('a');
            maxElement.id = maxElementId;
            maxElement.style.marginLeft = '5px';
            maxElement.style.cursor = 'pointer';
            input.parentNode.appendChild(maxElement);
        }
        maxElement.textContent = '(' + maxAffordable + ')';
        maxElement.onclick = (function (inp, val) {
            return function () { inp.value = val; inp.dispatchEvent(new Event('input')); calculateMaxTroops(unit); };
        }(input, maxAffordable));
    });
}

/**
 * Reads all non-zero unit input values, POSTs a train request to the barracks endpoint,
 * then refreshes the widget once the server-side training data has been re-fetched.
 */
async function submitTroops() {
    let bodyData = new URLSearchParams();

    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + '_input');
        if (input && Number(input.value) > 0) {
            bodyData.append(`units[${unit}]`, input.value);
        }
    });

    if (!bodyData.toString()) return;

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
        if (typeof showAutoHideBox === 'function') showAutoHideBox('Troops recruited!', false);
    } else {
        if (typeof showAutoHideBox === 'function') showAutoHideBox('Error recruiting troops.', true);
    }

    // Re-inject the widget only after the fetchTrainInfo AJAX call completes
    fetchTrainInfo(injectRecruitTroopsWidget);
}


/**
 * Builds and injects the Recruit Troops widget into the configured column.
 * Renders one row per trainable unit (image, name, in-village count, resource costs),
 * recruit and clear buttons, and the current training queue.
 * Attaches a MutationObserver on the resource counters to keep max values live.
 */
function injectRecruitTroopsWidget() {
    if (!settings_cookies.general['show__recruit_troops']) return;

    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
    const queueData = JSON.parse(localStorage.getItem('train_queue_data') || '[]');
    const lang = JSON.parse(localStorage.getItem('tw_lang')) || {};
    const widgetConfig = settings_cookies.widgets.find(function (w) { return w.name === 'recruit_troops'; });
    const columnToUse = widgetConfig ? widgetConfig.column : LEFT_COLUMN;

    const table = document.createElement('table');
    table.id = 'widget_recruit';
    table.className = 'vis';
    table.style.width = '100%';
    const tbody = document.createElement('tbody');

    for (const unit in unitData) {
        const info = unitData[unit];
        const row = document.createElement('tr');

        // Unit cell: image + localized name + costs
        const unitCell = document.createElement('td');
        unitCell.style.cssText = 'padding: 3px 6px; vertical-align: middle;';

        const unitTop = document.createElement('div');
        unitTop.style.cssText = 'display: flex; align-items: center; gap: 4px;';

        const img = document.createElement('img');
        img.src = info.img || ('graphic/unit/unit_' + unit + '.png');
        img.style.cssText = 'width: 22px; height: 22px; vertical-align: middle;';
        img.alt = unit;

        const nameSpan = document.createElement('span');
        nameSpan.style.fontSize = '12px';
        nameSpan.textContent = info.name || (unit.charAt(0).toUpperCase() + unit.slice(1));

        // Show current in-village count alongside the unit name
        if (info.count) {
            const countSpan = document.createElement('small');
            countSpan.style.cssText = 'color: #888; font-size: 10px; margin-left: 2px;';
            countSpan.textContent = '(' + info.count + ')';
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
    trainButton.textContent = lang['e1de43dd18d19451febfc1584ab33767'] || 'Recruit';
    trainButton.className = 'btn btn-default';
    trainButton.addEventListener('click', submitTroops);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.className = 'btn btn-default';
    clearButton.addEventListener('click', function () {
        game_data.units.forEach(function (unit) {
            const input = document.getElementById(unit + '_input');
            if (input) { input.value = '0'; input.dispatchEvent(new Event('input')); }
        });
        calculateMaxTroops();
    });
    btnRow.appendChild(trainButton);
    btnRow.appendChild(clearButton);

    // Training queue section
    const queueSection = document.createElement('div');
    if (queueData.length) {
        const qHeader = document.createElement('div');
        qHeader.style.cssText = 'font-size: 11px; font-weight: bold; margin: 8px 0 4px; padding-top: 4px; border-top: 1px solid #c1a264;';
        qHeader.textContent = 'Training queue';
        queueSection.appendChild(qHeader);

        queueData.forEach(function (entry) {
            const qRow = document.createElement('div');
            qRow.style.cssText = 'display: flex; align-items: center; gap: 5px; font-size: 11px; padding: 2px 0;';

            if (entry.imgSrc) {
                const qImg = document.createElement('img');
                qImg.src = entry.imgSrc;
                qImg.style.cssText = 'width: 16px; height: 16px;';
                qRow.appendChild(qImg);
            }
            const qName = document.createElement('span');
            qName.textContent = (entry.name || entry.unit) + ' \u00d7' + entry.count;
            qRow.appendChild(qName);

            if (entry.finishTimestamp) {
                const remaining = endTimeToTimer(Math.floor(entry.finishTimestamp / 1000));
                if (remaining) {
                    const qTime = document.createElement('span');
                    qTime.style.cssText = 'color: #888; margin-left: auto;';
                    qTime.textContent = remaining[0] + ':' + remaining[1] + ':' + remaining[2];
                    qRow.appendChild(qTime);
                }
            }
            queueSection.appendChild(qRow);
        });
    }

    const container = document.createElement('div');
    container.appendChild(table);
    container.appendChild(btnRow);
    container.appendChild(queueSection);

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
}