
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
            name = villages[i].name,
            villageId = new URL(url, window.location.origin).searchParams.get('village'),
            currentVillageId = typeof game_data !== 'undefined' ? game_data.village?.id : null,
            selectedClass = String(villageId) === String(currentVillageId) ? 'selected' : '';

        villagesDataUrl = villagesDataUrl + "<tr><td style='' class='" + selectedClass + "'><a class='' href='" + url + "'><span class='icon header village'></span>" + name + "</a></td></tr>"
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
 * Reads the village rows from an overview_villages document.
 * @param {Document|HTMLElement} root
 * @returns {Array<{name:string, url:string, coords:string}>}
 */
function parseVillageList(root) {
    const villageList = [];
    const seenVillageIds = new Set();
    const rows = root.querySelectorAll('#production_table tbody tr .quickedit-vn[data-id]');

    rows.forEach(function (villageElement) {
        const villageId = villageElement.dataset.id;
        const link = villageElement.querySelector('.quickedit-content > a');
        const label = villageElement.querySelector('.quickedit-label');
        if (!villageId || !link || !label || seenVillageIds.has(villageId)) return;

        const villageUrl = new URL(link.href, window.location.origin);
        if (villageUrl.searchParams.get('village') !== villageId) return;

        const labelText = label.textContent || '';
        const coordsMatch = labelText.match(/\((\d{1,3}\|\d{1,3})\)/);
        if (!coordsMatch) return;

        const name = (label.dataset.text || labelText.slice(0, coordsMatch.index)).trim();
        if (!name) return;

        seenVillageIds.add(villageId);
        villageList.push({ name, url: villageUrl.toString(), coords: coordsMatch[1] });
    });

    return villageList;
}

/**
 * Ensures the village list in localStorage is up to date.
 * The current overview_villages table is used to refresh names without a request.
 * If the cache is missing or its count differs from the server count, fetches the
 * overview_villages page as a fallback and re-caches the village data.
 * @returns {string} JSON string of the current village list.
 */
function prepareVillageList() {
    let villagesInfo = [];
    try {
        const parsedVillages = JSON.parse(localStorage.getItem('villages_info') || '[]');
        villagesInfo = Array.isArray(parsedVillages) ? parsedVillages : [];
    } catch {
        villagesInfo = [];
    }

    const isOverviewVillages = typeof game_data !== 'undefined' && game_data.screen === 'overview_villages';
    if (isOverviewVillages) {
        const currentPageVillages = parseVillageList(document);
        if (currentPageVillages.length) {
            villagesInfo = currentPageVillages;
            localStorage.setItem('villages_info', JSON.stringify(villagesInfo));
        }
    }

    const serverVillagesCount = (typeof game_data !== 'undefined' && game_data.player && !isNaN(Number(game_data.player.villages))) ? Number(game_data.player.villages) : 0;
    if (!villagesInfo.length || serverVillagesCount !== villagesInfo.length) {
        $.ajax({
            url: game_data.link_base_pure + 'overview_villages',
            type: 'GET',
            async: false,
            success: function (data) {
                const tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                const fetchedVillages = parseVillageList(tempElement);
                if (fetchedVillages.length) villagesInfo = fetchedVillages;
            }
        });

        if (villagesInfo.length) localStorage.setItem('villages_info', JSON.stringify(villagesInfo));
    }

    return JSON.stringify(villagesInfo);
}
