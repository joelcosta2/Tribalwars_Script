
// Build Extra List
function initializeBuilderQueueInfo(upgradesAvailableUrls, columnToUse) {
    var villageBuilderid = game_data.csrf;
    setCookie('village_builder_id', villageBuilderid, 30);
    var visualBuildingElements = document.getElementById("show_summary").getElementsByClassName("visual-building");
    var otherClasses = [];

    for (var i = 0; i < visualBuildingElements.length; i++) {
        var allClasses = visualBuildingElements[i].classList;

        // Itera sobre as classes do elemento
        for (var j = 0; j < allClasses.length; j++) {
            var currentClass = allClasses[j];

            if (currentClass !== "visual-building") {
                currentClass = currentClass.replace("visual-building-", "");
                otherClasses.push(currentClass);
            }
        }
    }

    //Create the extra build queue table
    var extraBuildQueueTable = document.createElement('table');
    extraBuildQueueTable.id = 'extra_build_queue_table';
    extraBuildQueueTable.className = 'vis bordered-table';
    extraBuildQueueTable.setAttribute('width', '100%');
    extraBuildQueueTable.style.verticalAlign = 'middle';

    var buildQueueElment = getBuildQueueElement();

    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    tr.appendChild(buildQueueElment);
    tbody.appendChild(tr);
    extraBuildQueueTable.appendChild(tbody);

    // Create the builds list table
    var buildsListTable = document.createElement('table');
    buildsListTable.className = 'vis bordered-table';
    buildsListTable.id = 'auto-construckt';
    buildsListTable.style.verticalAlign = 'middle';
    buildsListTable.style.width = '100%';

    var upgradableBuildingsIds = [];
    upgradesAvailableUrls.forEach(function (url) {
        var parts = url.split('&');
        parts.forEach(function (part) {
            var param = part.split('=');
            if (param[0] === 'id') {
                upgradableBuildingsIds.push(param[1]);
            }
        });
    });

    upgradableBuildingsIds.forEach(function (id, index) {
        var row = document.createElement('tr');
        row.id = 'main_buildrow_' + index;

        var cell = document.createElement('td');
        cell.style.display = 'flex';

        var imgLink = document.createElement('a');
        imgLink.href = '/game.php?village=' + game_data.village.id + '&screen=' + id;
        var img = document.createElement('img');
        img.className = 'bmain_list_img';
        var buildGraphicId = otherClasses.find(function (elem) {
            return elem.includes(id);
        });

        img.src = "https://dspt.innogamescdn.com/asset/b56f49d7/graphic/buildings/mid/" + buildGraphicId + ".png";
        img.setAttribute('data-title', id + upgradesAvailablesLevels[index]);
        imgLink.appendChild(img);
        cell.appendChild(imgLink);

        var textLink = document.createElement('a');
        textLink.href = '/game.php?village=' + game_data.village.id + '&screen=' + id;
        textLink.textContent = document.querySelector('.visual-label-' + id).getAttribute('data-title');
        cell.appendChild(textLink);

        var br = document.createElement('br');
        cell.appendChild(br);

        // Create the link for upgrading the building
        var upgradeLink = document.createElement('a');
        //upgradeLink.href = '/game.php?village=' + game_data.village.id + '&screen=main&action=upgrade_building&id=' + id + '&type=main&h=' + game_data.csrf;
        upgradeLink.className = 'btn current-quest';
        upgradeLink.setAttribute('data-building', id + upgradesAvailablesLevels[index]);
        upgradeLink.setAttribute('data-level-next', upgradesAvailablesLevels[index]);
        upgradeLink.setAttribute('data-title', 'O mercador');
        upgradeLink.id = 'main_buildlink_' + id + '_' + upgradesAvailablesLevels[index];
        upgradeLink.style.width = '-webkit-fill-available';
        upgradeLink.textContent = 'Level ' + upgradesAvailablesLevels[index];
        upgradeLink.onclick = function () {
            addToBuildQueue(buildGraphicId);
            callUpgradeBuilding('/game.php?village=' + game_data.village.id + '&screen=main&action=upgrade_building&id=' + id + '&type=main&h=' + game_data.csrf);
        }

        var upgradeCell = document.createElement('td');
        upgradeCell.appendChild(upgradeLink);

        row.appendChild(cell);
        row.appendChild(upgradeCell);
        buildsListTable.appendChild(row);
    });

    var extraBuildDiv = document.createElement('div');
    extraBuildDiv.appendChild(extraBuildQueueTable);
    extraBuildDiv.appendChild(buildsListTable);

    createAssetElement('Extra Building Queue', extraBuildDiv, columnToUse);

}

function addToBuildQueue(build_id) {
    build_queue.push(build_id);
    setCookie('build_queue', JSON.stringify(build_queue), 30);
    getBuildQueueElement(true);
}

function removeFromBuildQueue(build_id) {
    build_queue.splice(build_id, 1);
    setCookie('build_queue', JSON.stringify(build_queue), 30);
    getBuildQueueElement(true);
}

function getBuildQueueElement(update) {
    var td = document.createElement('td');
    td.style = '';
    td.className = '';

    build_queue.forEach(function (id, index) {
        var anchor = document.createElement('a');
        anchor.className = '';
        anchor.onclick = function () {
            removeFromBuildQueue(index);
        }

        var span = document.createElement('span');
        span.className = 'icon header village';
        span.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/b56f49d7/graphic/buildings/mid/' + id + '.png)';
        span.style.backgroundPosition = '0px 0px';
        span.style.backgroundSize = 'contain';
        span.style.backgroundRepeat = 'no-repeat';
        span.style.width = '24px';
        span.style.cursor = 'pointer';
        span.classList.add('tooltip');

        anchor.appendChild(span);
        td.appendChild(anchor);
    });
    if (update) {
        var extra_build_queue_table_tr = document.getElementById('extra_build_queue_table').getElementsByTagName('tr')[0];
        extra_build_queue_table_tr.innerHTML = td.outerHTML;
    }
    return td;
}

function callUpgradeBuilding(url) {
    $.ajax({
        'url': url,
        'type': 'GET',
        'success': function (data) {
            var tempElement = document.createElement('div');
            tempElement.innerHTML = data;
            var success = tempElement.querySelector('.autoHideBox');

        }
    });
}

function injectBuildQueueExtraList(columnToUse) {
    if (settings_cookies.general['show__extra_building_queue']) {
        $.ajax({
            'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=main',
            'type': 'GET',
            'success': function (data) {
                var tempElement = document.createElement('div');
                var upgradesAvailableUrls = [];
                tempElement.innerHTML = data;
                var btnCancelElements = tempElement.querySelectorAll('.btn-cancel:not([style*="display: none"])');
                var btnBuildElements = tempElement.querySelectorAll('.btn-build:not([style*="display: none"])');
                var visibleBtnBuildElements = Array.from(btnBuildElements).filter(function (element) {
                    return element.style.display !== 'none';
                });
                upgradesAvailableUrls = visibleBtnBuildElements.map(function (element) {
                    return element.href;
                });
                upgradesAvailablesLevels = visibleBtnBuildElements.map(function (element) {
                    return element.getAttribute('data-level-next');
                });

                initializeBuilderQueueInfo(upgradesAvailableUrls, columnToUse);
            }
        });
    }
}