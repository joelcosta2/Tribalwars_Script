
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

        createWidgetElement({ identifier: t('villageList.title'), contents: table, columnToUse, update: '', extra_name: '', description: '', widgetKey: 'village_list' });
    }
}

/**
 * Ensures the village list in localStorage is up to date.
 * If the stored list is missing or its count differs from the server count, fetches
 * the overview_villages page and re-caches the name, URL, and coords of every village.
 * @returns {string|undefined} JSON string of the refreshed village list, or undefined if no update was needed.
 */
function prepareVillageList() {
    const villages_info = JSON.parse(localStorage.getItem('villages_info') || '[]');
    const villages_count = Array.isArray(villages_info) ? villages_info.length : 0;
    var jsonToSave = localStorage.getItem('villages_info') || '[]';

    const serverVillagesCount = (typeof game_data !== 'undefined' && game_data.player && !isNaN(Number(game_data.player.villages))) ? Number(game_data.player.villages) : 0;

    if (!villages_info || serverVillagesCount !== villages_count) {
        jsonToSave = '[]';
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
                    if (!link) return;
                    let name = link.querySelector('span').innerText.split('(')[0];
                    let coords = link.querySelector('span').innerText.split('(')[1];
                    let url = link.href;

                    villageList.push({ name: name, url: url, coords: coords.replace(')', '')});
                });

                jsonToSave = JSON.stringify(villageList);
            },
            error: function () {
                // Keep last valid value in storage; fallback stays as empty list string.
            }
        });

        if (typeof jsonToSave === 'string') {
            localStorage.setItem('villages_info', jsonToSave);
        } else {
            localStorage.setItem('villages_info', '[]');
            }
    }
    return jsonToSave;
}
