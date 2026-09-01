
// Notepad Page — view/edit every village's Notepad-widget note directly from the native screen=memo page.
// Reuses the custom Notepad widget's own IndexedDB-backed cache, not the native TW memo.

/**
 * Returns the village name for a village id using the cached villages_info list, falling back to
 * its coordinates in X|Y format when the name is unavailable.
 * @param {string|number} villageId
 * @returns {string}
 */
function getVillageTabLabel(villageId) {
    const villages = JSON.parse(localStorage.getItem('villages_info') || '[]');
    const village = villages.find(v => (v.url.match(/village=(\d+)/) || [])[1] == villageId);
    if (village?.name) return village.name;
    if (village?.coords) return village.coords;

    const raw = typeof mapDataGetRaw === 'function' ? mapDataGetRaw('map_villages') : '';
    const escapedVillageId = String(villageId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = raw && raw.match(new RegExp('^' + escapedVillageId + ',[^,]*,(\\d{1,3}),(\\d{1,3}),', 'm'));
    return match ? match[1] + '|' + match[2] : String(villageId);
}

// Tracks which village's note is currently shown/edited in #extra_memo_display.
var currentExtraMemoVillageId = null;
var currentExtraMemoSource = 'own';
var currentExtraMemoType = 'own';

function renderExtraMemoView(villageId) {
    currentExtraMemoVillageId = villageId;
    closeNotepadBBCodePickers();
    document.getElementById('extra_memo_edit_row').style.display = 'none';
    document.getElementById('extra_memo_view_row').style.display = '';

    const notes = currentExtraMemoSource === 'profile'
        ? villageProfileNoteGetAll()
        : getNotepadStorage();
    const noteText = notes[villageId];
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
    const notes = currentExtraMemoSource === 'profile'
        ? villageProfileNoteGetAll()
        : getNotepadStorage();
    const textarea = document.getElementById('extra_memo_message');
    textarea.value = notes[villageId] || '';
    // Duck-typed jQuery-like target, same pattern openEditModeNote() uses for the native BBCodes.insert().
    BBCodes.target = { 0: textarea };

    document.getElementById('extra_memo_view_row').style.display = 'none';
    document.getElementById('extra_memo_edit_row').style.display = '';
    textarea.focus();
}

function saveExtraMemoNote(villageId) {
    const text = document.getElementById('extra_memo_message').value;
    if (currentExtraMemoSource === 'profile') {
        villageProfileNoteSet(villageId, text);
    } else {
        notepadSet(villageId, text);
    }
    renderExtraMemoView(villageId);
}

function deleteExtraMemoNote(villageId) {
    UI.ConfirmationBox(
        t('memo.deleteNoteConfirm'),
        [{
            text: t('button.delete'),
            callback: async function () {
                if (currentExtraMemoSource === 'profile') {
                    await villageProfileNoteSet(villageId, '');
                } else {
                    await notepadSet(villageId, '');
                }
                renderExtraMemoVillageTabs();
                hideExtraMemoDisplay();
            },
            confirm: true
        }],
        'tw_delete_note_' + currentExtraMemoSource + '_' + villageId,
        false,
        true
    );
}

function downloadExtraMemoBackup(notes, filename) {
    const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        notes: Object.assign({}, notes)
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportAllVillageNotes() {
    downloadExtraMemoBackup(getNotepadStorage(), 'tribalwars-village-notes.json');
}

function exportAllProfileNotes() {
    downloadExtraMemoBackup(villageProfileNoteGetAll(), 'tribalwars-profile-notes.json');
}

function exportCurrentExtraMemoNotes() {
    downloadExtraMemoBackup({
        ownVillageNotes: getNotepadStorage(),
        profileNotes: villageProfileNoteGetAll()
    }, 'tribalwars-all-notes.json');
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

function parseImportedAllMemoNotes(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Invalid notes file');
    }

    const combinedNotes = payload.notes && typeof payload.notes === 'object' && !Array.isArray(payload.notes)
        ? payload.notes
        : payload;

    if (Object.prototype.hasOwnProperty.call(combinedNotes, 'ownVillageNotes') ||
        Object.prototype.hasOwnProperty.call(combinedNotes, 'profileNotes')) {
        return {
            ownVillageNotes: parseImportedVillageNotes(combinedNotes.ownVillageNotes || {}),
            profileNotes: parseImportedVillageNotes(combinedNotes.profileNotes || {})
        };
    }

    return {
        ownVillageNotes: parseImportedVillageNotes(payload),
        profileNotes: {}
    };
}

async function importAllMemoNotesFromFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const payload = JSON.parse(event.target.result);
            const notes = parseImportedAllMemoNotes(payload);

            UI.ConfirmationBox(
                t('memo.importAllNotesConfirm'),
                [{
                    text: t('button.import'),
                    callback: async function () {
                        await notepadReplaceAll(notes.ownVillageNotes);
                        await villageProfileNoteReplaceAll(notes.profileNotes);
                        renderExtraMemoVillageTabs();
                        if (currentExtraMemoVillageId != null) {
                            renderExtraMemoView(currentExtraMemoVillageId);
                        }
                        alert(t('memo.importAllNotesSuccess'));
                    },
                    confirm: true
                }],
                'tw_import_all_notes',
                false,
                true
            );
        } catch (error) {
            console.warn('[ExtraMemo] Failed to import all notes', error);
            alert(t('memo.importAllNotesInvalid'));
        }
    };
    reader.readAsText(file);
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

async function importProfileNotesFromFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const payload = JSON.parse(event.target.result);
            const notes = parseImportedVillageNotes(payload);

            if (!confirm(t('memo.importProfileNotesConfirm'))) return;

            await villageProfileNoteReplaceAll(notes);
            renderExtraMemoVillageTabs();
            if (currentExtraMemoVillageId != null && currentExtraMemoSource === 'profile') {
                renderExtraMemoView(currentExtraMemoVillageId);
            }
            alert(t('memo.importProfileNotesSuccess'));
        } catch (error) {
            console.warn('[ExtraMemo] Failed to import profile notes', error);
            alert(t('memo.importProfileNotesInvalid'));
        }
    };
    reader.readAsText(file);
}

function importCurrentExtraMemoNotes(file) {
    importAllMemoNotesFromFile(file);
}

function showExtraMemoDisplay(villageId, source = 'own') {
    document.getElementById('extra_memo_display').style.display = '';
    currentExtraMemoSource = source;
    const deleteLink = document.querySelector('#extra_memo_display [data-extra-delete]');
    if (deleteLink) deleteLink.style.display = '';
    renderExtraMemoView(villageId);
}

function hideExtraMemoDisplay() {
    const display = document.getElementById('extra_memo_display');
    if (display) display.style.display = 'none';

    document.querySelectorAll('.memo_container').forEach(c => {
        if (c.id !== 'extra_memo_display') c.style.display = '';
    });
}

function setNativeMemoVisibility(visible) {
    document.querySelectorAll('#tab-bar .memo-tab:not([data-extra-memo-tab]):not([data-extra-profile-memo-tab])')
        .forEach(tab => tab.style.display = visible ? '' : 'none');
    document.querySelectorAll('.memo_container:not(#extra_memo_display)')
        .forEach(container => container.style.display = visible ? '' : 'none');
}

function selectExtraMemoTab(villageId, tabEl, source = 'own') {
    document.querySelectorAll('#tab-bar [data-extra-memo-tab], #tab-bar [data-extra-profile-memo-tab]')
        .forEach(t => t.classList.remove('memo-tab-selected'));
    tabEl.classList.add('memo-tab-selected');
    document.querySelectorAll('.memo_container').forEach(c => {
        if (c.id !== 'extra_memo_display') c.style.display = 'none';
    });
    showExtraMemoDisplay(villageId, source);
}

function selectExtraMemoType(type, button) {
    currentExtraMemoType = type;
    document.querySelectorAll('[data-extra-memo-type-button]').forEach(tab => {
        tab.classList.remove('selected');
    });
    document.querySelectorAll('[data-extra-memo-type-panel]').forEach(panel => panel.classList.remove('active'));
    button.classList.add('selected');
    const panel = document.querySelector('[data-extra-memo-type-panel="' + type + '"]');
    if (panel) panel.classList.add('active');
    const exportButton = document.getElementById('extra_memo_export');
    const importButton = document.getElementById('extra_memo_import');
    if (exportButton) exportButton.title = t('memo.exportAllNotesTitle');
    if (importButton) importButton.title = t('memo.importAllNotesTitle');
    hideExtraMemoDisplay();
    setNativeMemoVisibility(type === 'own');
    renderExtraMemoVillageTabs();
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

    const deleteLink = document.createElement('a');
    deleteLink.className = 'btn';
    deleteLink.href = '#';
    deleteLink.dataset.extraDelete = '1';
    deleteLink.textContent = t('button.delete');
    deleteLink.addEventListener('click', (e) => {
        e.preventDefault();
        deleteExtraMemoNote(currentExtraMemoVillageId);
    });
    scriptDiv.appendChild(deleteLink);
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

function removeExtraMemoVillageTabs(hideDisplay = true) {
    document.querySelectorAll('[data-extra-memo-tab], [data-extra-profile-memo-tab]').forEach(el => el.remove());
    if (hideDisplay) hideExtraMemoDisplay();
}

function renderExtraMemoVillageTabs() {
    removeExtraMemoVillageTabs(false);
    const tabBar = document.getElementById('tab-bar');
    if (!tabBar) return;

    if (currentExtraMemoType === 'own') getAllVillageIds().forEach(villageId => {
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
            selectExtraMemoTab(villageId, tab, 'own');
        });

        tabBar.appendChild(tab);
    });

    if (currentExtraMemoType === 'profile') {
        Object.keys(villageProfileNoteGetAll()).forEach(villageId => {
            const tab = document.createElement('div');
            tab.className = 'memo-tab';
            tab.dataset.extraProfileMemoTab = '1';
            tab.dataset.villageId = villageId;

            const label = document.createElement('span');
            label.className = 'memo-tab-label';
            label.innerHTML = '<strong>' + escapeHtml(getVillageTabLabel(villageId)) + '</strong>';
            tab.appendChild(label);
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                selectExtraMemoTab(villageId, tab, 'profile');
            });
            tabBar.appendChild(tab);
        });
    }
}

/**
 * Entry point for screen=memo. Injects note-type tabs next to the title and village tabs backed
 * by the custom notepad/profile-note stores.
 */
function injectExtraMemoFeature() {
    if (document.getElementById('extra_memo_type_tabs')) return;

    const titleHeading = document.querySelector('#content_value h2');
    const tabBar = document.getElementById('tab-bar');
    if (!titleHeading || !tabBar) return;

    const isPremium = !!game_data?.features?.Premium?.active;

    const controls = document.createElement('div');
    controls.id = 'extra_memo_type_tabs';
    controls.className = 'extra-memo-type-tabs';
    if (isPremium) {
        controls.setAttribute('data-title', t('memo.premiumDisabledHint'));
        controls.addEventListener('mouseenter', (e) => toggleTooltip(e.currentTarget, true));
        controls.addEventListener('mouseleave', (e) => toggleTooltip(e.currentTarget, false));
    }

    const backupActions = document.createElement('span');
    backupActions.className = 'extra-memo-backup-actions';
    backupActions.style.cssText = 'float:right; display:inline-flex; flex-wrap:wrap; gap:6px; align-items:center;';

    const exportBtn = document.createElement('input');
    exportBtn.id = 'extra_memo_export';
    exportBtn.type = 'button';
    exportBtn.className = 'btn';
    exportBtn.value = t('button.export');
    exportBtn.title = t('memo.exportAllNotesTitle');
    exportBtn.disabled = isPremium;
    exportBtn.addEventListener('click', exportCurrentExtraMemoNotes);

    const importBtn = document.createElement('input');
    importBtn.id = 'extra_memo_import';
    importBtn.type = 'button';
    importBtn.className = 'btn';
    importBtn.value = t('button.import');
    importBtn.title = t('memo.importAllNotesTitle');
    importBtn.disabled = isPremium;

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.style.display = 'none';
    importInput.addEventListener('change', () => {
        const file = importInput.files?.[0];
        importInput.value = '';
        importCurrentExtraMemoNotes(file);
    });
    importBtn.addEventListener('click', () => importInput.click());
    backupActions.append(exportBtn, importBtn, importInput);
    controls.appendChild(backupActions);

    const tabMenu = document.createElement('table');
    tabMenu.className = 'vis modemenu';
    tabMenu.id = 'extra_memo_type_menu';
    tabMenu.style.width = '100%';
    const tabMenuBody = document.createElement('tbody');
    const tabMenuRow = document.createElement('tr');
    tabMenuBody.appendChild(tabMenuRow);
    tabMenu.appendChild(tabMenuBody);
    const panels = document.createElement('div');
    panels.className = 'extra-memo-type-panels';

    const createBackupPanel = (type, title) => {
        const tab = document.createElement('td');
        tab.className = 'center';
        tab.dataset.extraMemoTypeButton = type;
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = title;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            if (!isPremium) selectExtraMemoType(type, tab);
        });
        tab.appendChild(link);
        tabMenuRow.appendChild(tab);

        const panel = document.createElement('div');
        panel.className = 'extra-memo-type-panel';
        panel.dataset.extraMemoTypePanel = type;
        panels.appendChild(panel);
    };

    createBackupPanel('own', t('memo.showOwnVillageNotes'));
    createBackupPanel('profile', t('memo.showOtherVillageProfileNotes'));
    controls.append(tabMenu, panels);
    titleHeading.insertAdjacentElement('afterend', controls);

    // Additive listener on the real native tabs so switching back to one hides our overlay.
    tabBar.querySelectorAll('.memo-tab').forEach(nativeTab => {
        nativeTab.addEventListener('click', hideExtraMemoDisplay);
    });

    tabBar.insertAdjacentElement('afterend', buildExtraMemoDisplay());

    if (!isPremium) {
        const firstButton = tabMenu.querySelector('[data-extra-memo-type-button="own"]');
        if (firstButton) selectExtraMemoType('own', firstButton);
        renderExtraMemoVillageTabs();
    }
}
