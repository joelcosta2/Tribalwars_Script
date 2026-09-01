// Building cost/time data: official API primary source, TWStats scraping as fallback.

/**
 * Builds the TWStats base URL (e.g. https://br.twstats.com/br143/index.php) for the current
 * world/market, reused by every TWStats-backed feature (building costs, player profile, notepad
 * bbcode lookups, ...).
 * @returns {string|null}
 */
function getTWStatsBaseUrl() {
    const world = game_data?.world;
    const market = game_data?.market || (world ? world.replace(/\d+$/, '') : null);
    if (!world || !market) return null;
    return `https://${market}.twstats.com/${world}/index.php`;
}

/**
 * Parses a TWStats building detail page and returns per-level cost + time data.
 *
 * The page contains two tables:
 *   - table.widget  — summary row for this building with base time and time factor
 *   - table.vis     — per-level costs (Nível, Madeira, Argila, Ferro, Pop para desenvolver)
 *
 * Build time per level is calculated as:
 *   time(n) = base_time_seconds * factor ^ (n - 1)
 * This is the raw speed-1 time with no main-building bonus applied.
 *
 * @param {Document} doc        - Parsed HTML of the TWStats building detail page.
 * @param {string}   buildingId - Building identifier (e.g. 'barracks'), used to locate
 *                                the correct row in the widget summary table.
 * @returns {Object} { 1: { wood, stone, iron, pop, timeSec }, 2: {...}, ... }
 */
function parseTWStatsBuildingPage(doc, buildingId) {
    const result = {};

    // --- Step 1: extract base_time and time_factor from table.widget ---
    let baseTimeSec = 0;
    let timeFactor  = 1;

    const widgetTable = doc.querySelector('table.widget');
    if (widgetTable) {
        const wRows = widgetTable.querySelectorAll('tr');
        const wHeaders = Array.from(wRows[0]?.querySelectorAll('th, td') || [])
            .map(th => th.textContent.trim().toLowerCase());

        // PT: "Tempo de construção base" / "Fator tempo de construção"
        const baseTimeIdx   = wHeaders.findIndex(h => /tempo.*constru|build.*time|bauzeit/i.test(h));
        const timeFactorIdx = wHeaders.findIndex(h => /fator.*tempo|time.*factor|zeitfaktor/i.test(h));

        for (let i = 1; i < wRows.length; i++) {
            // Match this row by the detail= href in the first cell's link
            if (!wRows[i].querySelector(`a[href*="detail=${buildingId}"]`)) continue;

            const cells = wRows[i].querySelectorAll('td');
            if (baseTimeIdx >= 0 && cells[baseTimeIdx]) {
                // Format is "MM:SS" (e.g. "30:0" = 30 min, "9780:0" = 9780 min)
                const [mins, secs] = cells[baseTimeIdx].textContent.trim().split(':').map(Number);
                baseTimeSec = (mins || 0) * 60 + (secs || 0);
            }
            if (timeFactorIdx >= 0 && cells[timeFactorIdx]) {
                timeFactor = parseFloat(cells[timeFactorIdx].textContent.trim()) || 1;
            }
            break;
        }
    }

    // --- Step 2: parse per-level costs from table.vis ---
    const visTable = doc.querySelector('table.vis');
    if (!visTable) return result;

    const rows = visTable.querySelectorAll('tr');
    if (rows.length < 2) return result;

    const headers = Array.from(rows[0].querySelectorAll('th, td'))
        .map(th => th.textContent.trim().toLowerCase());

    // PT headers: Nível | Madeira | Argila | Ferro | População para desenvolver | População total
    const levelIdx = headers.findIndex(h => /^n[íi]vel$|^level$|^stufe$/i.test(h));
    const woodIdx  = headers.findIndex(h => /madeira|wood|holz/i.test(h));
    const stoneIdx = headers.findIndex(h => /argila|stone|clay|lehm/i.test(h));
    const ironIdx  = headers.findIndex(h => /ferro|iron|eisen/i.test(h));
    // "para desenvolver" = pop cost for this upgrade (not cumulative total)
    const popIdx   = headers.findIndex(h => /para\s+des|for\s+dev|zum\s+aus/i.test(h));

    if (levelIdx === -1 || woodIdx === -1 || stoneIdx === -1 || ironIdx === -1) return result;

    const parseResourceValue = cell => {
        const text = cell?.textContent?.trim() || '';
        if (!text || !/\d/.test(text)) return null;
        const value = parseInt(text.replace(/[^\d]/g, ''), 10);
        return Number.isFinite(value) ? value : null;
    };

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length <= levelIdx) continue;

        const level = parseInt(cells[levelIdx]?.textContent.trim(), 10);
        if (isNaN(level) || level <= 0) continue;

        const wood = parseResourceValue(cells[woodIdx]);
        const stone = parseResourceValue(cells[stoneIdx]);
        const iron = parseResourceValue(cells[ironIdx]);
        if (wood === null || stone === null || iron === null) continue;

        // time(n) = base * factor^(n-1), rounded to nearest second
        const timeSec = baseTimeSec > 0
            ? Math.round(baseTimeSec * Math.pow(timeFactor, level - 1))
            : 0;

        result[level] = {
            wood,
            stone,
            iron,
            pop:     popIdx   >= 0 ? (parseResourceValue(cells[popIdx]) ?? 0) : 0,
            timeSec, // raw seconds on speed-1, no main-building bonus
        };
    }

    return result;
}

/**
 * Parses the official get_building_info XML and calculates costs for every level.
 * Values are rounded up per resource so a prediction cannot underestimate the cost.
 * @param {Document} doc - Parsed XML returned by interface.php?func=get_building_info.
 * @returns {Object} { buildingId: { 1: { wood, stone, iron, pop, timeSec }, ... } }
 */
function parseOfficialBuildingInfo(doc) {
    const result = {};
    const resourceKeys = ['wood', 'stone', 'iron', 'pop'];
    const factorKeys = ['wood_factor', 'stone_factor', 'iron_factor', 'pop_factor'];

    Array.from(doc.documentElement?.children || []).forEach(building => {
        const maxLevel = Number(building.querySelector('max_level')?.textContent);
        const baseValues = resourceKeys.map(key => Number(building.querySelector(key)?.textContent));
        const factors = factorKeys.map(key => Number(building.querySelector(key)?.textContent));
        const baseTime = Number(building.querySelector('build_time')?.textContent);
        const timeFactor = Number(building.querySelector('build_time_factor')?.textContent);

        if (!Number.isInteger(maxLevel) || maxLevel < 1 ||
            baseValues.some(value => !Number.isFinite(value) || value < 0) ||
            factors.some(value => !Number.isFinite(value) || value <= 0)) {
            return;
        }

        const levels = {};
        for (let level = 1; level <= maxLevel; level++) {
            levels[level] = {
                wood: Math.ceil(baseValues[0] * Math.pow(factors[0], level - 1)),
                stone: Math.ceil(baseValues[1] * Math.pow(factors[1], level - 1)),
                iron: Math.ceil(baseValues[2] * Math.pow(factors[2], level - 1)),
                pop: Math.ceil(baseValues[3] * Math.pow(factors[3], level - 1)),
                timeSec: Number.isFinite(baseTime) && baseTime > 0 && Number.isFinite(timeFactor) && timeFactor > 0
                    ? Math.round(baseTime * Math.pow(timeFactor, level - 1))
                    : 0
            };
        }
        result[building.tagName] = levels;
    });

    return result;
}

/**
 * Fetches the official building configuration for the current world.
 * @returns {Promise<Object|null>}
 */
async function fetchOfficialBuildingInfo() {
    try {
        const response = await fetch('/interface.php?func=get_building_info', { credentials: 'include' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const xml = new DOMParser().parseFromString(await response.text(), 'text/xml');
        const data = parseOfficialBuildingInfo(xml);
        return Object.keys(data).length ? data : null;
    } catch (error) {
        console.warn('[TW BuildingsData] Official building info unavailable:', error.message);
        return null;
    }
}

/**
 * Fetches per-level cost/time data for every building from the official API and stores it
 * in localStorage under 'buildings_data'. TWStats remains the fallback if the API is unavailable.
 * in localStorage under 'buildings_data'. The fetch is skipped entirely if the key
 * already exists — the data is static and only needs to be collected once.
 *
 * Storage format:
 *   buildings_data = { barracks: { 1: { wood, stone, iron, pop, time }, 2: {...} }, ... }
 *
 * The URL is built from game_data.market and game_data.world so it automatically
 * targets the correct server (e.g. br.twstats.com/br143 or pt.twstats.com/pt93).
 * @returns {Promise<Object|null>}
 */
async function fetchAndCacheBuildingsData() {
    const STORAGE_KEY = 'buildings_data';
    const META_STORAGE_KEY = 'buildings_data_meta';
    const CACHE_VERSION = 3;

    const world = game_data?.world;
    const market = game_data?.market || (world ? world.replace(/\d+$/, '') : null);

    const isValidCache = cachedData => cachedData && Object.values(cachedData).some(levels =>
        levels && Object.values(levels).some(level =>
            Number.isFinite(level?.wood) && Number.isFinite(level?.stone) && Number.isFinite(level?.iron)
        )
    );

    try {
        const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        const cacheMeta = JSON.parse(localStorage.getItem(META_STORAGE_KEY) || 'null');
        if (cacheMeta?.version === CACHE_VERSION && cacheMeta.world === world &&
            cacheMeta.market === market && isValidCache(cachedData)) {
            return cachedData;
        }
    } catch (error) {
        console.warn('[TW BuildingsData] Invalid cached data — refetching');
    }

    if (!world || !market) {
        console.warn('[TW BuildingsData] Cannot determine world/market from game_data — skipping fetch');
        return null;
    }

    const officialData = await fetchOfficialBuildingInfo();
    if (officialData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(officialData));
        localStorage.setItem(META_STORAGE_KEY, JSON.stringify({
            version: CACHE_VERSION,
            world,
            market,
            source: 'official-api',
            updatedAt: Date.now()
        }));
        console.log('[TW BuildingsData] Official building data cached successfully.');
        return officialData;
    }

    const buildings = [
        'main', 'barracks', 'stable', 'garage', 'church', 'church_f',
        'snob', 'smith', 'place', 'market', 'wood', 'stone', 'iron',
        'farm', 'storage', 'hide', 'wall', 'watchtower', 'statue'
    ];

    const baseUrl = getTWStatsBaseUrl() + '?page=buildings&detail=';
    const buildingsData = {};

    console.log(`[TW BuildingsData] Fetching from ${baseUrl}...`);

    for (const building of buildings) {
        try {
            const html = await gmFetch(baseUrl + building);
            const doc  = new DOMParser().parseFromString(html, 'text/html');
            const levelData = parseTWStatsBuildingPage(doc, building);
            if (Object.keys(levelData).length > 0) {
                buildingsData[building] = levelData;
                console.log(`[TW BuildingsData] ${building}: ${Object.keys(levelData).length} levels cached`);
            } else {
                console.warn(`[TW BuildingsData] ${building}: no level data found (building may not exist in this world)`);
            }
        } catch (e) {
            console.warn(`[TW BuildingsData] Skipping ${building}:`, e.message);
        }
    }

    if (Object.keys(buildingsData).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buildingsData));
        localStorage.setItem(META_STORAGE_KEY, JSON.stringify({
            version: CACHE_VERSION,
            world,
            market,
            source: 'twstats',
            updatedAt: Date.now()
        }));
        console.log('[TW BuildingsData] All buildings cached successfully.');
    } else {
        console.warn('[TW BuildingsData] No data was fetched — localStorage not updated.');
    }

    return buildingsData;
}
