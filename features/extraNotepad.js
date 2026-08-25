
// Notepad Page — view/edit every village's Notepad-widget note directly from the native screen=memo page.
// Reuses the custom Notepad widget's own IndexedDB-backed cache, not the native TW memo.

const EXTRA_MEMO_TOGGLE_KEY = 'extra_memo_show_all_villages';

function isExtraMemoEnabled() {
    return localStorage.getItem(EXTRA_MEMO_TOGGLE_KEY) === '1';
}

function setExtraMemoEnabled(enabled) {
    localStorage.setItem(EXTRA_MEMO_TOGGLE_KEY, enabled ? '1' : '0');
}

/**
 * Returns the village name for a village id using the cached villages_info list, or the raw id
 * when the village isn't known.
 * @param {string|number} villageId
 * @returns {string}
 */
function getVillageTabLabel(villageId) {
    const villages = JSON.parse(localStorage.getItem('villages_info') || '[]');
    const village = villages.find(v => (v.url.match(/village=(\d+)/) || [])[1] == villageId);
    if (!village) return String(villageId);
    return village.name;
}

// Tracks which village's note is currently shown/edited in #extra_memo_display.
var currentExtraMemoVillageId = null;

function renderExtraMemoView(villageId) {
    currentExtraMemoVillageId = villageId;
    document.getElementById('extra_memo_edit_row').style.display = 'none';
    document.getElementById('extra_memo_view_row').style.display = '';

    const notepadByVillageId = getNotepadStorage();
    const noteText = notepadByVillageId[villageId];
    const body = document.getElementById('extra_memo_view_body');

    if (noteText) {
        // white-space:pre-wrap preserves line breaks — convertBBCodeToHTML() doesn't convert them
        // itself, same convention as getOverviewVillagesNotepadTooltipHtml() (overviewVillages.js).
        body.style.whiteSpace = 'pre-wrap';
        body.innerHTML = convertBBCodeToHTML(noteText);
        resolveNotepadBBCodeLinks(body);
    } else {
        body.innerHTML = '<i>' + t('memo.noNoteYet') + '</i>';
    }
}

function openExtraMemoEditMode(villageId) {
    currentExtraMemoVillageId = villageId;
    const notepadByVillageId = getNotepadStorage();
    const textarea = document.getElementById('extra_memo_message');
    textarea.value = notepadByVillageId[villageId] || '';
    // Duck-typed jQuery-like target, same pattern openEditModeNote() uses for the native BBCodes.insert().
    BBCodes.target = { 0: textarea };

    document.getElementById('extra_memo_view_row').style.display = 'none';
    document.getElementById('extra_memo_edit_row').style.display = '';
    textarea.focus();
}

function saveExtraMemoNote(villageId) {
    const text = document.getElementById('extra_memo_message').value;
    notepadSet(villageId, text);
    renderExtraMemoView(villageId);
}

function exportAllVillageNotes() {
    const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        notes: Object.assign({}, getNotepadStorage())
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tribalwars-village-notes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function parseImportedVillageNotes(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Invalid notes file');
    }

    const source = payload.notes && typeof payload.notes === 'object' && !Array.isArray(payload.notes)
        ? payload.notes
        : payload;

    const notes = {};
    Object.keys(source).forEach(villageId => {
        const noteText = source[villageId];
        if (typeof noteText === 'string' && noteText !== '') {
            notes[String(villageId)] = noteText;
        }
    });

    return notes;
}

async function importVillageNotesFromFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const payload = JSON.parse(event.target.result);
            const notes = parseImportedVillageNotes(payload);

            if (!confirm(t('memo.importNotesConfirm'))) return;

            await notepadReplaceAll(notes);
            if (currentExtraMemoVillageId != null) {
                renderExtraMemoView(currentExtraMemoVillageId);
            }
            alert(t('memo.importNotesSuccess'));
        } catch (error) {
            console.warn('[ExtraMemo] Failed to import village notes', error);
            alert(t('memo.importNotesInvalid'));
        }
    };
    reader.readAsText(file);
}

function showExtraMemoDisplay(villageId) {
    document.getElementById('extra_memo_display').style.display = '';
    renderExtraMemoView(villageId);
}

function hideExtraMemoDisplay() {
    const display = document.getElementById('extra_memo_display');
    if (display) display.style.display = 'none';

    document.querySelectorAll('.memo_container').forEach(c => {
        if (c.id !== 'extra_memo_display') c.style.display = '';
    });
}

function selectExtraMemoTab(villageId, tabEl) {
    document.querySelectorAll('#tab-bar .memo-tab').forEach(t => t.classList.remove('memo-tab-selected'));
    tabEl.classList.add('memo-tab-selected');
    document.querySelectorAll('.memo_container').forEach(c => {
        if (c.id !== 'extra_memo_display') c.style.display = 'none';
    });
    showExtraMemoDisplay(villageId);
}

/**
 * Builds the (hidden by default) view/edit container shown when an injected village tab is
 * selected. Created once and reused for every village — only its content is swapped.
 * @returns {HTMLDivElement}
 */
function buildExtraMemoDisplay() {
    const container = document.createElement('div');
    container.id = 'extra_memo_display';
    container.className = 'memo_container';
    container.style.display = 'none';

    const scriptDiv = document.createElement('div');
    scriptDiv.className = 'memo_script';
    scriptDiv.style.clear = 'both';

    const editLink = document.createElement('a');
    editLink.className = 'btn';
    editLink.href = '#';
    editLink.textContent = t('button.edit');
    editLink.addEventListener('click', (e) => {
        e.preventDefault();
        openExtraMemoEditMode(currentExtraMemoVillageId);
    });
    scriptDiv.appendChild(editLink);
    scriptDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.className = 'vis';
    table.width = '100%';
    table.style.marginTop = '5px';
    const tbody = document.createElement('tbody');

    const viewRow = document.createElement('tr');
    viewRow.id = 'extra_memo_view_row';
    const viewCell = document.createElement('td');
    viewCell.colSpan = 2;
    viewCell.id = 'extra_memo_view_body';
    viewRow.appendChild(viewCell);

    const editRow = document.createElement('tr');
    editRow.id = 'extra_memo_edit_row';
    editRow.style.display = 'none';
    const editCell = document.createElement('td');
    editCell.colSpan = 2;

    const toolbar = buildBBCodeButtonsToolbar('extra_memo_');
    const textarea = document.createElement('textarea');
    textarea.id = 'extra_memo_message';
    textarea.cols = 80;
    textarea.rows = 15;
    textarea.style.width = '100%';

    const saveBtn = document.createElement('input');
    saveBtn.type = 'button';
    saveBtn.className = 'btn';
    saveBtn.value = t('button.save');
    saveBtn.style.marginTop = '5px';
    saveBtn.addEventListener('click', () => saveExtraMemoNote(currentExtraMemoVillageId));

    const cancelBtn = document.createElement('input');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn';
    cancelBtn.value = t('button.cancel');
    cancelBtn.style.marginTop = '5px';
    cancelBtn.addEventListener('click', () => renderExtraMemoView(currentExtraMemoVillageId));

    editCell.appendChild(toolbar);
    editCell.appendChild(textarea);
    editCell.appendChild(document.createElement('br'));
    editCell.appendChild(saveBtn);
    editCell.appendChild(cancelBtn);
    editRow.appendChild(editCell);

    tbody.appendChild(viewRow);
    tbody.appendChild(editRow);
    table.appendChild(tbody);
    scriptDiv.appendChild(table);
    container.appendChild(scriptDiv);
    return container;
}

function removeExtraMemoVillageTabs() {
    document.querySelectorAll('[data-extra-memo-tab]').forEach(el => el.remove());
    hideExtraMemoDisplay();
}

function renderExtraMemoVillageTabs() {
    removeExtraMemoVillageTabs();
    const tabBar = document.getElementById('tab-bar');
    if (!tabBar) return;

    getAllVillageIds().forEach(villageId => {
        const tab = document.createElement('div');
        tab.className = 'memo-tab';
        tab.dataset.extraMemoTab = '1';
        tab.dataset.villageId = villageId;

        const label = document.createElement('span');
        label.className = 'memo-tab-label';
        label.innerHTML = '<strong>' + escapeHtml(getVillageTabLabel(villageId)) + '</strong>';
        tab.appendChild(label);

        // stopPropagation: defends against any native delegated tab-bar click handler reacting
        // to a tab id it doesn't recognize.
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            selectExtraMemoTab(villageId, tab);
        });

        tabBar.appendChild(tab);
    });
}

/**
 * Entry point for screen=memo. Injects the "show all villages" toggle next to the title and,
 * when enabled, one extra tab per other village backed by the Notepad widget's own storage.
 */
function injectExtraMemoFeature() {
    if (document.getElementById('extra_memo_toggle')) return;

    const titleHeading = document.querySelector('#content_value h2');
    const tabBar = document.getElementById('tab-bar');
    if (!titleHeading || !tabBar) return;

    const isPremium = !!game_data?.features?.Premium?.active;

    const controls = document.createElement('div');
    controls.style.cssText = 'float:right; display:flex; align-items:center; gap:8px; flex-wrap:wrap;';

    const label = document.createElement('label');
    label.id = 'extra_memo_toggle_label';
    label.style.cssText = 'font-weight:normal; display:flex; align-items:center; gap:8px; flex-wrap:wrap;';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'extra_memo_toggle';
    checkbox.disabled = isPremium;
    checkbox.checked = !isPremium && isExtraMemoEnabled();

    const backupActions = document.createElement('span');
    backupActions.style.cssText = 'display:inline-flex; gap:6px; align-items:center; flex-wrap:wrap;';

    const exportBtn = document.createElement('input');
    exportBtn.type = 'button';
    exportBtn.className = 'btn';
    exportBtn.value = t('button.export');
    exportBtn.title = t('memo.exportNotesTitle');
    exportBtn.addEventListener('click', exportAllVillageNotes);

    const importBtn = document.createElement('input');
    importBtn.type = 'button';
    importBtn.className = 'btn';
    importBtn.value = t('button.import');
    importBtn.title = t('memo.importNotesTitle');

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.style.display = 'none';
    importInput.addEventListener('change', () => {
        const file = importInput.files?.[0];
        importInput.value = '';
        importVillageNotesFromFile(file);
    });

    importBtn.addEventListener('click', () => importInput.click());

    backupActions.appendChild(exportBtn);
    backupActions.appendChild(importBtn);
    backupActions.appendChild(importInput);
    backupActions.style.display = checkbox.checked ? 'inline-flex' : 'none';

    controls.appendChild(backupActions);
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + t('memo.showAllVillages')));
    controls.appendChild(label);

    if (isPremium) {
        label.setAttribute('data-title', t('memo.premiumDisabledHint'));
        label.addEventListener('mouseenter', (e) => toggleTooltip(e.currentTarget, true));
        label.addEventListener('mouseleave', (e) => toggleTooltip(e.currentTarget, false));
    }

    titleHeading.insertAdjacentElement('afterend', controls);

    // Additive listener on the real native tabs so switching back to one hides our overlay.
    tabBar.querySelectorAll('.memo-tab').forEach(nativeTab => {
        nativeTab.addEventListener('click', hideExtraMemoDisplay);
    });

    tabBar.insertAdjacentElement('afterend', buildExtraMemoDisplay());

    checkbox.addEventListener('change', () => {
        if (isPremium) return;
        setExtraMemoEnabled(checkbox.checked);
        backupActions.style.display = checkbox.checked ? 'inline-flex' : 'none';
        if (checkbox.checked) {
            renderExtraMemoVillageTabs();
        } else {
            removeExtraMemoVillageTabs();
        }
    });

    if (!isPremium && isExtraMemoEnabled()) {
        renderExtraMemoVillageTabs();
    }
}
