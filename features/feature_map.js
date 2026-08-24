
/**
 * Fetches outgoing commands from the overview page and stores them in localStorage.
 * Updates map icons if the relevant setting is enabled.
 */
async function getOutgoingCommandsFromOverview() {
    const { general } = settings_cookies;

    // Early exit if features are disabled
    if (!general['show__extra_options_map_hover'] && !general['show__outgoingInfo_map']) {
        return;
    }

    // Time-gate: skip fetch if synced within the last 3 minutes.
    // Uses a session variable (not localStorage) so every page load fetches fresh data.
    const OUTGOING_TTL_MS = 3 * 60 * 1000;
    if ((Date.now() - _outgoingCommandsLastFetch) < OUTGOING_TTL_MS) {
        if (general['show__outgoingInfo_map'] && typeof mapReady === 'function') {
            await mapReady();
            addOutgoingIcons();
        }
        return;
    }

    try {
        const response = await fetch(game_data.link_base_pure + 'overview');
        const htmlText = await response.text();

        // Parse the HTML response
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const outgoingTable = doc.querySelector('#commands_outgoings');

        // Handle case where no outgoing commands exist
        if (!outgoingTable) {
            localStorage.setItem('outgoing_units_saved', JSON.stringify([]));
            _outgoingCommandsCache = [];
            return;
        }

        const commandRows = outgoingTable.querySelectorAll('.command-row');
        const outgoingUnitsMap = new Map();

        Array.from(commandRows).forEach(row => {
            const villageLabel = row.querySelector('.quickedit-label');
            const hoverDetails = row.querySelectorAll('.command_hover_details img');

            // Extract unit names from image sources
            const unitList = Array.from(hoverDetails)
                .map(img => {
                    const match = img.src.match(/\/([^/]+)\.(?:png|webp)$/);
                    return match ? match[1] : null;
                })
                .filter(Boolean); // Remove null values

            const villageCoords = villageLabel?.innerText.match(/\((.*?)\)/)?.[1] || "";
            if (!villageCoords) return;

            const existing = outgoingUnitsMap.get(villageCoords) || { name: villageCoords, imgs: [] };
            existing.imgs.push(...unitList);
            outgoingUnitsMap.set(villageCoords, existing);
        });

        const outgoing_units = Array.from(outgoingUnitsMap.values()).map(entry => ({
            name: entry.name,
            imgs: entry.imgs.join(',')
        }));

        // Save processed data and update in-memory cache
        localStorage.setItem('outgoing_units_saved', JSON.stringify(outgoing_units));
        _outgoingCommandsLastFetch = Date.now();
        _outgoingCommandsCache = outgoing_units;

        // Trigger map update if enabled
        if (general['show__outgoingInfo_map'] && typeof mapReady === 'function') {
            await mapReady();
            addOutgoingIcons();
        }

        if (general['show__heatmap_reports'] && typeof mapReady === 'function') {
            await mapReady();
            rebuildReportHeatmapMapSdkElements();
        }

    } catch (error) {
        console.error("[Outgoing Commands] Failed to fetch overview data:", error);
    }
}

/**
 * Promisified version of the map waiter.
 */
const mapReady = () => new Promise((resolve) => {
    const check = setInterval(() => {
        if (document.querySelector("[id^='map_village_']")) {
            clearInterval(check);
            resolve();
        }
    }, 200);
    // Timeout after 10 seconds to avoid memory leaks
    setTimeout(() => { clearInterval(check); resolve(); }, 10000);
});

/**
 * Renders outgoing unit icons directly onto the map based on saved command data.
 */
function addOutgoingIcons() {
    if (_outgoingCommandsCache === null) {
        const raw = localStorage.getItem('outgoing_units_saved');
        if (!raw) return;
        _outgoingCommandsCache = JSON.parse(raw);
    }
    const outgoingCommands = _outgoingCommandsCache;
    const mapContainer = document.getElementById('map_container');
    if (!mapContainer) return;

    // Remove existing icons to prevent duplicates during map re-renders
    document.querySelectorAll('.outgoing_units_overlay').forEach(el => el.remove());

    outgoingCommands.forEach(command => {
        // Formats "500|500" to "500500" to match TWMap.villages keys
        const villageCoords = command.name.replace('|', '');
        const villageInfo = TWMap.villages[villageCoords];

        if (!villageInfo) return;

        const villageElement = document.getElementById(`map_village_${villageInfo.id}`);
        if (!villageElement) return;

        const { top, left } = villageElement.style;
        const icons = command.imgs.split(',').filter(Boolean);
        const iconCounts = icons.reduce((acc, icon) => {
            acc[icon] = (acc[icon] || 0) + 1;
            return acc;
        }, {});
        const uniqueIcons = Object.keys(iconCounts);

        // Use a fragment to batch DOM injections for better performance
        const fragment = document.createDocumentFragment();

        uniqueIcons.forEach(icon => {
            const iconId = `icon-${villageCoords}-${icon}`;

            // Skip if icon already exists (extra safety)
            if (document.getElementById(iconId)) return;

            const cell = document.createElement('div');
            cell.className = 'icon_outgoing_unit outgoing_units_overlay';
            cell.id = iconId;

            Object.assign(cell.style, {
                position: 'relative',
                width: '15px',
                height: '15px',
                display: 'block'
            });

            const farmIcon = document.createElement('img');
            farmIcon.src = `/graphic/command/${icon}.png`;
            farmIcon.alt = '';
            Object.assign(farmIcon.style, {
                width: '15px',
                height: '15px',
                display: 'block'
            });

            cell.appendChild(farmIcon);

            const count = iconCounts[icon];
            if (count > 1) {
                const badge = document.createElement('span');
                badge.textContent = `${count}x`;
                Object.assign(badge.style, {
                    position: 'absolute',
                    top: '-4px',
                    right: '-7px',
                    padding: '0 2px',
                    minWidth: '12px',
                    height: '11px',
                    lineHeight: '11px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#fff',
                    background: 'rgba(0,0,0,0.75)',
                    borderRadius: '6px',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.35)'
                });
                cell.appendChild(badge);
            }

            fragment.appendChild(cell);
        });

        const overlay = document.createElement('div');
        overlay.id = `outgoing_overlay_${villageCoords}`;
        overlay.className = 'outgoing_units_overlay';
        Object.assign(overlay.style, {
            position: 'absolute',
            top: top,
            left: left,
            zIndex: '10',
            pointerEvents: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 15px)',
            gridAutoRows: '15px',
            gap: '1px',
            width: 'max-content',
            alignItems: 'start'
        });

        overlay.appendChild(fragment);

        // Batch insert before the village element
        villageElement.parentNode.insertBefore(overlay, villageElement);
    });
}

/**
 * Renders a dedicated barracks icon for attacks sent through the farm assistant.
 * This keeps the normal outgoing-command icons untouched.
 */
function addFarmAttackIcons() {
    const savedData = Array.from(_farmAttackCoordsSet);
    if (!savedData.length) return;

    const farmAttackCoords = savedData;
    const mapContainer = document.getElementById('map_container');
    if (!mapContainer) return;

    // Remove standalone overlays and any previously appended barracks icons
    document.querySelectorAll('.farm_attack_overlay').forEach(el => el.remove());
    document.querySelectorAll('.farm_attack_img').forEach(el => el.remove());

    farmAttackCoords.forEach(coords => {
        const villageCoords = coords.replace('|', '');
        const villageInfo = TWMap.villages[villageCoords];
        if (!villageInfo) return;

        const villageElement = document.getElementById(`map_village_${villageInfo.id}`);
        if (!villageElement) return;

        const farmIcon = document.createElement('img');
        farmIcon.src = _getNavAssetBase() + 'buildings/barracks.png';
        farmIcon.alt = '';
        farmIcon.className = 'farm_attack_img';
        Object.assign(farmIcon.style, { width: '15px', height: '15px', display: 'block' });

        const existingOverlay = document.getElementById(`outgoing_overlay_${villageCoords}`);
        if (existingOverlay) {
            // Slot into the existing icon grid — no positional overlap
            existingOverlay.appendChild(farmIcon);
        } else {
            // No outgoing overlay yet — create a standalone one with the same grid layout
            const { top, left } = villageElement.style;
            const overlay = document.createElement('div');
            overlay.id = `outgoing_overlay_${villageCoords}`;
            overlay.className = 'farm_attack_overlay';
            Object.assign(overlay.style, {
                position: 'absolute',
                top,
                left,
                zIndex: '11',
                pointerEvents: 'none',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 15px)',
                gridAutoRows: '15px',
                gap: '1px',
                width: 'max-content',
                alignItems: 'start'
            });
            overlay.appendChild(farmIcon);
            villageElement.parentNode.insertBefore(overlay, villageElement);
        }
    });
}

/**
 * Rebuilds the attack-report heatmap as MapSdk squares (one per attacked coordinate),
 * replacing the previous DOM-dot overlay. Called only when the reports cache changes —
 * MapSdk auto-redraws newly panned-into sectors on its own, so this never needs to run
 * on every map drag.
 * Intensity = 70% frequency weight + 30% recency weight over a 14-day window.
 */
function rebuildReportHeatmapMapSdkElements() {
    if (typeof MapSdk === 'undefined' || typeof TWMap === 'undefined') return;
    if (!settings_cookies.general['show__heatmap_reports'] || !_reportsListCache) return;

    MapSdk.polygons = MapSdk.polygons.filter(element => !element._twpfHeatmap);

    // Aggregate attack counts and latest timestamp per coordinate
    const attackCounts = {};
    const latestAttack = {};
    _reportsListCache.forEach(report => {
        if (!report.coords) return;
        attackCounts[report.coords] = (attackCounts[report.coords] || 0) + 1;
        const ts = new Date(convertDateToISO(report.date) || 0).getTime();
        if (!latestAttack[report.coords] || ts > latestAttack[report.coords]) {
            latestAttack[report.coords] = ts;
        }
    });

    const maxCount = Math.max(...Object.values(attackCounts), 1);
    const now = Date.now();
    const maxAge = 14 * 24 * 60 * 60 * 1000;

    Object.keys(attackCounts).forEach(coords => {
        const match = coords.match(/^(\d{1,3})\|(\d{1,3})$/);
        if (!match) return;
        const x = Number(match[1]);
        const y = Number(match[2]);

        const count = attackCounts[coords];
        const ageRatio = Math.max(0, 1 - (now - (latestAttack[coords] || 0)) / maxAge);
        const intensity = Math.min(1, (count / maxCount) * 0.7 + ageRatio * 0.3);
        const alpha = (0.15 + intensity * 0.3).toFixed(2);

        MapSdk.polygons.push({
            _twpfHeatmap: true,
            coords: [{ x, y }, { x: x + 1, y }, { x: x + 1, y: y + 1 }, { x, y: y + 1 }],
            anchor: 'topLeft',
            styling: { main: { fillStyle: `rgba(220,50,50,${alpha})` } },
            drawOnMap: true, drawOnMini: false
        });
    });

    MapSdk.redraw();
}

/**
 * Fetches attack reports from the server for the default and "all" groups,
 * merges them with any previously stored data (keeping the most recent per coordinate),
 * and saves the result to localStorage.
 */
async function getReportsList() {
    if (!settings_cookies.general?.['show__extra_options_map_hover']) return;

    if (_reportsListCache === null) {
        _reportsListCache = await reportGetAll();
    }
    const storedReports = _reportsListCache;

    // Time-gate: skip fetch if synced within the last 15 minutes — UNLESS the store is
    // actually empty (e.g. cleared via DevTools without also clearing reports_last_fetch),
    // in which case we always force a fresh sync regardless of the timestamp.
    const FETCH_TTL_MS = 15 * 60 * 1000;
    const lastFetch = parseInt(localStorage.getItem('reports_last_fetch') || '0', 10);
    if (storedReports.length > 0 && (Date.now() - lastFetch) < FETCH_TTL_MS) {
        if (settings_cookies.general?.['show__heatmap_reports']) {
            await mapReady();
            rebuildReportHeatmapMapSdkElements();
        }
        return;
    }

    const reportsMap = new Map(storedReports.map(report => [report.coords, report]));
    const knownIds = new Set(storedReports.map(report => report.id));

    const groupIds = [0, 7600];
    const allNewReports = [];

    try {
        // We use a standard for...of loop here on purpose.
        // This ensures group 7600 only starts after group 0 is completely finished.
        for (const id of groupIds) {
            const newReports = await fetchAllReports(id, knownIds);
            allNewReports.push(...newReports);

            // Optional: Add a small 200ms rest between groups for extra safety
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const changedCoords = new Set();
        allNewReports.forEach(report => {
            const existingReport = reportsMap.get(report.coords);
            if (!existingReport || isNewer(report.date, existingReport.date)) {
                // Fresh sighting for this coords — any previously cached loot/spy data belonged
                // to the older report and no longer applies, so it's dropped (not merged forward).
                reportsMap.set(report.coords, report);
                changedCoords.add(report.coords);
            }
        });

        // Prune entries older than 30 days to prevent unbounded growth
        const PRUNE_AGE_MS = 30 * 24 * 60 * 60 * 1000;
        const pruneThreshold = Date.now() - PRUNE_AGE_MS;
        const removedCoords = [];
        for (const [coords, report] of reportsMap) {
            const ts = new Date(convertDateToISO(report.date) || 0).getTime();
            if (ts > 0 && ts < pruneThreshold) {
                reportsMap.delete(coords);
                removedCoords.push(coords);
            }
        }

        _reportsListCache = [...reportsMap.values()];
        // Only persist what actually changed — one small record per coord, not the whole list.
        await Promise.all([
            ...[...changedCoords].filter(c => reportsMap.has(c)).map(c => reportSet(c, reportsMap.get(c))),
            ...removedCoords.map(c => reportRemove(c))
        ]);
        localStorage.setItem('reports_last_fetch', String(Date.now()));
        // Refresh the heatmap overlay with the newly fetched report data.
        if (settings_cookies.general?.['show__heatmap_reports']) {
            await mapReady();
            rebuildReportHeatmapMapSdkElements();
        }
    } catch (err) {
        console.error("[Report Manager] Error syncing reports:", err);
    }
}

/**
 * Fetches all reports for a group sequentially to prevent server rate-limiting.
 * @param {number} groupId - The ID of the report group.
 * @returns {Promise<Array>} List of extracted reports.
 */
async function fetchAllReports(groupId, knownIds = new Set()) {
    const firstPageData = await fetchReportsPage(groupId, 0);
    if (!firstPageData) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(firstPageData, 'text/html');

    // Calculate total pages based on navigation items
    const navItems = doc.querySelectorAll('.paged-nav-item');
    const totalPages = navItems.length + 1;

    // Start with reports from the first page
    let allReports = extractReports(doc);

    // Early-stop: if a known report is already on the first page, no need to paginate further
    if (knownIds.size > 0 && allReports.some(r => knownIds.has(r.id))) {
        return allReports;
    }

    // Fetch subsequent pages one by one (Sequential)
    // TribalWars uses increments of 12 for the 'from' parameter
    for (let i = 1; i < totalPages; i++) {
        const offset = i * 12;
        const pageData = await fetchReportsPage(groupId, offset);

        if (pageData) {
            const pageDoc = parser.parseFromString(pageData, 'text/html');
            const pageReports = extractReports(pageDoc);
            allReports.push(...pageReports);

            // Early-stop: found a known report — everything after is already cached
            if (knownIds.size > 0 && pageReports.some(r => knownIds.has(r.id))) {
                break;
            }
        }

        // Add a small safety delay (throttle) between requests
        // 200ms is usually enough to stay under the radar
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    return allReports;
}

/**
 * Fetches a specific page of reports using the native Fetch API.
 * @param {number} groupId - The ID of the report group.
 * @param {number} from - The starting offset for pagination.
 * @returns {Promise<string|null>} The HTML content of the page or null on failure.
 */
async function fetchReportsPage(groupId, from) {
    const url = `${game_data.link_base_pure}report&mode=attack&group_id=${groupId}&from=${from}`;

    try {
        const response = await fetch(url);

        // Check if the request was successful (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Return the HTML as text to be parsed by DOMParser in the calling function
        return await response.text();
    } catch (error) {
        console.error(`[Report Manager] Failed to fetch reports from ${url}:`, error);
        return null;
    }
}

/**
 * Extracts report data from a parsed DOM element.
 * @param {HTMLElement|Document} doc - The element containing the report list.
 * @returns {Array} List of extracted report objects.
 */
function extractReports(doc) {
    const reports = [];
    const reportLabels = doc.querySelectorAll('.quickedit-label');

    reportLabels.forEach(label => {
        // Use .closest() to find the table row containing this report
        const row = label.closest('tr');
        const title = label.closest('.report-title');
        if (!row) return;

        const reportId = title.getAttribute('data-id');
        const labelText = label.textContent;

        // Optimized Regex: Extracts the last (xxx|yyy) coordinates found in the text
        const coordsMatch = labelText.match(/\((\d{1,3}\|\d{1,3})\)(?=[^\(]*$)/);

        if (coordsMatch && reportId) {
            // Scope the search to the current row for better performance
            const dateElement = row.querySelectorAll('.nowrap')[1];

            if (dateElement) {
                const dotImg = row.querySelector('.report-subject img[src*="dots/"]');
                reports.push({
                    id: reportId,
                    coords: coordsMatch[1],
                    date: dateElement.innerText.trim(),
                    dot: dotImg ? { src: dotImg.src, title: dotImg.getAttribute('data-title') || '' } : null
                });
            }
        }
    });

    return reports;
}

/**
 * Compares two date strings to determine if the first is more recent.
 * @param {string} date1 - The new report date string.
 * @param {string} date2 - The existing report date string from storage.
 * @returns {boolean} True if date1 is strictly newer than date2.
 */
function isNewer(date1, date2) {
    // If we don't have an existing date to compare against, the new one is "newer"
    if (!date2) return true;
    if (!date1) return false;

    // Convert to timestamps (milliseconds) for faster numeric comparison
    const time1 = new Date(convertDateToISO(date1)).getTime();
    const time2 = new Date(convertDateToISO(date2)).getTime();

    // Handle invalid date cases (NaN)
    if (isNaN(time1)) return false;
    if (isNaN(time2)) return true;

    return time1 > time2;
}

/**
 * Converts TribalWars date strings to ISO format.
 * Handles standard "Month DD, HH:MM" and relative "today/yesterday at HH:MM".
 * @param {string} dateStr - Raw date string from the game.
 * @returns {string|null} ISO 8601 string or null if parsing fails.
 */
function convertDateToISO(dateStr) {
    if (!dateStr) return null;

    const now = new Date();
    const targetDate = new Date();
    const lowerDate = dateStr.toLowerCase();

    // 1. Handle relative dates: "today at 12:00", "yesterday at 12:00" (EN)
    //    and "hoje às 12:00", "ontem às 12:00" (PT)
    const isToday = lowerDate.includes('today') || lowerDate.includes('hoje');
    const isYesterday = lowerDate.includes('yesterday') || lowerDate.includes('ontem');
    if (lowerDate.includes(':') && (isToday || isYesterday)) {
        const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})/);
        if (!timeMatch) return null;

        const dayOffset = isYesterday ? -1 : 0;
        targetDate.setTime(twWallClockToEpochMs(
            parseInt(timeMatch[1], 10),
            parseInt(timeMatch[2], 10),
            0,
            dayOffset
        ));
    }
    // 2. Handle standard format: "mar. 14, 17:56"
    else {
        const parts = dateStr.match(/([a-z]{3})\.?\s+(\d+),\s+(\d{1,2}):(\d{2})/i);
        if (!parts) return null;

        const monthMap = {
            // English
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
            // Portuguese (months that differ from English abbreviations)
            fev: 1, abr: 3, mai: 4, ago: 7, set: 8, out: 9, dez: 11
        };

        const monthAbbr = parts[1].toLowerCase().replace('.', '');
        const month = monthMap[monthAbbr];
        const day = parseInt(parts[2], 10);
        const hour = parseInt(parts[3], 10);
        const minute = parseInt(parts[4], 10);

        // Build UTC epoch using server timezone: "mon. 14, 17:56" is 17:56 server-local time
        let yearToUse = now.getFullYear();
        let epochMs = Date.UTC(yearToUse, month, day) + hour * 3600000 + minute * 60000 - serverTimezoneOffsetMs;
        // Year Wrap-around: If the report is "Dec 31" but it's currently Jan 1st,
        // the report belongs to last year.
        if (epochMs > Timing.getCurrentServerTime()) {
            epochMs = Date.UTC(yearToUse - 1, month, day) + hour * 3600000 + minute * 60000 - serverTimezoneOffsetMs;
        }
        targetDate.setTime(epochMs);
    }

    return targetDate.toISOString();
}

/**
 * Builds a "<th>label</th><td>icon+value icon+value icon+value</td>" row for a wood/stone/iron
 * amounts object. Returns null if amounts is missing (nothing to show).
 * @param {string} labelText
 * @param {{wood:number, stone:number, iron:number}|null} amounts
 * @returns {HTMLTableRowElement|null}
 */
function createResourceAmountsRow(labelText, amounts) {
    if (!amounts) return null;
    const row = document.createElement('tr');
    row.classList.add('premium-report-row');
    const th = document.createElement('th');
    th.textContent = labelText;
    const td = document.createElement('td');
    ['wood', 'stone', 'iron'].forEach(res => {
        const icon = document.createElement('span');
        icon.className = 'icon header ' + res;
        icon.style.marginRight = '2px';
        td.appendChild(icon);
        td.appendChild(document.createTextNode(String(amounts[res]) + ' '));
    });
    row.append(th, td);
    return row;
}

/**
 * Injects report data (last attack date, loot, and spy results) into the Map Popup.
 * @param {Object} report - The report record (see reportGet/reportSet shape in
 * utils/core_indexeddb.js), with `loot`/`spyDiscover` populated once fetchedFull is true.
 */
function insertReportData(report, popUpBody) {
    if (!popUpBody) return;

    // 1. Cleanup: Remove existing "Last Attack" info to prevent row stacking
    const existingEntry = document.getElementById("info_last_attack");
    if (existingEntry) existingEntry.remove();

    // 2. Create the main "Last Attack" row
    const lastAttackRow = document.createElement('tr');
    lastAttackRow.id = "info_last_attack";

    // Use textContent for the labels to ensure clean rendering
    const header = document.createElement('th');
    header.textContent = t('map.lastAttack');

    const data = document.createElement('td');
    if (report.dot) {
        const dotImg = document.createElement('img');
        dotImg.src = report.dot.src;
        dotImg.title = report.dot.title;
        dotImg.style.cssText = 'vertical-align:middle;margin-right:4px;';
        data.appendChild(dotImg);
    }
    data.appendChild(document.createTextNode(report.date));

    lastAttackRow.append(header, data);
    popUpBody.appendChild(lastAttackRow);

    // 3. Loot/spy-discovery rows, rendered from structured numbers (not cached HTML)
    const lootLabel = report.loot
        ? t('map.loot') + ' (' + report.loot.popLooted + '/' + report.loot.popTotal + ')'
        : t('map.loot');
    const lootRow = createResourceAmountsRow(lootLabel, report.loot);
    if (lootRow) popUpBody.appendChild(lootRow);

    const spyRow = createResourceAmountsRow(t('map.discoveredResources'), report.spyDiscover);
    if (spyRow) popUpBody.appendChild(spyRow);
}

/**
 * Scans a DOM subtree for the game's standard "<span class='icon header wood'>...</span>1234"
 * resource icon+amount pattern and returns the parsed wood/stone/iron numbers.
 * @param {Element|null} container
 * @returns {{wood:number, stone:number, iron:number}|null} Null if no resource icons found.
 */
function extractResourceAmounts(container) {
    if (!container) return null;
    const amounts = {};
    let found = false;
    ['wood', 'stone', 'iron'].forEach(res => {
        const icon = container.querySelector('.icon.header.' + res);
        if (!icon) return;
        found = true;
        const wrapper = icon.closest('.nowrap') || icon.parentElement;
        amounts[res] = parseInt((wrapper?.textContent || '').replace(/\D/g, ''), 10) || 0;
    });
    return found ? amounts : null;
}

/**
 * Injects report data (last attack, loot, outgoing units) into the active map popup
 * for the village currently under the cursor. Fetches and caches full report details
 * on first access via fetch.
 */
async function getReportInfoToMap(currentCoords, currentPopUpBody) {
    if (!settings_cookies.general['show__extra_options_map_hover']) return;

    // --- Morale (server-authoritative via the game's calculate_morale API) ---
    // The formula-based approach is unreliable: it ignores whether morale is enabled
    // in this world, and misses the time-based component. The API is the ground truth.
    document.getElementById('info_morale')?.remove();
    const tgtCoords = currentCoords.replace('|', '');
    const tgtVillage = TWMap?.villages?.[tgtCoords];
    // Own villages (including ones just conquered) shouldn't show morale or old
    // enemy-report data — the village's current owner is what matters, not who
    // owned it when the report was generated.
    const isOwnVillage = tgtVillage?.owner === game_data?.player?.id.toString();
    
    if (tgtVillage?.owner && !isOwnVillage) {
        const defPoints = TWMap.players?.[tgtVillage.owner]?.points;
        const defName   = TWMap.players?.[tgtVillage.owner]?.name || '';
        const ownerId   = tgtVillage.owner;

        if (defPoints > 0) {
            // Helper: inject the morale row into the popup.
            // Uses a live DOM query instead of the captured currentPopUpBody reference —
            // the game rebuilds #map_popup innerHTML ~100ms after hover (popup server data),
            // which detaches the original tbody before the morale POST resolves.
            // TWMap.popup._currentVillage guards against injecting into a different village's popup.
            const injectMoraleRow = (morale) => {
                document.getElementById('info_morale')?.remove();
                if (TWMap.popup._currentVillage !== tgtVillage.id) return;
                const liveBody = document.getElementById('map_popup')?.querySelector('tbody');
                if (!liveBody) return;
                const color = morale >= 90 ? '#4caf50' : morale >= 70 ? '#ff9800' : morale >= 50 ? '#ff5722' : '#f44336';
                const moraleRow = document.createElement('tr');
                moraleRow.id = 'info_morale';
                const moraleTh = document.createElement('th');
                moraleTh.textContent = t('map.morale');
                const moraleTd = document.createElement('td');
                moraleTd.textContent = `${morale}%`;
                moraleTd.style.cssText = `color:${color};font-weight:bold`;
                moraleRow.append(moraleTh, moraleTd);
                liveBody.appendChild(moraleRow);
            };

            if (_moraleCache.has(ownerId)) {
                injectMoraleRow(_moraleCache.get(ownerId));
            } else {
                // Async: fire the same POST the game's MoraleCalculator uses.
                // Passes the defender name so the server can resolve days_played server-side.
                (async () => {
                    try {
                        // When defender_name is known, pass empty defender_points so
                        // the server does a full player lookup (resolves real points +
                        // days_played for accurate time-based morale).
                        // Fall back to local points only if name is unavailable.
                        const body = new URLSearchParams({
                            attacker_points: game_data.player.points,
                            defender_name:   defName,
                            defender_points: defName ? '' : defPoints,
                            days_played:     0,
                            perspective:     'attacker',
                            h:               game_data.csrf
                        });
                        const resp = await fetch(
                            `${game_data.link_base_pure}place&ajax=calculate_morale&type=morale`,
                            { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, body: body.toString() }
                        );
                        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                        const json = await resp.json();
                        const morale = json?.morale;
                        if (morale != null) {
                            _moraleCache.set(ownerId, morale);
                            injectMoraleRow(morale);
                        }
                    } catch (e) {
                        console.warn('[Morale] API call failed:', e);
                    }
                })();
            }
        }
    }

    if (_reportsListCache === null) {
        _reportsListCache = await reportGetAll();
    }
    const reports_list = _reportsListCache;

    if (_outgoingCommandsCache === null) {
        const raw = localStorage.getItem('outgoing_units_saved');
        if (raw) _outgoingCommandsCache = JSON.parse(raw);
    }
    const outgoing_units_saved = _outgoingCommandsCache;

    if (reports_list && !isOwnVillage) {
        for (let i = 0; i < reports_list.length; i++) {
            const report = reports_list[i];

            if (report.coords.includes(currentCoords)) {
                // Use cached data if already fetched for this report
                if (report.fetchedFull) {
                    insertReportData(report, currentPopUpBody);
                } else {
                    // No cached data — fetch the full report page, extract structured loot/spy
                    // numbers (not raw HTML), then delegate display to insertReportData()
                    try {
                        const response = await fetch('/game.php?screen=report&view=' + report.id);
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        const html = await response.text();

                        const parser = new DOMParser();
                        const tempDoc = parser.parseFromString(html, 'text/html');

                        // Extract loot: wood/stone/iron amounts + population looted/total.
                        // Find the row that actually holds the resource icons instead of
                        // assuming it's always the first <tr> (row order/count can vary).
                        const lootRow = Array.from(tempDoc.querySelectorAll('#attack_results tr'))
                            .find(tr => tr.querySelector('.icon.header.wood, .icon.header.stone, .icon.header.iron'));
                        if (lootRow) {
                            const cells = lootRow.querySelectorAll('td');
                            report.loot = extractResourceAmounts(cells[0]);
                            if (report.loot) {
                                const popParts = (cells[1]?.textContent || '').split('/').map(s => parseInt(s.replace(/\D/g, ''), 10) || 0);
                                report.loot.popLooted = popParts[0] || 0;
                                report.loot.popTotal = popParts[1] || 0;
                            }
                        } else if (tempDoc.getElementById('attack_results')) {
                            console.warn('[Report] #attack_results found but no resource icons inside it for report ' + report.id);
                        }

                        // Extract discovered resources (spy report), excluding the relic row.
                        // Queried directly against the table (not `tbody`) since a missing
                        // explicit <tbody> in the source HTML shouldn't matter either way.
                        const spyTable = tempDoc.getElementById('attack_spy_resources');
                        if (spyTable) {
                            spyTable.querySelectorAll('tr').forEach(tr => {
                                if (tr.querySelector('.relic-quality-shoddy, [class*="relic-quality"], [class*="inline-relic"]')) {
                                    tr.remove();
                                }
                            });
                            report.spyDiscover = extractResourceAmounts(spyTable);
                            if (!report.spyDiscover) {
                                console.warn('[Report] #attack_spy_resources found but no resource icons inside it for report ' + report.id);
                            }
                        }

                        report.fetchedFull = true;

                        // Use the same display function as the cached path
                        insertReportData(report, currentPopUpBody);

                        await reportSet(report.coords, report);
                    } catch (error) {
                        console.error('[Report] Failed to fetch report:', error);
                    }
                }
                break;
            }
        }
    }

    // --- Travel time: all units, compact grid (icons row + H:MM times row) ---
    document.getElementById('info_travel_time')?.remove();
    if (typeof calculateDistanceToTarget === 'function' && game_data?.units) {
        if (_unitSpeedsCache === null) {
            _unitSpeedsCache = JSON.parse(localStorage.getItem('units_speed') || '{}');
        }
        const unitSpeeds = _unitSpeedsCache;
        const distance = calculateDistanceToTarget(currentCoords);
        const units = game_data.units.filter(u => unitSpeeds[u] > 0 && unitSpeeds[u] * distance >= 1);

        if (units.length > 0 && distance > 0) {
            const assetBase = _getNavAssetBase();
            const travelRow = document.createElement('tr');
            travelRow.id = 'info_travel_time';
            const travelTd = document.createElement('td');
            travelTd.colSpan = 2;
            travelTd.style.padding = '3px 0';

            const grid = document.createElement('div');
            grid.style.cssText = `display:grid;grid-template-columns:repeat(${units.length},1fr);gap:2px;text-align:center`;

            // Row 1: unit icons
            units.forEach(unit => {
                const img = document.createElement('img');
                img.src = `${assetBase}unit/unit_${unit}.png`;
                img.title = getUnitDisplayName(unit);
                img.style.cssText = 'width:16px;height:16px;display:block;margin:0 auto';
                grid.appendChild(img);
            });

            // Row 2: H:MM travel times — hover each cell for full H:MM:SS
            units.forEach(unit => {
                const totalMins = unitSpeeds[unit] * distance;
                const h = Math.floor(totalMins / 60);
                const m = Math.floor(totalMins % 60);
                const span = document.createElement('span');
                span.textContent = `${h}:${String(m).padStart(2, '0')}`;
                span.title = typeof formatMinutesToTime === 'function' ? formatMinutesToTime(totalMins) : '';
                span.style.cssText = 'font-size:9px;display:block';
                grid.appendChild(span);
            });

            travelTd.appendChild(grid);
            travelRow.appendChild(travelTd);
            currentPopUpBody.appendChild(travelRow);
        }
    }

    if (outgoing_units_saved) {
        outgoing_units_saved.forEach(function (unit) {
            if (unit.name.includes(currentCoords)) {
                const span1Element = document.createElement('span');
                span1Element.className = 'icon-container';
                const icons = unit.imgs.split(',');
                icons.forEach(function (icon) {
                    if (icon !== '') {
                        const img1Element = document.createElement('img');
                        img1Element.src = _getNavAssetBase() + 'command/' + icon + '.png';
                        img1Element.alt = '';
                        span1Element.appendChild(img1Element);
                    }
                });

                const popUpTitle = currentPopUpBody.querySelector('th');
                if (popUpTitle) popUpTitle.insertBefore(span1Element, popUpTitle.firstChild);
            }
        });
    }
}

/**
 * Adjusts the TribalWars map size based on user input and persists settings.
 * Handles the teardown and re-initialization of the TWMap object.
 */
function setMapSize() {
    const mapWrap = document.getElementById('map_wrap');
    if (!mapWrap) return;

    // 1. Gather all necessary DOM elements once
    const elements = {
        map: document.getElementById('map'),
        container: document.getElementById('map_container'),
        boundary: document.getElementById('map_go_home_boundary'),
        coordY: document.getElementById('map_coord_y_wrap'),
        coordX: document.getElementById('map_coord_x_wrap'),
        heightInput: document.querySelector('#map_custom_height'),
        widthInput: document.querySelector('#map_custom_width')
    };

    // 2. Handle Configuration Persistence
    const storedConfig = JSON.parse(localStorage.getItem('mapConfig')) || {};

    // Save original dimensions only if they don't exist yet
    if (!storedConfig.originalWidth) {
        const firstImg = elements.map.querySelector('img');
        Object.assign(storedConfig, {
            originalWidth: elements.map.style.width || 'auto',
            originalHeight: elements.map.style.height || 'auto',
            originalMapImgWidth: firstImg?.style.width || 'auto',
            originalMapImgHeight: firstImg?.style.height || 'auto'
        });
        localStorage.setItem('mapConfig', JSON.stringify(storedConfig));
    }

    // 3. Update Custom Dimensions in Storage
    const newHeight = elements.heightInput?.value || localStorage.getItem('map_custom_height');
    const newWidth = elements.widthInput?.value || localStorage.getItem('map_custom_width');

    localStorage.setItem('map_custom_height', newHeight);
    localStorage.setItem('map_custom_width', newWidth);

    const mapHeightPx = `${newHeight}px`;
    const mapWidthPx = `${newWidth}px`;

    // 4. Apply Styles efficiently
    const resizeTargets = [mapWrap, elements.map, elements.coordX];
    resizeTargets.forEach(el => { if (el) el.style.width = mapWidthPx; });

    [mapWrap, elements.map, elements.coordY].forEach(el => { if (el) el.style.height = mapHeightPx; });

    // Reset image scaling to prevent distortion on larger maps
    elements.map.querySelectorAll('img').forEach(img => {
        Object.assign(img.style, { width: 'auto', height: 'auto' });
    });

    // 5. Re-initialize Game Map
    // We remove elements that TWMap.init() will recreate
    elements.container?.remove();
    elements.boundary?.remove();

    // TWMap.init() creates a fresh FreeMap + mover + click-to-jump handler for #map/#minimap
    // but never removes the previous ones — jQuery's .click() stacks handlers, so the stale
    // one (whose own mover never saw this drag, so its moveDirty guard wrongly passes) still
    // fires TWMap.focus() with stale coords on minimap-drag-release, causing a coord "snap".
    // Strip the leftovers so init() re-creates exactly one of each.
    document.getElementById('map_mover')?.remove();
    document.getElementById('minimap_mover')?.remove();
    $('#map, #minimap').off('click');

    // Set internal game map size (grid blocks) and restart engine
    TWMap.size = [15, 15]; // Expanded grid for larger custom maps
    TWMap.init();
    // TWMap.init() doesn't recompute minimap_offset for the new #map size on its own —
    // without this, minimap drag miscalculates its target and snaps to the wrong coord.
    if (typeof TWMap.scaleMinimap === 'function') {
        TWMap.scaleMinimap();
    }

    // 6. Focus Update
    // Using a short timeout to ensure the DOM has settled after TWMap.init()
    setTimeout(() => {
        if (typeof TWMap.focusSubmit === 'function') {
            TWMap.focusSubmit();
        }
    }, 100);
}

/**
 * Injects UI controls for the Large Map feature into the game's map configuration table.
 */
function createBigMapOption() {
    const mapConfig = document.getElementById('map_config');
    const mapSearch = document.getElementById('map_search');
    if (!mapConfig || !mapSearch) return;

    // Helper to create the checkbox row
    const createCheckboxRow = () => {
        const tr = document.createElement('tr');

        const tdCheckbox = document.createElement('td');
        const input = Object.assign(document.createElement('input'), {
            type: 'checkbox',
            id: 'show_biggermap',
            checked: settings_cookies.general['show__big_map']
        });

        input.onclick = () => {
            const isEnabled = !settings_cookies.general['show__big_map'];
            settings_cookies.general['show__big_map'] = isEnabled;
            localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));

            isEnabled ? setMapSize() : location.reload();
        };

        const tdLabel = Object.assign(document.createElement('td'), { colSpan: 2 });

        const label = Object.assign(document.createElement('label'), {
            textContent: ' ' + t('map.showLargeMap'),
            htmlFor: 'show_biggermap'
        });

        tdCheckbox.appendChild(input);
        tdLabel.appendChild(label);
        tr.append(tdCheckbox, tdLabel);
        return tr;
    };

    // Helper to create the input row with debouncing
    const createSizeRow = () => {
        const tr = document.createElement('tr');

        // Internal helper for numeric inputs
        const createInput = (id, labelText) => {
            const td = Object.assign(document.createElement('td'), { className: 'nowrap' });
            const label = document.createTextNode(labelText);
            const input = Object.assign(document.createElement('input'), {
                type: 'number',
                id: id,
                value: localStorage.getItem(id) || 600,
                step: 100
            });
            input.style.width = '60px';

            // Debounce logic: prevents setMapSize from firing on every keypress
            let timeout;
            input.oninput = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (settings_cookies.general['show__big_map']) setMapSize();
                }, 400);
            };

            td.append(label, input);
            return td;
        };

        tr.append(
            createInput('map_custom_height', t('map.height') + ': '),
            createInput('map_custom_width', ' ' + t('map.width') + ': ')
        );
        return tr;
    };

    const mapOptionsTable = document.createElement('table');
    mapOptionsTable.className = 'vis';
    mapOptionsTable.style.cssText = 'border-spacing:0px;border-collapse:collapse;';
    mapOptionsTable.width = '100%';

    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.colSpan = 3;
    headerCell.textContent = t('map.options');
    headerRow.appendChild(headerCell);
    tbody.appendChild(headerRow);

    // Injection
    const rowToggle = createCheckboxRow();
    const rowInputs = createSizeRow();

    tbody.append(rowToggle, rowInputs);
    mapOptionsTable.appendChild(tbody);
    mapConfig.insertBefore(mapOptionsTable, mapSearch);
}

// In-memory set of coords attacked via the farm assistant this session.
// Intentionally not persisted — icons are temporary and reset on page refresh.
const _farmAttackCoordsSet = new Set();

// In-memory caches for localStorage data read on every map drag.
// Avoids repeated JSON.parse(localStorage.getItem(...)) on each onMovePixel call.
// Updated whenever the underlying data is written.
let _outgoingCommandsCache = null;
let _reportsListCache = null;

// Session-only TTL for outgoing commands fetch — resets on every page load
// so a refresh always gets fresh data from the server.
let _outgoingCommandsLastFetch = 0;

// Batches icon refreshes so several sectors spawning during one drag gesture trigger a
// single rebuild instead of one per sector.
let _mapIconsRefreshScheduled = false;
function scheduleMapIconsRefresh() {
    if (_mapIconsRefreshScheduled) return;
    _mapIconsRefreshScheduled = true;
    setTimeout(() => {
        _mapIconsRefreshScheduled = false;
        if (settings_cookies.general['show__outgoingInfo_map']) addOutgoingIcons();
        addFarmAttackIcons();
    }, 0);
}

// Per-village session cache for troop templates.
// Skips re-fetching the rally point dialog for already-visited villages.
const _troopTemplateSessionCache = new Map();

// Shared storage namespace with feature_TroopTemplates.user.js
const _CUSTOM_TEMPLATES_STORAGE_PREFIX = 'twpf_custom_troop_templates_v1';

// Cache for unit speed data — set once at startup, safe to hold in memory.
let _unitSpeedsCache = null;

// Per-session morale cache keyed by enemy player ID.
// Avoids a POST request on every re-hover of the same player's village.
const _moraleCache = new Map();

// Map-based LRU cache for village ID lookups (max 10 entries)
const _villageCache = new Map();
const _VILLAGE_CACHE_MAX = 150;

// Maps TribalWars unit codes to their translated display names, reusing the
// navIcon.* keys already defined for widget_navigationBar.user.js's icon picker.
const UNIT_NAME_KEYS = {
    spear: 'navIcon.spear', sword: 'navIcon.sword', axe: 'navIcon.axe', archer: 'navIcon.archer',
    spy: 'navIcon.scout', light: 'navIcon.lightCavalry', marcher: 'navIcon.mountedArcher',
    heavy: 'navIcon.heavyCavalry', ram: 'navIcon.ram', catapult: 'navIcon.catapult',
    knight: 'navIcon.paladin', snob: 'navIcon.noble', militia: 'navIcon.militia'
};
function getUnitDisplayName(unit) {
    return UNIT_NAME_KEYS[unit] ? t(UNIT_NAME_KEYS[unit]) : unit;
}

/**
 * Returns the localStorage key for account-wide custom troop templates.
 */
function getCustomTroopTemplatesStorageKey() {
    const world = game_data?.world || window.location.hostname || 'unknown_world';
    const player = game_data?.player?.id || 'unknown_player';
    return `${_CUSTOM_TEMPLATES_STORAGE_PREFIX}_${world}_${player}`;
}

/**
 * Converts custom templates saved by feature_TroopTemplates into the same shape
 * expected by TroopTemplates/current map buttons.
 */
function getCustomTemplatesForMap() {
    let rawTemplates = [];
    try {
        const raw = localStorage.getItem(getCustomTroopTemplatesStorageKey());
        const parsed = raw ? JSON.parse(raw) : [];
        rawTemplates = Array.isArray(parsed) ? parsed : [];
    } catch {
        rawTemplates = [];
    }

    const units = Array.isArray(game_data?.units) ? game_data.units : [];

    return rawTemplates.map((tpl) => {
        const mapped = {
            id: `custom_local_${tpl.id}`,
            player_id: String(game_data?.player?.id || 'custom'),
            name: tpl?.name || t('map.customTemplateName'),
            used: 0,
            use_all: []
        };

        units.forEach((unit) => {
            const value = parseInt(tpl?.units?.[unit], 10);
            mapped[unit] = Number.isFinite(value) && value > 0 ? String(value) : '0';
        });

        return mapped;
    });
}

/**
 * Builds a TroopTemplates.current object composed of server templates + custom local templates.
 */
function mergeTemplatesWithCustom(baseTemplates) {
    const merged = {};
    const source = baseTemplates || {};

    Object.keys(source).forEach((key) => {
        if (!String(key).startsWith('custom_local_')) {
            merged[key] = source[key];
        }
    });

    getCustomTemplatesForMap().forEach((tpl) => {
        merged[tpl.id] = tpl;
    });

    return merged;
}

/**
 * Retrieves a village ID based on "X|Y" coordinates from the cached map data.
 * @param {string} coords - Format: "500|500"
 * @returns {string|null} The village ID or null if not found.
 */
function getVillageIDByCoord(coords) {
    if (!coords) return null;

    // 1. Check cache (LRU: re-insert on hit to mark as most recently used)
    if (_villageCache.has(coords)) {
        const id = _villageCache.get(coords);
        _villageCache.delete(coords);
        _villageCache.set(coords, id);
        return id;
    }

    const rawData = mapDataGetRaw('map_villages');
    if (!rawData) {
        console.error("[Map Data] map_villages not found in cache.");
        return null;
    }

    // 2. Prepare the coordinate for matching: "457|370" -> "457,370"
    const [x, y] = coords.split('|');
    if (!x || !y) return null;
    const formattedCoord = `${x},${y}`;

    /**
     * Regex Optimization: 
     * [^,]+ matches village name characters (non-commas) faster than .*?
     * ^(\d+) captures ID at start of line
     */
    const regex = new RegExp(`^(\\d+),[^,]+,${formattedCoord},`, 'm');
    const match = rawData.match(regex);

    if (match && match[1]) {
        const villageId = match[1];

        // LRU eviction: remove oldest entry if at capacity
        if (_villageCache.size >= _VILLAGE_CACHE_MAX) {
            _villageCache.delete(_villageCache.keys().next().value);
        }
        _villageCache.set(coords, villageId);
        return villageId;
    }

    console.warn(`[Map Data] Village not found: ${coords}`);
    updateMapInfoVillages();
    return null;
}

let lastFocusId = -1;

/**
 * Monitors the map's context menu focus.
 * When a village is selected, it updates the target data and troop templates.
 * Uses event-driven overrides on TWMap.context.spawn/hide instead of setInterval polling.
 */
function startMapContextWatcher() {
    const _origSpawn = TWMap.context.spawn.bind(TWMap.context);
    TWMap.context.spawn = function(village, x, y) {
        // Hide our buttons before the game repositions mp_att — prevents them from
        // visibly jumping from the previous village's position to the new one.
        document.querySelectorAll('.custom-map-ctx-button').forEach(el => {
            el.style.display = 'none';
            el.style.opacity = '0';
        });
        _origSpawn(village, x, y);
        const newFocus = 1000 * x + y;
        if (newFocus !== lastFocusId) {
            lastFocusId = newFocus;
            const focusCoords = `${x}|${y}`;
            GM_setValue('target_village', village.id);
            GM_setValue('target_distance', calculateDistanceToTarget(focusCoords));
            initializeTroopTemplates(village.id, parseInt(village.owner, 10) === 0);
        }
    };

    const _origHide = TWMap.context.hide.bind(TWMap.context);
    TWMap.context.hide = function() {
        _origHide();
        lastFocusId = -1;
    };
}

let _troopTemplateAbortController = null;

/**
 * Fetches and initializes troop templates for a specific target village.
 * Simulates opening the rally point command window to get template data.
 * @param {string|number} targetID - The ID of the target village.
 */
async function initializeTroopTemplates(targetID, isBarbarian = false) {
    if (!targetID) return;

    // Cancel any in-flight request for a previous village
    if (_troopTemplateAbortController) {
        _troopTemplateAbortController.abort();
        _troopTemplateAbortController = null;
    }

    // Remove existing "fake" buttons before re-rendering to avoid UI clutter
    document.querySelectorAll('.fake-farm-assistant-button').forEach(el => el.remove());

    // Session cache hit: render directly without a network request
    if (_troopTemplateSessionCache.has(targetID)) {
        const cachedTemplates = _troopTemplateSessionCache.get(targetID);
        const mergedTemplates = mergeTemplatesWithCustom(cachedTemplates);
        TroopTemplates.current = mergedTemplates;
        Object.values(mergedTemplates).filter(t => t.player_id).forEach((template, index) => {
            if (typeof addFakeFarmAssistantButton === 'function') addFakeFarmAssistantButton(template, index, isBarbarian);
        });
        return;
    }

    _troopTemplateAbortController = new AbortController();
    const signal = _troopTemplateAbortController.signal;

    const url = `${window.location.origin}${game_data.link_base_pure}place&ajax=command&target=${targetID}`;

    try {
        // 1. Modern fetch instead of $.ajax for better async handling
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const htmlContent = data.dialog;

        if (!htmlContent) {
            console.warn("[Templates] No dialog content returned.");
            return;
        }

        // 2. Extract TroopTemplates JSON string
        // The regex looks for the object assigned to TroopTemplates.current
        const templateMatch = htmlContent.match(/TroopTemplates\.current\s*=\s*({.*?});/);

        if (templateMatch?.[1]) {
            const templatesData = JSON.parse(templateMatch[1]);

            // Store in session cache to avoid re-fetching for the same village
            _troopTemplateSessionCache.set(targetID, templatesData);

            // Sync with game's global object, including local custom templates.
            const mergedTemplates = mergeTemplatesWithCustom(templatesData);
            TroopTemplates.current = mergedTemplates;

            // 3. Re-bind template selection event (scoped cleanup)
            const $selectTemplate = $(".evt-select-template");
            $selectTemplate.off('change').on('change', function () {
                TroopTemplates.useTemplate(this);
            });

            // 4. Generate buttons for each template found
            const templatesArray = Object.values(mergedTemplates).filter(t => t.player_id);

            templatesArray.forEach((template, index) => {
                // We pass the template object and index to the button creator
                if (typeof addFakeFarmAssistantButton === 'function') {
                    addFakeFarmAssistantButton(template, index, isBarbarian);
                }
            });

            console.log(`[Templates] Initialized ${templatesArray.length} templates for target ${targetID}`);
        } else {
            console.warn("[Templates] Could not find TroopTemplates in the response dialog.");
        }
    } catch (error) {
        if (error.name === 'AbortError') return; // Intentionally cancelled, not an error
        console.error("[Templates] Critical error during initialization:", error);
    }
}

if (typeof TWMap !== 'undefined') {
    // Hide native Farm Assistant context buttons if the feature is not active for this account
    if (!game_data.features?.FarmAssistent?.active) {
        const style = document.createElement('style');
        style.textContent = '#mp_farm_a, #mp_farm_b, .farmassistant-tooltip { display: none !important; }';
        document.head.appendChild(style);
    }

    //initiate target_village as 0
    GM_setValue("target_village", 0);
    getOutgoingCommandsFromOverview();
    createBigMapOption();
    if (settings_cookies.general['show__extra_options_map_hover']) {
        var originalHandleMouseMove = TWMap.popup.handleMouseMove;
        getReportsList();
        TWMap.popup.handleMouseMove = function (e) {
            TWMap.popup.extraInfo = true;
            originalHandleMouseMove.call(this, e);
            var villageHoverCoords = TWMap.map.coordByEvent(e);
            const currentCoords = villageHoverCoords.join('|');
            var mapPopupElement = document.getElementById('map_popup');
            const currentPopUpBody = mapPopupElement.getElementsByTagName('tbody')[0];

            var tr = document.createElement('tr');
            tr.className = 'nowrap';
            tr.id = 'map_popup_extra';

            if (currentPopUpBody && !currentPopUpBody.querySelector('#map_popup_extra')) {
                currentPopUpBody.appendChild(tr);
                document.querySelectorAll("#info_last_attack, #info_outgoing_units, #info_travel_time, #info_morale").forEach(el => el.remove());
                getReportInfoToMap(currentCoords, currentPopUpBody);
            }
        };
    }
    if (settings_cookies.general['show__big_map']) {
        setMapSize();
    }
    if (settings_cookies.general['show__outgoingInfo_map'] || settings_cookies.general['show__heatmap_reports']) {
        if (TWMap.mapHandler) {
            // Fires only when a sector actually spawns (far rarer than onMovePixel's per-pixel
            // drag events) — chains after any other spawnSector wrapper (e.g. MapSdk's own).
            var _previousSpawnSector = TWMap.mapHandler.spawnSector;
            TWMap.mapHandler.spawnSector = function (data, sector) {
                _previousSpawnSector.call(this, data, sector);
                scheduleMapIconsRefresh();
            }
        }
    }

    if (settings_cookies.general['show__ctx_attack_buttons']) {
        startMapContextWatcher();
    }
}


/**
 * Creates and injects a custom attack button into the map context menu for a given troop template.
 * @param {Object} template - A TroopTemplate object.
 * @param {number} index - Zero-based index; index 0 also clears buttons from the previous village.
 */
function addFakeFarmAssistantButton(template, index, isBarbarian = false) {
    const ctxButtons = document.getElementById("map-ctx-buttons");
    // Always use mp_att as reference for show/hide tracking (it animates normally for all
    // attackable villages, including barbarians). For barbarian villages the position is
    // read from mp_farm_a/mp_farm_b inside updateBasedOnReference instead.
    const referenceElement = document.getElementById("mp_att");

    //remove previous buttons
    if (index === 0) {
        document.querySelectorAll('.custom-map-ctx-button').forEach(element => element.remove());
    }

    if (!ctxButtons) {
        console.warn("[MapCTX] #map-ctx-buttons not found.");
        return;
    }

    if (!referenceElement) {
        console.warn("[MapCTX] #mp_att reference element not found.");
        return;
    }

    // create ctx button for map
    const newButton = document.createElement("a");
    newButton.className = "mp custom-map-ctx-button";
    newButton.id = "mp_farm_f" + index;
    newButton.style.borderRadius = '5px';
    newButton.setAttribute("data-tooltip-tpl", generateTemplateTooltipData(template));

    if (index === 0) {
        newButton.style.backgroundImage = 'url(data:image/png;base64,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)'
    } else {
        // Subsequent templates (index > 0) use a different icon
        newButton.style.backgroundImage = 'url(data:image/png;base64,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)'
    }

    newButton.onmouseover = function () {
        toggleTooltip(newButton, true)
    }

    newButton.onmouseleave = function () {
        toggleTooltip(newButton, false)
    }

    newButton.onclick = async function fetchData() {
        const originalBackgroundImage = newButton.style.backgroundImage;
        // Capture focus synchronously at click time — lastFocusId can change
        // during the async launchAttack() if the user moves focus elsewhere.
        const focusAtClick = lastFocusId;
        try {
            newButton.style.backgroundImage = 'url(https://dsbr.innogamescdn.com/asset/f441272cc5/graphic/loading.gif)';

            // 1. Define the list of game units to extract from the template
            const unitTypes = game_data.units;

            // 2. Build the units object dynamically
            const unitsToLaunch = {};

            unitTypes.forEach(unit => {
                // Convert string value from template to integer
                const amount = parseInt(template[unit], 10);

                // Only add to the request if amount is greater than 0
                if (amount > 0) {
                    unitsToLaunch[unit] = amount;
                }
            });

            // 3. Get target from GM_getValue (Tampermonkey storage)
            const targetId = GM_getValue("target_village");

            if (!targetId) {
                throw new Error("Target village ID not found in storage.");
            }

            console.log(`Launching attack from template '${template.name}' on target ${targetId}`);

            // 4. Call the previously defined launch function
            const attackSucceeded = await launchAttack(unitsToLaunch, targetId);

            // 5. Only update map icons if the attack was actually sent.
            // Use focusAtClick (captured before the await) — not lastFocusId,
            // which may have changed while the request was in flight.
            if (attackSucceeded && focusAtClick > 0) {
                const focusStr = focusAtClick.toString().padStart(6, '0');
                const targetCoords = focusStr.substring(0, 3) + '|' + focusStr.substring(3, 6);

                // Add a temporary barracks icon to show the attack was sent.
                // This is replaced by real outgoing-command icons on next page load.
                _farmAttackCoordsSet.add(targetCoords);
                if (typeof addFarmAttackIcons === 'function') addFarmAttackIcons();
            }

        } catch (error) {
            console.warn("Error sending attack:", error);
        } finally {
            newButton.style.backgroundImage = originalBackgroundImage;
        }
    };

    let syncInterval = null;

    /**
     * Synchronizes the position, display, and opacity of CTX button
     * with the referenceElement (mp_att).
     */
    function updateBasedOnReference(index) {
        const ref = referenceElement;
        const btn = newButton;

        if (!ref || !btn) return;

        const refStyle = window.getComputedStyle(ref);

        btn.style.display = refStyle.display;
        btn.style.visibility = refStyle.visibility;

        if (refStyle.display === 'none' || refStyle.opacity === '0') {
            btn.style.opacity = refStyle.opacity;
            btn.style.pointerEvents = 'none';
        } else {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = refStyle.opacity;

            if (isBarbarian) {
                // For barbarian villages: read position directly from the native (hidden)
                // farm assist elements — the game sets their left/top even when display:none.
                const posEl = index === 0
                    ? (document.getElementById('mp_farm_a') || document.getElementById('mp_farm_b'))
                    : (document.getElementById('mp_farm_b') || document.getElementById('mp_farm_a'));

                if (posEl?.style.left) {
                    btn.style.left = posEl.style.left;
                    btn.style.top = index <= 1
                        ? posEl.style.top
                        : `${parseFloat(posEl.style.top) + (index - 1) * 36}px`;
                }
            } else {
                // Use the reference element's own style coordinates (same container as native TW buttons)
                const refLeft = parseFloat(ref.style.left) || 0;
                const refTop = parseFloat(ref.style.top) || 0;

                btn.style.left = `${refLeft + 32}px`;
                btn.style.top = index === 0
                    ? `${refTop - 15}px`
                    : `${refTop + 53 + (index - 1) * 36}px`;
            }
        }
    }

    /**
     * MutationObserver to watch for attribute changes
     */
    const observer = new MutationObserver(() => {
        // Immediate sync when a change is detected
        updateBasedOnReference(index);

        // "Insurance Policy": jQuery animations (fadeIn/fadeOut) update the style attribute 
        // many times per second. We force a sync at 60fps for 500ms to "stick" to the animation.
        if (syncInterval) clearInterval(syncInterval);

        let duration = 0;
        syncInterval = setInterval(() => {
            updateBasedOnReference(index);
            duration += 16; // Approximately 1 frame at 60fps

            // Stop the loop after 500ms (typical duration of a TW fade effect)
            if (duration > 500) {
                clearInterval(syncInterval);
                syncInterval = null;
            }
        }, 16);
    });

    // Observe style, class, and hidden attributes
    observer.observe(referenceElement, {
        attributes: true,
        attributeFilter: ["style", "class", "hidden"]
    });

    // Initial synchronization
    updateBasedOnReference(index);

    // Parent monitoring: if the referenceElement is completely removed from the DOM
    // (common in dynamic UI refreshes), we need to know.
    if (referenceElement.parentElement) {
        const parentObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                const removed = Array.from(mutation.removedNodes);
                if (removed.includes(referenceElement)) {
                    console.warn("Reference element was removed from DOM. Sync stopped.");
                    // You might want to re-initialize your logic here if the element is recreated
                }
            }
        });
        parentObserver.observe(referenceElement.parentElement, { childList: true });
    }

    /**
     * Builds the HTML tooltip content for a troop template button.
     * Shows unit icons, counts, total carry capacity, and travel time to the target.
     * @param {Object} template - A TroopTemplate object.
     * @returns {string} HTML string for use in data-tooltip-tpl.
     */
    function generateTemplateTooltipData(template) {
        let tooltipHtml = "";
        const units = game_data.units;

        // Load data from storage
        const unitSpeeds = JSON.parse(localStorage.getItem('units_speed') || '{}');
        const unitCarry = JSON.parse(localStorage.getItem('units_carry') || '{}');

        let slowestUnitSpeed = 0;
        let totalCarry = 0;
        let hasVariableCarry = false; // To track if 'use_all' is used

        units.forEach(unit => {
            const value = parseInt(template[unit], 10) || 0;
            const isUseAll = template.use_all && template.use_all.includes(unit);

            if (value > 0 || isUseAll) {
                const iconUrl = `${_getNavAssetBase()}unit/unit_${unit}.png`;
                const displayValue = isUseAll ? t('common.all') : value;

                tooltipHtml += `<img src="${iconUrl}" alt="${getUnitDisplayName(unit)}" /> ${displayValue}<br />`;

                // Track slowest unit
                if (unitSpeeds[unit] && unitSpeeds[unit] > slowestUnitSpeed) {
                    slowestUnitSpeed = unitSpeeds[unit];
                }

                // Calculate Carry
                if (unitCarry[unit]) {
                    if (isUseAll) {
                        hasVariableCarry = true;
                    } else {
                        totalCarry += value * unitCarry[unit];
                    }
                }
            }
        });

        // ---- Carry Capacity Display ----
        const carryDisplay = hasVariableCarry ? `${totalCarry}+` : totalCarry;
        tooltipHtml += `
            <img src="${_getNavAssetBase()}res.png" title="${t('common.resources')}" />
            ${carryDisplay}<br />
        `;

        // ---- Distance time calculation ----
        let distanceTimeText = "--:--:--";
        const targetDist = GM_getValue("target_distance");

        if (slowestUnitSpeed > 0 && targetDist) {
            const totalMinutes = slowestUnitSpeed * targetDist;
            distanceTimeText = formatMinutesToTime(totalMinutes);
        }

        tooltipHtml += `
            <span style="line-height: 20px;">
                ${distanceTimeText}
            </span>
        `;

        return tooltipHtml;
    }

    // Append the new CTX button to the map context menu
    ctxButtons.appendChild(newButton);
}
