const TROOP_UNIT_ORDER = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
const TROOP_CACHE_TTL_MS = 30 * 60 * 1000;
const TROOP_SHORT_REFRESH_MS = 5 * 60 * 1000;

function getOverviewVillagesTroopUnitOrder() {
    return TROOP_UNIT_ORDER.filter(unit => isArchersEnabled() || (unit !== 'archer' && unit !== 'marcher'));
}

function getOverviewVillagesTroopMetadata() {
    try {
        return JSON.parse(localStorage.getItem('unit_managers_meta') || '{}');
    } catch (error) {
        return {};
    }
}

function replaceOverviewVillagesTroopHeader(cell, unit) {
    if (!cell) return;
    const unitMeta = getOverviewVillagesTroopMetadata();
    cell.textContent = '';
    cell.className = 'troops-overview-header troops-overview-header-' + unit;
    cell.style.cssText = 'white-space:nowrap;text-align:center;position:relative;';

    const img = document.createElement('img');
    img.src = unitMeta[unit]?.img || ('graphic/unit/unit_' + unit + '.webp');
    img.alt = unit;
    img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
    img.setAttribute('data-title', `<b>${escapeHtml(unitMeta[unit]?.name || unit)}</b>`);
    img.addEventListener('mouseenter', function (event) { toggleTooltip(event.target, true); });
    img.addEventListener('mouseleave', function (event) { toggleTooltip(event.target, false); });
    cell.appendChild(img);
}

/**
 * Fills a single unit's table cell for a village using ONLY already-cached data
 * (the village's `village_unit_counts`/`train_queue_data` fields) — no network request is
 * made, so counts may be stale or missing for villages whose /train page hasn't been recently
 * loaded/refreshed (see fetchAndStoreVillageTroopCounts/refreshAllVillagesTroopCounts).
 * Shows "in village/total" (raw format from storeVillageUnitCounts()), or plain "0" when this
 * unit has no cached data at all, plus the amount currently in the training queue in orange —
 * same colour/format convention as recruitTroops.js.
 * @param {HTMLElement} cell
 * @param {string|number} villageId
 * @param {string} unit
 */
function renderTroopsOverviewCell(cell, villageId, unit) {
    const counts = bqGet('village_unit_counts', villageId) || {};
    const queueData = bqGet('train_queue_data', villageId) || {};
    const countText = counts[unit] || '0'; // Format: "in_village/total", see storeVillageUnitCounts()
    const [inVillage, total] = countText.split('/');
    const queueCount = queueData[unit] || 0;

    cell.style.textAlign = 'center';
    cell.style.color = '';
    cell.style.minHeight = '';
    cell.removeAttribute('aria-busy');
    cell.innerHTML = '<b>' + inVillage + '</b>' + (total ? '/' + total : '')
        + (queueCount > 0 ? '<div style="color: #70a710; font-weight: bold; font-size: 8px">+' + queueCount + '</div>' : '');
}

const PLACE_UNIT_TYPES = TROOP_UNIT_ORDER.concat('militia');

/**
 * Parses the true in-village / total-owned counts from a village's "place" (rally point) troops
 * page. The numerator is only the village's own row in #units_home. The denominator also includes
 * that village's troops in transit, stationed in its other villages, and out collecting.
 *
 * #units_home also lists external support rows, which have a checkbox and are excluded from
 * both values. The collection table's Total row is included in the denominator; troops in
 * attacks, supports, returns, or collection therefore never inflate the numerator.
 * @param {Document} doc - Parsed HTML of screen=place&mode=units&display=units.
 * @returns {Object} Unit counts in the form { unit: "home/total" }.
 */
function parsePlaceUnitCounts(doc) {
    const homeRow = Array.from(doc.querySelectorAll('#units_home tbody tr')).find(row =>
        row.querySelectorAll('td').length && !row.querySelector('input[type="checkbox"]')
    );

    const collectionTable = Array.from(doc.querySelectorAll('table')).find(table =>
        table.querySelector('a[href*="mode=scavenge"]') && table.querySelector('.unit-item')
    );
    const collectionTotalRow = Array.from(collectionTable?.querySelectorAll('tr') || []).reverse().find(row =>
        row.querySelector('th')?.textContent.trim().toLowerCase().includes('total')
    );

    function sumUnitCells(selector, unit) {
        let total = 0;
        doc.querySelectorAll(selector + '.unit-item-' + unit).forEach(cell => {
            total += parseInt(cell.dataset.unitCount || '0', 10);
        });
        return total;
    }

    const result = {};
    PLACE_UNIT_TYPES.forEach(function (unit) {
        const homeCell = homeRow?.querySelector('.unit-item-' + unit);
        if (!homeCell) return;
        const home = parseInt(homeCell.dataset.unitCount || '0', 10);
        const transit = sumUnitCells('#units_transit td', unit);
        const away = sumUnitCells('#units_away td', unit);
        const collection = parseInt(collectionTotalRow?.querySelector('.unit-item-' + unit)?.dataset.unitCount || '0', 10);

        result[unit] = `${home}/${home + transit + away + collection}`;
    });

    return result;
}

/**
 * Fetches a village's rally point troops page and returns its in-village/total counts
 * (see parsePlaceUnitCounts). Only used by the overview_villages troops column — the sidebar
 * recruit widget never needs the place-only breakdown. Also stores a resource snapshot from
 * the same fetched page (the resource header bar is present on every screen), at no extra
 * request cost.
 * @param {string|number} villageId
 * @returns {Promise<Object|null>} Resolves to null on failure (merge is skipped by the caller).
 */
function fetchSpecialUnitCounts(villageId) {
    return fetchWithRetry429({
        url: getVillageLinkBase(villageId) + 'place&mode=units&display=units',
        type: 'GET',
        cache: false
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, 'text/html');
        setVillageResources(villageId, readVillageResourceSnapshot(doc));
        return parsePlaceUnitCounts(doc);
    }).catch(function () { return null; });
}

/**
 * Fetches a single village's /train page and stores its unit counts (in-village/total),
 * in-training-queue totals, and global unit metadata — mirroring
 * storeVillageUnitCounts()/storeAvailableUnitsCosts()/storeTrainQueueData()
 * (overview.js) but parameterized by an explicit villageId instead of relying on
 * game_data.village.id — those functions only ever write to the CURRENTLY displayed village, so
 * they can't be reused as-is to refresh other villages in the background. Per-village costs are
 * NOT stored here (not needed by this column). In full mode it also fetches the place page in
 * parallel and merges its location-aware counts, since /train does not include troops away.
 * @param {string|number} villageId
 * @returns {Promise<void>} Resolves once stored (never rejects — a failed village is skipped).
 */
function fetchAndStoreVillageTroopCounts(villageId, { mode = 'full' } = {}) {
    const fetchPlace = mode !== 'train';
    const trainFetch = mode === 'place' ? Promise.resolve({ unitCounts: {}, success: false }) : fetchWithRetry429({
        url: getVillageLinkBase(villageId) + 'train',
        type: 'GET',
        cache: false
    }).then(function (data) {
        const unitCounts = {};
        const unitMeta = JSON.parse(localStorage.getItem('unit_managers_meta') || '{}');

        $(data).find('tr.row_a, tr.row_b').each(function (_, row) {
            const link = $(row).find('a.unit_link');
            if (!link.length) return;
            const unitType = link.data('unit');
            if (!unitType) return;

            const tds = $(row).find('td');
            if (tds.length >= 3) {
                const countText = $(tds[2]).text().trim();
                if (countText && countText.includes('/')) {
                    unitCounts[unitType] = countText;
                }
            }

            if (!unitMeta[unitType]) unitMeta[unitType] = {};
            const img = link.find('img');
            if (img.length) unitMeta[unitType].img = img.attr('src');
            const linkEl = link[0];
            for (let i = linkEl.childNodes.length - 1; i >= 0; i--) {
                const node = linkEl.childNodes[i];
                if (node.nodeType === 3 && node.textContent.trim()) {
                    unitMeta[unitType].name = node.textContent.trim();
                    break;
                }
            }
        });

        // Total units currently in the training queue (barracks/stable/garage), same
        // parsing logic as storeTrainQueueData() in overview.js.
        const queueCounts = {};
        ['barracks', 'stable', 'garage'].forEach(function (building) {
            $(data).find('#trainqueue_wrap_' + building + ' tr').each(function (_, row) {
                const spriteDiv = $(row).find('div.unit_sprite_smaller');
                if (!spriteDiv.length) return;

                let unitType = null;
                const classes = spriteDiv.attr('class').split(/\s+/);
                for (let cls of classes) {
                    if (cls !== 'unit_sprite' && cls !== 'unit_sprite_smaller' && cls !== '') {
                        unitType = cls;
                        break;
                    }
                }
                if (!unitType) return;

                const cellText = $(row).find('td').first().text().trim();
                const countMatch = cellText.match(/^(\d+)\s+/);
                if (!countMatch) return;

                const count = parseInt(countMatch[1], 10);
                queueCounts[unitType] = (queueCounts[unitType] || 0) + count;
            });
        });

        localStorage.setItem('unit_managers_meta', JSON.stringify(unitMeta));
        bqSet('train_queue_data', villageId, queueCounts);
        return { unitCounts, success: true };
    }).catch(function () { return { unitCounts: {}, success: false }; });

    const placeFetch = fetchPlace ? fetchSpecialUnitCounts(villageId) : Promise.resolve(null);
    return Promise.all([trainFetch, placeFetch]).then(([trainResult, placeCounts]) => {
        const unitCounts = trainResult.unitCounts;
        const trainSucceeded = trainResult.success;
        const existingCounts = bqGet('village_unit_counts', villageId) || {};
        bqSet('village_unit_counts', villageId, Object.assign({}, existingCounts, unitCounts, placeCounts || {}));
        const now = Date.now();
        if (trainSucceeded) bqSet('troop_train_fetched_at', villageId, now);
        if (placeCounts !== null) {
            bqSet('troop_place_fetched_at', villageId, now);
        }
        if (trainSucceeded && placeCounts !== null) {
            bqSet('troop_full_fetched_at', villageId, now);
        }
    });
}

function getOverviewVillagesTroopAutoSetting() {
    const setting = settings_cookies.general?.show__overview_villages_troops;
    if (!setting || typeof setting !== 'object' || setting.enabled !== true || setting.auto !== true) return null;
    return { mode: setting.mode === 'place' ? 'place' : 'full' };
}

function shouldAutoRefreshOverviewVillagesTroops(villageId, mode) {
    if (mode === 'place') return true;
    const fetchedAt = Number(bqGet('troop_full_fetched_at', villageId) || 0);
    return !fetchedAt || Date.now() - fetchedAt >= TROOP_CACHE_TTL_MS;
}

function getOverviewVillagesTroopRefreshMode(villageId) {
    const fullFetchedAt = Number(bqGet('troop_full_fetched_at', villageId) || 0);
    return fullFetchedAt && Date.now() - fullFetchedAt < TROOP_SHORT_REFRESH_MS ? 'train' : 'full';
}

function autoRefreshOverviewVillagesTroops(table) {
    const setting = getOverviewVillagesTroopAutoSetting();
    if (!setting) return;

    const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.querySelector('.quickedit-vn[data-id]'));
    const rowsToFetch = rows.filter(row => shouldAutoRefreshOverviewVillagesTroops(
        row.querySelector('.quickedit-vn[data-id]').getAttribute('data-id'), setting.mode
    ));
    runWithConcurrencyLimit(rowsToFetch, function (row) {
        const villageId = row.querySelector('.quickedit-vn[data-id]').getAttribute('data-id');
        row.querySelectorAll('.troops-overview-cell').forEach(function (cell) {
            cell.replaceChildren(createWidgetLoadingElement('24px'));
            cell.setAttribute('aria-busy', 'true');
        });
        return fetchAndStoreVillageTroopCounts(villageId, { mode: setting.mode }).then(function () {
            row.querySelectorAll('.troops-overview-cell').forEach(function (cell) {
                renderTroopsOverviewCell(cell, villageId, cell.dataset.unit);
            });
        });
    }, { concurrency: 1, minDelay: 100, maxDelay: 500 });
}

/**
 * Refreshes troop counts for every village row in the table, one village at a time, waiting a
 * random 100-500ms between each request so all the AJAX calls aren't fired at once. Each cell
 * shows "…" while its own fetch is pending and re-renders as soon as it completes. The trigger
 * icon is disabled/dimmed for the duration of the whole sweep.
 * @param {HTMLElement} table
 * @param {HTMLElement} triggerIcon
 */
function refreshAllVillagesTroopCounts(table, triggerIcon) {
    if (triggerIcon.dataset.refreshing === 'true') return;
    triggerIcon.dataset.refreshing = 'true';
    triggerIcon.style.opacity = '0.4';
    triggerIcon.style.pointerEvents = 'none';

    const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row => row.querySelector('.quickedit-vn[data-id]'));

    runWithConcurrencyLimit(rows, function (row) {
        const villageId = row.querySelector('.quickedit-vn[data-id]').getAttribute('data-id');
        const cells = row.querySelectorAll('.troops-overview-cell');
        cells.forEach(function (cell) {
            cell.replaceChildren(createWidgetLoadingElement('24px'));
            cell.setAttribute('aria-busy', 'true');
        });

        return fetchAndStoreVillageTroopCounts(villageId, { mode: getOverviewVillagesTroopRefreshMode(villageId) }).then(function () {
            cells.forEach(function (cell) { renderTroopsOverviewCell(cell, villageId, cell.dataset.unit); });
        });
    }, { concurrency: 1, minDelay: 100, maxDelay: 500 }).then(function () {
        triggerIcon.dataset.refreshing = 'false';
        triggerIcon.style.opacity = '';
        triggerIcon.style.pointerEvents = '';
    });
}

/**
 * Re-fetches and re-renders a single village's troop columns in #production_table — used after
 * training troops via the quick-links Recruit overlay (see submitTroops/disperseTroops in
 * recruitTroops.js) so the overview row doesn't show stale counts until the next
 * manual "\u21bb" refresh or full page load. No-ops if the table or that village's row aren't
 * present (e.g. not on the overview_villages page, or the column is disabled).
 * @param {string|number} villageId
 */
function refreshOverviewVillagesTroopsRow(villageId) {
    const table = document.getElementById('production_table');
    if (!table) return;
    if (getOverviewVillagesTroopAutoSetting()?.mode === 'place') return;

    const row = table.querySelector('.quickedit-vn[data-id="' + villageId + '"]')?.closest('tr');
    const cells = row?.querySelectorAll('.troops-overview-cell');
    if (!cells?.length) return;
    cells.forEach(function (cell) {
        cell.replaceChildren(createWidgetLoadingElement('24px'));
        cell.setAttribute('aria-busy', 'true');
    });

    fetchAndStoreVillageTroopCounts(villageId, { mode: getOverviewVillagesTroopRefreshMode(villageId) }).then(function () {
        cells.forEach(function (cell) { renderTroopsOverviewCell(cell, villageId, cell.dataset.unit); });
    });
}

/**
 * Adds one column PER unit type (TROOP_UNIT_ORDER) to the multi-village table
 * (#production_table) on the screen=overview_villages page, using whatever per-village
 * unit-count data is already cached in localStorage (see renderTroopsOverviewCell). Each header
 * shows the unit's icon instead of text. Does NOT fetch fresh data automatically — a refresh
 * icon in the corner of the first unit column lets the user trigger an on-demand update for all
 * villages instead (see refreshAllVillagesTroopCounts).
 */
function injectOverviewVillagesTroopsColumn() {
    if (getSetting('show__overview_villages_troops') === false) return;
    if (!game_data?.player?.villages || game_data.player.villages < 2) return;

    const table = document.getElementById('production_table');
    if (!table) return;

    // Archer is a world-config-dependent unit — skip its column entirely when disabled.
    const unitOrder = getOverviewVillagesTroopUnitOrder();

    const headerRow = table.querySelector('thead tr');
    if (!headerRow || headerRow.querySelector('.troops-overview-header-' + unitOrder[0])) return;

    unitOrder.forEach(function (unit, unitIndex) {
        const th = document.createElement('th');
        replaceOverviewVillagesTroopHeader(th, unit);

        if (unitIndex === 0) {
            const refreshIcon = document.createElement('a');
            refreshIcon.href = '#';
            refreshIcon.title = t('overviewVillages.refreshAllTroops');
            refreshIcon.style.cssText = 'position:absolute;top:0;left:2px;text-decoration:none;cursor:pointer;font-size:10px;';
            refreshIcon.textContent = '\u21bb';
            refreshIcon.addEventListener('click', function (event) {
                event.preventDefault();
                refreshAllVillagesTroopCounts(table, refreshIcon);
            });
            th.appendChild(refreshIcon);
        }

        headerRow.appendChild(th);
    });

    table.querySelectorAll('tbody tr').forEach(function (row) {
        const villageId = row.querySelector('.quickedit-vn[data-id]')?.getAttribute('data-id');
        if (!villageId) return;

        unitOrder.forEach(function (unit) {
            const cell = document.createElement('td');
            cell.className = 'troops-overview-cell';
            cell.dataset.unit = unit;
            row.appendChild(cell);

            renderTroopsOverviewCell(cell, villageId, unit);
        });
    });

    autoRefreshOverviewVillagesTroops(table);
}

