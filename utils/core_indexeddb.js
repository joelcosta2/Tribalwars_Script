// IndexedDB-backed storage — localStorage has a small per-origin quota that becomes a real
// ceiling once an account has many villages/reports; IndexedDB does not.

const TW_DB_NAME = 'tw_premium_features';
const BUILD_QUEUE_STORE_NAME = 'build_queue';
const WORLD_REPORTS_STORE_NAME = 'world_reports';
const VILLAGE_NOTEPAD_STORE_NAME = 'village_notepad';
const MAP_DATA_STORE_NAME = 'map_data';
const ALLY_RESERVATIONS_STORE_NAME = 'ally_reservations';

var twDbPromise = null;
// One entry per village: { [villageId]: { building_queue, building_queue_active, ... } }
var buildQueueMemoryCache = {};
// One entry per village: { [villageId]: noteText }
var notepadMemoryCache = {};
// One entry per map/*.txt dump: { 'map_villages': rawText, 'map_players': rawText, 'map_allies': rawText }
var mapDataMemoryCache = {};
// One entry per reserved village: { [villageId]: { reservationId, villageId, coords, targetPlayerId, reservingPlayerId, reservingPlayerName, expiresAtMs } }
var allyReservationsMemoryCache = {};

/**
 * Opens (or returns the cached open) shared IndexedDB database used by all script features.
 * Creates any object store that doesn't exist yet — safe for both fresh installs and upgrades
 * from an earlier version that only had `build_queue`.
 * @returns {Promise<IDBDatabase>}
 */
function openTwDb() {
    if (twDbPromise) return twDbPromise;
    twDbPromise = new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            reject(new Error('IndexedDB unavailable'));
            return;
        }
        const request = indexedDB.open(TW_DB_NAME, 5);
        request.onupgradeneeded = function () {
            const db = request.result;
            if (!db.objectStoreNames.contains(BUILD_QUEUE_STORE_NAME)) {
                db.createObjectStore(BUILD_QUEUE_STORE_NAME);
            }
            if (!db.objectStoreNames.contains(WORLD_REPORTS_STORE_NAME)) {
                db.createObjectStore(WORLD_REPORTS_STORE_NAME);
            }
            if (!db.objectStoreNames.contains(VILLAGE_NOTEPAD_STORE_NAME)) {
                db.createObjectStore(VILLAGE_NOTEPAD_STORE_NAME);
            }
            if (!db.objectStoreNames.contains(MAP_DATA_STORE_NAME)) {
                db.createObjectStore(MAP_DATA_STORE_NAME);
            }
            if (!db.objectStoreNames.contains(ALLY_RESERVATIONS_STORE_NAME)) {
                db.createObjectStore(ALLY_RESERVATIONS_STORE_NAME);
            }
        };
        request.onsuccess = function () { resolve(request.result); };
        request.onerror = function () { reject(request.error); };
    });
    return twDbPromise;
}

/**
 * Writes a village's whole record to the build-queue IndexedDB store.
 * @param {string|number} villageId
 * @param {*} record
 * @returns {Promise<void>} Never rejects — persistence failures are logged, not thrown.
 */
function idbSet(villageId, record) {
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(BUILD_QUEUE_STORE_NAME, 'readwrite').objectStore(BUILD_QUEUE_STORE_NAME).put(record, villageId);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW BuildQueue] idbSet failed for village ' + villageId, e));
}

/**
 * Synchronous read of one field from a village's in-memory build-queue record — mirrors
 * localStorage.getItem's null-when-absent semantics so call sites need minimal changes.
 * @param {string} field - e.g. 'building_queue', 'waiting_for_queue'.
 * @param {string|number} [villageId] - Defaults to the currently loaded village.
 * @returns {*} The stored value (array/object/number/etc), or null if absent.
 */
function bqGet(field, villageId) {
    const vId = villageId || game_data?.village?.id || '_no_village';
    return buildQueueMemoryCache[vId]?.[field] ?? null;
}

/**
 * Synchronous write of one field into a village's in-memory build-queue record, persisting the
 * whole updated record to IndexedDB in the background (write-behind — callers don't wait).
 * IndexedDB uses the structured clone algorithm, so values are stored natively — no need to
 * JSON.stringify arrays/objects before passing them in (that was a localStorage-only concern).
 * @param {string} field
 * @param {string|number} [villageId] - Defaults to the currently loaded village.
 * @param {*} value - Any structured-clonable value (array, object, number, string, etc).
 */
function bqSet(field, villageId, value) {
    const vId = villageId || game_data?.village?.id || '_no_village';
    if (!buildQueueMemoryCache[vId]) buildQueueMemoryCache[vId] = {};
    buildQueueMemoryCache[vId][field] = value;
    idbSet(vId, buildQueueMemoryCache[vId]);
}

/**
 * Removes one field from a village's in-memory build-queue record, persisting the change.
 * @param {string} field
 * @param {string|number} [villageId] - Defaults to the currently loaded village.
 */
function bqRemove(field, villageId) {
    const vId = villageId || game_data?.village?.id || '_no_village';
    if (!buildQueueMemoryCache[vId]) return;
    delete buildQueueMemoryCache[vId][field];
    idbSet(vId, buildQueueMemoryCache[vId]);
}

/**
 * Loads every village's persisted build-queue record into the in-memory cache. Must complete
 * before any bqGet/bqSet call site runs (called once at boot, before restoreTimeouts()/start()).
 * @returns {Promise<void>} Resolves even if IndexedDB is unavailable (cache just stays empty).
 */
function hydrateBuildQueueCache() {
    return openTwDb().then(db => new Promise(resolve => {
        const store = db.transaction(BUILD_QUEUE_STORE_NAME, 'readonly').objectStore(BUILD_QUEUE_STORE_NAME);
        const keysRequest = store.getAllKeys();
        const valuesRequest = store.getAll();
        let pending = 2;
        let keys, values;
        function done() {
            pending--;
            if (pending === 0) {
                (keys || []).forEach((villageId, index) => { buildQueueMemoryCache[villageId] = values[index]; });
                migrateBuildQueueRecordsToNative();
                resolve();
            }
        }
        keysRequest.onsuccess = function () { keys = keysRequest.result; done(); };
        keysRequest.onerror = done;
        valuesRequest.onsuccess = function () { values = valuesRequest.result; done(); };
        valuesRequest.onerror = done;
    })).catch(e => console.warn('[TW BuildQueue] hydrateBuildQueueCache failed', e));
}

// Fields that used to be JSON.stringify'd before being stored (a leftover from the original
// localStorage-based implementation). Used by migrateBuildQueueRecordsToNative() below.
const BUILD_QUEUE_JSON_FIELDS = [
    'building_queue', 'building_queue_levels', 'building_queue_active',
    'building_queue_active_levels', 'building_queue_slots', 'nextLevelBuildsQueueInfo',
    'waiting_for_queue', 'queue_cancelIds'
];

/**
 * One-time, self-guarding migration: converts any legacy JSON-string field values (stored back
 * when this module still mirrored localStorage's string-only API) into their real parsed form,
 * then persists the migrated record back to IndexedDB. Safe to call on every hydration —
 * already-migrated fields simply aren't strings anymore, so they're skipped. Delete this (and
 * its call in hydrateBuildQueueCache) once confirmed no legacy string-encoded records remain.
 */
function migrateBuildQueueRecordsToNative() {
    Object.keys(buildQueueMemoryCache).forEach(villageId => {
        const record = buildQueueMemoryCache[villageId];
        if (!record) return;
        let changed = false;
        BUILD_QUEUE_JSON_FIELDS.forEach(field => {
            if (typeof record[field] === 'string') {
                try {
                    record[field] = JSON.parse(record[field]);
                    changed = true;
                } catch (e) {
                    console.warn('[TW BuildQueue] Failed to migrate field ' + field + ' for village ' + villageId, e);
                }
            }
        });
        if (changed) idbSet(villageId, record);
    });
}

// Prefixes of legacy per-village recruit/troops localStorage keys, now stored as
// unit_managers_costs/village_unit_counts/train_queue_data fields on the same per-village
// record used by the build queue (via bqGet/bqSet — these accessors aren't build-queue-only
// anymore, just generic per-village field storage). `unit_managers_meta` is NOT included here —
// it's global (not per-village) and stays on localStorage.
const RECRUIT_QUEUE_CLEANUP_FLAG = 'idb_rq_cleanup_v1_done';
const LEGACY_RECRUIT_QUEUE_KEY_PREFIXES = [
    'unit_managers_costs_', 'village_unit_counts_', 'train_queue_data_'
];

/**
 * One-time cleanup: deletes every legacy per-village recruit/troops localStorage key now that
 * this data lives in IndexedDB. Not a migration/copy (data is cheap to regenerate from the next
 * /train page visit) — just reclaims space. Guarded so it only ever runs once. Delete this (and
 * its call in init()) once confirmed no legacy keys remain.
 */
function cleanupLegacyRecruitQueueLocalStorage() {
    if (localStorage.getItem(RECRUIT_QUEUE_CLEANUP_FLAG)) return;
    Object.keys(localStorage).forEach(key => {
        if (LEGACY_RECRUIT_QUEUE_KEY_PREFIXES.some(prefix => key.startsWith(prefix))) {
            localStorage.removeItem(key);
        }
    });
    localStorage.setItem(RECRUIT_QUEUE_CLEANUP_FLAG, '1');
}

/**
 * Writes a single world coordinate's report record to the world_reports IndexedDB store.
 * @param {string} coords
 * @param {*} record
 * @returns {Promise<void>} Never rejects — persistence failures are logged, not thrown.
 */
function reportSet(coords, record) {
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(WORLD_REPORTS_STORE_NAME, 'readwrite').objectStore(WORLD_REPORTS_STORE_NAME).put(record, coords);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Reports] reportSet failed for ' + coords, e));
}

/**
 * Deletes a single world coordinate's report record (used by the 30-day pruning pass).
 * @param {string} coords
 * @returns {Promise<void>} Never rejects.
 */
function reportRemove(coords) {
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(WORLD_REPORTS_STORE_NAME, 'readwrite').objectStore(WORLD_REPORTS_STORE_NAME).delete(coords);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Reports] reportRemove failed for ' + coords, e));
}

/**
 * Reads every stored report record. Each record has `coords` denormalized into its own value,
 * so no key-pairing is needed (unlike hydrateBuildQueueCache, which stores fields without ids).
 * @returns {Promise<Array>} Resolves to [] if unavailable — never rejects.
 */
function reportGetAll() {
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(WORLD_REPORTS_STORE_NAME, 'readonly').objectStore(WORLD_REPORTS_STORE_NAME).getAll();
        request.onsuccess = function () { resolve(request.result || []); };
        request.onerror = function () { resolve([]); };
    })).catch(() => []);
}

// Legacy localStorage key holding the report list array (replaced by the world_reports store).
// `reports_last_fetch` is a tiny global timestamp, not per-coord — deliberately left untouched.
const REPORTS_CLEANUP_FLAG = 'idb_reports_cleanup_v1_done';

/**
 * One-time cleanup: deletes the old `reports_list` localStorage key now that report data lives
 * in IndexedDB, keyed by coordinate. Not a migration/copy — cached attack reports are cheap to
 * resync. Guarded so it only ever runs once. Delete this (and its call in init()) once confirmed
 * no legacy key remains.
 */
function cleanupLegacyReportsLocalStorage() {
    if (localStorage.getItem(REPORTS_CLEANUP_FLAG)) return;
    localStorage.removeItem('reports_list');
    localStorage.setItem(REPORTS_CLEANUP_FLAG, '1');
}

const NOTEPAD_CLEANUP_FLAG = 'idb_notepad_cleanup_v1_done';

/**
 * Returns the full in-memory notepad cache, keyed by village id.
 * @returns {{[villageId: string]: string}}
 */
function notepadGetAll() {
    return notepadMemoryCache;
}

/**
 * Reads one notepad entry from the in-memory cache.
 * @param {string|number} [villageId]
 * @returns {string}
 */
function notepadGet(villageId) {
    const vId = villageId || game_data?.village?.id || '_no_village';
    return notepadMemoryCache[vId] ?? '';
}

/**
 * Writes one village note to the cache and IndexedDB.
 * @param {string|number} villageId
 * @param {string} noteText
 * @returns {Promise<void>} Never rejects.
 */
function notepadSet(villageId, noteText) {
    const vId = String(villageId);
    if (noteText == null || noteText === '') {
        return notepadDelete(vId);
    }
    notepadMemoryCache[vId] = noteText;
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(VILLAGE_NOTEPAD_STORE_NAME, 'readwrite').objectStore(VILLAGE_NOTEPAD_STORE_NAME).put(noteText, vId);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Notepad] notepadSet failed for village ' + vId, e));
}

/**
 * Deletes one village note from the cache and IndexedDB.
 * @param {string|number} villageId
 * @returns {Promise<void>} Never rejects.
 */
function notepadDelete(villageId) {
    const vId = String(villageId);
    delete notepadMemoryCache[vId];
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(VILLAGE_NOTEPAD_STORE_NAME, 'readwrite').objectStore(VILLAGE_NOTEPAD_STORE_NAME).delete(vId);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Notepad] notepadDelete failed for village ' + vId, e));
}

/**
 * Replaces every notepad entry with the provided map and persists the full replacement.
 * @param {{[villageId: string]: string}} nextNotes
 * @returns {Promise<void>} Never rejects.
 */
function notepadReplaceAll(nextNotes) {
    const normalizedNotes = {};
    Object.keys(nextNotes || {}).forEach(villageId => {
        const noteText = nextNotes[villageId];
        if (typeof noteText === 'string' && noteText !== '') {
            normalizedNotes[String(villageId)] = noteText;
        }
    });

    Object.keys(notepadMemoryCache).forEach(key => delete notepadMemoryCache[key]);
    Object.assign(notepadMemoryCache, normalizedNotes);

    return openTwDb().then(db => new Promise(resolve => {
        const tx = db.transaction(VILLAGE_NOTEPAD_STORE_NAME, 'readwrite');
        const store = tx.objectStore(VILLAGE_NOTEPAD_STORE_NAME);

        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };

        const clearRequest = store.clear();
        clearRequest.onsuccess = function () {
            Object.entries(normalizedNotes).forEach(([villageId, noteText]) => {
                store.put(noteText, villageId);
            });
        };
        clearRequest.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Notepad] notepadReplaceAll failed', e));
}

/**
 * Hydrates the in-memory notepad cache from IndexedDB.
 * @returns {Promise<void>} Resolves even if IndexedDB is unavailable.
 */
function hydrateNotepadCache() {
    return openTwDb().then(db => new Promise(resolve => {
        const store = db.transaction(VILLAGE_NOTEPAD_STORE_NAME, 'readonly').objectStore(VILLAGE_NOTEPAD_STORE_NAME);
        const keysRequest = store.getAllKeys();
        const valuesRequest = store.getAll();
        let pending = 2;
        let keys, values;
        function done() {
            pending--;
            if (pending === 0) {
                Object.keys(notepadMemoryCache).forEach(key => delete notepadMemoryCache[key]);
                (keys || []).forEach((villageId, index) => {
                    const noteText = values[index];
                    if (noteText != null && noteText !== '') {
                        notepadMemoryCache[villageId] = noteText;
                    }
                });
                resolve();
            }
        }
        keysRequest.onsuccess = function () { keys = keysRequest.result; done(); };
        keysRequest.onerror = done;
        valuesRequest.onsuccess = function () { values = valuesRequest.result; done(); };
        valuesRequest.onerror = done;
    })).catch(e => console.warn('[TW Notepad] hydrateNotepadCache failed', e));
}

/**
 * One-time cleanup for the legacy localStorage-backed notepad key.
 * @returns {Promise<void>} Resolves even if IndexedDB is unavailable.
 */
function cleanupLegacyNotepadStorage() {
    if (localStorage.getItem(NOTEPAD_CLEANUP_FLAG)) return Promise.resolve();
    localStorage.removeItem('vilagges_notepad');
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(VILLAGE_NOTEPAD_STORE_NAME, 'readwrite').objectStore(VILLAGE_NOTEPAD_STORE_NAME).clear();
        request.onsuccess = function () {
            localStorage.setItem(NOTEPAD_CLEANUP_FLAG, '1');
            resolve();
        };
        request.onerror = function () {
            localStorage.setItem(NOTEPAD_CLEANUP_FLAG, '1');
            resolve();
        };
    })).catch(e => {
        console.warn('[TW Notepad] cleanupLegacyNotepadStorage failed', e);
        localStorage.setItem(NOTEPAD_CLEANUP_FLAG, '1');
    });
}

/**
 * Synchronous read of a cached map/*.txt raw-text dump from the in-memory cache — mirrors
 * localStorage.getItem's empty-string-when-absent semantics for drop-in replacement.
 * @param {string} key - e.g. 'map_villages', 'map_players', 'map_allies'.
 * @returns {string}
 */
function mapDataGetRaw(key) {
    return mapDataMemoryCache[key] || '';
}

/**
 * Writes a map/*.txt raw-text dump to the in-memory cache and IndexedDB (these dumps can be
 * several MB for large worlds — too big for localStorage's quota, hence IndexedDB here).
 * @param {string} key
 * @param {string} text
 * @returns {Promise<void>} Never rejects — persistence failures are logged, not thrown.
 */
function mapDataSet(key, text) {
    mapDataMemoryCache[key] = text;
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(MAP_DATA_STORE_NAME, 'readwrite').objectStore(MAP_DATA_STORE_NAME).put(text, key);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW MapData] mapDataSet failed for ' + key, e));
}

/**
 * Hydrates the in-memory map-data cache from IndexedDB. Must complete before any
 * mapDataGetRaw() call site runs (called once at boot, before start()).
 * @returns {Promise<void>} Resolves even if IndexedDB is unavailable.
 */
function hydrateMapDataCache() {
    return openTwDb().then(db => new Promise(resolve => {
        const store = db.transaction(MAP_DATA_STORE_NAME, 'readonly').objectStore(MAP_DATA_STORE_NAME);
        const keysRequest = store.getAllKeys();
        const valuesRequest = store.getAll();
        let pending = 2;
        let keys, values;
        function done() {
            pending--;
            if (pending === 0) {
                (keys || []).forEach((key, index) => { mapDataMemoryCache[key] = values[index]; });
                resolve();
            }
        }
        keysRequest.onsuccess = function () { keys = keysRequest.result; done(); };
        keysRequest.onerror = done;
        valuesRequest.onsuccess = function () { values = valuesRequest.result; done(); };
        valuesRequest.onerror = done;
    })).catch(e => console.warn('[TW MapData] hydrateMapDataCache failed', e));
}

const MAP_DATA_CLEANUP_FLAG = 'idb_map_data_cleanup_v1_done';

/**
 * One-time cleanup: deletes the legacy localStorage-backed map_villages/map_players/map_allies
 * raw-text keys (the original cause of the QuotaExceededError) now that this data lives in
 * IndexedDB. The small *_last_update timestamp keys are left untouched. Not a migration/copy —
 * these dumps are cheap to refetch from the server. Guarded so it only ever runs once.
 */
function cleanupLegacyMapDataLocalStorage() {
    if (localStorage.getItem(MAP_DATA_CLEANUP_FLAG)) return;
    ['map_villages', 'map_players', 'map_allies'].forEach(key => localStorage.removeItem(key));
    localStorage.setItem(MAP_DATA_CLEANUP_FLAG, '1');
}

/**
 * Returns the full in-memory ally-reservations cache, keyed by village id.
 * @returns {{[villageId: string]: {reservationId, villageId, coords, targetPlayerId, reservingPlayerId, reservingPlayerName, expiresAtMs}}}
 */
function reservationsGetAll() {
    return allyReservationsMemoryCache;
}

/**
 * Writes a single village's reservation record to the cache and IndexedDB — used for the
 * optimistic update right after the user reserves a village via the map context menu.
 * @param {string|number} villageId
 * @param {*} record
 * @returns {Promise<void>} Never rejects.
 */
function reservationSet(villageId, record) {
    const vId = String(villageId);
    allyReservationsMemoryCache[vId] = record;
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(ALLY_RESERVATIONS_STORE_NAME, 'readwrite').objectStore(ALLY_RESERVATIONS_STORE_NAME).put(record, vId);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Reservations] reservationSet failed for village ' + vId, e));
}

/**
 * Deletes a single village's reservation record from the cache and IndexedDB — used for the
 * optimistic update right after the user unreserves a village via the map context menu.
 * @param {string|number} villageId
 * @returns {Promise<void>} Never rejects.
 */
function reservationRemove(villageId) {
    const vId = String(villageId);
    delete allyReservationsMemoryCache[vId];
    return openTwDb().then(db => new Promise(resolve => {
        const request = db.transaction(ALLY_RESERVATIONS_STORE_NAME, 'readwrite').objectStore(ALLY_RESERVATIONS_STORE_NAME).delete(vId);
        request.onsuccess = function () { resolve(); };
        request.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Reservations] reservationRemove failed for village ' + vId, e));
}

/**
 * Replaces every cached reservation with the provided map and persists the full replacement —
 * used after each hourly full resync of the tribe's reservations list.
 * @param {{[villageId: string]: *}} nextReservations
 * @returns {Promise<void>} Never rejects.
 */
function reservationsReplaceAll(nextReservations) {
    const normalized = {};
    Object.keys(nextReservations || {}).forEach(villageId => {
        normalized[String(villageId)] = nextReservations[villageId];
    });

    Object.keys(allyReservationsMemoryCache).forEach(key => delete allyReservationsMemoryCache[key]);
    Object.assign(allyReservationsMemoryCache, normalized);

    return openTwDb().then(db => new Promise(resolve => {
        const tx = db.transaction(ALLY_RESERVATIONS_STORE_NAME, 'readwrite');
        const store = tx.objectStore(ALLY_RESERVATIONS_STORE_NAME);

        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };

        const clearRequest = store.clear();
        clearRequest.onsuccess = function () {
            Object.entries(normalized).forEach(([villageId, record]) => {
                store.put(record, villageId);
            });
        };
        clearRequest.onerror = function () { resolve(); };
    })).catch(e => console.warn('[TW Reservations] reservationsReplaceAll failed', e));
}

/**
 * Hydrates the in-memory ally-reservations cache from IndexedDB.
 * @returns {Promise<void>} Resolves even if IndexedDB is unavailable.
 */
function hydrateReservationsCache() {
    return openTwDb().then(db => new Promise(resolve => {
        const store = db.transaction(ALLY_RESERVATIONS_STORE_NAME, 'readonly').objectStore(ALLY_RESERVATIONS_STORE_NAME);
        const keysRequest = store.getAllKeys();
        const valuesRequest = store.getAll();
        let pending = 2;
        let keys, values;
        function done() {
            pending--;
            if (pending === 0) {
                Object.keys(allyReservationsMemoryCache).forEach(key => delete allyReservationsMemoryCache[key]);
                (keys || []).forEach((villageId, index) => { allyReservationsMemoryCache[villageId] = values[index]; });
                resolve();
            }
        }
        keysRequest.onsuccess = function () { keys = keysRequest.result; done(); };
        keysRequest.onerror = done;
        valuesRequest.onsuccess = function () { values = valuesRequest.result; done(); };
        valuesRequest.onerror = done;
    })).catch(e => console.warn('[TW Reservations] hydrateReservationsCache failed', e));
}
