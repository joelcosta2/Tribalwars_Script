
//Village List
function getVillagesDataURL() {
    var i = 0,
        villgersNum = sizeOfObject(villageList);

    var villagesDataUrl = '';

    for (i = 0; i < villgersNum; i++) {
        var url = villageList[i].url,
            name = villageList[i].name;

        villagesDataUrl = villagesDataUrl + "<tr><td style='' class=''><a class='' href='" + url + "'><span class='icon header village'></span>" + name + "</a></td></tr>"
    }
    return villagesDataUrl;
}

function injectVillagesListColumn(columnToUse) {
    if (showVillagesList) {
        var villagesDataUrl = getVillagesDataURL();
        // Criação da tabela
        var table = document.createElement('table');
        table.id = 'village_overview_table';
        table.className = 'vis bordered-table';
        table.width = '100%';
        table.style.verticalAlign = 'middle';

        var tbody = document.createElement('tbody');
        tbody.innerHTML = villagesDataUrl;
        table.appendChild(tbody);

        createAssetElement('Village List', table, columnToUse);
    }
}