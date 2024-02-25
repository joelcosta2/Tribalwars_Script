
// Build Extra List
function injectExtraBuildQueue(availableBuildingsImgs, availableBuildingLevels, columnToUse, buildQueueElment, update = false) {
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

    //Create the table with all available builds
    availableBuildingsImgs.forEach(function (url, index) {
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
        upgradeLink.className = 'btn btn-build current-quest';
        upgradeLink.setAttribute('data-building', (buildId + availableBuildingLevels[index] + 1));
        upgradeLink.setAttribute('data-level-next', (parseInt(availableBuildingLevels[index]) + 1));
        upgradeLink.setAttribute('data-title', 'O mercador');
        upgradeLink.id = 'main_buildlink_' + buildId + '_' + (parseInt(availableBuildingLevels[index]) + 1);
        upgradeLink.style.width = '-webkit-fill-available';
        upgradeLink.textContent = 'Level ' + (parseInt(availableBuildingLevels[index]) + 1);
        upgradeLink.onclick = function () {
            addToBuildQueue(buildId);
        }

        var upgradeCell = document.createElement('td');
        upgradeCell.appendChild(upgradeLink);

        row.appendChild(cell);
        row.appendChild(upgradeCell);
        buildsListTable.appendChild(row);
    });

    // Create the build queue error container
    var extraBuildDivTemp = document.createElement('div');
    var errorBuildDiv = document.createElement('div');
    var errorBuildContent = document.createElement('div');
    errorBuildContent.id = 'error_build_queue_content';
    errorBuildContent.textContent = 'Error Adding To Queue';
    errorBuildContent.className = 'content';
    errorBuildDiv.style.display = 'none';
    errorBuildDiv.className = 'error_box';
    errorBuildDiv.appendChild(errorBuildContent);
    extraBuildDivTemp.appendChild(errorBuildDiv);


    var extraBuildDiv = document.createElement('div');
    extraBuildDiv.appendChild(extraBuildDivTemp);
    extraBuildDiv.appendChild(extraBuildQueueTable);
    extraBuildDiv.appendChild(buildsListTable);

    createWidgetElement('Extra Building Queue', extraBuildDiv, columnToUse, update);
}

function getCurrentQueueListElement(tempElement, allAvailableBuildingsImgs) {
    var buildQueueElment = document.createElement('td');
    var cancelConfirmIds = [];
    var queueBuildIdsActive = [];
    var cancelButtons = tempElement.querySelectorAll('.btn-cancel');
    var dateLastSlot, dateNextSlot;

    //Get times from the cancel buttons row and check if the queue is full
    if (cancelButtons.length == 2) {
        isBuildQueueFull = true;
        debugger
        var lastBuildTime = extractTimeFromHTML(cancelButtons[1].parentElement.parentElement.children[3].textContent);
        dateLastSlot = new Date().setDate(new Date().getDate() + lastBuildTime[0]);
        dateLastSlot = new Date(dateLastSlot).setHours(lastBuildTime[1], lastBuildTime[2]);
        localStorage.setItem('extra_building_queue_last_slot', dateLastSlot);

        var nextSlotTime = extractTimeFromHTML(cancelButtons[0].parentElement.parentElement.children[3].textContent);
        dateNextSlot = new Date().setDate(new Date().getDate() + nextSlotTime[0]);
        dateNextSlot = new Date(dateNextSlot).setHours(nextSlotTime[1], nextSlotTime[2]);
        localStorage.setItem('extra_building_queue_next_slot', dateNextSlot);
    } else if (cancelButtons.length == 1) {
        isBuildQueueFull = false;
        var nextSlotTime = extractTimeFromHTML(cancelButtons[0].parentElement.parentElement.children[3].textContent);
        dateNextSlot = new Date().setDate(new Date().getDate() + dateNextSlot[0]);
        dateNextSlot = new Date(dateLastSlot).setHours(dateNextSlot[1], dateNextSlot[2]);
        localStorage.setItem('extra_building_queue_next_slot', dateNextSlot);
    } else {
        isBuildQueueFull = false;
        localStorage.setItem('extra_building_queue_last_slot', 0);
        localStorage.setItem('extra_building_queue_next_slot', 0);
    }

    cancelButtons.forEach(function (element) {
        cancelConfirmIds.push(element.href.match(/id=(\d+)/)?.[1]);
        queueBuildIdsActive.push(element.parentElement.parentElement.querySelector('.lit-item > img').src.split('/').pop().replace(/\.[^/.]+$/, ""));
    })

    var queueBuildIds = JSON.parse(localStorage.getItem('extra_building_queue') || '[]');
    if (queueBuildIdsActive.length) {
        queueBuildIdsActive.forEach(function (id) {
            var anchor = document.createElement('a');
            anchor.className = '';
            anchor.style.display = 'inline-flex';

            /*anchor.onclick = function () {
                var index = Array.from(this.parentElement.children).indexOf(this);
                removeFromBuildQueue(index); //todo: NOT WORKING
                //callRemoveBuildingQueue('/game.php?village=' + game_data.village.id + '&screen=main');
            }*/

            /*anchor.addEventListener('mouseenter', function (event) {
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
            });*/

            var span = document.createElement('span');
            span.className = 'icon header village active_queue';
            span.style.backgroundImage = 'url(' + allAvailableBuildingsImgs.find(element => element.includes(id)) + ')';
            span.style.backgroundPosition = '0px 0px';
            span.style.backgroundSize = 'contain';
            span.style.backgroundRepeat = 'no-repeat';
            span.style.width = '24px';
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            //span.style.cursor = 'pointer';
            span.classList.add('tooltip');

            var progressBar = document.createElement('div');
            progressBar.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background-color: #4caf50;';
            span.appendChild(progressBar);
            anchor.appendChild(span);
            buildQueueElment.appendChild(anchor);
        });
    }
    if (queueBuildIds.length) {
        queueBuildIds.forEach(function (id) {
            var anchor = document.createElement('a');
            anchor.className = '';
            anchor.style.display = 'inline-flex';
            anchor.style.backgroundColor = 'red';
            anchor.onclick = function () {
                var index = Array.from(this.parentElement.children).indexOf(this);
                removeFromBuildQueue(index - queueBuildIdsActive.length); //todo: NOT WORKING
                //callRemoveBuildingQueue('/game.php?village=' + game_data.village.id + '&screen=main');
            }

            /*anchor.addEventListener('mouseenter', function (event) {
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
            });*/

            var span = document.createElement('span');
            span.className = 'icon header village';
            span.style.backgroundImage = 'url(' + allAvailableBuildingsImgs.find(element => element.includes(id)) + ')';
            span.style.backgroundPosition = '0px 0px';
            span.style.backgroundSize = 'contain';
            span.style.backgroundRepeat = 'no-repeat';
            span.style.width = '24px';
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.cursor = 'pointer';
            span.classList.add('tooltip');

            anchor.appendChild(span);
            buildQueueElment.appendChild(anchor);
        });
    }
    return buildQueueElment;

}

function getAllBuildingsImages(tempElement) {
    var buildingsElement = tempElement.querySelector('#buildings');
    var allAvailableBuildingsImgs = [], availableBuildingsImgs = [], allAvailableBuildingLevels = [], availableBuildingLevels = [];
    if (buildingsElement) {
        var trs = buildingsElement.querySelectorAll('tr');
        trs.forEach(function (tr) {
            if (tr.id !== '') {
                var tds = tr.querySelectorAll('td');
                if (tds.length > 2) {
                    var buildButtons = tr.querySelector('.btn-build');
                    if (buildButtons) {
                        //get lvls and images for available buildings only
                        if (buildButtons.style.display !== 'none') {
                            var span = tds[0].querySelector('span'), lvl;
                            if (span) {
                                lvl = span.textContent.match(/\d+/);
                                if (lvl) {
                                    availableBuildingLevels.push(lvl[0]);
                                }
                            }
                            var a = tds[0].querySelector('a');
                            if (a && lvl) {
                                availableBuildingsImgs.push(a.querySelector('img').src);
                            }
                        }
                        //get lvls and images for all buildings
                        var span = tds[0].querySelector('span'), lvl;
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
            }
        });
    }

    return { availableBuildingsImgs, availableBuildingLevels, allAvailableBuildingsImgs, allAvailableBuildingLevels };
}

function addToBuildQueue(build_id) {
    if (build_id) {
        if (!isBuildQueueFull && !JSON.parse(localStorage.getItem('waiting_for_queue')).buildId) {
            callUpgradeBuilding(build_id);
        } else {
            var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue') || '[]');
            extra_building_queue.push(build_id)
            localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue));
            injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
        }
    } else {
        var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue'));
        callUpgradeBuilding(extra_building_queue[0]);
    }
}

function removeFromBuildQueue(build_index) {
    var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue'));
    extra_building_queue.splice(build_index, 1);
    localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue));

    if (build_index === 0) {
        localStorage.setItem('function_extra_building_queue', JSON.stringify(''));
        localStorage.setItem('waiting_for_queue', JSON.stringify({}));
    }
    injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
}

function callUpgradeBuilding(id) {
    $.ajax({
        'url': '/game.php?village=' + game_data.village.id + '&screen=main&action=upgrade_building&id=' + id + '&type=main&h=' + game_data.csrf,
        'type': 'GET',
        'success': function (data) {
            var tempElement = document.createElement('div');
            tempElement.innerHTML = data;
            var isError = tempElement.querySelector('.error_box');
            var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue') || '[]');
            extra_building_queue.shift();
            localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue || []));
            localStorage.setItem('waiting_for_queue', JSON.stringify({}));
            if (isError !== null) {
                var errorBuildContent = document.querySelector('#error_build_queue_content');
                var buildRow = tempElement.querySelector('#main_buildrow_' + id + ' .inactive');
                if (buildRow) {
                    var timeAvailable = extractTimeFromHTML(buildRow.textContent);
                }

                //ABLE TO GET TIME WHEN ITS AVAILABLE TO ADD TO QUEUE
                errorBuildContent.textContent = isError.textContent;
                if (timeAvailable) {
                    errorBuildContent.textContent += (settings_cookies.general['allow_pre_queue'] ? ' Added to queue at ' : ' Available at ') + (timeAvailable[0] ? 'Tomorrow' : 'Today') + ' @ ' + timeAvailable[1] + ':' + timeAvailable[2];
                    var waiting_for_queue_temp = { buildId: id, time: timeAvailable };
                    if (settings_cookies.general['allow_pre_queue']) {
                        localStorage.setItem('waiting_for_queue', JSON.stringify(waiting_for_queue_temp));
                        extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue'));
                        extra_building_queue.unshift(id);
                        localStorage.setItem('extra_building_queue', JSON.stringify(extra_building_queue));
                    }
                }

                errorBuildContent.parentElement.style.display = 'block';
                setTimeout(function () {
                    errorBuildContent.parentElement.style.display = 'none';
                }, 2000);
                //injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
            } else {
                injectBuildQueueExtraList(settings_cookies.assets.find(asset => asset.name === 'extra_building_queue').column, true);
            }
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

function injectBuildQueueExtraList(columnToUse, update = false) {
    if (settings_cookies.general['show__extra_building_queue']) {
        $.ajax({
            'url': '/game.php?village=' + game_data.village.id + '&screen=main',
            'type': 'GET',
            'success': function (data) {
                var tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                var { availableBuildingsImgs, availableBuildingLevels, allAvailableBuildingsImgs, allAvailableBuildingLevels } = getAllBuildingsImages(tempElement);
                var buildQueueElment = getCurrentQueueListElement(tempElement, allAvailableBuildingsImgs);

                if (settings_cookies.general['show__extra_building_queue_all']) {
                    injectExtraBuildQueue(allAvailableBuildingsImgs, allAvailableBuildingLevels, columnToUse, buildQueueElment, update);
                } else {
                    injectExtraBuildQueue(availableBuildingsImgs, availableBuildingLevels, columnToUse, buildQueueElment, update);
                }
            }
        });
    }
}