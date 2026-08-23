// Overview Villages (screen=overview_villages) — multi-village table enhancements

/**
 * Formats a millisecond duration as a short human-readable remaining-time string
 * (e.g. "1d 3h 12m 5s"), omitting leading zero units. Returns null once expired.
 * @param {number} ms
 * @returns {string|null}
 */
function formatQueueRemaining(ms) {
    if (!ms || ms <= 0) return null;
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 1000 / 60) % 60);
    const h = Math.floor((ms / 1000 / 60 / 60) % 24);
    const d = Math.floor(ms / 1000 / 60 / 60 / 24);
    return (d > 0 ? d + 'd ' : '') + (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
}

/**
 * Attaches a live-updating tooltip to an icon's wrapper anchor: on mouseenter it renders the
 * header/body via the given callback and re-renders every second (so a "time remaining"
 * countdown ticks down while hovered), stopping on mouseleave. Mirrors the countdown pattern
 * used by the per-village widget (injectAtiveQueueList/injectFakeQueueList in
 * widgets/widget_extraBuildQueue.user.js).
 * @param {HTMLElement} anchor - Element carrying data-title (header) / data-tooltip-tpl (body).
 * @param {HTMLElement} hoverTarget - Element the mouse listeners are attached to (usually the icon span).
 * @param {string} headerHtml - Static header HTML (e.g. building name), set once.
 * @param {Function} getBodyHtml - Returns the current body HTML (called every tick).
 */
function attachLiveQueueTooltip(anchor, hoverTarget, headerHtml, getBodyHtml) {
    anchor.setAttribute('data-title', headerHtml);
    anchor.setAttribute('data-tooltip-tpl', getBodyHtml());

    function updateCountdown(event) {
        anchor.setAttribute('data-tooltip-tpl', getBodyHtml());
        toggleTooltip(event.target, true);
        event.target.countdownTimeout = setTimeout(() => updateCountdown(event), 1000);
    }

    hoverTarget.addEventListener('mouseenter', function (event) {
        anchor.setAttribute('data-tooltip-tpl', getBodyHtml());
        toggleTooltip(event.target, true);
        updateCountdown(event);
    });
    hoverTarget.addEventListener('mouseleave', function (event) {
        toggleTooltip(event.target, false);
        clearTimeout(event.target.countdownTimeout);
    });
}

/**
 * Renders the ACTIVE (real, server-side) queue items for a village: one icon per item, green
 * progress bar, tooltip shows "Starts in / Finishes in" countdowns — same colour/logic as the
 * per-village widget's injectAtiveQueueList.
 * @param {HTMLElement} cell
 * @param {string|number} villageId
 * @param {Document} doc - Parsed main-building page HTML for this village (for building names).
 */
function renderActiveQueueIcons(cell, villageId, doc) {
    const queueBuildIdsActive = bqGet('building_queue_active', villageId) || [];
    if (!queueBuildIdsActive.length) return;

    const slots = (bqGet('building_queue_slots', villageId) || []).map(Number);

    queueBuildIdsActive.forEach(function (id, index) {
        const buildingId = id.replace(/[0-9]/g, '');
        const buildingName = doc.querySelector('.visual-label-' + buildingId)?.getAttribute('data-title') || buildingId;

        function getBodyHtml() {
            const now = Date.now();
            if (index === 0) {
                const fmt = formatQueueRemaining((slots[0] || 0) - now);
                return fmt
                    ? `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;">Finishes in <b>${fmt}</b></div>`
                    : `<div style="margin-top:3px;color:#aaa;">Finishing soon\u2026</div>`;
            }
            const startFmt = formatQueueRemaining((slots[index - 1] || 0) - now);
            const endFmt = formatQueueRemaining((slots[index] || 0) - now);
            return (startFmt ? `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;">Starts in <b>${startFmt}</b></div>` : '')
                + (endFmt ? `<div>Finishes in <b>${endFmt}</b></div>` : `<div style="color:#aaa;">Finishing soon\u2026</div>`);
        }

        var anchor = document.createElement('a');
        anchor.style.display = 'inline-flex';
        anchor.style.border = '1px solid #7d510f';

        var span = document.createElement('span');
        span.className = 'icon header village active_queue';
        span.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/95eda994/graphic/buildings/mid/' + id + '.png)';
        span.style.backgroundPosition = '0px 0px';
        span.style.backgroundSize = 'contain';
        span.style.backgroundRepeat = 'no-repeat';
        span.style.width = '20px';
        span.style.height = '20px';
        span.style.marginRight = '3px';
        span.style.position = 'relative';
        span.style.display = 'inline-block';

        var progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '100%';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = '#4caf50';
        span.appendChild(progressBar);

        anchor.appendChild(span);
        cell.appendChild(anchor);

        attachLiveQueueTooltip(anchor, span, `<b>${escapeHtml(buildingName)}</b>`, getBodyHtml);
    });
}

/**
 * Renders the WAITING (fake/local, not yet submitted to the server) queue items for a village:
 * one icon per item, orange progress bar, tooltip shows "Next attempt in" (first item, live
 * countdown to the script's next retry) or "Position N in waiting queue" (further items) — same
 * colour/logic as the per-village widget's injectFakeQueueList.
 * @param {HTMLElement} cell
 * @param {string|number} villageId
 * @param {string[]} allBuildingsImgs - All building image URLs from this village's main page (for icons at the correct level).
 * @param {Document} doc
 */
function renderFakeQueueIcons(cell, villageId, allBuildingsImgs, doc) {
    const queueBuildIds = bqGet('building_queue', villageId) || [];
    if (!queueBuildIds.length) return;

    // Scheduled time (ms epoch) when addToBuildQueue() will next fire for this village
    const scheduledEndTime = parseInt(localStorage.getItem('endTime_' + getBuildQueueTimeoutId(villageId))) || 0;

    queueBuildIds.forEach(function (id, fakeIndex) {
        const buildingName = doc.querySelector('.visual-label-' + id)?.getAttribute('data-title') || id;

        function getBodyHtml() {
            if (fakeIndex === 0 && scheduledEndTime > 0) {
                const fmt = formatQueueRemaining(scheduledEndTime - Date.now());
                return fmt
                    ? `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;color:#888;">Next attempt in <b>${fmt}</b></div>`
                    : `<div style="margin-top:3px;color:#aaa;">Retrying soon\u2026</div>`;
            }
            if (fakeIndex > 0) {
                return `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;color:#aaa;">Position ${fakeIndex + 1} in waiting queue</div>`;
            }
            return '';
        }

        var anchor = document.createElement('a');
        anchor.style.display = 'inline-flex';
        anchor.style.border = '1px solid #7d510f';

        var span = document.createElement('span');
        span.className = 'icon header village';
        const matchedImg = allBuildingsImgs.find(el => new RegExp('/' + id + '\\d+\\.').test(el));
        span.style.backgroundImage = 'url(' + (matchedImg || ('https://dspt.innogamescdn.com/asset/95eda994/graphic/buildings/mid/' + id + '.png')) + ')';
        span.style.backgroundPosition = '0px 0px';
        span.style.backgroundSize = 'contain';
        span.style.backgroundRepeat = 'no-repeat';
        span.style.width = '20px';
        span.style.height = '20px';
        span.style.marginRight = '3px';
        span.style.position = 'relative';
        span.style.display = 'inline-block';

        var progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '100%';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = 'orange';
        span.appendChild(progressBar);

        anchor.appendChild(span);
        cell.appendChild(anchor);

        attachLiveQueueTooltip(anchor, span, `<b>${escapeHtml(buildingName)}</b>`, getBodyHtml);
    });
}

/**
 * Fills a table cell (already appended to a row of #production_table) with a compact summary
 * of a village's build queue: active (green) items followed by waiting/fake (orange) items,
 * each a small building icon with a live-countdown hover tooltip. Shows a dash if both queues
 * are empty. Building names/icons are resolved from `doc`, the village's own fetched
 * main-building page, since the overview_villages page itself has no building label DOM to
 * read from.
 * @param {HTMLElement} cell
 * @param {string|number} villageId
 * @param {Document} doc - Parsed main-building page HTML for this village.
 * @param {string[]} allBuildingsImgs - All building image URLs from this village's main page.
 */
function renderBuildQueueOverviewCell(cell, villageId, doc, allBuildingsImgs) {
    cell.innerHTML = '';
    cell.style.color = '';
    cell.style.display = '';

    const hasActive = (bqGet('building_queue_active', villageId) || []).length > 0;
    const hasWaiting = (bqGet('building_queue', villageId) || []).length > 0;

    if (!hasActive && !hasWaiting) {
        cell.textContent = '\u2013';
        cell.style.textAlign = 'center';
        cell.style.color = '#999';
        return;
    }

    cell.style.textAlign = 'left';
    cell.style.display = 'grid';
    cell.style.gridTemplateColumns = 'repeat(3, auto)'; // max 3 items per line
    cell.style.gap = '2px 0';
    cell.style.justifyContent = 'start';
    renderActiveQueueIcons(cell, villageId, doc);
    renderFakeQueueIcons(cell, villageId, allBuildingsImgs, doc);
    applyBuildQueueOverviewCollapse(cell);
}

/**
 * Re-renders a single village's Build Queue cell in #production_table using already-fetched
 * doc/allBuildingsImgs — used after the quick-links Build Queue overlay adds/removes/cancels an
 * item (see renderVillageBuildQueueOverlay), so the overview row doesn't show stale state until
 * the next full refresh. No-ops if the table or that village's row/cell aren't present (e.g. not
 * on the overview_villages page, or the column is disabled).
 * @param {string|number} villageId
 * @param {Document} doc - Parsed main-building page HTML for this village.
 * @param {string[]} allBuildingsImgs - All building image URLs from this village's main page.
 */
function refreshOverviewVillagesBuildQueueRow(villageId, doc, allBuildingsImgs) {
    const table = document.getElementById('production_table');
    if (!table) return;

    const row = table.querySelector('.quickedit-vn[data-id="' + villageId + '"]')?.closest('tr');
    const cell = row?.querySelector('.build-queue-overview-cell');
    if (!cell) return;

    renderBuildQueueOverviewCell(cell, villageId, doc, allBuildingsImgs);
}

/**
 * Whether build-queue cells show every row (true) or are clipped to just the first row of 3
 * icons (false, default). Shared across all rows, toggled via the header icon.
 */
let buildQueueOverviewExpanded = false;

/**
 * Clips a build-queue cell to a single 3-icon row (overflow hidden) when collapsed, or shows
 * the full queue when expanded, per the current `buildQueueOverviewExpanded` state.
 * @param {HTMLElement} cell
 */
function applyBuildQueueOverviewCollapse(cell) {
    if (buildQueueOverviewExpanded) {
        cell.style.maxHeight = '';
        cell.style.overflow = '';
    } else {
        cell.style.maxHeight = '22px'; // one row of icons
        cell.style.overflow = 'hidden';
    }
}

/**
 * Adds a "Build Queue" column to the multi-village table (#production_table) on the
 * screen=overview_villages page, showing each village's active build queue at a glance.
 * Only runs when the account has more than one village (that page/table is meaningless
 * otherwise). For every village row, fetches its main-building page in the background to
 * get fresh queue state (persisted via parseAndStoreQueueState, same mechanism used by the
 * per-village widget and the background sweep), then renders the summary cell.
 */
function injectOverviewVillagesBuildQueueColumn() {
    if (!settings_cookies.general['show__overview_villages_queue']) return;
    if (!game_data?.player?.villages || game_data.player.villages < 2) return;

    const table = document.getElementById('production_table');
    if (!table) return;

    const headerRow = table.querySelector('thead tr');
    if (!headerRow || headerRow.querySelector('.build-queue-overview-header')) return;

    const th = document.createElement('th');
    th.className = 'build-queue-overview-header';
    th.style.position = 'relative';
    th.style.textAlign = 'center';
    th.textContent = t('buildQueue.title');

    const toggleIcon = document.createElement('img');
    toggleIcon.style.cssText = 'position:absolute;top:2px;left:2px;width:12px;height:12px;cursor:pointer;';
    toggleIcon.src = 'https://dspt.innogamescdn.com/asset/95eda994/graphic//icons/slide_down.png';
    toggleIcon.alt = t('overviewVillages.showFullQueue');
    toggleIcon.title = t('overviewVillages.showFullQueue');
    toggleIcon.addEventListener('click', function (event) {
        event.preventDefault();
        buildQueueOverviewExpanded = !buildQueueOverviewExpanded;
        toggleIcon.src = 'https://dspt.innogamescdn.com/asset/95eda994/graphic//icons/slide_' + (buildQueueOverviewExpanded ? 'up' : 'down') + '.png';
        toggleIcon.alt = buildQueueOverviewExpanded ? t('overviewVillages.showOneRow') : t('overviewVillages.showFullQueue');
        toggleIcon.title = buildQueueOverviewExpanded ? t('overviewVillages.showOneRow') : t('overviewVillages.showFullQueue');
        table.querySelectorAll('.build-queue-overview-cell').forEach(applyBuildQueueOverviewCollapse);
    });
    th.appendChild(toggleIcon);
    headerRow.appendChild(th);

    const rowsToFetch = [];
    table.querySelectorAll('tbody tr').forEach(function (row) {
        const villageId = row.querySelector('.quickedit-vn[data-id]')?.getAttribute('data-id');
        if (!villageId) return;

        const cell = document.createElement('td');
        cell.className = 'build-queue-overview-cell';
        cell.textContent = '\u2026';
        cell.style.textAlign = 'center';
        cell.style.color = '#999';
        row.appendChild(cell);

        rowsToFetch.push({ villageId, cell });
    });

    // Throttled (max 2 concurrent, staggered) so accounts with many villages don't burst one
    // request per village at once and trip the server's rate limiter (HTTP 429).
    runWithConcurrencyLimit(rowsToFetch, function ({ villageId, cell }) {
        return fetchVillageMainPage(villageId)
            .then(({ doc }) => {
                parseAndStoreQueueState(doc, villageId);
                // Re-arm the instant-free timer too, not just the fake/waiting queue state
                if (typeof scheduleCompletionNotification === 'function') scheduleCompletionNotification(villageId);
                const { allBuildingsImgs } = getAllBuildingsImages(doc);
                renderBuildQueueOverviewCell(cell, villageId, doc, allBuildingsImgs);
            })
            .catch(() => {
                cell.textContent = '?';
                cell.style.textAlign = 'center';
                cell.style.color = '#c33';
            });
    }, { concurrency: 2, minDelay: 100, maxDelay: 250 });
}

// Fixed column order for the per-unit troop columns (screen=overview_villages), matches the
// game's own unit ordering (also used by widget_navigationBar.user.js's icon picker).
const TROOP_UNIT_ORDER = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob', 'militia'];

/**
 * Fills a single unit's table cell for a village using ONLY already-cached data
 * (the village's `village_unit_counts`/`train_queue_data` fields) — no network request is
 * made, so counts may be stale or missing for villages whose /train page hasn't been recently
 * loaded/refreshed (see fetchAndStoreVillageTroopCounts/refreshAllVillagesTroopCounts).
 * Shows "in village/total" (raw format from storeVillageUnitCounts()), or plain "0" when this
 * unit has no cached data at all, plus the amount currently in the training queue in orange —
 * same colour/format convention as widget_recruitTroops.user.js.
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
    cell.innerHTML = '<b>' + inVillage + '</b>' + (total ? '/' + total : '')
        + (queueCount > 0 ? '<div style="color: #70a710; font-weight: bold; font-size: 8px">+' + queueCount + '</div>' : '');
}

/**
 * Unit types not obtainable from the /train page (no training screen of their own): Paladin
 * (trained via screen=statue), Nobleman (via screen=snob), and Militia (auto-defense only, no
 * training screen at all). Their real in-village/total counts come from parseSpecialUnitCounts
 * instead (screen=place&mode=units, which additionally breaks troops down by location).
 */
const SPECIAL_UNIT_TYPES = ['knight', 'snob', 'militia'];

/**
 * Parses the true in-village / total-owned counts for Paladin, Nobleman, and Militia from a
 * village's "place" (rally point) troops page, which — unlike /train — accounts for troops away
 * on missions or stationed in other own villages.
 *
 * #units_home lists one row per source of troops physically present: the village's OWN troops
 * ("Desta aldeia" — no checkbox, no link to another village) plus one row per OTHER village
 * currently supporting this one (checkbox + a link to that village) — those must be excluded,
 * they don't belong to this village. #units_transit (attacks/support/withdrawals in transit)
 * and #units_away (support stationed in this account's other villages) list troops still owned
 * by this village but not currently present, and their sums count toward the total. Militia has
 * no transit/away column at all (it can never leave the village), so its total always equals
 * its home count.
 * @param {Document} doc - Parsed HTML of screen=place&mode=units&display=units.
 * @returns {Object} { knight: "home/total", snob: "home/total", militia: "home/total" }
 */
function parseSpecialUnitCounts(doc) {
    const homeRow = Array.from(doc.querySelectorAll('#units_home tbody tr')).find(row =>
        row.querySelectorAll('td').length && !row.querySelector('td a[href*="screen=info_village"]')
    );

    const result = {};
    SPECIAL_UNIT_TYPES.forEach(function (unit) {
        const home = parseInt(homeRow?.querySelector('.unit-item-' + unit)?.dataset.unitCount || '0', 10);

        let away = 0;
        doc.querySelectorAll('#units_transit td.unit-item-' + unit + ', #units_away td.unit-item-' + unit)
            .forEach(cell => { away += parseInt(cell.dataset.unitCount || '0', 10); });

        result[unit] = `${home}/${home + away}`;
    });

    return result;
}

/**
 * Fetches a village's rally point troops page and returns its Paladin/Nobleman/Militia counts
 * (see parseSpecialUnitCounts). Only used by the overview_villages troops column — the sidebar
 * recruit widget never needs these (none of the three are trainable from /train).
 * @param {string|number} villageId
 * @returns {Promise<Object|null>} Resolves to null on failure (merge is skipped by the caller).
 */
function fetchSpecialUnitCounts(villageId) {
    return fetchWithRetry429({
        url: getVillageLinkBase(villageId) + 'place&mode=units&display=units',
        type: 'GET',
        cache: false
    }).then(function (data) {
        return parseSpecialUnitCounts(new DOMParser().parseFromString(data, 'text/html'));
    }).catch(function () { return null; });
}

/**
 * Fetches a single village's /train page and stores its unit counts (in-village/total),
 * in-training-queue totals, and global unit metadata — mirroring
 * storeVillageUnitCounts()/storeAvailableUnitsCosts()/storeTrainQueueData()
 * (feature_overview.user.js) but parameterized by an explicit villageId instead of relying on
 * game_data.village.id — those functions only ever write to the CURRENTLY displayed village, so
 * they can't be reused as-is to refresh other villages in the background. Per-village costs are
 * NOT stored here (not needed by this column). Also fetches Paladin/Nobleman/Militia counts (see
 * fetchSpecialUnitCounts) in parallel and merges them in, since /train never reports those three.
 * @param {string|number} villageId
 * @returns {Promise<void>} Resolves once stored (never rejects — a failed village is skipped).
 */
function fetchAndStoreVillageTroopCounts(villageId) {
    const trainFetch = fetchWithRetry429({
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
        // parsing logic as storeTrainQueueData() in feature_overview.user.js.
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
        return unitCounts;
    }).catch(function () { return {}; }); // Skip failed villages without blocking the rest.

    return Promise.all([trainFetch, fetchSpecialUnitCounts(villageId)]).then(([unitCounts, specialCounts]) => {
        bqSet('village_unit_counts', villageId, Object.assign({}, unitCounts, specialCounts || {}));
    });
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
            cell.textContent = '\u2026';
            cell.style.textAlign = 'center';
            cell.style.color = '#999';
        });

        return fetchAndStoreVillageTroopCounts(villageId).then(function () {
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
 * widget_recruitTroops.user.js) so the overview row doesn't show stale counts until the next
 * manual "\u21bb" refresh or full page load. No-ops if the table or that village's row aren't
 * present (e.g. not on the overview_villages page, or the column is disabled).
 * @param {string|number} villageId
 */
function refreshOverviewVillagesTroopsRow(villageId) {
    const table = document.getElementById('production_table');
    if (!table) return;

    const row = table.querySelector('.quickedit-vn[data-id="' + villageId + '"]')?.closest('tr');
    const cells = row?.querySelectorAll('.troops-overview-cell');
    if (!cells?.length) return;

    fetchAndStoreVillageTroopCounts(villageId).then(function () {
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
    if (!settings_cookies.general['show__overview_villages_troops']) return;
    if (!game_data?.player?.villages || game_data.player.villages < 2) return;

    const table = document.getElementById('production_table');
    if (!table) return;

    // Archer is a world-config-dependent unit — skip its column entirely when disabled.
    const unitOrder = TROOP_UNIT_ORDER.filter(unit => unit !== 'archer' || isArchersEnabled());

    const headerRow = table.querySelector('thead tr');
    if (!headerRow || headerRow.querySelector('.troops-overview-header-' + unitOrder[0])) return;

    const unitMeta = JSON.parse(localStorage.getItem('unit_managers_meta') || '{}');

    unitOrder.forEach(function (unit, unitIndex) {
        const th = document.createElement('th');
        th.className = 'troops-overview-header troops-overview-header-' + unit;
        th.style.cssText = 'white-space:nowrap;text-align:center;position:relative;';

        const img = document.createElement('img');
        img.src = unitMeta[unit]?.img || ('graphic/unit/unit_' + unit + '.png');
        img.alt = unit;
        img.style.cssText = 'width:18px;height:18px;vertical-align:middle;';
        img.setAttribute('data-title', `<b>${escapeHtml(unitMeta[unit]?.name || unit)}</b>`);
        img.addEventListener('mouseenter', function (event) { toggleTooltip(event.target, true); });
        img.addEventListener('mouseleave', function (event) { toggleTooltip(event.target, false); });
        th.appendChild(img);

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
}

// In-memory only (never localStorage-read) so a fetch is only ever reused within the SAME page
// load — a refresh always starts empty, forcing a fresh fetch on the next hover per villageId.
const storageOverviewTimesCache = {};
const storageOverviewFetchPromises = {};

/**
 * Fetches a village's /storage page and extracts its wood/stone/iron fill end-times (Unix
 * seconds, same `data-endtime` spans read by getStorageTime() in feature_overview.user.js).
 * Also persists to `full_storage_times_{villageId}` (same key/format that function uses) so other
 * features benefit from the fresher data, but THIS feature's own display never reads that key
 * back — only the in-memory cache above, which is what enforces the same-page-load rule.
 * @param {string|number} villageId
 * @returns {Promise<Object|null>} { wood, stone, iron } end-times, or null on failure.
 */
function fetchVillageStorageTimes(villageId) {
    if (storageOverviewTimesCache[villageId]) return Promise.resolve(storageOverviewTimesCache[villageId]);
    if (storageOverviewFetchPromises[villageId]) return storageOverviewFetchPromises[villageId];

    const promise = new Promise((resolve) => {
        $.ajax({
            url: getVillageLinkBase(villageId) + 'storage',
            type: 'GET',
            cache: false,
            success: function (data) {
                const spans = $(data).find('span[data-endtime]');
                const times = {
                    wood: parseInt($(spans[0]).attr('data-endtime')) || 0,
                    stone: parseInt($(spans[1]).attr('data-endtime')) || 0,
                    iron: parseInt($(spans[2]).attr('data-endtime')) || 0
                };
                storageOverviewTimesCache[villageId] = times;
                localStorage.setItem(`full_storage_times_${villageId}`, JSON.stringify(times));
                resolve(times);
            },
            error: function () { resolve(null); }
        });
        // Not cached until it resolves — this promise itself is the in-flight de-dupe guard.
    }).finally(() => { delete storageOverviewFetchPromises[villageId]; });

    storageOverviewFetchPromises[villageId] = promise;
    return promise;
}

/**
 * Binds hover behaviour to a village's storage-capacity cell: on mouseenter, shows the native
 * tooltip (same card used by the build queue column) with a live per-second countdown to when
 * each resource fills up, fetching the data on first hover (or reusing this page's cache on
 * subsequent hovers of the same village — see storageOverviewTimesCache).
 * @param {HTMLElement} cell
 * @param {string|number} villageId
 */
function attachStorageOverviewHover(cell, villageId) {
    cell.style.cursor = 'help';
    cell.setAttribute('data-title', '<b>Armaz\u00e9m</b>');

    const RESOURCE_LABELS = { wood: 'Madeira', stone: 'Argila', iron: 'Ferro' };

    function getBodyHtml() {
        const times = storageOverviewTimesCache[villageId];
        if (!times) return '<div style="color:#aaa;">' + t('common.loading') + '</div>';

        return Object.keys(RESOURCE_LABELS).map(function (res, index) {
            const fmt = formatQueueRemaining(times[res] * 1000 - Timing.getCurrentServerTime());
            const style = index === 0 ? 'margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;' : '';
            return `<div style="${style}">${RESOURCE_LABELS[res]}: ${fmt ? '<b>' + fmt + '</b>' : '<span class="warn">Full</span>'}</div>`;
        }).join('');
    }

    function updateCountdown(event) {
        cell.setAttribute('data-tooltip-tpl', getBodyHtml());
        toggleTooltip(event.target, true);
        cell.countdownTimeout = setTimeout(() => updateCountdown(event), 1000);
    }

    cell.addEventListener('mouseenter', function (event) {
        cell.setAttribute('data-tooltip-tpl', getBodyHtml());
        toggleTooltip(event.target, true);
        updateCountdown(event);

        fetchVillageStorageTimes(villageId).then(function () {
            cell.setAttribute('data-tooltip-tpl', getBodyHtml());
        });
    });
    cell.addEventListener('mouseleave', function (event) {
        toggleTooltip(event.target, false);
        clearTimeout(cell.countdownTimeout);
    });
}

/**
 * Locates a #production_table column index by matching its header link's `order` query param
 * (language-independent, unlike matching the header's translated text).
 * @param {HTMLElement} table
 * @param {string} orderParam
 * @returns {number} -1 if not found.
 */
function getOverviewVillagesColumnIndex(table, orderParam) {
    const headerCells = Array.from(table.querySelectorAll('thead th'));
    return headerCells.findIndex(th => !!th.querySelector(`a[href*="order=${orderParam}"]`));
}

/**
 * Adds hover-to-fetch storage fill-time tooltips to the native "Armaz\u00e9m" (storage capacity)
 * column of #production_table on screen=overview_villages. No data is fetched up-front — only on
 * first hover per village (see fetchVillageStorageTimes/attachStorageOverviewHover).
 */
function injectOverviewVillagesStorageHover() {
    if (!game_data?.player?.villages || game_data.player.villages < 2) return;

    const table = document.getElementById('production_table');
    if (!table) return;

    const columnIndex = getOverviewVillagesColumnIndex(table, 'storage_max');
    if (columnIndex === -1) return;

    table.querySelectorAll('tbody tr').forEach(function (row) {
        const villageId = row.querySelector('.quickedit-vn[data-id]')?.getAttribute('data-id');
        if (!villageId) return;

        const cell = row.children[columnIndex];
        if (!cell || cell.dataset.storageHoverBound) return;
        cell.dataset.storageHoverBound = '1';

        attachStorageOverviewHover(cell, villageId);
    });
}

// Quick-links popup content when the custom shortcut mode is selected.
const VILLAGE_QUICKLINKS_CUSTOM_ITEMS = [
    { label: t('navIcon.mainBuilding'), screen: 'main', img: 'graphic/buildings/mid/main3.png' },
    { label: t('navIcon.market'), screen: 'market', img: 'graphic/buildings/market.webp' },
    { label: t('navIcon.rallyPoint'), screen: 'train', img: 'graphic/unit/att.png' },
    { label: t('navIcon.academy'), screen: 'snob', img: 'graphic/buildings/snob.webp' }
];

// Second row of the popup: widgets rendered in an overlay instead of a plain navigation link.
const VILLAGE_QUICKLINKS_WIDGETS = [
    { label: t('button.recruit'), img: 'graphic/buildings/barracks.png', open: openVillageRecruitOverlay },
    { label: t('buildQueue.title'), img: 'graphic/buildings/mid/main3.png', open: openVillageBuildQueueOverlay }
];

function getOverviewVillagesQuickLinksSetting() {
    return settings_cookies.general['show__overview_villages_quicklinks'];
}

function isOverviewVillagesQuickLinksEnabled() {
    const setting = getOverviewVillagesQuickLinksSetting();
    return typeof setting === 'object' ? !!setting.enabled : !!setting;
}

function getOverviewVillagesQuickLinksMode() {
    const setting = getOverviewVillagesQuickLinksSetting();
    if (!setting || typeof setting !== 'object') return 'custom';
    return setting.source === 'navbar' ? 'navbar' : 'custom';
}

function getRenderedQuickbarItems() {
    return Array.from(document.querySelectorAll('#quickbar_contents .quickbar_link')).map(function (link) {
        const icon = link.querySelector('img');
        return {
            label: link.textContent.trim(),
            href: link.href,
            img: icon ? (icon.getAttribute('data-src') || icon.getAttribute('src') || icon.src) : ''
        };
    }).filter(function (item) { return !!item.href; });
}

function rewriteVillageInHref(href, villageId) {
    try {
        const url = new URL(href, window.location.origin);
        if (url.searchParams.has('village')) {
            url.searchParams.set('village', villageId);
        }
        return url.toString();
    } catch (e) {
        return href.replace(/([?&])village=\d+/, '$1village=' + villageId);
    }
}

function getOverviewVillagesQuickLinksItems(villageId) {
    if (getOverviewVillagesQuickLinksMode() === 'navbar') {
        const renderedItems = getRenderedQuickbarItems();
        if (renderedItems.length) {
            return renderedItems.map(function (item) {
                return Object.assign({}, item, {
                    href: rewriteVillageInHref(item.href, villageId)
                });
            });
        }
    }

    return VILLAGE_QUICKLINKS_CUSTOM_ITEMS.map(function (item) {
        return {
            label: item.label,
            href: getVillageLinkBase(villageId) + item.screen,
            img: item.img
        };
    });
}

function appendQuickLinkIcon(container, item) {
    const link = document.createElement('a');
    link.href = item.href;
    link.title = item.label || '';

    const img = document.createElement('img');
    img.src = item.img || 'https://dspt.innogamescdn.com/asset/d4119ec5/graphic/premium_plus.webp';
    img.style.cssText = 'width:18px; height:18px;';
    link.appendChild(img);

    container.appendChild(link);
}

/**
 * Opens (or toggles closed) a floating popup near anchorEl with quick-navigation icons
 * resolved from the selected source, plus a separate row of widget shortcuts (currently just
 * Recruit) below a horizontal separator. Mirrors the floating popup_style picker pattern used
 * by _openNavIconPicker in widget_navigationBar.user.js: fixed-position div clamped to the
 * viewport, closed by re-clicking the anchor, picking a building icon, or clicking outside.
 * Picking a widget icon closes this popup and opens its overlay instead.
 * @param {string|number} villageId
 * @param {HTMLElement} anchorEl - The clicked quick-links icon.
 */
function openVillageQuickLinksPopup(villageId, anchorEl) {
    const existing = document.querySelector('.village-quicklinks-popup');
    if (existing) {
        const wasForThisAnchor = existing.__quickLinksAnchor === anchorEl;
        existing.remove();
        if (wasForThisAnchor) return;
    }

    const popup = document.createElement('div');
    popup.className = 'village-quicklinks-popup popup_style';
    popup.style.cssText = 'position:fixed; z-index:20000; display:inline-flex; flex-direction:column; width:max-content; max-width:calc(100vw - 16px);';
    popup.__quickLinksAnchor = anchorEl;

    const content = document.createElement('div');
    content.className = 'popup_content';
    content.style.cssText = 'padding:8px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap; width:max-content; max-width:calc(100vw - 32px);';

    getOverviewVillagesQuickLinksItems(villageId).forEach(function (item) {
        appendQuickLinkIcon(content, item);
    });

    const separator = document.createElement('div');
    separator.style.cssText = 'border-top:1px solid #7d510f; margin:0 8px;';

    const widgetsContent = document.createElement('div');
    widgetsContent.className = 'popup_content';
    widgetsContent.style.cssText = 'padding:8px; display:flex; gap:6px; justify-content:center; flex-wrap:wrap; width:max-content; max-width:calc(100vw - 32px);';

    VILLAGE_QUICKLINKS_WIDGETS.forEach(function (widget) {
        const link = document.createElement('a');
        link.href = '#';
        link.title = widget.label;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            popup.remove();
            widget.open(villageId);
        });

        const img = document.createElement('img');
        img.src = widget.img;
        img.style.cssText = 'width:18px; height:18px;';
        link.appendChild(img);

        widgetsContent.appendChild(link);
    });

    popup.appendChild(content);
    popup.appendChild(separator);
    popup.appendChild(widgetsContent);
    document.body.appendChild(popup);

    const rect = anchorEl.getBoundingClientRect();
    const popupWidth = popup.getBoundingClientRect().width;
    let left = rect.left;
    let top = rect.bottom + 4;
    if (left + popupWidth > window.innerWidth) left = window.innerWidth - popupWidth - 8;
    if (left < 0) left = 4;
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    const closeOnOutside = (event) => {
        if (!popup.contains(event.target) && event.target !== anchorEl) {
            popup.remove();
            document.removeEventListener('mousedown', closeOnOutside);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', closeOnOutside), 0);
}

/**
 * Builds a recruit context for a village that ISN'T necessarily the currently loaded page (see
 * createLiveRecruitContext in widget_recruitTroops.user.js for the sidebar-widget counterpart):
 * resources come from the static villageResourceSnapshots cache (populated by fetchTrainInfo())
 * instead of live DOM, and there's no MutationObserver/village-poll since nothing here ticks.
 * @param {string|number} villageId
 * @param {HTMLElement} containerEl
 * @returns {Object} ctx
 */
function createOverlayRecruitContext(villageId, containerEl) {
    const ctx = {
        villageId,
        linkBase: getVillageLinkBase(villageId),
        containerEl,
        isLive: false,
        pendingDeduction: { wood: 0, stone: 0, iron: 0 },
        calcDebounceTimer: null,
        getResources: () => {
            const snap = villageResourceSnapshots[villageId] || { wood: 0, stone: 0, iron: 0, pop: 0, popMax: 0 };
            return {
                wood: Math.max(0, snap.wood - ctx.pendingDeduction.wood),
                stone: Math.max(0, snap.stone - ctx.pendingDeduction.stone),
                iron: Math.max(0, snap.iron - ctx.pendingDeduction.iron),
                pop: Math.max(0, snap.popMax - snap.pop)
            };
        },
        deductResources: (cost) => {
            const snap = villageResourceSnapshots[villageId];
            if (!snap) return;
            snap.wood = Math.max(0, snap.wood - cost.wood);
            snap.stone = Math.max(0, snap.stone - cost.stone);
            snap.iron = Math.max(0, snap.iron - cost.iron);
        },
        refreshData: (callback) => fetchTrainInfo(callback, villageId, getVillageLinkBase(villageId), false)
    };
    return ctx;
}

/**
 * Opens a modal overlay showing the shared recruit form (see renderRecruitForm in
 * widget_recruitTroops.user.js) for the given village, always fetching fresh training data on
 * open. Replaces any existing overlay if one is already open. Triggered from the "widgets" row
 * of openVillageQuickLinksPopup.
 * @param {string|number} villageId
 */
function openVillageRecruitOverlay(villageId) {
    document.querySelector('.village-recruit-overlay-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'village-recruit-overlay-backdrop';
    backdrop.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:20001; display:block;';

    const box = document.createElement('div');
    box.className = 'popup_style';
    box.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); max-width:95vw; max-height:85vh; overflow-y:auto; z-index:20002; display:block;';

    const header = document.createElement('div');
    header.className = 'popup_menu';
    header.style.cssText = 'font-size:15px; font-weight:bold;';
    header.textContent = t('button.recruit') + ' \u2014 ' + (typeof getVillageName === 'function' ? getVillageName(villageId) : villageId);

    const closeX = document.createElement('a');
    closeX.href = '#';
    closeX.textContent = t('button.close');
    closeX.style.cssText = 'float:right; cursor:pointer; font-weight:bold; text-decoration:none; margin-left:15px;';
    closeX.addEventListener('click', function (event) { event.preventDefault(); backdrop.remove(); });
    header.appendChild(closeX);

    const content = document.createElement('div');
    content.className = 'popup_content';
    content.style.cssText = 'padding:10px;';
    content.textContent = t('common.loading');

    box.appendChild(header);
    box.appendChild(content);
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    backdrop.addEventListener('mousedown', function (event) {
        if (event.target === backdrop) backdrop.remove();
    });

    const ctx = createOverlayRecruitContext(villageId, content);
    ctx.refreshData(function () {
        renderRecruitForm(ctx);
    });
}

/**
 * Fetches a fresh /main page for the village and (re)renders the overlay's queue icons + full
 * upgrade-button list (see buildBuildQueueContent/injectAtiveQueueList/injectFakeQueueList in
 * widget_extraBuildQueue.user.js). Re-run after every add/remove/cancel action inside the
 * overlay so it reflects the server's latest state \u2014 this village isn't the loaded page, so
 * nothing here ticks or refreshes on its own like the sidebar widget does.
 * @param {string|number} villageId
 * @param {HTMLElement} content
 */
function renderVillageBuildQueueOverlay(villageId, content) {
    fetchVillageMainPage(villageId)
        .then(({ doc }) => {
            parseAndStoreQueueState(doc, villageId);
            const { availableBuildingsImgs, availableBuildingLevels, allBuildingsImgs, allAvailableBuildingLevels } = getAllBuildingsImages(doc);
            const queueBuildIdsActive = bqGet('building_queue_active', villageId) || [];
            const resources = readResourcesFromDoc(doc);

            refreshOverviewVillagesBuildQueueRow(villageId, doc, allBuildingsImgs);

            // Re-fetch and re-render after any action so the overlay reflects fresh server state
            // (cancel is awaited directly; add/remove queue actions settle immediately or async
            // via a fire-and-forget AJAX call, hence the extra delayed re-render below).
            const onAction = () => {
                renderVillageBuildQueueOverlay(villageId, content);
                setTimeout(() => renderVillageBuildQueueOverlay(villageId, content), 1200);
            };

            const buildQueueElment = document.createElement('td');
            injectAtiveQueueList(queueBuildIdsActive, buildQueueElment, villageId, doc, onAction);
            injectFakeQueueList(queueBuildIdsActive, buildQueueElment, allBuildingsImgs, villageId, doc, resources, onAction);

            const buildDiv = settings_cookies.general['show__building_queue_all']
                ? buildBuildQueueContent(allBuildingsImgs, availableBuildingsImgs, allAvailableBuildingLevels, buildQueueElment, villageId, doc, resources, onAction)
                : buildBuildQueueContent(availableBuildingsImgs, availableBuildingsImgs, availableBuildingLevels, buildQueueElment, villageId, doc, resources, onAction);

            content.innerHTML = '';
            content.appendChild(buildDiv);
        })
        .catch(() => {
            content.textContent = t('overviewVillages.buildQueueLoadError');
        });
}

/**
 * Opens a modal overlay showing the shared build-queue widget content (queue icons + full
 * upgrade-button list, same as the sidebar widget) for the given village, always fetching
 * fresh data on open. Replaces any existing overlay if one is already open. Triggered from the
 * "widgets" row of openVillageQuickLinksPopup. Unlike the read-only overview_villages column,
 * this overlay is fully interactive (add/remove/cancel) since the user opened it deliberately
 * for this specific village.
 * @param {string|number} villageId
 */
function openVillageBuildQueueOverlay(villageId) {
    document.querySelector('.village-buildqueue-overlay-backdrop')?.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'village-buildqueue-overlay-backdrop';
    backdrop.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:20001; display:block;';

    const box = document.createElement('div');
    box.className = 'popup_style';
    box.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); max-width:95vw; max-height:85vh; overflow-y:auto; z-index:20002; display:block;';

    const header = document.createElement('div');
    header.className = 'popup_menu';
    header.style.cssText = 'font-size:15px; font-weight:bold;';
    header.textContent = t('buildQueue.title') + ' \u2014 ' + (typeof getVillageName === 'function' ? getVillageName(villageId) : villageId);

    const closeX = document.createElement('a');
    closeX.href = '#';
    closeX.textContent = t('button.close');
    closeX.style.cssText = 'float:right; cursor:pointer; font-weight:bold; text-decoration:none; margin-left:15px;';
    closeX.addEventListener('click', function (event) { event.preventDefault(); backdrop.remove(); });
    header.appendChild(closeX);

    const content = document.createElement('div');
    content.className = 'popup_content';
    content.style.cssText = 'padding:10px;';
    content.textContent = t('common.loading');

    box.appendChild(header);
    box.appendChild(content);
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    backdrop.addEventListener('mousedown', function (event) {
        if (event.target === backdrop) backdrop.remove();
    });

    renderVillageBuildQueueOverlay(villageId, content);
}

/**
 * Adds a small icon to each village row of #production_table (screen=overview_villages),
 * absolutely positioned against the right edge of the village-name cell. Absolute (not float)
 * so it never wraps onto its own line when the name/relic/support icons already fill the row's
 * width — a float can get pushed down if it doesn't fit on the current line. Clicking it opens
 * a popup with quick links to that village's Main, Market, Train and Academy buildings (see
 * openVillageQuickLinksPopup).
 */
function getOverviewVillagesNotepadText(villageId) {
    try {
        const stored = typeof getNotepadStorage === 'function'
            ? getNotepadStorage()
            : notepadMemoryCache;

        if (Array.isArray(stored)) {
            return stored[Number(villageId)] || '';
        }

        return stored?.[String(villageId)] || '';
    } catch (e) {
        return '';
    }
}

function getOverviewVillagesNotepadTooltipHtml(villageId) {
    const noteText = getOverviewVillagesNotepadText(villageId);

    if (!noteText) {
        return '<div style="color:#aaa;">Sem nota.</div>';
    }

    return '<div style="white-space:pre-wrap;">' + convertBBCodeToHTML(noteText) + '</div>';
}

function injectOverviewVillagesQuickLinksIcon() {
    if (!isOverviewVillagesQuickLinksEnabled()) return;

    const table = document.getElementById('production_table');
    if (!table) return;

    table.querySelectorAll('tbody tr').forEach(function (row) {
        const quickeditVn = row.querySelector('.quickedit-vn[data-id]');
        const villageId = quickeditVn?.getAttribute('data-id');
        const cell = quickeditVn?.closest('td');
        if (!villageId || !cell || cell.querySelector('.overview-quicklinks-icon') || cell.querySelector('.overview-notepad-icon')) return;

        cell.style.position = 'relative';
        cell.style.paddingRight = '34px';

        const noteIcon = document.createElement('img');
        noteIcon.className = 'overview-notepad-icon';
        noteIcon.src = 'https://media.innogamescdn.com/TribalWars/emoji/1f4c4.png';
        noteIcon.style.cssText = 'position:absolute; right:18px; top:50%; transform:translateY(-50%); width:12px; height:12px; cursor:help;';
        noteIcon.setAttribute('data-tooltip-tpl', getOverviewVillagesNotepadTooltipHtml(villageId));
        noteIcon.addEventListener('mouseenter', function (event) {
            noteIcon.setAttribute('data-tooltip-tpl', getOverviewVillagesNotepadTooltipHtml(villageId));
            toggleTooltip(event.target, true);
        });
        noteIcon.addEventListener('mouseleave', function (event) {
            toggleTooltip(event.target, false);
        });
        cell.appendChild(noteIcon);

        const icon = document.createElement('img');
        icon.className = 'overview-quicklinks-icon';
        icon.src = 'graphic/ally_forum.png';
        icon.title = t('overviewVillages.quickAccessBuildings');
        icon.style.cssText = 'position:absolute; right:2px; top:50%; transform:translateY(-50%); width:12px; height:12px; cursor:pointer;';
        icon.addEventListener('click', function (event) {
            event.preventDefault();
            openVillageQuickLinksPopup(villageId, icon);
        });

        cell.appendChild(icon);
    });
}
