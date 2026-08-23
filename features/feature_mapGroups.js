// Custom Map Village Color Groups
// Lets non-premium accounts recolor arbitrary villages on the world map by defining
// named groups (matched by village coordinates, player names or tribe tags), managed
// from a popup opened through a new row injected into the native #map_legend.

const _CUSTOM_MAP_GROUPS_STORAGE_PREFIX = 'twpf_custom_map_groups_v1';

/**
 * Returns the localStorage key for this account's custom map groups, scoped per world+player
 * so groups don't leak across different accounts/worlds sharing the same browser profile.
 */
function getCustomMapGroupsStorageKey() {
    const world = game_data?.world || window.location.hostname || 'unknown_world';
    const player = game_data?.player?.id || 'unknown_player';
    return `${_CUSTOM_MAP_GROUPS_STORAGE_PREFIX}_${world}_${player}`;
}

// In-memory cache of the parsed groups array; null until first load.
let _customMapGroupsCache = null;
// Lowercased/trimmed value Set per group id, rebuilt whenever groups change — keeps matching O(1).
let _customMapGroupsLookup = new Map();

/**
 * Loads (and caches) the ordered list of custom map groups. Array order is priority:
 * the first active group that matches a village wins.
 * @returns {Array<{id:string, name:string, color:string, active:boolean, matchType:'villages'|'players'|'tribes', values:string[]}>}
 */
function loadCustomMapGroups() {
    if (_customMapGroupsCache) return _customMapGroupsCache;

    let groups = [];
    try {
        const raw = localStorage.getItem(getCustomMapGroupsStorageKey());
        const parsed = raw ? JSON.parse(raw) : [];
        groups = Array.isArray(parsed) ? parsed : [];
    } catch {
        groups = [];
    }

    _customMapGroupsCache = groups;
    rebuildCustomMapGroupsLookup(groups);
    return groups;
}

/**
 * Persists the groups array and refreshes every dependent piece of UI/state:
 * the match lookup, the legend row and the actual village colors on the map.
 * @param {Array} groups
 */
function saveCustomMapGroups(groups) {
    _customMapGroupsCache = groups;
    localStorage.setItem(getCustomMapGroupsStorageKey(), JSON.stringify(groups));
    rebuildCustomMapGroupsLookup(groups);
    renderCustomMapGroupsLegend();
    applyCustomMapGroupColors();
}

/**
 * Rebuilds the per-group normalized (lowercase, trimmed) value Sets used for matching.
 * @param {Array} groups
 */
function rebuildCustomMapGroupsLookup(groups) {
    _customMapGroupsLookup = new Map();
    groups.forEach(group => {
        const set = new Set((group.values || []).map(v => String(v).trim().toLowerCase()).filter(Boolean));
        _customMapGroupsLookup.set(group.id, set);
    });
}

/**
 * Converts a "#rrggbb" hex string into a CSS rgb(...) string.
 * @param {string} hex
 * @returns {string}
 */
function hexToRgbString(hex) {
    const clean = (hex || '').replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgb(${r},${g},${b})`;
}

/**
 * Converts an rgb(...) color string into a translucent rgba(...) string.
 * @param {string} rgb
 * @param {number} alpha
 * @returns {string}
 */
function rgbToRgbaString(rgb, alpha = 0.35) {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (!match) return rgb;
    return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`;
}

/**
 * Resolves the CSS color for a village based on the first matching active custom group
 * (array order = priority), or null if no active group matches.
 * @param {Object} village - A TWMap.villages entry (has owner, ally_id, xy, ...).
 * @returns {string|null}
 */
function resolveVillageGroupColor(village) {
    const groups = loadCustomMapGroups();

    for (const group of groups) {
        if (!group.active) continue;
        const values = _customMapGroupsLookup.get(group.id);
        if (!values || !values.size) continue;

        let matched = false;
        if (group.matchType === 'villages') {
            const x = Math.floor(village.xy / 1000);
            const y = village.xy % 1000;
            matched = values.has(`${x}|${y}`);
        } else if (group.matchType === 'players') {
            const ownerName = TWMap.players?.[village.owner]?.name;
            matched = !!ownerName && values.has(ownerName.trim().toLowerCase());
        } else if (group.matchType === 'tribes') {
            const tag = TWMap.allies?.[village.ally_id]?.tag;
            matched = !!tag && values.has(tag.trim().toLowerCase());
        }

        if (matched) return hexToRgbString(group.color);
    }

    return null;
}

const CUSTOM_MAP_GROUP_OVERLAY_CLASS = 'custom-map-group-overlay';

function removeCustomMapGroupOverlays() {
    document.querySelectorAll('.' + CUSTOM_MAP_GROUP_OVERLAY_CLASS).forEach(el => el.remove());
}

function addCustomMapGroupOverlay(village, color) {
    const villageElement = document.getElementById('map_village_' + village.id);
    if (!villageElement || !villageElement.parentNode) return;

    const existingOverlay = document.getElementById('custom_map_group_overlay_' + village.id);
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom_map_group_overlay_' + village.id;
    overlay.className = CUSTOM_MAP_GROUP_OVERLAY_CLASS;
    Object.assign(overlay.style, {
        position: 'absolute',
        top: villageElement.style.top,
        left: villageElement.style.left,
        width: '53px',
        height: '38px',
        backgroundColor: rgbToRgbaString(color, 0.35),
        zIndex: '4',
        pointerEvents: 'none'
    });

    villageElement.parentNode.insertBefore(overlay, villageElement.nextSibling);
}

// Set once installMapHighlighterHook() runs; lets us repaint with native colors on demand.
let _origColorVillage = null;

/**
 * Wraps MapHighlighter.colorVillage so every native recolor (initial load, drag redraw,
 * hover-driven refresh) is immediately followed by our own custom-group paint-over.
 * This bypasses TWMap.getColorByPlayer's own-village exclusion for villageColors, since we
 * apply the CSS ourselves after the native call runs, regardless of village ownership.
 */
function installMapHighlighterHook() {
    if (typeof MapHighlighter === 'undefined' || _origColorVillage) return;

    _origColorVillage = MapHighlighter.colorVillage.bind(MapHighlighter);
    MapHighlighter.colorVillage = function (village) {
        _origColorVillage(village);

        const color = resolveVillageGroupColor(village);
        if (!color) return;

        addCustomMapGroupOverlay(village, color);
    };
}

/**
 * Repaints every currently loaded village according to the active custom groups.
 * Relies on the MapHighlighter.colorVillage wrapper above to do the actual painting.
 */
function applyCustomMapGroupColors() {
    if (typeof TWMap === 'undefined' || typeof MapHighlighter === 'undefined' || !TWMap.villages) return;
    removeCustomMapGroupOverlays();
    Object.values(TWMap.villages).forEach(village => MapHighlighter.colorVillage(village));
}

/**
 * Repaints every loaded village using ONLY the native color logic, bypassing our override.
 * Used when the master toggle is switched off, so colors revert instantly without a reload.
 */
function restoreNativeMapColors() {
    if (!_origColorVillage || !TWMap?.villages) return;
    removeCustomMapGroupOverlays();
    Object.values(TWMap.villages).forEach(village => _origColorVillage(village));
}

const CUSTOM_MAP_GROUPS_LEGEND_ROW_ID = 'map_legend_custom_groups_row';

/**
 * (Re)builds the custom-groups row inside the native #map_legend table: one swatch+name
 * per group (click toggles visibility) plus a button that opens the manage popup.
 * Safe to call repeatedly — removes and recreates the row each time.
 */
function renderCustomMapGroupsLegend() {
    const legendBody = document.querySelector('#map_legend table tbody');
    document.getElementById(CUSTOM_MAP_GROUPS_LEGEND_ROW_ID)?.remove();
    if (!legendBody) return;

    const tr = document.createElement('tr');
    tr.className = 'nowrap';
    tr.id = CUSTOM_MAP_GROUPS_LEGEND_ROW_ID;

    const tdLabel = document.createElement('td');
    tdLabel.className = 'small';
    tdLabel.valign = 'top';
    tdLabel.textContent = t('map.groupsLegendLabel') + ':';

    const tdEntries = document.createElement('td');

    loadCustomMapGroups().forEach(group => {
        const entry = document.createElement('div');
        entry.className = 'map_legend';
        entry.dataset.id = group.id;
        entry.dataset.active = group.active ? '1' : '0';
        entry.style.cursor = 'pointer';
        entry.title = t('map.clickToToggleGroup');
        if (!group.active) entry.style.opacity = '0.4';

        const swatch = document.createElement('div');
        swatch.style.backgroundColor = hexToRgbString(group.color);

        const span = document.createElement('span');
        span.textContent = group.name;

        entry.append(swatch, document.createTextNode(' '), span);
        entry.onclick = () => {
            group.active = !group.active;
            saveCustomMapGroups(loadCustomMapGroups());
        };

        tdEntries.appendChild(entry);
    });

    const manageBtn = document.createElement('a');
    manageBtn.id = 'map_groups_manage_btn';
    manageBtn.className = 'btn';
    manageBtn.style.marginLeft = '4px';
    manageBtn.textContent = t('map.manageGroups');
    manageBtn.onclick = (e) => { e.preventDefault(); openMapGroupsPopup(); };
    tdEntries.appendChild(manageBtn);

    tr.append(tdLabel, tdEntries);
    legendBody.appendChild(tr);
}

// Cached popup element, created lazily on first open.
let _mapGroupsPopup = null;
// Id of the group currently being edited in the form, or null when adding a new one.
let _mapGroupsEditingId = null;

/**
 * Creates (once) the manage-groups popup and appends it to <body>.
 * Reuses the script's own popup CSS classes for visual consistency with the settings popup.
 * @returns {HTMLElement}
 */
function getOrCreateMapGroupsPopup() {
    if (_mapGroupsPopup) return _mapGroupsPopup;

    const popup = document.createElement('div');
    popup.id = 'map_groups_popup';
    popup.classList.add('popup_style', 'borderimage', 'popup_box', 'script-settings-popup');
    popup.style.display = 'none';
    popup.style.width = '480px';

    const header = document.createElement('div');
    header.className = 'script-popup-header';
    header.textContent = t('map.manageGroups');

    const closeLink = document.createElement('a');
    closeLink.className = 'script-popup-close';
    closeLink.textContent = t('button.close');
    closeLink.onclick = (e) => { e.preventDefault(); popup.style.display = 'none'; };
    header.appendChild(closeLink);

    const listContainer = document.createElement('div');
    listContainer.id = 'map_groups_list_container';

    const addButton = document.createElement('a');
    addButton.className = 'btn';
    addButton.textContent = t('button.addNew');
    addButton.style.display = 'inline-block';
    addButton.style.marginTop = '10px';
    addButton.onclick = (e) => { e.preventDefault(); openMapGroupsForm(null); };

    const formContainer = document.createElement('div');
    formContainer.id = 'map_groups_form_container';
    formContainer.style.display = 'none';
    formContainer.style.marginTop = '10px';
    formContainer.style.paddingTop = '10px';
    formContainer.style.borderTop = '1px solid #dec58a';

    popup.append(header, listContainer, addButton, formContainer);
    document.body.appendChild(popup);

    // Escape / click-outside to close — scoped to this popup, independent from the settings popup.
    $(document).off('keydown.map_groups_popup').on('keydown.map_groups_popup', function (e) {
        if (e.key !== 'Escape') return;
        if (popup.style.display !== 'none') popup.style.display = 'none';
    });
    $(document).off('mousedown.map_groups_popup').on('mousedown.map_groups_popup', function (e) {
        if (popup.style.display === 'none') return;
        if (!popup.contains(e.target) && !e.target.closest('#map_groups_manage_btn')) popup.style.display = 'none';
    });

    _mapGroupsPopup = popup;
    return popup;
}

/**
 * Opens the manage-groups popup, refreshing the group list every time.
 */
function openMapGroupsPopup() {
    const popup = getOrCreateMapGroupsPopup();
    renderMapGroupsList();
    popup.querySelector('#map_groups_form_container').style.display = 'none';
    popup.style.display = 'block';
}

/**
 * Renders the list of existing groups (reorder/toggle/edit/delete controls) into the popup.
 */
function renderMapGroupsList() {
    const container = document.getElementById('map_groups_list_container');
    if (!container) return;
    container.innerHTML = '';

    const groups = loadCustomMapGroups();
    if (!groups.length) {
        const empty = document.createElement('p');
        empty.textContent = t('map.noGroupsYet');
        container.appendChild(empty);
        return;
    }

    const table = document.createElement('table');
    table.className = 'vis';
    table.style.width = '100%';
    const tbody = document.createElement('tbody');

    const matchTypeLabels = {
        villages: t('map.matchTypeVillages'),
        players: t('map.matchTypePlayers'),
        tribes: t('map.matchTypeTribes')
    };

    groups.forEach((group, index) => {
        const row = document.createElement('tr');

        const tdActive = document.createElement('td');
        const activeCheckbox = Object.assign(document.createElement('input'), {
            type: 'checkbox',
            checked: group.active
        });
        activeCheckbox.onclick = () => { group.active = activeCheckbox.checked; saveCustomMapGroups(groups); };
        tdActive.appendChild(activeCheckbox);

        const tdColor = document.createElement('td');
        const swatch = document.createElement('div');
        Object.assign(swatch.style, {
            width: '16px', height: '16px', display: 'inline-block',
            backgroundColor: hexToRgbString(group.color), border: '1px solid #7d510f'
        });
        tdColor.appendChild(swatch);

        const tdName = document.createElement('td');
        tdName.textContent = group.name;

        const tdType = document.createElement('td');
        tdType.textContent = matchTypeLabels[group.matchType] || group.matchType;

        const tdActions = document.createElement('td');
        tdActions.style.whiteSpace = 'nowrap';

        const upBtn = document.createElement('a');
        upBtn.className = 'btn';
        upBtn.textContent = '\u25b2';
        upBtn.style.marginRight = '2px';
        if (index === 0) upBtn.style.visibility = 'hidden';
        upBtn.onclick = (e) => {
            e.preventDefault();
            [groups[index - 1], groups[index]] = [groups[index], groups[index - 1]];
            saveCustomMapGroups(groups);
            renderMapGroupsList();
        };

        const downBtn = document.createElement('a');
        downBtn.className = 'btn';
        downBtn.textContent = '\u25bc';
        downBtn.style.marginRight = '6px';
        if (index === groups.length - 1) downBtn.style.visibility = 'hidden';
        downBtn.onclick = (e) => {
            e.preventDefault();
            [groups[index + 1], groups[index]] = [groups[index], groups[index + 1]];
            saveCustomMapGroups(groups);
            renderMapGroupsList();
        };

        const editBtn = document.createElement('a');
        editBtn.className = 'btn';
        editBtn.textContent = t('button.edit');
        editBtn.style.marginRight = '4px';
        editBtn.onclick = (e) => { e.preventDefault(); openMapGroupsForm(group.id); };

        const deleteBtn = document.createElement('a');
        deleteBtn.className = 'btn';
        deleteBtn.textContent = t('button.remove');
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            UI.ConfirmationBox(
                t('map.confirmDeleteGroup', { name: escapeHtml(group.name) }),
                [{
                    text: t('button.ok'),
                    callback: function () {
                        saveCustomMapGroups(loadCustomMapGroups().filter(g => g.id !== group.id));
                        renderMapGroupsList();
                    },
                    confirm: true
                }],
                'tw_delete_map_group_' + group.id,
                false,
                true
            );
        };

        tdActions.append(upBtn, downBtn, editBtn, deleteBtn);
        row.append(tdActive, tdColor, tdName, tdType, tdActions);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

/**
 * Shows the add/edit form pre-filled for the given group id, or empty for a new group.
 * @param {string|null} groupId
 */
function openMapGroupsForm(groupId) {
    _mapGroupsEditingId = groupId;
    const group = groupId ? loadCustomMapGroups().find(g => g.id === groupId) : null;

    const formContainer = document.getElementById('map_groups_form_container');
    formContainer.innerHTML = '';
    formContainer.style.display = 'block';

    const table = document.createElement('table');
    table.className = 'vis settings-table';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.style.width = '95%';
    nameInput.value = group?.name || '';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = group?.color || '#ff0000';

    const typeSelect = document.createElement('select');
    [
        { value: 'villages', label: t('map.matchTypeVillages') },
        { value: 'players', label: t('map.matchTypePlayers') },
        { value: 'tribes', label: t('map.matchTypeTribes') }
    ].forEach(opt => {
        const option = Object.assign(document.createElement('option'), { value: opt.value, textContent: opt.label });
        typeSelect.appendChild(option);
    });
    typeSelect.value = group?.matchType || 'villages';

    const valuesTextarea = document.createElement('textarea');
    valuesTextarea.style.width = '95%';
    valuesTextarea.rows = 5;
    valuesTextarea.value = (group?.values || []).join('\n');

    const valuesHelp = document.createElement('small');
    valuesHelp.style.display = 'block';
    valuesHelp.style.color = '#555';

    const valuesHelpKeys = { villages: 'valuesHelpVillages', players: 'valuesHelpPlayers', tribes: 'valuesHelpTribes' };
    const updateValuesHelp = () => { valuesHelp.textContent = t('map.' + valuesHelpKeys[typeSelect.value]); };
    typeSelect.onchange = updateValuesHelp;
    updateValuesHelp();

    const addFormRow = (labelKey, input) => {
        const row = document.createElement('tr');
        const tdLabel = Object.assign(document.createElement('td'), { className: 'settings-label-cell', textContent: t(labelKey) });
        const tdInput = document.createElement('td');
        tdInput.className = 'settings-input-cell';
        tdInput.appendChild(input);
        row.append(tdLabel, tdInput);
        table.appendChild(row);
    };

    addFormRow('map.groupName', nameInput);
    addFormRow('map.groupColor', colorInput);
    addFormRow('map.groupMatchType', typeSelect);

    const valuesRow = document.createElement('tr');
    const valuesLabelTd = Object.assign(document.createElement('td'), { className: 'settings-label-cell', textContent: t('map.groupValues') });
    const valuesInputTd = document.createElement('td');
    valuesInputTd.className = 'settings-input-cell';
    valuesInputTd.append(valuesTextarea, valuesHelp);
    valuesRow.append(valuesLabelTd, valuesInputTd);
    table.appendChild(valuesRow);

    const saveBtn = document.createElement('a');
    saveBtn.className = 'btn';
    saveBtn.style.marginRight = '6px';
    saveBtn.textContent = t('button.save');
    saveBtn.onclick = (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (!name) return;

        const values = valuesTextarea.value.split('\n').map(v => v.trim()).filter(Boolean);
        const groups = loadCustomMapGroups();

        if (_mapGroupsEditingId) {
            const existing = groups.find(g => g.id === _mapGroupsEditingId);
            Object.assign(existing, { name, color: colorInput.value, matchType: typeSelect.value, values });
        } else {
            groups.push({ id: 'group_' + Date.now(), name, color: colorInput.value, active: true, matchType: typeSelect.value, values });
        }

        saveCustomMapGroups(groups);
        renderMapGroupsList();
        formContainer.style.display = 'none';
    };

    const cancelBtn = document.createElement('a');
    cancelBtn.className = 'btn';
    cancelBtn.textContent = t('button.cancel');
    cancelBtn.onclick = (e) => { e.preventDefault(); formContainer.style.display = 'none'; };

    formContainer.append(table, saveBtn, cancelBtn);
}

if (typeof TWMap !== 'undefined') {
    installMapHighlighterHook();

    mapReady().then(() => {
        renderCustomMapGroupsLegend();
        applyCustomMapGroupColors();
    });

    if (TWMap.map) {
        // Chain after whatever handler is already assigned (e.g. feature_map.user.js's own
        // wrapper) instead of replacing it, so both files' drag-repaint logic keeps running.
        const _previousOnMovePixel = TWMap.map.handler.onMovePixel;
        TWMap.map.handler.onMovePixel = function (e, a) {
            _previousOnMovePixel.call(this, e, a);
            applyCustomMapGroupColors();
        };
    }
}
