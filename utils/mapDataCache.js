// World map data cache: village/player/ally.txt dumps + lookup helpers + distance calc.

const _mapDataFetches = new Map();

/**
 * Fetches a world map/*.txt dump and caches the raw text in IndexedDB (these dumps can be
 * several MB for large worlds — too big for localStorage's quota). Only the small freshness
 * timestamp stays in localStorage. village.txt uses a strict 1 hour and 1 minute TTL;
 * its timestamp is authoritative even when the cache is unavailable.
 * @param {string} fileName - e.g. 'village.txt', 'player.txt', 'ally.txt'
 * @param {string} storageKey - cache key to store the raw response under (e.g. 'map_villages')
 * @param {boolean} [force=false]
 * @returns {Promise<boolean>} true only if a fetch actually happened
 */
async function fetchAndCacheMapDataFile(fileName, storageKey, force = false) {
    const TIMESTAMP_KEY = storageKey + '_last_update';
    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
    const VILLAGE_DATA_TTL = ONE_HOUR + 60 * 1000; // 1 hour and 1 minute
    const isVillageData = storageKey === 'map_villages';
    const cacheTtl = isVillageData ? VILLAGE_DATA_TTL : ONE_HOUR;

    const lastUpdate = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();
    const isFresh = lastUpdate && now - Number(lastUpdate) < cacheTtl;

    if (isVillageData) {
        const inFlightRequest = _mapDataFetches.get(storageKey);
        if (inFlightRequest) return inFlightRequest;
    }

    if (isVillageData ? isFresh : (!force && isFresh && mapDataGetRaw(storageKey))) {
        return false;
    }

    const request = (async () => {
        console.log(`Updating ${fileName} data...`);

        if (isVillageData) localStorage.setItem(TIMESTAMP_KEY, now.toString());

        try {
            const response = await fetch(window.location.origin + "/map/" + fileName);

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.text();

            await mapDataSet(storageKey, data);
            if (!isVillageData) localStorage.setItem(TIMESTAMP_KEY, now.toString());

            console.log(`${fileName} updated and cached.`);
            return true;
        } catch (error) {
            console.error(`Failed to fetch ${fileName}:`, error);
            return false;
        } finally {
            if (isVillageData) _mapDataFetches.delete(storageKey);
        }
    })();

    if (isVillageData) _mapDataFetches.set(storageKey, request);
    return request;
}

/**
 * Fetches the server's village.txt data and caches it in localStorage.
 * Skips the fetch if the timestamp is less than 1 hour and 1 minute old.
 * The timestamp is authoritative, and force cannot bypass this TTL.
 * @param {boolean} [force=false]
 */
async function updateMapInfoVillages(force = false) {
    await fetchAndCacheMapDataFile('village.txt', 'map_villages', force);
}

/**
 * Fetches the server's player.txt data (id,name,ally_id,villages,points,rank) and caches it.
 * @param {boolean} [force=false]
 */
async function updateMapInfoPlayers(force = false) {
    if (await fetchAndCacheMapDataFile('player.txt', 'map_players', force)) {
        _mapPlayersIndexCache = null;
    }
}

/**
 * Fetches the server's ally.txt data (id,name,tag,members,villages,points,points_all,rank) and caches it.
 * @param {boolean} [force=false]
 */
async function updateMapInfoAllies(force = false) {
    if (await fetchAndCacheMapDataFile('ally.txt', 'map_allies', force)) {
        _mapAlliesIndexCache = null;
    }
}

/**
 * Refreshes village/player/ally map data sequentially with a delay between requests;
 * each file remains independently hourly-gated.
 * @param {boolean} [force=false]
 */
const MAP_DATA_REQUEST_INTERVAL_SECONDS = 1;

async function updateAllMapData(force = false) {
    await updateMapInfoVillages(force);
    await wait(MAP_DATA_REQUEST_INTERVAL_SECONDS);
    await updateMapInfoPlayers(force);
    await wait(MAP_DATA_REQUEST_INTERVAL_SECONDS);
    await updateMapInfoAllies(force);
}

/**
 * Decodes a map/*.txt field value (e.g. player/ally names), which is URL-encoded with '+' for spaces.
 * @param {string} rawValue
 * @returns {string}
 */
function decodeMapEntryName(rawValue) {
    try {
        return decodeURIComponent(rawValue.replace(/\+/g, ' '));
    } catch {
        return rawValue.replace(/\+/g, ' ');
    }
}

// Lazy in-memory indexes built from the cached map_players/map_allies localStorage text.
// Nulled out by updateMapInfoPlayers/updateMapInfoAllies whenever a fresh fetch actually happens.
let _mapPlayersIndexCache = null;
let _mapAlliesIndexCache = null;

/**
 * Builds (once, cached) a Map of lowercased player name -> player record from 'map_players'.
 * @returns {Map<string, {id:string,name:string,allyId:string,villages:number,points:number,rank:number}>}
 */
function getMapPlayersIndex() {
    if (_mapPlayersIndexCache) return _mapPlayersIndexCache;

    const index = new Map();
    const raw = mapDataGetRaw('map_players');
    raw.split('\n').forEach(line => {
        const parts = line.trim().split(',');
        if (parts.length < 6) return;
        const [id, rawName, allyId, villages, points, rank] = parts;
        const name = decodeMapEntryName(rawName);
        index.set(name.toLowerCase(), { id, name, allyId, villages: +villages, points: +points, rank: +rank });
    });

    _mapPlayersIndexCache = index;
    return index;
}

/**
 * @param {string} name
 * @returns {{id:string,name:string,allyId:string,villages:number,points:number,rank:number}|null}
 */
function getCachedPlayerByName(name) {
    if (!name) return null;
    return getMapPlayersIndex().get(name.trim().toLowerCase()) || null;
}

/**
 * @param {string|number} id
 * @returns {{id:string,name:string,allyId:string}|null}
 */
function getCachedPlayerById(id) {
    if (id === null || id === undefined) return null;
    for (const player of getMapPlayersIndex().values()) {
        if (String(player.id) === String(id)) return player;
    }
    return null;
}

/**
 * Builds (once, cached) a Map of lowercased ally name -> ally record from 'map_allies'.
 * @returns {Map<string, {id:string,name:string,tag:string,members:number,villages:number,points:number,pointsAll:number,rank:number}>}
 */
function getMapAlliesIndex() {
    if (_mapAlliesIndexCache) return _mapAlliesIndexCache;

    const index = new Map();
    const raw = mapDataGetRaw('map_allies');
    raw.split('\n').forEach(line => {
        const parts = line.trim().split(',');
        if (parts.length < 8) return;
        const [id, rawName, rawTag, members, villages, points, pointsAll, rank] = parts;
        const name = decodeMapEntryName(rawName);
        index.set(name.toLowerCase(), {
            id, name, tag: decodeMapEntryName(rawTag),
            members: +members, villages: +villages, points: +points, pointsAll: +pointsAll, rank: +rank
        });
    });

    _mapAlliesIndexCache = index;
    return index;
}

/**
 * @param {string} name
 * @returns {{id:string,name:string,tag:string,members:number,villages:number,points:number,pointsAll:number,rank:number}|null}
 */
function getCachedAllyByName(name) {
    if (!name) return null;
    return getMapAlliesIndex().get(name.trim().toLowerCase()) || null;
}

/**
 * @param {string|number} id
 * @returns {{id:string,name:string,tag:string}|null}
 */
function getCachedAllyById(id) {
    if (id === null || id === undefined) return null;
    for (const ally of getMapAlliesIndex().values()) {
        if (String(ally.id) === String(id)) return ally;
    }
    return null;
}

/**
 * Computes the "KXY" continent label from world coordinates (X_tens/Y_tens grid), e.g. 366|295 -> K23.
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
function computeContinent(x, y) {
    return 'K' + Math.floor(y / 100) + Math.floor(x / 100);
}

/**
 * Looks up a village's full cached record (id, name, owner, continent) by "X|Y" coordinates,
 * reading the raw 'map_villages' text directly (unlike getVillageIDByCoord's LRU-cached
 * id-only lookup in map.js, this is for the infrequent bbcode-resolution path).
 * @param {string|number} x
 * @param {string|number} y
 * @returns {{id:string,name:string,ownerId:string,x:string,y:string,continent:string}|null}
 */
function getCachedVillageByCoords(x, y) {
    const raw = mapDataGetRaw('map_villages');
    if (!raw) return null;

    const regex = new RegExp(`^(\\d+),([^,]+),${x},${y},(\\d+),`, 'm');
    const match = raw.match(regex);
    if (!match) return null;

    return {
        id: match[1],
        name: decodeMapEntryName(match[2]),
        ownerId: match[3],
        x: String(x),
        y: String(y),
        continent: computeContinent(Number(x), Number(y))
    };
}

/**
 * Calculates the Euclidean distance from the current village to a target coordinate.
 * @param {string} targetCoords - Target village in "X|Y" format.
 * @returns {number} Distance rounded to 2 decimal places.
 */
function calculateDistanceToTarget(targetCoords) {
    // 1. Get current village coordinates from game_data
    const currentCoords = game_data.village.coord; // Format: "454|369"

    // 2. Split both strings into X and Y arrays
    const [x1, y1] = currentCoords.split('|').map(Number);
    const [x2, y2] = targetCoords.split('|').map(Number);

    // 3. Apply the Pythagorean theorem: sqrt((x2-x1)^2 + (y2-y1)^2)
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 4. Return formatted to 2 decimal places (standard for TW)
    return parseFloat(distance.toFixed(2));
}
