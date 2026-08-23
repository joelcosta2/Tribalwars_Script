// Feature: Player Profile TWStats History
// Injects the player's TWStats history table (points/villages/OD evolution over time) into the
// native "screen=info_player" page, placed at the top of the right-hand column (next to the
// achievements/awards section).
// Data is fetched cross-origin via gmFetch (GM_xmlhttpRequest, see util/core_utils.user.js) and cached
// in localStorage for TWSTATS_CACHE_TTL_MS to avoid hammering twstats.com on every page load.
//
// Note: we intentionally avoid parsing TWStats by matching localized (PT) label text — that's
// fragile and breaks silently if TWStats changes its wording or the player views the site in a
// different language. Instead we grab the whole `table#history` element by its structural id,
// which TWStats keeps consistent across languages/worlds, and embed it as-is.

var TWSTATS_CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes

/**
 * Builds the TWStats player profile URL (info tab) for the current world/market.
 * Used only for the "view full profile" link shown above the history table.
 * @param {string|number} playerId
 * @returns {string|null} Full URL, or null if world/market can't be determined.
 */
function getTWStatsPlayerUrl(playerId) {
    var world = game_data && game_data.world;
    var market = (game_data && game_data.market) || (world ? world.replace(/\d+$/, '') : null);

    if (!world || !market) {
        console.warn('[TW PlayerProfile] Cannot determine world/market from game_data — skipping fetch');
        return null;
    }

    return 'https://' + market + '.twstats.com/' + world + '/index.php?page=player&id=' + playerId;
}

/**
 * Builds the TWStats player history URL (daily view) for the current world/market.
 * Mirrors the same market/world detection used by fetchAndCacheBuildingsData() in core_utils.
 * @param {string|number} playerId
 * @returns {string|null} Full URL, or null if world/market can't be determined.
 */
function getTWStatsPlayerHistoryUrl(playerId) {
    var world = game_data && game_data.world;
    var market = (game_data && game_data.market) || (world ? world.replace(/\d+$/, '') : null);

    if (!world || !market) {
        console.warn('[TW PlayerProfile] Cannot determine world/market from game_data — skipping fetch');
        return null;
    }

    return 'https://' + market + '.twstats.com/' + world + '/index.php?page=player&id=' + playerId + '&tab=history&view=daily';
}

/**
 * Locates the right-hand column of the native player page (the one holding the
 * achievements/".award-group" blocks) so we can insert our history table at its top.
 * Falls back to the sibling <td> of the #player_info table if no award group is present
 * (e.g. a player with no achievements yet).
 * @returns {{ container: Element, before: Node|null }|null}
 */
function getPlayerProfileRightColumn() {
    var anchor = document.querySelector('.award-group');
    if (anchor && anchor.parentElement) {
        return { container: anchor.parentElement, before: anchor };
    }

    var playerInfoTable = document.getElementById('player_info');
    var leftTd = playerInfoTable && playerInfoTable.closest('td');
    var rightTd = leftTd && leftTd.nextElementSibling;
    if (rightTd) {
        return { container: rightTd, before: rightTd.firstChild };
    }

    return null;
}

/**
 * Creates (once) the wrapper holding the TWStats history table, inserted at the top of the
 * right-hand column. Safe to call repeatedly — reuses the existing wrapper.
 * @param {string} profileUrl - Link to the full TWStats profile (opens in a new tab).
 * @returns {Element|null}
 */
function ensureTWStatsHistoryContainer(profileUrl) {
    var wrapper = document.getElementById('twstats_player_history');

    if (!wrapper) {
        var target = getPlayerProfileRightColumn();
        if (!target) return null;

        wrapper = document.createElement('div');
        wrapper.id = 'twstats_player_history';
        wrapper.style.marginBottom = '10px';
        wrapper.innerHTML = '<table class="vis" width="100%"><tbody>' +
            '<tr><th>TWStats<a href="' + profileUrl + '" target="_blank" class="float_right" id="twstats_player_link">' + t('playerProfile.openProfile') + '</a></th></tr>' +
            '</tbody></table>';

        target.container.insertBefore(wrapper, target.before || null);
    } else {
        var link = wrapper.querySelector('#twstats_player_link');
        if (link) link.href = profileUrl;
    }

    return wrapper;
}

/**
 * Renders the fetched TWStats `table#history` element into the wrapper, replacing any
 * previously rendered table (e.g. stale cached data followed by a fresh fetch). Relative
 * links inside the table are rewritten to absolute twstats.com URLs opening in a new tab.
 * @param {Element|null} historyTableEl - The `table#history` element scraped from TWStats, or null.
 * @param {string} profileUrl
 * @param {string} historyPageUrl - URL the table was fetched from, used to resolve relative links.
 */
function renderTWStatsPlayerHistory(historyTableEl, profileUrl, historyPageUrl) {
    var wrapper = ensureTWStatsHistoryContainer(profileUrl);
    if (!wrapper) return;

    var existingTable = wrapper.querySelector('table[data-twstats-history]');
    if (existingTable) existingTable.remove();

    if (!historyTableEl) {
        wrapper.remove(); // nothing to show (e.g. TWStats hasn't indexed this player yet)
        return;
    }

    var clone = historyTableEl.cloneNode(true);
    clone.removeAttribute('id'); // avoid clashing with a real #history id already on this page
    clone.setAttribute('data-twstats-history', '1');
    clone.style.width = '100%';
    clone.style.marginTop = '0';

    clone.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href) return;
        try {
            a.setAttribute('href', new URL(href, historyPageUrl).href);
        } catch (e) { /* leave malformed hrefs untouched */ }
        a.setAttribute('target', '_blank');
    });

    wrapper.appendChild(clone);
}

/**
 * Entry point for the "screen=info_player" page. Reads cached TWStats history (rendering it
 * immediately if present) then re-fetches in the background once TWSTATS_CACHE_TTL_MS has
 * elapsed, so the page stays fast while data stays reasonably fresh.
 */
async function injectPlayerProfileTWStats() {
    var playerInfoTable = document.getElementById('player_info');
    if (!playerInfoTable) return; // e.g. mode=awards / mode=stats_own tabs don't have this table

    var urlParams = new URLSearchParams(window.location.search);
    var playerId = urlParams.get('id') || (game_data.player && game_data.player.id);
    if (!playerId) return;

    var profileUrl = getTWStatsPlayerUrl(playerId);
    var historyPageUrl = getTWStatsPlayerHistoryUrl(playerId);
    if (!profileUrl || !historyPageUrl) return;

    var cacheKey = 'twstats_player_history_' + playerId;
    var cached = null;
    try {
        cached = JSON.parse(localStorage.getItem(cacheKey));
    } catch (e) {
        cached = null;
    }

    if (cached && cached.html) {
        var cachedTable = new DOMParser().parseFromString(cached.html, 'text/html').querySelector('table');
        renderTWStatsPlayerHistory(cachedTable, profileUrl, historyPageUrl);
        if ((Date.now() - cached.timestamp) < TWSTATS_CACHE_TTL_MS) {
            return; // cache is fresh enough, skip the network round-trip entirely
        }
    }

    try {
        var html = await gmFetch(historyPageUrl);
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var historyTableEl = doc.querySelector('table#history');

        // TODO: change caching to use GM.setValue() instead of localStorage, because os storage max constrains. This will require refactoring the caching logic to be async as well.
        /* localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            html: historyTableEl ? historyTableEl.outerHTML : null
        })); */
        renderTWStatsPlayerHistory(historyTableEl, profileUrl, historyPageUrl);
    } catch (e) {
        console.warn('[TW PlayerProfile] Failed to fetch TWStats data:', e.message);
    }
}
