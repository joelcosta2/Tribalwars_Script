
// Build Extra List
function initializeBuilderQueueInfoAvailable(upgradesAvailableUrls, columnToUse, buildQueueElment, update = false) {
    var villageBuilderid = game_data.csrf;
    localStorage.setItem('village_builder_id', villageBuilderid);
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

    createAssetElement('Extra Building Queue', extraBuildDiv, columnToUse, update);

}


function initializeBuilderQueueInfoAll(allAvailableBuildingsImgs, allAvailableBuildingLevels, columnToUse, buildQueueElment, update = false) {
    var villageBuilderid = game_data.csrf;
    localStorage.setItem('village_builder_id', villageBuilderid);

    //Create the extra build queue table
    var extraBuildQueueTable = document.createElement('table');
    extraBuildQueueTable.id = 'extra_build_queue_table';
    extraBuildQueueTable.className = 'vis bordered-table';
    extraBuildQueueTable.setAttribute('width', '100%');
    extraBuildQueueTable.style.verticalAlign = 'middle';

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

    allAvailableBuildingsImgs.forEach(function (url, index) {
        var buildId = url.match(/([^\/]+?)(?=\d+\.\w+$)/)[1];
        var buildLvel = url.match(/([^\/]+?)(?=\.\w+$)/)[1];
        var row = document.createElement('tr');
        row.id = 'main_buildrow_' + index;

        var cell = document.createElement('td');
        cell.style.display = 'flex';

        var imgLink = document.createElement('a');
        imgLink.href = '/game.php?village=' + game_data.village.id + '&screen=' + buildId;
        var img = document.createElement('img');
        img.className = 'bmain_list_img';
        img.src = url;
        img.setAttribute('data-title', buildLvel);
        imgLink.appendChild(img);
        cell.appendChild(imgLink);

        var textLink = document.createElement('a');
        textLink.href = '/game.php?village=' + game_data.village.id + '&screen=' + buildId;
        textLink.textContent = document.querySelector('.visual-label-' + buildId).getAttribute('data-title');
        cell.appendChild(textLink);

        var br = document.createElement('br');
        cell.appendChild(br);

        // Create the link for upgrading the building
        var upgradeLink = document.createElement('a');
        upgradeLink.className = 'btn current-quest';
        upgradeLink.setAttribute('data-building', buildId + allAvailableBuildingLevels[index]);
        upgradeLink.setAttribute('data-level-next', allAvailableBuildingLevels[index]);
        upgradeLink.setAttribute('data-title', 'O mercador');
        upgradeLink.id = 'main_buildlink_' + buildId + '_' + allAvailableBuildingLevels[index];
        upgradeLink.style.width = '-webkit-fill-available';
        upgradeLink.textContent = 'Level ' + allAvailableBuildingLevels[index];
        upgradeLink.onclick = function () {
            addToBuildQueue(buildId, false);
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

    createAssetElement('Extra Building Queue', extraBuildDiv, columnToUse, update);

}

function addToBuildQueue(build_id, fromQueueList = true) {
    if (!fromQueueList) {
        if (!isBuildQueueFull) {
            callUpgradeBuilding('/game.php?village=' + game_data.village.id + '&screen=main&action=upgrade_building&id=' + build_id + '&type=main&h=' + game_data.csrf);
        } else {
            var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue')) || [];
            extra_building_queue.push(build_id);
            localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue));
            injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
        }
    } else {
        var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue'));
        callUpgradeBuilding('/game.php?village=' + game_data.village.id + '&screen=main&action=upgrade_building&id=' + extra_building_queue[0] + '&type=main&h=' + game_data.csrf);

        extra_building_queue.shift();
        localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue));
        injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
    }
}


function removeFromBuildQueue(build_index) {
    var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue'));
    extra_building_queue.splice(build_index, 1);
    localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue));
    injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
}

function callUpgradeBuilding(url) {
    $.ajax({
        'url': url,
        'type': 'GET',
        'success': function (data) {
            injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
        }
    });
}

function callRemoveBuildingQueue(url) {
    $.ajax({
        'url': url,
        'type': 'GET',
        'success': function (data) {
            injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
        }
    });
}
var isBuildQueueFull = false;
function injectBuildQueueExtraList(columnToUse, update = false) {
    if (settings_cookies.general['show__extra_building_queue']) {
        $.ajax({
            'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=main',
            'type': 'GET',
            'success': function (data) {
                var tempElement = document.createElement('div');
                var upgradesAvailableUrls = [];
                var allAvailableBuildingsImgs = [];
                var allAvailableBuildingLevels = [];
                tempElement.innerHTML = data;
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

                var buildingsElement = tempElement.querySelector('#buildings');
                if (buildingsElement) {
                    var trs = buildingsElement.querySelectorAll('tr');
                    trs.forEach(function (tr) {
                        if (tr.id !== '') {
                            var tds = tr.querySelectorAll('td');
                            if (tds.length > 2) {
                                var span = tds[0].querySelector('span');
                                var lvl
                                if (span) {
                                    lvl = span.textContent.match(/\d+/);
                                    if (lvl) {
                                        allAvailableBuildingLevels.push(lvl[0]);
                                    }
                                }

                                var a = tds[0].querySelector('a');
                                if (a && lvl) {
                                    allAvailableBuildingsImgs.push(a.querySelector('img').src);
                                }
                            }
                        }
                    });
                }

                var td = document.createElement('td');
                var cancelConfirmIds = [];
                var queueBuildIds = [];
                var queueBuildIdsOld = [];
                var cancelButtons = tempElement.querySelectorAll('.btn-cancel');
                var timeLastSlot, timeNextSlot, dateLastSlot, dateNextSlot;

                if (cancelButtons.length == 2) {
                    var lastBuildTime = cancelButtons[1].parentElement.parentElement.children[3].textContent.split(' ');
                    isBuildQueueFull = true;
                    timeLastSlot = lastBuildTime[2].split(':');


                    //TODO: Refactor this code
                    //Hardcoded "day" for now
                    if (lastBuildTime[0] === 'hoje') {
                        dateLastSlot = new Date().setHours(timeLastSlot[0], timeLastSlot[1], timeLastSlot[2]);
                    } else if (lastBuildTime[0] === 'amanhã') {
                        dateLastSlot.setDate(new Date().getDate() + 1);
                        dateLastSlot.setHours(timeLastSlot[0], timeLastSlot[1], timeLastSlot[2]);
                    }
                    localStorage.setItem('extra_building_queue_last_slot', dateLastSlot);
                } else if (cancelButtons.length == 1) {
                    var nextSlotTime = cancelButtons[0].parentElement.parentElement.children[3].textContent.split(' ');
                    isBuildQueueFull = false;
                    timeNextSlot = nextSlotTime[2].split(':');

                    if (nextSlotTime[0] === 'hoje') {
                        dateNextSlot = new Date().setHours(timeNextSlot[0], timeNextSlot[1], timeNextSlot[2]);
                    } else if (nextSlotTime[0] === 'amanhã') {
                        dateNextSlot.setDate(new Date().getDate() + 1);
                        dateNextSlot.setHours(timeNextSlot[0], timeNextSlot[1], timeNextSlot[2]);
                    }
                    localStorage.setItem('extra_building_queue_next_slot', dateNextSlot);
                } else {
                    isBuildQueueFull = false;
                    localStorage.setItem('extra_building_queue_last_slot', 0);
                    localStorage.setItem('extra_building_queue_next_slot', 0);
                }

                cancelButtons.forEach(function (element) {
                    cancelConfirmIds.push(element.href.match(/id=(\d+)/)?.[1]);
                    queueBuildIdsOld.push(element.parentElement.parentElement.querySelector('.lit-item > img').src.split('/').pop().replace(/\.[^/.]+$/, ""));
                })

                queueBuildIds = queueBuildIdsOld.concat(JSON.parse(localStorage.getItem('extra_building_queue')) || []);

                queueBuildIds.forEach(function (id) {
                    var anchor = document.createElement('a');
                    anchor.className = '';
                    anchor.onclick = function () {
                        var index = Array.from(this.parentElement.children).indexOf(this);
                        removeFromBuildQueue(index - 2); //todo: NOT WORKING
                        //callRemoveBuildingQueue('/game.php?village=' + game_data.village.id + '&screen=main');
                    }

                    anchor.addEventListener('mouseenter', function (event) {
                        var interval = setInterval(function () {
                            var storedDate = new Date(JSON.parse(localStorage.getItem('extra_building_queue_last_slot')));
                            var currentDate = new Date();
                            var differenceInMilliseconds = storedDate - currentDate;
                            var differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
                            differenceInMinutes = Math.floor(differenceInMinutes * 60);
                            var tooltip = document.querySelector('#tooltip h3');
                            tooltip.textContent = differenceInMinutes + ' _min';
                            showTooltipNoText(event.target, true);
                        }, 1000);

                        anchor.addEventListener('mouseleave', function () {
                            clearInterval(interval);
                            showTooltip(event.target, false);
                        });
                    });



                    var span = document.createElement('span');
                    span.className = 'icon header village';
                    span.style.backgroundImage = 'url(' + allAvailableBuildingsImgs.find(element => element.includes(id)) + ')';
                    span.style.backgroundPosition = '0px 0px';
                    span.style.backgroundSize = 'contain';
                    span.style.backgroundRepeat = 'no-repeat';
                    span.style.width = '24px';
                    span.style.cursor = 'pointer';
                    span.classList.add('tooltip');

                    anchor.appendChild(span);
                    td.appendChild(anchor);
                });
                if (settings_cookies.general['show__extra_building_queue_all']) {
                    initializeBuilderQueueInfoAll(allAvailableBuildingsImgs, allAvailableBuildingLevels, columnToUse, td, update);
                } else {
                    initializeBuilderQueueInfoAvailable(upgradesAvailableUrls, columnToUse, td, update);

                }
            }
        });
    }
}