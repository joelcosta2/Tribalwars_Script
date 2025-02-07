
// Build Extra List
function injectBuildQueue(availableBuildingsImgs, buildingImgs, availableBuildingLevels, columnToUse, buildQueueElment, update = false) {
    var villageBuilderid = game_data.csrf;
    localStorage.setItem('village_builder_id', villageBuilderid);

    //Create the extra build queue table
    var extraBuildQueueTable = document.createElement('table');
    extraBuildQueueTable.id = 'build_queue_table';
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
        const canAddToQueue = buildingImgs.includes(url);

        var cell = document.createElement('td');
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.padding = '0';

        var imgLink = document.createElement('a');
        imgLink.href = game_data.link_base_pure + '' + buildId;
        var img = document.createElement('img');
        img.className = 'bmain_list_img';
        img.style.marginRight = '3px';
        img.src = url;
        img.setAttribute('data-title', buildLvel);
        imgLink.appendChild(img);
        cell.appendChild(imgLink);

        var textLink = document.createElement('a');
        textLink.href = game_data.link_base_pure + '' + buildId;
        textLink.textContent = document.querySelector('.visual-label-' + buildId)?.getAttribute('data-title');
        cell.appendChild(textLink);

        var br = document.createElement('br');
        cell.appendChild(br);

        // Create the link for upgrading the building
        var upgradeLink = document.createElement('a');
        upgradeLink.className = canAddToQueue ? 'btn btn-build' : 'btn evt-cancel-btn btn-confirm-no';
        upgradeLink.setAttribute('data-building', (buildId + availableBuildingLevels[index] + 1));
        upgradeLink.setAttribute('data-level-next', (parseInt(availableBuildingLevels[index]) + 1));
        
        upgradeLink.id = 'main_buildlink_' + buildId + '_' + (parseInt(availableBuildingLevels[index]) + 1);
        upgradeLink.style.width = '-webkit-fill-available';
        upgradeLink.style.margin = '0';
        upgradeLink.style.fontSize = '11px !important';
        upgradeLink.style.padding = '1px 3px';
        upgradeLink.textContent = 'Level ' + (parseInt(availableBuildingLevels[index]) + 1);
        upgradeLink.onclick = function () {
            addToBuildQueue(buildId);
        }
        
        upgradeLink.addEventListener('mouseenter', function (event) {
            showTooltip(event.target, true);
        });
        upgradeLink.addEventListener('mouseleave', function (event) {
            showTooltip(event.target, false);
        });

        var upgradeCell = document.createElement('td');
        upgradeCell.setAttribute('data-title', canAddToQueue ? 'Add to queue' : 'Add to waiting queue');
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

    createWidgetElement({ title: 'Building Queue', contents: extraBuildDiv, columnToUse, update, extra_name: '', description: '' });
}

function getCurrentQueueListElement(tempElement, allBuildingsImgs) {
    var buildQueueElment = document.createElement('td');
    var cancelConfirmIds = [];
    var queueBuildIdsActive = [];
    var cancelButtons = tempElement.querySelectorAll('.btn-cancel');
    var dateLastSlot, dateNextSlot;

    //Get times from the cancel buttons row and check if the queue is full
    if (cancelButtons.length == 2) {
        isBuildQueueFull = true;
        var lastBuildTime = extractBuildTimeFromHTML(cancelButtons[1].parentElement.parentElement.children[3].textContent);
        dateLastSlot = new Date().setDate(new Date().getDate() + lastBuildTime[0]);
        dateLastSlot = new Date(dateLastSlot).setHours(lastBuildTime[1], lastBuildTime[2]);
        localStorage.setItem('building_queue_last_slot', dateLastSlot);

        var nextSlotTime = extractBuildTimeFromHTML(cancelButtons[0].parentElement.parentElement.children[3].textContent);
        dateNextSlot = new Date().setDate(new Date().getDate() + nextSlotTime[0]);
        dateNextSlot = new Date(dateNextSlot).setHours(nextSlotTime[1], nextSlotTime[2]);
        localStorage.setItem('building_queue_next_slot', dateNextSlot);
        setCancelBuildIds(cancelButtons);
    } else if (cancelButtons.length == 1) {
        isBuildQueueFull = false;
        var nextSlotTime = extractBuildTimeFromHTML(cancelButtons[0].parentElement.parentElement.children[3].textContent);
        dateNextSlot = new Date().setDate(new Date().getDate() + nextSlotTime[0]);
        dateNextSlot = new Date(dateLastSlot).setHours(nextSlotTime[1], nextSlotTime[2]);
        localStorage.setItem('building_queue_next_slot', dateNextSlot);
        setCancelBuildIds(cancelButtons);
    } else {
        isBuildQueueFull = false;
        localStorage.setItem('building_queue_last_slot', 0);
        localStorage.setItem('building_queue_next_slot', 0);
    }

    cancelButtons.forEach(function (element) {
        queueBuildIdsActive.push(element.parentElement.parentElement.querySelector('.lit-item > img').src.split('/').pop().replace(/\.[^/.]+$/, ''));
    })
    
    localStorage.setItem('building_queue_active', JSON.stringify(queueBuildIdsActive))

    // inject active real queue
    if (queueBuildIdsActive.length) {
        queueBuildIdsActive.forEach(function (id, index) {
            var anchor = document.createElement('a');
            anchor.className = '';
            anchor.style.display = 'inline-flex';
            anchor.style.border = '1px solid #7d510f';

            anchor.onclick = async function () {
                const cancelIds = JSON.parse(localStorage.getItem('queue_cancelIds'));

                try {
                    await callRemoveFromActiveBuildingQueue(cancelIds[index]);  // Wait for the promise to resolve
                    console.log('Building successfully removed');
                
                    removeFromActiveBuildQueue(index);
                } catch (error) {
                    console.error('Error removing building:', error);
                }
            }

            /*anchor.addEventListener('mouseenter', function (event) {
                var interval = setInterval(function () {
                    var storedDate = new Date(JSON.parse(localStorage.getItem('building_queue_last_slot')));
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
            span.style.backgroundImage = 'url(' + allBuildingsImgs.find(element => element.includes(id)) + ')';
            span.style.backgroundPosition = '0px 0px';
            span.style.backgroundSize = 'contain';
            span.style.backgroundRepeat = 'no-repeat';
            span.style.width = '24px';
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.cursor = 'pointer';


            var progressBar = document.createElement('div');
            progressBar.style.position = 'absolute';
            progressBar.style.bottom = '0';
            progressBar.style.left = '0';
            progressBar.style.width = '100%';
            progressBar.style.height = '4px';
            progressBar.style.backgroundColor = index != 0 ? '#ffb400' : '#4caf50';

            span.appendChild(progressBar);
            anchor.appendChild(span);
            buildQueueElment.appendChild(anchor);
        });
    }
    // inject waiting fake queue
    var queueBuildIds = JSON.parse(localStorage.getItem('building_queue') || '[]');
    if (queueBuildIds.length) {
        queueBuildIds.forEach(function (id) {
            var anchor = document.createElement('a');
            anchor.className = '';
            anchor.style.display = 'inline-flex';
            anchor.setAttribute('data-title', 'Remove from queue');
            anchor.style.border = '1px solid #7d510f';
            anchor.onclick = function () {
                var index = Array.from(this.parentElement.children).indexOf(this);
                removeFromBuildQueue(index - queueBuildIdsActive.length);
            }

            /*anchor.addEventListener('mouseenter', function (event) {
                var interval = setInterval(function () {
                    var storedDate = new Date(JSON.parse(localStorage.getItem('building_queue_last_slot')));
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
            span.style.backgroundImage = 'url(' + allBuildingsImgs.find(element => element.includes(id)) + ')';
            span.style.backgroundPosition = '0px 0px';
            span.style.backgroundSize = 'contain';
            span.style.backgroundRepeat = 'no-repeat';
            span.style.width = '24px';
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.cursor = 'pointer';

            var progressBar = document.createElement('div');
            progressBar.style.position = 'absolute';
            progressBar.style.bottom = '0';
            progressBar.style.left = '0';
            progressBar.style.width = '100%';
            progressBar.style.height = '4px';
            progressBar.style.backgroundColor = 'red';

            span.appendChild(progressBar);
            
            span.addEventListener('mouseenter', function (event) {
                showTooltip(event.target, true);
            });
            span.addEventListener('mouseleave', function (event) {
                showTooltip(event.target, false);
            });
            

            anchor.appendChild(span);
            buildQueueElment.appendChild(anchor);
        });
    }
    return buildQueueElment;

}

function getAllBuildingsImages(tempElement) {
    var buildingsElement = tempElement.querySelector('#buildings');
    var allBuildingsImgs = [], availableBuildingsImgs = [], allAvailableBuildingLevels = [], availableBuildingLevels = [];
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
                            allBuildingsImgs.push(a.querySelector('img').src);
                        }
                    }
                }
            }
        });
    }

    return { availableBuildingsImgs, availableBuildingLevels, allBuildingsImgs, allAvailableBuildingLevels };
}

function setCancelBuildIds(cancelButtons) {
    var ids = [];
    cancelButtons.forEach(btn => {
        var id = new URLSearchParams(new URL(btn.href).search).get('id');
        if (id) ids.push(id);
    });
    localStorage.setItem('queue_cancelIds', JSON.stringify(ids));
}

function addToBuildQueue(build_id) {
    if (build_id) {
        if (!isBuildQueueFull && !JSON.parse(localStorage.getItem('waiting_for_queue')).buildId) {
            callUpgradeBuilding(build_id);
        } else {
            var building_queue = JSON.parse(localStorage.getItem('building_queue') || '[]');
            building_queue.push(build_id)
            localStorage.setItem('building_queue', JSON.stringify(building_queue));
            injectBuildQueueWidget(settings_cookies.widgets.find(widget => widget.name === 'building_queue').column, true);
        }
    } else {
        var building_queue = JSON.parse(localStorage.getItem('building_queue'));
        callUpgradeBuilding(building_queue[0]);
    }
}

function removeFromBuildQueue(build_index) {
    var building_queue = JSON.parse(localStorage.getItem('building_queue'));
    building_queue.splice(build_index, 1);
    localStorage.setItem('building_queue', JSON.stringify(building_queue));

    if (build_index === 0) {
        localStorage.removeItem('function_building_queue');
        localStorage.removeItem('endTime_building_queue');
        localStorage.setItem('waiting_for_queue', JSON.stringify({}));
    }
    injectBuildQueueWidget(settings_cookies.widgets.find(widget => widget.name === 'building_queue').column, true);
}

function removeFromActiveBuildQueue(build_index) {
    var building_active_queue = JSON.parse(localStorage.getItem('building_queue_active'));
    building_active_queue.splice(build_index, 1);
    localStorage.setItem('building_queue_active', JSON.stringify(building_active_queue));

    if (build_index === 0) {
        localStorage.setItem('building_queue_active', JSON.stringify({}));
    }
    injectBuildQueueWidget(settings_cookies.widgets.find(widget => widget.name === 'building_queue').column, true);
}

function callUpgradeBuilding(id) {
    $.ajax({
        'url': game_data.link_base_pure + 'main&action=upgrade_building&id=' + id + '&type=main&h=' + game_data.csrf,
        'type': 'GET',
        'success': function (data) {
            var tempElement = document.createElement('div');
            tempElement.innerHTML = data;
            var isError = tempElement.querySelector('.error_box');
            var building_queue = JSON.parse(localStorage.getItem('building_queue') || '[]');
            building_queue.shift();
            localStorage.setItem('building_queue', JSON.stringify(building_queue || []));
            localStorage.setItem('waiting_for_queue', JSON.stringify({}));
            if (isError !== null) {
                var errorBuildContent = document.querySelector('#error_build_queue_content');
                var buildRow = tempElement.querySelector('#main_buildrow_' + id + ' .inactive');
                if (buildRow) {
                    var timeAvailable = extractBuildTimeFromHTML(buildRow.textContent);
                }

                //ABLE TO GET TIME WHEN ITS AVAILABLE TO ADD TO QUEUE
                errorBuildContent.textContent = isError.textContent;
                if (timeAvailable) {
                    errorBuildContent.textContent += 'Added to queue at ' + (timeAvailable[0] ? 'Tomorrow' : 'Today') + ' @ ' + timeAvailable[1] + ':' + timeAvailable[2];
                    var waiting_for_queue_temp = { buildId: id, time: timeAvailable };
                    
                    localStorage.setItem('waiting_for_queue', JSON.stringify(waiting_for_queue_temp));
                    building_queue = JSON.parse(localStorage.getItem('building_queue'));
                    building_queue.unshift(id);
                    localStorage.setItem('building_queue', JSON.stringify(building_queue));
                }

                errorBuildContent.parentElement.style.display = 'block';
                setTimeout(function () {
                    errorBuildContent.parentElement.style.display = 'none';
                }, 2000);
                injectBuildQueueWidget(settings_cookies.widgets.find(widget => widget.name === 'building_queue').column, true);
            } else {
                injectBuildQueueWidget(settings_cookies.widgets.find(widget => widget.name === 'building_queue').column, true);
            }
        }
    });
}

function callRemoveFromActiveBuildingQueue(idToRemove) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://pt105.tribalwars.com.pt/game.php?village=14520&screen=main&ajaxaction=cancel_order&type=main', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('Tribalwars-Ajax', '1');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('edificio removido');
            } else {
                console.error('Error:', xhr.status, xhr.statusText);
            }
        }
    };

    var body = 'id=' + idToRemove + '&destroy=0&h=' + game_data.csrf;
    xhr.send(body);
}

function injectBuildQueueWidget(columnToUse, update = false) {
    if (settings_cookies.general['show__building_queue']) {
        $.ajax({
            'url': game_data.link_base_pure + 'main',
            'type': 'GET',
            'success': function (data) {
                var tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                var { availableBuildingsImgs, availableBuildingLevels, allBuildingsImgs, allAvailableBuildingLevels } = getAllBuildingsImages(tempElement);
                var buildQueueElment = getCurrentQueueListElement(tempElement, allBuildingsImgs);

                if (settings_cookies.general['show__building_queue_all']) {
                    injectBuildQueue(allBuildingsImgs, availableBuildingsImgs, allAvailableBuildingLevels, columnToUse, buildQueueElment, update);
                } else {
                    injectBuildQueue(availableBuildingsImgs, availableBuildingsImgs, availableBuildingLevels, columnToUse, buildQueueElment, update);
                }
            }
        });
    }
}