// Feature: Player Profile TWStats info
// Injects extra player stats (sourced from TWStats) into the native "screen=info_player" page,
// right after the native #player_info table (same table used both for your own profile and for
// other players' profiles — the TWStats external link already lives inside it).
// Data is fetched cross-origin via gmFetch (GM_xmlhttpRequest, see util/core_utils.user.js) and cached
// in localStorage for TWSTATS_CACHE_TTL_MS to avoid hammering twstats.com on every page load.

var TWSTATS_CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes

// Labels we care about from the TWStats profile page (PT-BR/PT-PT wording), mapped to
// a shorter label used in our own rendered table. Fields already shown natively on the
// TribalWars page (Pontos, Classificação, Tribo, Aldeias) are intentionally left out.
var TWSTATS_PLAYER_FIELDS = [
    { key: 'Pontos médios por aldeia:', label: 'Pontos médios/aldeia' },
    { key: 'Mudanças de tribo:', label: 'Mudanças de tribo' },
    { key: 'Conquistas:', label: 'Conquistas (+ganhas -perdidas)' },
    { key: 'Data de ingresso:', label: 'Data de ingresso no mundo' },
    { key: 'Melhor classificação:', label: 'Melhor classificação (histórico)' },
    { key: 'Maior número de pontos:', label: 'Maior número de pontos' },
    { key: 'Maior número de aldeias:', label: 'Maior número de aldeias' },
    { key: 'Posição OD:', label: 'Posição OD (total)' },
    { key: 'Posição OD de Ataque:', label: 'Posição OD Ataque' },
    { key: 'Posição OD de Defesa:', label: 'Posição OD Defesa' },
    { key: 'Outros mundos do jogador:', label: 'Também joga em' },
    { key: 'Mundos em que o jogador já teve conta (contas apagadas):', label: 'Contas apagadas em' }
];

/**
 * Builds the TWStats player profile URL for the current world/market.
 * Mirrors the same market/world detection used by fetchAndCacheBuildingsData() in core_utils.
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
 * Parses a TWStats player profile page into a generic { "Label:": "Value" } map.
 * Works on any simple two-column key/value table, regardless of table class/id,
 * so it survives minor markup changes on TWStats' side.
 * @param {Document} doc - Parsed HTML of the TWStats player page.
 * @returns {Object}
 */
function parseTWStatsPlayerPage(doc) {
    var data = {};
    var rows = doc.querySelectorAll('table tr');

    rows.forEach(function (row) {
        var cells = row.querySelectorAll('td, th');
        if (cells.length < 2) return;

        var label = cells[0].textContent.trim();
        if (!label.endsWith(':')) return;

        data[label] = cells[1].textContent.trim().replace(/\s+/g, ' ');
    });

    return data;
}

/**
 * Creates (once) the extra "TWStats" table right after the native #player_info table,
 * and returns its <table> element. Safe to call repeatedly — reuses the existing table.
 * @param {Element} playerInfoTable - The native #player_info table element.
 * @param {string} profileUrl - Link to the full TWStats profile (opens in a new tab).
 * @returns {Element}
 */
function ensureTWStatsPlayerContainer(playerInfoTable, profileUrl) {
    var table = document.getElementById('twstats_player_info');

    if (!table) {
        playerInfoTable.insertAdjacentHTML('afterend', '<br><table class="vis" id="twstats_player_info" width="100%"><tbody>' +
            '<tr><th colspan="2">TWStats<a href="' + profileUrl + '" target="_blank" class="float_right" id="twstats_player_link">Ver perfil completo</a></th></tr>' +
            '</tbody></table>');
        table = document.getElementById('twstats_player_info');
    } else {
        var link = table.querySelector('#twstats_player_link');
        if (link) link.href = profileUrl;
    }

    return table;
}

/**
 * Renders the parsed TWStats data into the extra table, replacing any previously
 * rendered rows (e.g. stale cached data followed by a fresh fetch).
 * @param {Element} playerInfoTable
 * @param {Object} data - Output of parseTWStatsPlayerPage().
 * @param {string} profileUrl
 */
function renderTWStatsPlayerInfo(playerInfoTable, data, profileUrl) {
    var table = ensureTWStatsPlayerContainer(playerInfoTable, profileUrl);
    var tbody = table.querySelector('tbody');

    tbody.querySelectorAll('tr[data-twstats-row]').forEach(function (tr) {
        tr.remove();
    });

    var rendered = 0;
    TWSTATS_PLAYER_FIELDS.forEach(function (field) {
        var value = data[field.key];
        if (!value) return;

        var tr = document.createElement('tr');
        tr.setAttribute('data-twstats-row', '1');
        tr.innerHTML = '<td>' + field.label + ':</td><td>' + value + '</td>';
        tbody.appendChild(tr);
        rendered++;
    });

    // Nothing useful to show (e.g. TWStats hasn't indexed this player yet) — remove the table.
    if (rendered === 0) {
        var prev = table.previousElementSibling;
        if (prev && prev.tagName === 'BR') prev.remove();
        table.remove();
    }
}

/**
 * Entry point for the "screen=info_player" page. Reads cached TWStats data (rendering it
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
    if (!profileUrl) return;

    var cacheKey = 'twstats_player_' + playerId;
    var cached = null;
    try {
        cached = JSON.parse(localStorage.getItem(cacheKey));
    } catch (e) {
        cached = null;
    }

    if (cached && cached.data) {
        renderTWStatsPlayerInfo(playerInfoTable, cached.data, profileUrl);
        if ((Date.now() - cached.timestamp) < TWSTATS_CACHE_TTL_MS) {
            return; // cache is fresh enough, skip the network round-trip entirely
        }
    }

    try {
        var html = await gmFetch(profileUrl);
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var data = parseTWStatsPlayerPage(doc);

        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data }));
        renderTWStatsPlayerInfo(playerInfoTable, data, profileUrl);
    } catch (e) {
        console.warn('[TW PlayerProfile] Failed to fetch TWStats data:', e.message);
    }
}
