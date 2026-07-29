
//Village List

/**
 * Builds an HTML string of table rows, one per village, using the list stored in localStorage.
 * Each row contains a link with the village icon and name.
 * @returns {string} HTML string of <tr> elements ready to be set as tbody innerHTML.
 */
function getVillagesDataURL() {
    var i = 0,
        villages = JSON.parse(localStorage.getItem('villages_info') || '[]'),
        villgersNum = sizeOfObject(villages);

    var villagesDataUrl = '';

    for (i = 0; i < villgersNum; i++) {
        var url = villages[i].url,
            name = villages[i].name;

        villagesDataUrl = villagesDataUrl + "<tr><td style='' class=''><a class='' href='" + url + "'><span class='icon header village'></span>" + name + "</a></td></tr>"
    }
    return villagesDataUrl;
}

/**
 * Builds and injects the Village List widget into the given column.
 * Renders all known villages as clickable links.
 * @param {string} columnToUse - Target column identifier passed to createWidgetElement.
 */
function injectVillagesListWidget(columnToUse) {
    if (settings_cookies.general['show__village_list']) {
        var villagesDataUrl = getVillagesDataURL();
        // Create the table element
        var table = document.createElement('table');
        table.id = 'village_overview_table';
        table.className = 'vis bordered-table';
        table.width = '100%';
        table.style.verticalAlign = 'middle';

        var tbody = document.createElement('tbody');
        tbody.innerHTML = villagesDataUrl;
        table.appendChild(tbody);

        createWidgetElement({ identifier: 'Village List', contents: table, columnToUse, update: '', extra_name: '', description: '' });
    }
}

/**
 * Ensures the village list in localStorage is up to date.
 * If the stored list is missing or its count differs from the server count, fetches
 * the overview_villages page and re-caches the name, URL, and coords of every village.
 * @returns {string|undefined} JSON string of the refreshed village list, or undefined if no update was needed.
 */
function prepareVillageList() {
    const villages_info = JSON.parse(localStorage.getItem('villages_info'));
    const villages_count = Object.keys(villages_info).length;

    if(!villages_info || game_data.player.villages !== villages_count) {
        var jsonToSave;
        $.ajax({
            url: game_data.link_base_pure + 'overview_villages',
            type: 'GET',
            async: false,
            success: function (data) {
                var tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                let rows = tempElement.querySelectorAll('#production_table tbody tr');
                let villageList = [];
                
                rows.forEach(function (row) {
                    let link = row.querySelector('td:first-child span:first-child a');
                    let name = link.querySelector('span').innerText.split('(')[0];
                    let coords = link.querySelector('span').innerText.split('(')[1];
                    let url = link.href;

                    villageList.push({ name: name, url: url, coords: coords.replace(')', '')});
                });

                jsonToSave = JSON.stringify(villageList);
            }
        });
        localStorage.setItem('villages_info', jsonToSave);
    }
    return jsonToSave;
}

/**
 * Builds and injects the Resource Dashboard widget into the given column.
 * Displays the last known wood/stone/iron counts for every visited village,
 * sorted alphabetically, with a relative timestamp showing how stale the data is.
 * @param {string} columnToUse - Target column identifier passed to createWidgetElement.
 */
function injectResourceDashboardWidget(columnToUse) {
    if (!settings_cookies.general['show__resource_dashboard']) return;

    const resources = JSON.parse(localStorage.getItem('villages_resources') || '{}');
    const entries = Object.values(resources).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const table = document.createElement('table');
    table.className = 'vis bordered-table';
    table.style.width = '100%';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Village', 'wood', 'stone', 'iron'].forEach((col, i) => {
        const th = document.createElement('th');
        if (i === 0) {
            th.textContent = col;
        } else {
            const icon = document.createElement('span');
            icon.className = 'icon header ' + col;
            icon.style.margin = '0';
            th.appendChild(icon);
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    if (!entries.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'Visit villages to populate this dashboard.';
        td.style.cssText = 'text-align:center;padding:5px;font-style:italic;';
        tr.appendChild(td);
        tbody.appendChild(tr);
    } else {
        entries.forEach(v => {
            const ageMin = Math.floor((Date.now() - v.ts) / 60000);
            const ageText = ageMin < 60 ? ageMin + 'm ago' : Math.floor(ageMin / 60) + 'h ago';
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.style.fontSize = '11px';
            tdName.style.whiteSpace = 'nowrap';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = v.name;
            const ageSmall = document.createElement('small');
            ageSmall.style.color = '#888';
            ageSmall.textContent = ' ' + ageText;
            tdName.appendChild(nameSpan);
            tdName.appendChild(ageSmall);

            const tdWood = document.createElement('td');
            tdWood.style.cssText = 'text-align:right;font-size:11px;';
            tdWood.textContent = v.wood;

            const tdStone = document.createElement('td');
            tdStone.style.cssText = 'text-align:right;font-size:11px;';
            tdStone.textContent = v.stone;

            const tdIron = document.createElement('td');
            tdIron.style.cssText = 'text-align:right;font-size:11px;';
            tdIron.textContent = v.iron;

            tr.append(tdName, tdWood, tdStone, tdIron);
            tbody.appendChild(tr);
        });
    }
    table.appendChild(tbody);

    createWidgetElement({
        identifier: 'Resource Dashboard',
        contents: table,
        columnToUse,
        update: false,
        description: 'Last known resources for all visited villages'
    });
}