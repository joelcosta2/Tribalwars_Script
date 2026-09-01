var villageGroupsWidgetState = {
    villageId: null,
    groups: null
};

function getVillageGroupsData(villageId) {
    if (typeof loadOverviewManualGroups !== 'function') return [];
    return loadOverviewManualGroups().map(function (group) {
        return {
            group_id: String(group.id),
            name: group.name,
            in_group: group.villageIds.includes(String(villageId))
        };
    });
}

function getVillageGroupsDynamic(data) {
    return data && Array.isArray(data.dynamicGroups) ? data.dynamicGroups : [];
}

function getVillageGroupsManual(data) {
    return data && Array.isArray(data.result) ? data.result : [];
}

function createVillageGroupsTable(rows, dynamic) {
    var table = document.createElement('table');
    table.className = 'vis';
    table.width = '100%';

    var tbody = document.createElement('tbody');
    rows.forEach(function (group) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.textContent = String(group.name || '');

        if (dynamic) {
            var marker = document.createElement('i');
            marker.style.float = 'right';
            marker.textContent = '(' + t('villageGroups.dynamic') + ')';
            cell.appendChild(marker);
        }

        row.appendChild(cell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    return table;
}

function createVillageGroupsManualTable(groups, editMode) {
    var table = document.createElement('table');
    table.id = 'group_table';
    table.className = 'vis';
    table.width = '100%';

    var tbody = document.createElement('tbody');
    groups.forEach(function (group) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        var paragraph = document.createElement('p');
        paragraph.className = 'p_groups';

        if (editMode) {
            var label = document.createElement('label');
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'checkbox_' + String(group.name || '').replace(/\s+/g, '_');
            checkbox.name = 'groups[]';
            checkbox.value = String(group.group_id);
            checkbox.className = 'check';
            checkbox.checked = group.in_group;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(String(group.name || '')));
            paragraph.appendChild(label);
        } else {
            paragraph.textContent = String(group.name || '');
        }

        cell.appendChild(paragraph);
        row.appendChild(cell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    return table;
}

function renderVillageGroupsWidget(container, data, villageId, editMode) {
    container.innerHTML = '';

    var dynamicGroups = getVillageGroupsDynamic(data);
    var manualGroups = getVillageGroupsManual(data);
    container.appendChild(createVillageGroupsTable(dynamicGroups, true));

    var assignment = document.createElement('div');
    assignment.id = 'group_assignment';
    var canEdit = !editMode;

    if (editMode) {
        var form = document.createElement('form');
        form.id = 'reassign_village_to_groups_form_group_assignment';
        form.method = 'POST';
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            saveVillageGroups(form, container, villageId);
        });
        form.appendChild(createVillageGroupsManualTable(manualGroups, true));

        var saveButton = document.createElement('input');
        saveButton.type = 'submit';
        saveButton.className = 'btn';
        saveButton.value = t('villageGroups.save');
        form.appendChild(saveButton);
        assignment.appendChild(form);
    } else {
        assignment.appendChild(createVillageGroupsManualTable(manualGroups.filter(function (group) {
            return group.in_group;
        }), false));

        if (canEdit) {
            var actionTable = document.createElement('table');
            actionTable.className = 'vis';
            actionTable.width = '100%';
            actionTable.style.marginTop = '-2px';
            var actionRow = actionTable.insertRow();
            var actionCell = actionRow.insertCell();
            var editLink = document.createElement('a');
            editLink.href = '#';
            editLink.textContent = t('villageGroups.edit');
            editLink.addEventListener('click', function (event) {
                event.preventDefault();
                renderVillageGroupsWidget(container, data, villageId, true);
            });
            actionCell.appendChild(editLink);
            assignment.appendChild(actionTable);
        }
    }

    container.appendChild(assignment);
}

function saveVillageGroups(form, container, villageId) {
    var groups = loadOverviewManualGroups();
    var selectedGroupIds = Array.from(form.querySelectorAll('input[name="groups[]"]:checked')).map(function (input) {
        return String(input.value);
    });
    groups.forEach(function (group) {
        var villageIds = group.villageIds.filter(function (id) {
            return String(id) !== String(villageId);
        });
        if (selectedGroupIds.includes(String(group.id))) villageIds.push(String(villageId));
        group.villageIds = villageIds;
    });
    saveOverviewManualGroups(groups);
    renderVillageGroupsWidget(container, { result: getVillageGroupsData(villageId) }, villageId, false);
}

function loadVillageGroupsWidgetData(container, villageId) {
    villageGroupsWidgetState.villageId = String(villageId);
    villageGroupsWidgetState.groups = getVillageGroupsData(villageId);
    renderVillageGroupsWidget(container, { result: villageGroupsWidgetState.groups }, villageId, false);
}

function injectVillageGroupsWidget() {
    if (!settings_cookies.general.show__village_groups) return;

    var villageId = game_data && game_data.village && game_data.village.id;
    if (!villageId) return;

    var widgetConfig = settings_cookies.widgets.find(function (widget) {
        return widget.name === 'village_groups';
    });
    var columnToUse = widgetConfig ? widgetConfig.column : LEFT_COLUMN;
    var contents = document.createElement('div');
    contents.id = 'village_groups_content';
    createWidgetElement({
        identifier: t('villageGroups.title'),
        title: t('villageGroups.title'),
        description: t('villageGroups.description'),
        contents: contents,
        columnToUse: columnToUse,
        update: true,
        widgetKey: 'village_groups'
    });
    loadVillageGroupsWidgetData(contents, villageId);
}
