
//Village List
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

function injectVillagesListWidget(columnToUse) {
    if (settings_cookies.general['show__village_list']) {
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

        createWidgetElement({ identifier: 'Village List', contents: table, columnToUse, update: '', extra_name: '', description: '' });
    }
}

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
                let villageList = {};
                
                rows.forEach(function (row, index) {
                    let link = row.querySelector('td:first-child span:first-child a');
                    let name = link.querySelector('span').innerText.split('(')[0];
                    let coords = link.querySelector('span').innerText.split('(')[1];
                    let url = link.href;

                    villageList[index] = { name: name, url: url, coords: coords.replace(')', '')};
                });

                jsonToSave = JSON.stringify(villageList);
            }
        });
        localStorage.setItem('villages_info', jsonToSave);
    }
    return jsonToSave;
}