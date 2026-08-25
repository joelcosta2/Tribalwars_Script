
// Notepad Module

function getCurrentNotepadVillageId() {
    const villageId = game_data?.village?.id;
    return villageId != null ? String(villageId) : null;
}

function getNotepadStorage() {
    return notepadGetAll();
}

/**
 * Loads the saved note for the current village from the in-memory cache and renders it
 * as HTML (converting BBCode) inside the notepad display area.
 */
function loadNote() {
    var notepadByVillageId = getNotepadStorage();
    var textPlacer = document.getElementById('village-note-body_script');
    var villageId = getCurrentNotepadVillageId();
    var notepadText = villageId ? (notepadByVillageId[villageId] || '') : '';

    if (notepadText != null && notepadText !== '' && textPlacer) {
        toggleElement('village_note_script');
        textPlacer.innerHTML = convertBBCodeToHTML(notepadText);
        resolveNotepadBBCodeLinks(textPlacer);
    }
}

/**
 * Resolves a single .tw-bbcode-pending placeholder (left by convertBBCodeToHTML) into a real
 * game link using the locally cached village/player/ally.txt data (see updateAllMapData() in
 * utils/core_utils.js), leaving the plain text untouched if nothing is found in the cache.
 */
function resolveNotepadBBCodePlaceholder(el) {
    var type = el.dataset.bbType;
    var value = el.dataset.bbValue;
    var villageId = getCurrentNotepadVillageId();
    if (!villageId) return;

    if (type === 'player') {
        var player = getCachedPlayerByName(value);
        if (player) {
            el.outerHTML = `<a href="/game.php?village=${villageId}&screen=info_player&id=${player.id}" target="_self">${escapeHtml(player.name)}</a>`;
        }
    } else if (type === 'ally') {
        var ally = getCachedAllyByName(value);
        if (ally) {
            el.outerHTML = `<a href="/game.php?village=${villageId}&screen=info_ally&id=${ally.id}" target="_self">${escapeHtml(ally.name)}</a>`;
        }
    } else if (type === 'coord') {
        var parts = value.split('|');
        var village = getCachedVillageByCoords(parts[0], parts[1]);
        if (village) {
            el.outerHTML = `<span class="village_anchor contexted" data-player="${village.ownerId}" data-id="${village.id}"><a target="_self" href="/game.php?village=${villageId}&screen=info_village&id=${village.id}">${escapeHtml(village.name)} (${village.x}|${village.y}) ${escapeHtml(village.continent)}</a><a class="ctx" href="#"></a></span>`;
        }
    }
}

/**
 * Finds every [player]/[ally]/[coord] placeholder inside `container` (a note rendered in
 * non-edit/display mode) and upgrades each one to a real game link via cached map data.
 * @param {Element} container
 */
function resolveNotepadBBCodeLinks(container) {
    container.querySelectorAll('.tw-bbcode-pending').forEach(resolveNotepadBBCodePlaceholder);
}

/**
 * Saves the current textarea content to the IndexedDB-backed notepad cache for the active village.
 * @param {boolean} [closeNotepad=true] - If true, hides the edit form and reloads the display view.
 */
function saveNote(closeNotepad = true) {
    var textToSave = document.getElementById('message_note_script').value;
    var villageId = getCurrentNotepadVillageId();
    if (!villageId) return;
    notepadSet(villageId, textToSave);
    if (closeNotepad) {
        toggleElement('note_body_edit');
        loadNote();
        toggleElement('edit_notepad_link_script');
        // Popups live in document.body (see injectNotepadWidget) so they must be hidden explicitly
        document.getElementById('bb_sizes')?.style.setProperty('display', 'none');
        document.getElementById('bb_color_picker')?.style.setProperty('display', 'none');
    }
}

/**
 * Switches the notepad into edit mode: sets up BBCode targets, populates the textarea
 * with the stored note, shows the editor, and moves focus to the end of the text.
 */
function openEditModeNote() {
    const lang = JSON.parse(localStorage.getItem('tw_lang'));
    //set target BBCodes
    BBCodes.target = {0: document.getElementById('message_note_script')}

    listenTextAreas();

    var villageId = getCurrentNotepadVillageId();
    var notepadByVillageId = getNotepadStorage();
    document.getElementById('message_note_script').value = villageId ? (notepadByVillageId[villageId] || '') : '';
    toggleElement('note_body_edit');
    
    document.getElementById('village_note_script').style.display = 'none';
    document.getElementById('edit_notepad_link_script').style.display = 'none';
    
    var noteElem = document.getElementById('message_note_script');
    noteElem.focus();
    noteElem.setSelectionRange(noteElem.value.length, noteElem.value.length);
}

/**
 * Builds a BBCode formatting toolbar (bold/italic/underline/strikethrough/player/tribe/coord/
 * quote/url/spoiler) that dispatches through the game's own native BBCodes.insert() — caller must
 * set BBCodes.target to the desired textarea before/when a button is clicked. `idPrefix` namespaces
 * every button id so multiple toolbar instances (this widget vs. extraNotepad.js's per-village
 * editors) can coexist on the same page without id clashes with each other or the native memo page.
 * @param {string} [idPrefix='']
 * @returns {HTMLDivElement}
 */
function buildBBCodeButtonsToolbar(idPrefix = '') {
    let BBCodesArea = document.createElement("div");
    BBCodesArea.id = idPrefix + "bb_bar";
    BBCodesArea.style.textAlign = "left";
    BBCodesArea.style.overflow = "visible";
    BBCodesArea.setAttribute("data-target", "message");

    // Sprite sheet base: reuse the game's own CDN asset (falls back to the last-known hash
    // if `image_base` isn't defined for some reason).
    const bbcodeSpriteBase = typeof image_base !== 'undefined' ? image_base : 'https://dspt.innogamescdn.com/asset/95eda994/graphic/';

    // Button definitions: BBCode tag, tooltip title, and sprite sheet offset.
    // `open`/`close` override the default `[tag]`/`[/tag]` wrap for tags needing extra content.
    const bbButtons = [
        { id: "bb_button_bold",          tag: "b",       title: t('format.bold'),          pos: "0px" },
        { id: "bb_button_italic",        tag: "i",       title: t('format.italic'),        pos: "-20px" },
        { id: "bb_button_underline",     tag: "u",       title: t('format.underline'),     pos: "-40px" },
        { id: "bb_button_strikethrough", tag: "s",       title: t('format.strikethrough'), pos: "-60px" },
        { id: "bb_button_player",        tag: "player",  title: t('format.player'),        pos: "-80px" },
        { id: "bb_button_tribe",         tag: "ally",    title: t('format.tribe'),         pos: "-100px" },
        { id: "bb_button_coord",         tag: "coord",   title: t('format.coord'),         pos: "-120px" },
        { id: "bb_button_quote",         tag: "quote",   title: t('format.quote'),         pos: "-140px", open: "[quote=Author]\n", close: "\n[/quote]" },
        { id: "bb_button_url",           tag: "url",     title: t('format.url'),           pos: "-160px" },
        { id: "bb_button_spoiler",       tag: "spoiler", title: t('format.spoiler'),       pos: "-260px", open: "[spoiler=Spoiler]", close: "[/spoiler]" },
        { id: "bb_button_table",         tag: "table",   title: t('format.table'),         pos: "-280px", open: "[table]\n[**]", close: "[||]head2[/**]\n[*]test1[|]test2\n[/table]" },
    ];

    // Build each BBCode button dynamically from the definitions above
    bbButtons.forEach(btn => {
        let button = document.createElement("a");
        button.id = idPrefix + btn.id;
        button.href = "#";
        button.setAttribute("data-title", btn.title);
        button.onclick = function () {
            BBCodes.insert(btn.open || `[${btn.tag}${btn.extra || ""}]`, btn.close || `[/${btn.tag}]`);
        };

        let span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.background = `url(${bbcodeSpriteBase}bbcodes/bbcodes.png) no-repeat ${btn.pos} 0px`;
        span.style.width = "20px";
        span.style.height = "20px";
        span.style.marginRight = "2px";
        span.style.marginBottom = "3px";

        button.appendChild(span);
        BBCodesArea.appendChild(button);
    });

    return BBCodesArea;
}

/**
 * Builds and injects the notepad widget into the given column.
 * Creates the BBCode toolbar, the textarea, the save button, and the read-only
 * display area, then loads any existing note for the current village.
 * @param {string} columnToUse - Target column identifier passed to createWidgetElement.
 */
function injectNotepadWidget(columnToUse) {
    if (settings_cookies.general['show__notepad']) {
        var editLink = document.createElement('a');
        editLink.id = 'edit_notepad_link_script';
        editLink.classList.add('btn');
        editLink.textContent = t('button.edit');
        editLink.addEventListener('click', openEditModeNote);

        // Create the main BBCode toolbar container (bold/italic/etc.) — size/color picker appended below
        let BBCodesArea = buildBBCodeButtonsToolbar('');
        const bbcodeSpriteBase = typeof image_base !== 'undefined' ? image_base : 'https://dspt.innogamescdn.com/asset/95eda994/graphic/';

        // Size button + flyout menu (mirrors the native #bb_sizes popup)
        const sizeButton = document.createElement("a");
        sizeButton.id = "bb_button_size";
        sizeButton.href = "#";
        sizeButton.setAttribute("data-title", t('format.size'));
        sizeButton.onclick = function () {
            toggleElement('bb_sizes');
            BBCodes.placePopups();
            return false;
        };
        const sizeSpan = document.createElement("span");
        sizeSpan.style.display = "inline-block";
        sizeSpan.style.background = `url(${bbcodeSpriteBase}bbcodes/bbcodes.png) no-repeat -180px 0px`;
        sizeSpan.style.width = "20px";
        sizeSpan.style.height = "20px";
        sizeSpan.style.marginRight = "2px";
        sizeSpan.style.marginBottom = "3px";
        sizeButton.appendChild(sizeSpan);
        BBCodesArea.appendChild(sizeButton);

        const sizeTable = document.createElement("table");
        sizeTable.id = "bb_sizes";
        sizeTable.style.cssText = "display: none; clear: both; white-space: nowrap;";
        const sizeTbody = document.createElement("tbody");
        const sizeRow = document.createElement("tr");
        const sizeCell = document.createElement("td");
        [
            ["6", t('format.sizeVerySmall')],
            ["7", t('format.sizeSmall')],
            ["9", t('format.sizeNormal')],
            ["12", t('format.sizeLarge')],
            ["20", t('format.sizeVeryLarge')],
        ].forEach(([size, label]) => {
            const sizeLink = document.createElement("a");
            sizeLink.href = "#";
            sizeLink.textContent = "» " + label;
            sizeLink.onclick = function () {
                BBCodes.insert(`[size=${size}]`, "[/size]");
                toggleElement('bb_sizes');
                return false;
            };
            sizeCell.appendChild(sizeLink);
            sizeCell.appendChild(document.createElement("br"));
        });
        sizeRow.appendChild(sizeCell);
        sizeTbody.appendChild(sizeRow);
        sizeTable.appendChild(sizeTbody);
        // Appended to body (not BBCodesArea) so it isn't clipped by editDiv's overflow:hidden on narrow columns
        document.body.appendChild(sizeTable);

        // Color button + native color-picker popup (reuses BBCodes.colorPickerToggle/colorPickColor/
        // colorSetColor and the game's own #bb_color_picker* CSS, already loaded on the page)
        const colorButton = document.createElement("a");
        colorButton.id = "bb_button_color";
        colorButton.href = "#";
        colorButton.setAttribute("data-title", t('format.color'));
        colorButton.onclick = function () {
            BBCodes.colorPickerToggle();
            BBCodes.placePopups();
            return false;
        };
        const colorSpan = document.createElement("span");
        colorSpan.style.display = "inline-block";
        colorSpan.style.background = `url(${bbcodeSpriteBase}bbcodes/bbcodes.png) no-repeat -200px 0px`;
        colorSpan.style.width = "20px";
        colorSpan.style.height = "20px";
        colorSpan.style.marginRight = "2px";
        colorSpan.style.marginBottom = "3px";
        colorButton.appendChild(colorSpan);
        BBCodesArea.appendChild(colorButton);

        const colorPicker = document.createElement("div");
        colorPicker.id = "bb_color_picker";
        colorPicker.className = "bb_color_picker";
        // Explicit width: without it, a position:absolute box with only `left` set shrink-fits to
        // "containing-block-width - left", which can go below the ~110px the swatch rows need once
        // the button sits close to the viewport's right edge (wide layout breakpoints), wrapping the
        // floated swatches onto extra rows and scrambling the color grid.
        colorPicker.style.cssText = "display: none; clear: both; width: 111px;";
        colorPicker.innerHTML = `
            <div class="popup_menu" style="cursor:default"><a href="#" id="bb_color_picker_close">${t('button.close')}</a></div>
            <div id="bb_color_picker_colors">
                <div id="bb_color_picker_c0" style="background:#f00"></div>
                <div id="bb_color_picker_c1" style="background:#ff0"></div>
                <div id="bb_color_picker_c2" style="background:#0f0"></div>
                <div id="bb_color_picker_c3" style="background:#0ff"></div>
                <div id="bb_color_picker_c4" style="background:#00f"></div>
                <div id="bb_color_picker_c5" style="background:#f0f"></div>
                <br>
            </div>
            <div id="bb_color_picker_tones">
                <div id="bb_color_picker_10"></div><div id="bb_color_picker_11"></div><div id="bb_color_picker_12"></div><div id="bb_color_picker_13"></div><div id="bb_color_picker_14"></div><div id="bb_color_picker_15"></div><br style="clear: both">
                <div id="bb_color_picker_20"></div><div id="bb_color_picker_21"></div><div id="bb_color_picker_22"></div><div id="bb_color_picker_23"></div><div id="bb_color_picker_24"></div><div id="bb_color_picker_25"></div><br style="clear: both">
                <div id="bb_color_picker_30"></div><div id="bb_color_picker_31"></div><div id="bb_color_picker_32"></div><div id="bb_color_picker_33"></div><div id="bb_color_picker_34"></div><div id="bb_color_picker_35"></div><br style="clear: both">
                <div id="bb_color_picker_40"></div><div id="bb_color_picker_41"></div><div id="bb_color_picker_42"></div><div id="bb_color_picker_43"></div><div id="bb_color_picker_44"></div><div id="bb_color_picker_45"></div><br style="clear: both">
                <div id="bb_color_picker_50"></div><div id="bb_color_picker_51"></div><div id="bb_color_picker_52"></div><div id="bb_color_picker_53"></div><div id="bb_color_picker_54"></div><div id="bb_color_picker_55"></div><br style="clear: both">
            </div>
            <div id="bb_color_picker_preview">Aa</div>
            <input type="text" id="bb_color_picker_tx"><input type="button" value="OK" id="bb_color_picker_ok">
        `;
        // Appended to body (not BBCodesArea) so it isn't clipped by editDiv's overflow:hidden on narrow columns
        document.body.appendChild(colorPicker);
        colorPicker.querySelector('#bb_color_picker_ok').onclick = function () {
            BBCodes.colorPickerToggle(true);
            return false;
        };
        colorPicker.querySelector('#bb_color_picker_close').onclick = function () {
            colorPicker.style.display = 'none';
            return false;
        };

        var noteTextarea = document.createElement('textarea');
        noteTextarea.id = 'message_note_script';
        noteTextarea.name = 'note';
        noteTextarea.style.width = '-webkit-fill-available';
        noteTextarea.rows = '10';
        noteTextarea.cols = '40';

        var saveButton = document.createElement('a');
        saveButton.id = 'note_submit_button_script';
        saveButton.className = 'btn btn-default';
        saveButton.textContent = lang['c9cc8cce247e49bae79f15173ce97354'] || t('button.save');
        saveButton.addEventListener('click', saveNote);

        var table = document.createElement('table');
        table.width = '100%';
        var tbody = document.createElement('tbody'); 

        var noteRow = document.createElement('tr');
        noteRow.id = 'village_note_script';
        noteRow.style.display = 'none';

        var noteCell = document.createElement('td');
        var noteDiv = document.createElement('div');
        noteDiv.className = 'village-note';
        var noteBodyDiv = document.createElement('div');
        noteBodyDiv.id = 'village-note-body_script';
        noteBodyDiv.className = 'village-note-body';
        noteBodyDiv.style.whiteSpace = 'pre-wrap';
        noteBodyDiv.style.cursor = 'pointer';
        noteBodyDiv.addEventListener('dblclick', openEditModeNote);
        noteDiv.appendChild(noteBodyDiv);

        noteCell.appendChild(noteDiv);
        noteRow.appendChild(noteCell);

        var editRow = document.createElement('tr');
        editRow.id = 'note_body_edit';
        editRow.style.display = 'none';

        var editCell = document.createElement('td');
        var editDiv = document.createElement('div');
        editDiv.className = 'village-note';
        editDiv.style.width = '100%';
        editDiv.style.overflow = 'hidden';

        var buttonDiv = document.createElement('div');
        buttonDiv.appendChild(saveButton);

        editDiv.appendChild(BBCodesArea);
        editDiv.appendChild(noteTextarea);
        editDiv.appendChild(buttonDiv);

        var editNoteBodyDiv = document.createElement('div');
        editNoteBodyDiv.className = 'village-note-body';
        editDiv.appendChild(editNoteBodyDiv);

        editCell.appendChild(editDiv);
        editRow.appendChild(editCell);

        var editButtonRow = document.createElement('tr');
        var editButtonCell = document.createElement('td');
        editButtonCell.appendChild(editLink);
        editButtonRow.appendChild(editButtonCell);

        tbody.appendChild(noteRow);
        tbody.appendChild(editRow);
        tbody.appendChild(editButtonRow);
        table.appendChild(tbody);

        createWidgetElement({ identifier: t('notepad.title'), contents: table, columnToUse, update: '', extra_name: '', description: t('notepad.description'), title: lang['744c0e143621b2e2aeaee257475d6d22'] || t('notepad.title'), widgetKey: 'notepad' });
        loadNote();
    }
}

/**
 * Toggles the visibility of a DOM element between hidden and visible.
 * @param {string} element - The id of the element to toggle.
 */
function toggleElement(element) {
    var elementToToggle = document.getElementById(element);
    if (elementToToggle) {
        if (elementToToggle.style.display === 'none') {
            elementToToggle.style.display = '';
        } else {
            elementToToggle.style.display = 'none';
        }
    }
}