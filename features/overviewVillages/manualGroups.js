const OVERVIEW_MANUAL_GROUPS_STORAGE_PREFIX = 'twpf_overview_manual_groups_v1';
const OVERVIEW_MANUAL_GROUP_NAVIGATION_KEY = 'twpf_overview_manual_group_navigation_v1';

const overviewManualGroupsState = {
    groups: null,
    groupFilter: '',
    selectedVillageIds: new Set(),
    sortBy: 'name',
    sortDirection: 'asc'
};

function getOverviewManualGroupsStorageKey() {
    const world = game_data?.world || window.location.hostname || 'unknown_world';
    const player = game_data?.player?.id || 'unknown_player';
    return `${OVERVIEW_MANUAL_GROUPS_STORAGE_PREFIX}_${world}_${player}`;
}

function normalizeOverviewManualGroup(group, index) {
    if (!group || typeof group !== 'object') return null;
    const name = String(group.name || '').trim();
    if (!name) return null;
    return {
        id: String(group.id || `local-${Date.now()}-${index}`),
        name,
        villageIds: Array.from(new Set((Array.isArray(group.villageIds) ? group.villageIds : [])
            .map(String)
            .filter(Boolean)))
    };
}

function loadOverviewManualGroups() {
    if (overviewManualGroupsState.groups) return overviewManualGroupsState.groups;
    let parsed = [];
    try {
        const raw = localStorage.getItem(getOverviewManualGroupsStorageKey());
        const value = raw ? JSON.parse(raw) : [];
        parsed = Array.isArray(value) ? value : [];
    } catch (error) {
        parsed = [];
    }
    overviewManualGroupsState.groups = parsed.map(normalizeOverviewManualGroup).filter(Boolean);
    return overviewManualGroupsState.groups;
}

function saveOverviewManualGroups(groups) {
    const normalized = groups.map(normalizeOverviewManualGroup).filter(Boolean);
    overviewManualGroupsState.groups = normalized;
    localStorage.setItem(getOverviewManualGroupsStorageKey(), JSON.stringify(normalized));
}

function getOverviewManualGroupNavigation() {
    try {
        const value = JSON.parse(localStorage.getItem(OVERVIEW_MANUAL_GROUP_NAVIGATION_KEY) || 'null');
        return value && value.groupId && Array.isArray(value.villageIds) ? value : null;
    } catch (error) {
        return null;
    }
}

function setOverviewManualGroupNavigation(groupId, villageIds) {
    if (!groupId) {
        localStorage.removeItem(OVERVIEW_MANUAL_GROUP_NAVIGATION_KEY);
        return;
    }
    localStorage.setItem(OVERVIEW_MANUAL_GROUP_NAVIGATION_KEY, JSON.stringify({
        groupId: String(groupId),
        villageIds: villageIds.map(String)
    }));
}

function createOverviewManualGroupId() {
    return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getOverviewManualGroupNames(groupIds, groups) {
    const names = groups.filter(group => groupIds.includes(group.id)).map(group => group.name);
    return names.length ? names.join(', ') : t('overviewVillages.manualGroupsUnassigned');
}

function isOverviewManualVillageVisible(village) {
    const group = loadOverviewManualGroups().find(item => item.id === overviewManualGroupsState.groupFilter);
    return !overviewManualGroupsState.groupFilter || !group || group.villageIds.includes(String(village.id));
}

function restoreOverviewManualGroupFilter() {
    if (overviewManualGroupsState.groupFilter) return;
    const navigation = getOverviewManualGroupNavigation();
    if (navigation && loadOverviewManualGroups().some(group => group.id === navigation.groupId)) {
        overviewManualGroupsState.groupFilter = navigation.groupId;
    }
}

function getOverviewManualGroupVillages(villages) {
    restoreOverviewManualGroupFilter();
    return villages.filter(isOverviewManualVillageVisible);
}

function getOverviewManualVillageSortValue(village, sortBy) {
    if (sortBy === 'points') return Number(village.pointsText.replace(/[^0-9]/g, '')) || 0;
    if (sortBy === 'farm') {
        return Number(village.farmText.split('/').pop().replace(/[^0-9]/g, '')) || 0;
    }
    return village.name.toLocaleLowerCase();
}

function sortOverviewManualVillages(villages) {
    const direction = overviewManualGroupsState.sortDirection === 'desc' ? -1 : 1;
    return villages.slice().sort((left, right) => {
        const leftValue = getOverviewManualVillageSortValue(left, overviewManualGroupsState.sortBy);
        const rightValue = getOverviewManualVillageSortValue(right, overviewManualGroupsState.sortBy);
        if (leftValue < rightValue) return -1 * direction;
        if (leftValue > rightValue) return 1 * direction;
        return String(left.id).localeCompare(String(right.id)) * direction;
    });
}

function getOverviewManualVillageLink(villageId, originalHref) {
    const groupId = overviewManualGroupsState.groupFilter;
    if (!groupId) return originalHref;
    const url = new URL(originalHref, window.location.origin);
    url.searchParams.set('village', String(villageId));
    url.searchParams.delete('group');
    return url.toString();
}

function setOverviewManualGroupFilter(panel, villages, groupId, onChange) {
    overviewManualGroupsState.groupFilter = groupId;
    const group = loadOverviewManualGroups().find(item => item.id === groupId);
    setOverviewManualGroupNavigation(groupId, group?.villageIds || []);
    if (panel) renderOverviewManualGroupsPanel(panel, villages);
    if (typeof onChange === 'function') onChange();
    else if (typeof refreshOverviewVillagesGroupFilter === 'function') refreshOverviewVillagesGroupFilter();
}

function createOverviewManualButton(text, onClick) {
    const button = document.createElement('input');
    button.type = 'button';
    button.className = 'btn';
    button.value = text;
    button.addEventListener('click', onClick);
    return button;
}

function createOverviewManualGroupMenu(villages, onChange) {
    restoreOverviewManualGroupFilter();
    const groups = loadOverviewManualGroups();
    const menu = document.createElement('div');
    menu.className = 'vis_item';
    menu.style.textAlign = 'center';
    menu.appendChild(document.createTextNode(t('overviewVillages.manualGroupsMenu') + ' '));

    const all = overviewManualGroupsState.groupFilter ? document.createElement('a') : document.createElement('strong');
    all.className = 'group-menu-item';
    all.textContent = overviewManualGroupsState.groupFilter
        ? '[' + t('overviewVillages.manualGroupsAllVillages') + ']'
        : '>' + t('overviewVillages.manualGroupsAllVillages') + '<';
    all.href = '#';
    all.addEventListener('click', function (event) {
        event.preventDefault();
        setOverviewManualGroupFilter(null, villages, '', onChange);
    });
    menu.appendChild(all);
    groups.forEach(function (group) {
        const link = overviewManualGroupsState.groupFilter === group.id
            ? document.createElement('strong')
            : document.createElement('a');
        link.href = '#';
        link.className = 'group-menu-item';
        link.textContent = overviewManualGroupsState.groupFilter === group.id
            ? '>' + group.name + '<'
            : '[' + group.name + ']';
        link.addEventListener('click', function (event) {
            event.preventDefault();
            setOverviewManualGroupFilter(null, villages, group.id, onChange);
        });
        menu.appendChild(document.createTextNode(' '));
        menu.appendChild(link);
    });
    return menu;
}

function createOverviewManualGroupTypeMenu() {
    const table = document.createElement('table');
    table.className = 'vis modemenu';
    table.style.width = '100%';
    table.style.marginBottom = '10px';
    const row = table.insertRow();

    [
        ['overviewVillages.manualGroupsDynamic', false],
        ['overviewVillages.manualGroupsTitle', true],
        ['overviewVillages.manualGroupsMenuTab', false]
    ].forEach(function ([key, selected]) {
        const cell = row.insertCell();
        cell.style.textAlign = 'center';
        cell.style.width = '33.333333333333%';
        if (selected) cell.className = 'selected';
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = t(key);
        link.addEventListener('click', event => event.preventDefault());
        cell.appendChild(link);
    });

    return table;
}

function createOverviewManualGroupConfig(panel, villages, groups) {
    const config = document.createElement('div');
    config.id = 'group_config';
    config.className = 'group_config';
    config.style.marginBottom = '10px';

    const createForm = document.createElement('form');
    createForm.id = 'add_group_form';
    createForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (!name || groups.some(group => group.name.toLowerCase() === name.toLowerCase())) {
            alert(t('overviewVillages.manualGroupsInvalidName'));
            return;
        }
        groups.push({ id: createOverviewManualGroupId(), name, villageIds: [] });
        saveOverviewManualGroups(groups);
        if (typeof renderOverviewVillagesGroupMenu === 'function') renderOverviewVillagesGroupMenu();
        renderOverviewManualGroupsPanel(panel, villages);
    });
    createForm.appendChild(document.createTextNode(t('overviewVillages.manualGroupsCreateLabel')));
    const nameInput = document.createElement('input');
    nameInput.name = 'group_name';
    nameInput.id = 'add_new_group_name';
    createForm.appendChild(nameInput);
    const createSubmit = document.createElement('input');
    createSubmit.type = 'submit';
    createSubmit.className = 'btn';
    createSubmit.value = t('overviewVillages.manualGroupsCreate');
    createForm.appendChild(createSubmit);
    config.appendChild(createForm);

    const groupTable = document.createElement('table');
    groupTable.className = 'vis';
    groupTable.style.width = '100%';
    const heading = groupTable.insertRow();
    const headingCell = document.createElement('th');
    headingCell.textContent = t('overviewVillages.manualGroupsTitle');
    heading.appendChild(headingCell);
    groups.forEach(function (group) {
        const row = groupTable.insertRow();
        const showCell = row.insertCell();
        const link = overviewManualGroupsState.groupFilter === group.id
            ? document.createElement('strong')
            : document.createElement('a');
        link.href = '#';
        link.textContent = group.name;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            setOverviewManualGroupFilter(panel, villages, group.id);
        });
        showCell.appendChild(link);

        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.className = 'float_right';
        deleteLink.title = t('overviewVillages.manualGroupsDelete');
        const deleteImage = document.createElement('img');
        deleteImage.src = '/graphic/delete_14.png';
        deleteImage.alt = t('overviewVillages.manualGroupsDelete');
        deleteLink.appendChild(deleteImage);
        deleteLink.addEventListener('click', function (event) {
            event.preventDefault();
            if (!confirm(t('overviewVillages.manualGroupsDeleteConfirm', { name: group.name }))) return;
            saveOverviewManualGroups(groups.filter(item => item.id !== group.id));
            if (overviewManualGroupsState.groupFilter === group.id) {
                overviewManualGroupsState.groupFilter = '';
                setOverviewManualGroupNavigation('', []);
            }
            if (typeof renderOverviewVillagesGroupMenu === 'function') renderOverviewVillagesGroupMenu();
            renderOverviewManualGroupsPanel(panel, villages);
        });
        showCell.appendChild(deleteLink);

        const renameLink = document.createElement('a');
        renameLink.href = '#';
        renameLink.style.margin = '0 5px';
        renameLink.title = t('overviewVillages.manualGroupsRename');
        const renameImage = document.createElement('img');
        renameImage.src = '/graphic/rename.png';
        renameImage.alt = t('overviewVillages.manualGroupsRename');
        renameLink.appendChild(renameImage);
        renameLink.addEventListener('click', function (event) {
            event.preventDefault();
            const name = prompt(t('overviewVillages.manualGroupsRenamePrompt'), group.name)?.trim();
            if (name === null || name === undefined) return;
            if (!name || groups.some(item => item.id !== group.id && item.name.toLowerCase() === name.toLowerCase())) {
                alert(t('overviewVillages.manualGroupsInvalidName'));
                return;
            }
            group.name = name;
            saveOverviewManualGroups(groups);
            if (typeof renderOverviewVillagesGroupMenu === 'function') renderOverviewVillagesGroupMenu();
            renderOverviewManualGroupsPanel(panel, villages);
        });
        showCell.appendChild(renameLink);
    });
    const allRow = groupTable.insertRow();
    const allCell = allRow.insertCell();
    const allLink = overviewManualGroupsState.groupFilter
        ? document.createElement('a')
        : document.createElement('strong');
    allLink.href = '#';
    allLink.textContent = overviewManualGroupsState.groupFilter
        ? t('overviewVillages.manualGroupsAllVillages')
        : '>' + t('overviewVillages.manualGroupsAllVillages') + '<';
    allLink.addEventListener('click', event => {
        event.preventDefault();
        setOverviewManualGroupFilter(panel, villages, '');
    });
    allCell.appendChild(allLink);
    config.appendChild(groupTable);
    return config;
}

function createOverviewManualAssignmentTable(panel, villages, groups) {
    const filteredVillages = sortOverviewManualVillages(getOverviewManualGroupVillages(villages));
    const form = document.createElement('form');
    form.addEventListener('submit', function (event) { event.preventDefault(); });

    const table = document.createElement('table');
    table.id = 'group_assign_table';
    table.className = 'vis overview_table';
    table.style.width = '100%';
    const header = table.insertRow();
    const headers = [
        ['name', t('overviewVillages.manualGroupsVillage') + ' (' + filteredVillages.length + ')'],
        [null, t('overviewVillages.manualGroupsQuantity')],
        ['points', t('overviewVillages.manualGroupsPoints')],
        ['farm', t('overviewVillages.manualGroupsFarm')],
        [null, t('overviewVillages.manualGroupsGroups')],
        [null, t('overviewVillages.manualGroupsEdit')]
    ];
    headers.forEach(function ([sortBy, text]) {
        const cell = document.createElement('th');
        if (!sortBy) {
            cell.textContent = text;
        } else {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = text;
            link.addEventListener('click', function (event) {
                event.preventDefault();
                if (overviewManualGroupsState.sortBy === sortBy) {
                    overviewManualGroupsState.sortDirection = overviewManualGroupsState.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    overviewManualGroupsState.sortBy = sortBy;
                    overviewManualGroupsState.sortDirection = 'asc';
                }
                renderOverviewManualGroupsPanel(panel, villages);
            });
            cell.appendChild(link);
        }
        header.appendChild(cell);
    });

    filteredVillages.forEach(function (village, index) {
        const villageId = String(village.id);
        const assignedGroups = groups.filter(group => group.villageIds.includes(villageId));
        const row = table.insertRow();
        row.className = 'row_' + (index % 2 ? 'b' : 'a');
        const villageCell = row.insertCell();
        const select = document.createElement('input');
        select.type = 'checkbox';
        select.value = villageId;
        select.checked = overviewManualGroupsState.selectedVillageIds.has(villageId);
        select.setAttribute('aria-label', t('overviewVillages.manualGroupsSelectVillage', { name: village.name }));
        select.addEventListener('change', function () {
            if (select.checked) overviewManualGroupsState.selectedVillageIds.add(villageId);
            else overviewManualGroupsState.selectedVillageIds.delete(villageId);
        });
        villageCell.appendChild(select);
        appendVillageIdentityCell(row, village, villageCell);
        const villageLink = villageCell.querySelector('.quickedit-content > a');
        if (villageLink) villageLink.href = getOverviewManualVillageLink(villageId, villageLink.href);

        row.insertCell().textContent = assignedGroups.length || 0;
        const pointsCell = row.insertCell();
        pointsCell.innerHTML = village.pointsHtml || '--';
        const farmCell = row.insertCell();
        farmCell.innerHTML = village.farmHtml || '--';
        row.insertCell().textContent = getOverviewManualGroupNames(
            assignedGroups.map(group => group.id),
            groups
        );

        const editCell = row.insertCell();
        const edit = document.createElement('a');
        edit.href = '#';
        edit.textContent = '» ' + t('overviewVillages.manualGroupsEdit').toLowerCase();
        edit.addEventListener('click', function (event) {
            event.preventDefault();
            if (editCell.dataset.open === 'true') {
                editCell.dataset.open = 'false';
                editRow.hidden = true;
                return;
            }
            editCell.dataset.open = 'true';
            editRow.hidden = false;
        });
        editCell.appendChild(edit);

        const editRow = table.insertRow();
        editRow.className = 'nohover';
        editRow.hidden = true;
        const editCellContent = editRow.insertCell();
        editCellContent.colSpan = 6;
        groups.forEach(function (group) {
            const label = document.createElement('label');
            label.style.marginRight = '12px';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = group.villageIds.includes(villageId);
            checkbox.addEventListener('change', function () {
                if (checkbox.checked && !group.villageIds.includes(villageId)) group.villageIds.push(villageId);
                if (!checkbox.checked) group.villageIds = group.villageIds.filter(id => id !== villageId);
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + group.name));
            editCellContent.appendChild(label);
        });
        editCellContent.appendChild(createOverviewManualButton(t('overviewVillages.manualGroupsSave'), function () {
            saveOverviewManualGroups(groups);
            renderOverviewManualGroupsPanel(panel, villages);
        }));
    });

    const selectAllRow = table.insertRow();
    const selectAllCell = selectAllRow.insertCell();
    selectAllCell.colSpan = 6;
    const selectAll = document.createElement('input');
    selectAll.type = 'checkbox';
    selectAll.id = 'select_all';
    selectAll.checked = filteredVillages.length > 0
        && filteredVillages.every(village => overviewManualGroupsState.selectedVillageIds.has(String(village.id)));
    selectAll.addEventListener('change', function () {
        filteredVillages.forEach(village => {
            const id = String(village.id);
            if (selectAll.checked) overviewManualGroupsState.selectedVillageIds.add(id);
            else overviewManualGroupsState.selectedVillageIds.delete(id);
        });
        renderOverviewManualGroupsPanel(panel, villages);
    });
    selectAllCell.appendChild(selectAll);
    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = 'select_all';
    selectAllLabel.appendChild(document.createTextNode(' ' + t('overviewVillages.manualGroupsSelectAll')));
    selectAllCell.appendChild(selectAllLabel);
    form.appendChild(table);

    const bulk = document.createElement('div');
    const groupSelect = document.createElement('select');
    groups.forEach(group => groupSelect.appendChild(new Option(group.name, group.id)));
    bulk.appendChild(groupSelect);
    bulk.appendChild(createOverviewManualButton(t('overviewVillages.manualGroupsAdd'), function () {
        const group = groups.find(item => item.id === groupSelect.value);
        if (!group) return;
        overviewManualGroupsState.selectedVillageIds.forEach(id => {
            if (!group.villageIds.includes(id)) group.villageIds.push(id);
        });
        saveOverviewManualGroups(groups);
        renderOverviewManualGroupsPanel(panel, villages);
    }));
    bulk.appendChild(createOverviewManualButton(t('overviewVillages.manualGroupsRemove'), function () {
        const group = groups.find(item => item.id === groupSelect.value);
        if (!group) return;
        group.villageIds = group.villageIds.filter(id => !overviewManualGroupsState.selectedVillageIds.has(id));
        saveOverviewManualGroups(groups);
        renderOverviewManualGroupsPanel(panel, villages);
    }));
    if (overviewManualGroupsState.groupFilter) {
        bulk.appendChild(createOverviewManualButton(t('overviewVillages.manualGroupsMove'), function () {
            const sourceGroup = groups.find(item => item.id === overviewManualGroupsState.groupFilter);
            const targetGroup = groups.find(item => item.id === groupSelect.value);
            if (!sourceGroup || !targetGroup || sourceGroup.id === targetGroup.id) return;
            sourceGroup.villageIds = sourceGroup.villageIds.filter(id => !overviewManualGroupsState.selectedVillageIds.has(id));
            overviewManualGroupsState.selectedVillageIds.forEach(id => {
                if (!targetGroup.villageIds.includes(id)) targetGroup.villageIds.push(id);
            });
            saveOverviewManualGroups(groups);
            renderOverviewManualGroupsPanel(panel, villages);
        }));
    }
    form.appendChild(bulk);
    return form;
}

function renderOverviewManualGroupsPanel(panel, villages) {
    const groups = loadOverviewManualGroups();
    restoreOverviewManualGroupFilter();
    panel.replaceChildren();
    panel.appendChild(createOverviewManualGroupTypeMenu());
    panel.appendChild(createOverviewManualGroupConfig(panel, villages, groups));
    const separator = document.createElement('hr');
    separator.size = '3';
    panel.appendChild(separator);
    panel.appendChild(createOverviewManualAssignmentTable(panel, villages, groups));
}

function renderOverviewVillagesManualGroupsTable(panel, context) {
    renderOverviewManualGroupsPanel(panel, context.villages);
}
