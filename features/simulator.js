/**
 * 
 * Two-part feature:
 *   1. On screen=report (attack reports): injects a "Ver no Simulador" button.
 *      Clicking it saves attacker/defender troop counts, wall level, luck and morale
 *      to localStorage and redirects to the simulator with ?from_report=1.
 *
 *   2. On screen=place&mode=sim: if ?from_report=1 is present in the URL,
 *      reads the stored data and pre-fills the simulator form fields.
 */

var SIMULATOR_STORAGE_KEY = 'tw_report_to_simulator';
var SIMULATOR_FROM_REPORT_PARAM = 'from_report';
var SIMULATOR_BUTTON_LABEL = t('simulator.viewInSimulator');

/**
 * Parses unit quantities from a report unit table.
 * @param {string} tableSelector - CSS selector for the units table (e.g. '#attack_info_att_units')
 * @param {number} rowIndex      - 0-based row index within tbody: 0=header icons, 1=Quantidade, 2=Baixas
 * @returns {Object} map of unit name → count  e.g. { axe: 1500, light: 800, ... }
 */
function parseReportUnits(tableSelector, rowIndex) {
    var table = document.querySelector(tableSelector);
    if (!table) return {};
    var rows = table.querySelectorAll('tbody tr');
    if (!rows[rowIndex]) return {};
    var units = {};
    rows[rowIndex].querySelectorAll('[data-unit-count]').forEach(function (cell) {
        var match = cell.className.match(/unit-item-(\w+)/);
        if (match) {
            units[match[1]] = parseInt(cell.getAttribute('data-unit-count'), 10) || 0;
        }
    });
    return units;
}

/**
 * Parses defender troops that were away from the village at the time of the attack
 * (shown in the "Unidades fora da aldeia" / #attack_spy_away table, only visible
 * when a scout report reveals them). These are not part of the battle but should
 * still count toward the defender's total troops in the simulator.
 * @returns {Object} map of unit name → count
 */
function parseAwayUnits() {
    return parseReportUnits('#attack_spy_away table.vis', 1);
}

/**
 * Adds the counts from `source` into `target`, mutating and returning `target`.
 */
function mergeUnitCounts(target, source) {
    Object.keys(source).forEach(function (unit) {
        target[unit] = (target[unit] || 0) + source[unit];
    });
    return target;
}

/**
 * Parses the defender's wall level from the spy building tables
 * (#attack_spy_buildings_left / #attack_spy_buildings_right), which only
 * appear when a scout report reveals building levels.
 * @returns {number|null}
 */
function parseSpyWallLevel() {
    var tables = document.querySelectorAll('#attack_spy_buildings_left, #attack_spy_buildings_right');
    for (var t = 0; t < tables.length; t++) {
        var rows = tables[t].querySelectorAll('tr');
        for (var r = 0; r < rows.length; r++) {
            if (!rows[r].querySelector('img[src*="wall.webp"], img[src*="wall.png"]')) continue;
            var cells = rows[r].querySelectorAll('td');
            if (cells.length < 2) continue;
            var level = parseInt(cells[1].textContent.trim(), 10);
            if (!isNaN(level)) return level;
        }
    }
    return null;
}

/**
 * Returns true if the troops in the given table section were religious.
 * @param {string} tableSelector - '#attack_info_att' or '#attack_info_def'
 */
function parseReportReligion(tableSelector) {
    var table = document.querySelector(tableSelector);
    if (!table) return false;
    // The religion row has colspan=2. If it mentions "religi" the troops were religious
    // (TW only shows this row with a positive statement when troops are religious).
    var tds = table.querySelectorAll('td[colspan="2"]');
    for (var i = 0; i < tds.length; i++) {
        if (/religi/i.test(tds[i].textContent)) {
            return true;
        }
    }
    return false;
}

/**
 * Builds a map of { lowercaseLocalizedUnitName → internalUnitKey } from a report units table.
 * Uses the data-title attribute on the unit icon images and data-unit on the links.
 * e.g. { "lanceiro": "spear", "cavalaria leve": "light", "viking": "axe", ... }
 * @param {string} unitsTableId - e.g. 'attack_info_att_units' or 'attack_info_def_units'
 * @returns {Object}
 */
function buildUnitNameMap(unitsTableId) {
    var map = {};
    var table = document.getElementById(unitsTableId);
    if (!table) return map;
    var headerRow = table.querySelector('tbody tr.center');
    if (!headerRow) return map;
    headerRow.querySelectorAll('a.unit_link[data-unit]').forEach(function (link) {
        var img = link.querySelector('img[data-title]');
        if (img && img.dataset.title) {
            map[img.dataset.title.toLowerCase()] = link.dataset.unit;
        }
    });
    return map;
}

/**
 * Parses buff lines from the "Buffs:" row of a report table section.
 * Each returned object has: { label, value, attackBonus, defenseBonus, unitKey }
 * unitKey is resolved dynamically from the localized unit names in the same table section.
 * @param {string} tableSelector - '#attack_info_att' or '#attack_info_def'
 * @returns {Array}
 */
function parseReportBuffs(tableSelector) {
    var table = document.querySelector(tableSelector);
    if (!table) return [];

    // Build localized-name → internal-key map from the units table in this section
    var unitsTableId = tableSelector.replace('#', '') + '_units';
    var unitNameMap = buildUnitNameMap(unitsTableId);
    // Sort names longest-first to avoid "arqueiro" matching before "arqueiro a cavalo"
    var sortedNames = Object.keys(unitNameMap).sort(function (a, b) { return b.length - a.length; });

    var buffs = [];
    var rows = table.querySelectorAll('tr');
    rows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        if (cells.length >= 2 && /^buffs/i.test(cells[0].textContent.trim())) {
            var html = cells[1].innerHTML;
            var lines = html.split(/<br\s*\/?>/i).map(function (l) {
                return l.replace(/<[^>]+>/g, '').trim();
            }).filter(function (l) { return l.length > 0; });

            lines.forEach(function (line) {
                var lower = line.toLowerCase();
                var valueMatch = line.match(/\+(\d+(?:\.\d+)?)%/);
                var value = valueMatch ? parseFloat(valueMatch[1]) : 0;

                // Resolve unit key from localized name
                var unitKey = null;
                for (var i = 0; i < sortedNames.length; i++) {
                    if (lower.indexOf(sortedNames[i]) !== -1) {
                        unitKey = unitNameMap[sortedNames[i]];
                        break;
                    }
                }

                buffs.push({
                    label:   line,
                    value:   value,
                    unitKey: unitKey
                });
            });
        }
    });
    return buffs;
}

/**
 * Applies parsed report buffs as simulator benefits.
 * Uses TW's own `create_benefit` AJAX endpoint (same as BenefitCreator.finishBenefit) so
 * the returned objects have the correct server-side fields for the simulation calculation.
 * Falls back to display-only (Simulator.addBenefit with instance only) if AJAX fails.
 *
 * @param {string} side   - 'att' or 'def'
 * @param {Array}  buffs  - array of { label, value, attackBonus, defenseBonus }
 */
function applySimulatorBenefits(side, buffs) {
    var sideKey = side === 'att' ? 'attacker' : 'defender';

    // TW globals live on the PAGE window (unsafeWindow), not the userscript sandbox
    var _win       = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    var _Simulator = _win.Simulator;
    var _Format    = _win.Format;
    var _gameData  = _win.game_data || (typeof game_data !== 'undefined' ? game_data : null);

    if (!_Simulator || typeof _Simulator.addBenefit !== 'function') return;

    var csrf      = _gameData && _gameData.csrf    ? _gameData.csrf       : '';
    var villageId = _gameData && _gameData.village ? _gameData.village.id : '';
    var url = location.protocol + '//' + location.host
            + '/game.php?village=' + villageId + '&screen=place&ajax=create_benefit';

    // The side determines the stat: attacker buffs → 'attack', defender buffs → 'defense'
    var stat = (sideKey === 'attacker') ? 'attack' : 'defense';

    // Build a flat queue of all requests to make.
    // Sending them all at once causes 405 (TW rejects concurrent create_benefit calls).
    var queue = [];

    buffs.forEach(function (b) {
        var unitKey = b.unitKey || null;
        var iconPath = 'graphic/unit/unit_' + (unitKey || 'knight') + '.webp';
        var iconSrc  = (_Format && typeof _Format.image_src === 'function')
            ? _Format.image_src(iconPath) : iconPath;

        queue.push({
            label:   b.label,
            iconSrc: iconSrc,
            unitKey: unitKey,
            stat:    stat,
            value:   Math.round(b.value)
        });
    });

    // Execute queue sequentially: wait for each request to finish before sending the next.
    // This prevents the 405 errors caused by concurrent create_benefit calls.
    function processNext(idx) {
        if (idx >= queue.length) return;
        var item = queue[idx];
        var next = function () { processNext(idx + 1); };

        // Confirmed working body format (from network capture):
        //   inputs[0] = percentage value  (integer)
        //   inputs[1] = unit key          (e.g. "axe")
        //   inputs[2] = stat              ("attack" or "defense")
        //   h         = CSRF token
        var body = 'side='          + encodeURIComponent(sideKey)
                 + '&type=b_unitstat'
                 + '&inputs%5B%5D=' + encodeURIComponent(item.value)
                 + '&inputs%5B%5D=' + encodeURIComponent(item.unitKey || '')
                 + '&inputs%5B%5D=' + encodeURIComponent(item.stat)
                 + '&h='           + encodeURIComponent(csrf);

        fetch(url, {
            method:      'POST',
            credentials: 'include',
            headers: {
                'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
                'tribalwars-ajax':  '1',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: body
        })
        .then(function (resp) { return resp.json(); })
        .then(function (json) {
            var benefit = json && json.response && json.response.benefit;
            if (benefit) {
                _Simulator.addBenefit(benefit, sideKey);
            } else {
                _Simulator.addBenefit({ instance: { description: item.label, icon_src: item.iconSrc } }, sideKey);
            }
            next();
        })
        .catch(function () {
            _Simulator.addBenefit({ instance: { description: item.label, icon_src: item.iconSrc } }, sideKey);
            next();
        });
    }

    processNext(0);
}

/**
 * Injects a "Ver no Simulador" button into an attack report page.
 * Saves parsed report data to localStorage, then navigates to the simulator.
 */
function injectReportToSimulatorButton() {
    // Only inject on single attack report views (need the attacker unit table present)
    if (!document.getElementById('attack_info_att_units')) return;

    // --- Parse troop quantities (row index 1 = "Quantidade") ---
    var attUnits = parseReportUnits('#attack_info_att_units', 1);
    var defUnits = parseReportUnits('#attack_info_def_units', 1);

    // --- Add defender troops that were away from the village (not part of the battle) ---
    mergeUnitCounts(defUnits, parseAwayUnits());

    // --- Parse luck from #attack_luck ---
    var luck = '0';
    var luckBold = document.querySelector('#attack_luck b');
    if (luckBold) {
        luck = luckBold.textContent.replace('%', '').trim();
    }

    // --- Parse morale from the overlay <h4> ---
    var morale = '100';
    var overlay = document.querySelector('.report_transparent_overlay');
    if (overlay) {
        var h4s = overlay.querySelectorAll('h4');
        h4s.forEach(function (h4) {
            if (/moral/i.test(h4.textContent)) {
                var moraleMatch = h4.textContent.match(/(\d+)/);
                if (moraleMatch) morale = moraleMatch[1];
            }
        });
    }

    // --- Parse religion: check if each side's troops were religious ---
    var attReligious = parseReportReligion('#attack_info_att');
    var defReligious = parseReportReligion('#attack_info_def');

    // --- Parse buff lines for each side ---
    var attBuffs = parseReportBuffs('#attack_info_att');
    var defBuffs = parseReportBuffs('#attack_info_def');

    // --- Parse defender wall level from the spy report ---
    var wallLevel = parseSpyWallLevel();

    // --- Build the redirect URL ---
    var villageId = (typeof game_data !== 'undefined' && game_data.village) ? game_data.village.id : '';
    var simUrl = '/game.php?village=' + villageId + '&screen=place&mode=sim&' + SIMULATOR_FROM_REPORT_PARAM + '=1';

    var reportData = {
        attUnits: attUnits,
        defUnits: defUnits,
        luck: luck,
        morale: morale,
        attReligious: attReligious,
        defReligious: defReligious,
        attBuffs: attBuffs,
        defBuffs: defBuffs,
        wallLevel: wallLevel
    };

    // --- Create the button ---
    var btn = document.createElement('a');
    btn.href = '#';
    btn.className = 'btn btn-default';
    btn.textContent = SIMULATOR_BUTTON_LABEL;
    btn.style.cssText = 'margin: 6px 0; display: inline-block;';

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.setItem(SIMULATOR_STORAGE_KEY, JSON.stringify(reportData));
        window.location.href = simUrl;
    });

    // --- Inject the button ---
    // Try to place it right before .no-preview (which holds the "Publicar" link)
    var noPreview = document.querySelector('.no-preview');
    if (noPreview && noPreview.parentNode) {
        var wrapper = document.createElement('p');
        wrapper.style.cssText = 'margin: 4px 0; padding: 0 4px;';
        wrapper.appendChild(btn);
        noPreview.parentNode.insertBefore(wrapper, noPreview);
        return;
    }

    // Fallback: append after #attack_info table
    var attackInfo = document.getElementById('attack_info');
    if (attackInfo && attackInfo.parentNode) {
        var wrapper2 = document.createElement('p');
        wrapper2.style.cssText = 'margin: 4px 0; padding: 0 4px;';
        wrapper2.appendChild(btn);
        attackInfo.insertAdjacentElement('afterend', wrapper2);
    }
}

/**
 * On the simulator page, checks for ?from_report=1 in the URL.
 * If present, reads stored report data from localStorage and pre-fills the form.
 */
function injectSimulatorPrefill() {
    var urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get(SIMULATOR_FROM_REPORT_PARAM)) return;

    var raw = localStorage.getItem(SIMULATOR_STORAGE_KEY);
    if (!raw) return;

    var data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        return;
    }

    function fillSimulatorForm() {
        var form = document.getElementById('simulator_form');
        if (!form) return;

        // Fill attacker units
        if (data.attUnits) {
            Object.keys(data.attUnits).forEach(function (unit) {
                var count = data.attUnits[unit];
                if (count > 0) {
                    var input = form.querySelector('input[name="att_' + unit + '"]');
                    if (input) input.value = count;
                }
            });
        }

        // Fill defender units
        if (data.defUnits) {
            Object.keys(data.defUnits).forEach(function (unit) {
                var count = data.defUnits[unit];
                if (count > 0) {
                    var input = form.querySelector('input[name="def_' + unit + '"]');
                    if (input) input.value = count;
                }
            });
        }

        // Fill luck
        if (data.luck !== undefined) {
            var luckInput = form.querySelector('input[name="luck"]');
            if (luckInput) luckInput.value = data.luck;
        }

        // Fill morale
        if (data.morale !== undefined) {
            var moraleInput = document.getElementById('moral') || form.querySelector('input[name="moral"]');
            if (moraleInput) moraleInput.value = data.morale;
        }

        // Fill defender wall level
        if (data.wallLevel !== null && data.wallLevel !== undefined) {
            var wallInput = form.querySelector('input[name="def_wall"], select[name="def_wall"]');
            if (wallInput) wallInput.value = data.wallLevel;
        }

        // Fill religion checkboxes
        if (data.attReligious) {
            var beliefAtt = form.querySelector('input[name="belief_att"]');
            if (beliefAtt) beliefAtt.checked = true;
        }
        if (data.defReligious) {
            var beliefDef = form.querySelector('input[name="belief_def"]');
            if (beliefDef) beliefDef.checked = true;
        }

        // Fill benefits (buffs)
        if (data.attBuffs && data.attBuffs.length > 0) {
            applySimulatorBenefits('att', data.attBuffs);
        }
        if (data.defBuffs && data.defBuffs.length > 0) {
            applySimulatorBenefits('def', data.defBuffs);
        }

        // Clean up storage after use
        localStorage.removeItem(SIMULATOR_STORAGE_KEY);
    }

    // The form should already be in the DOM on this page, but wait for DOMContentLoaded just in case
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fillSimulatorForm);
    } else {
        fillSimulatorForm();
    }
}
