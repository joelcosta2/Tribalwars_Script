// Load the infoOverview object from localStorage, initialising any missing properties with empty strings
var infoOverview = JSON.parse(localStorage.getItem("infoOverview")) || {};

infoOverview.storage = infoOverview.storage || "";
infoOverview.wood = infoOverview.wood || "";
infoOverview.stone = infoOverview.stone || "";
infoOverview.iron = infoOverview.iron || "";
infoOverview.stable = infoOverview.stable || "";
infoOverview.barracks = infoOverview.barracks || "";
infoOverview.garage = infoOverview.garage || "";
infoOverview.smith = infoOverview.smith || "";
infoOverview.main = infoOverview.main || "";
infoOverview.statue = infoOverview.statue || "";
infoOverview.wall = infoOverview.wall || "";
infoOverview.farm = infoOverview.farm || "";


/**
 * Fetches storage fill times from the storage screen and injects a countdown onto the
 * storage tile. Also caches the times in localStorage and triggers resource hovers.
 * @returns {number} Unix timestamp (seconds) of whichever resource fills first, or 0.
 */
function getStorageTime() {
    let minTime = 0;

    const storageCapacity = document.querySelector('#storage');
    localStorage.setItem('storage_capacity', storageCapacity.textContent)

    if (settings_cookies.general['show__time_storage_full_hover'] && game_data) {
        $.ajax({
            url: game_data.link_base_pure + 'storage',
            method: "GET",
            success: function (data) {
                var spans = $(data).find("span[data-endtime]");
                var fullStorageTimes = {
                    wood: $(spans[0]).attr("data-endtime"),
                    stone: $(spans[1]).attr("data-endtime"),
                    iron: $(spans[2]).attr("data-endtime")
                };
                localStorage.setItem('full_storage_times', JSON.stringify(fullStorageTimes));

                //hovers resources
                addRessourcesHover(fullStorageTimes);
                
                if (fullStorageTimes) {
                    minTime = Math.min(...Object.values(fullStorageTimes));
                    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
                    var remaining = minTime - now;
                    
                    if(remaining) {
                        var hours = Math.floor(remaining / 3600).toString().padStart(2, '0');
                        var minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
                        var seconds = (remaining % 60).toString().padStart(2, '0');
                        
                        addToVisualLabelExtra('storage', `${hours}:${minutes}:${seconds}`, true, minTime);
                    }
                }
            }
        });
    }
    return minTime; // Returns the timestamp of whichever resource fills first
}

/**
 * Attaches mouse-enter/leave listeners to resource elements (wood/stone/iron) so
 * that hovering shows a fill-time countdown in the TW native tooltip.
 * @param {Object|null} fullStorageTimes - Map of resource id to Unix timestamp (seconds).
 */
function addRessourcesHover(fullStorageTimes) {
    if (fullStorageTimes) {
        Object.keys(fullStorageTimes).forEach(resourceId => {
            var element = document.getElementById(resourceId);
            if (element) {
                var parentInfoBox = element.parentElement;
                var iconBox = parentInfoBox.previousElementSibling;

                var tooltip = document.getElementById("tooltip");
                if (tooltip) {
                    var bodyElement = tooltip.querySelector(".body");
                    if (bodyElement) {
                        // Clear existing polling interval before creating a new one
                        if (parentInfoBox.dataset.interval) {
                            clearInterval(parseInt(parentInfoBox.dataset.interval));
                        }
                        parentInfoBox.dataset.interval = setInterval(function () {
                            const resourceHover = localStorage.getItem('resourceHover');
                            if (resourceHover) {
                                const latestTimes = JSON.parse(localStorage.getItem('full_storage_times')) || {};
                                startResourceTimerFull(parseInt(latestTimes[resourceHover]), bodyElement);
                            }
                        }, 500);

                        // Only bind event listeners once per element to avoid duplicates
                        if (parentInfoBox.dataset.hoverBound) return;
                        parentInfoBox.dataset.hoverBound = '1';

                        parentInfoBox.addEventListener("mouseenter", function () {
                            const latestTimes = JSON.parse(localStorage.getItem('full_storage_times')) || {};
                            startResourceTimerFull(parseInt(latestTimes[resourceId]), bodyElement);
                            localStorage.setItem('resourceHover', resourceId);
                        });
                        iconBox.addEventListener("mouseenter", function () {
                            const latestTimes = JSON.parse(localStorage.getItem('full_storage_times')) || {};
                            startResourceTimerFull(parseInt(latestTimes[resourceId]), bodyElement);
                            localStorage.setItem('resourceHover', resourceId);
                        });
                        parentInfoBox.addEventListener("mouseleave", function () {
                            localStorage.setItem('resourceHover', '');
                        });
                        iconBox.addEventListener("mouseleave", function () {
                            localStorage.setItem('resourceHover', '');
                        });
                    }
                }
            }
        });
    }
}

/**
 * Reads the wood fill time from localStorage and injects a production-rate + countdown
 * sub-label onto the wood tile.
 * @returns {Object} { perHour, fullEndTime } or {} if data is unavailable.
 */
function getWoodInfo() {
    const storageFullTime = JSON.parse(localStorage.getItem('full_storage_times'));
    if (storageFullTime) {
        const fullTime = storageFullTime['wood'];
        if (fullTime) {
            var remaining = endTimeToTimer(fullTime);
            if(remaining) {
                const wood = document.getElementById('wood');
                let production;
                if (wood?.hasAttribute('data-title')) {
                    production = wood.getAttribute('data-title').match(/\d+/g);
                    const labelVisual = production + '/h\n' + `${remaining[0]}:${remaining[1]}:${remaining[2]}`;;
                    if (production) addToVisualLabelExtra('wood', labelVisual , true, fullTime);
                }
                return {perHour: production, fullEndTime: '0'}; //get value from label?
            } 
        }
    }
    return {};
}

/**
 * Same as getWoodInfo but for stone.
 * @returns {Object}
 */
function getStoneInfo() {
    const storageFullTime = JSON.parse(localStorage.getItem('full_storage_times'));
    if (storageFullTime) {
        const fullTime = storageFullTime['stone'];
        if (fullTime) {
            var remaining = endTimeToTimer(fullTime);
            if(remaining) {
                const stone = document.getElementById('stone');
                let production;
                if (stone?.hasAttribute('data-title')) {
                    production = stone.getAttribute('data-title').match(/\d+/g);
                    const labelVisual = production + '/h\n' + `${remaining[0]}:${remaining[1]}:${remaining[2]}`;;
                    if (production) addToVisualLabelExtra('stone', labelVisual , true, fullTime);
                }

                return {perHour: production, fullEndTime: '0'}; //get value from label?
            }
        }
    }
    return {};
}

/**
 * Same as getWoodInfo but for iron.
 * @returns {Object}
 */
function getIronInfo() {
    const storageFullTime = JSON.parse(localStorage.getItem('full_storage_times'));
    if (storageFullTime) {
        const fullTime = storageFullTime['iron'];
        if (fullTime) {
            var remaining = endTimeToTimer(fullTime);

            if(remaining) {
                const iron = document.getElementById('iron');
                let production;
                if (iron?.hasAttribute('data-title')) {
                    production = iron.getAttribute('data-title').match(/\d+/g);
                    const labelVisual = production + '/h\n' + `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
                    if (production) addToVisualLabelExtra('iron', labelVisual , true, fullTime);
                }

                return {perHour: production, fullEndTime: '0'}; //get value from label?
            }
        }
    }
    return {};
}

/**
 * Stub for smith timer. Not yet implemented.
 * @returns {string}
 */
function getSmithTime() {
    return "2 horas para pesquisa";
}

/**
 * Reads active building queue finish times from localStorage and injects a countdown
 * on the main building tile showing when the last queued build completes.
 * @returns {string}
 */
function getMainQueueTime() {
    const building_queue_next_slot = parseInt(localStorage.getItem(getBuildQueueKey('building_queue_next_slot')));
    const building_queue_last_slot = parseInt(localStorage.getItem(getBuildQueueKey('building_queue_last_slot')));
    
    if (building_queue_next_slot || building_queue_last_slot) {
        var lastSlot = Math.floor((building_queue_last_slot ? building_queue_last_slot  : building_queue_next_slot) / 1000);
        var remaining = endTimeToTimer(lastSlot);
        let labelVisual;
        
        if(remaining) {
            labelVisual = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
            addToVisualLabelExtra('main', labelVisual, true, lastSlot);
        }
    }
    return "Last build within 5 hours";
}

/**
 * Stub for wall timer. Not yet implemented.
 * @returns {string}
 */
function getWallTime() {
    return "Last build within 5 hours";
}

/**
 * Fetches the market page and injects an "available/total" merchant count label
 * onto the market building tile.
 * @returns {string}
 */
function getMarketInfo() {
    if (game_data) {
        $.ajax({
            url: game_data.link_base_pure + 'market',
            method: "GET",
            success: function (data) {
                const market_merchant_available_count = $(data).find("#market_merchant_available_count").text();
                const market_merchant_total_count = $(data).find("#market_merchant_total_count").text();
                if(market_merchant_available_count && market_merchant_total_count)
                addToVisualLabelExtra('market', `${market_merchant_available_count}\/${market_merchant_total_count}`);
            }
        })
    }
    return "Last build within 5 hours";
}

/**
 * Reads the auto-scavenge return time from localStorage and injects a countdown
 * on the rally point (place) tile.
 * @returns {string}
 */
function getPlaceInfo() {
    const endTime_scavenging = localStorage.getItem('endTime_scavenging-auto');
    if (endTime_scavenging) {
        // Compute remaining time until the scavenging mission returns
        var endTime = Math.floor(endTime_scavenging / 1000);
        var remaining = endTimeToTimer(endTime);
        let labelVisual;
        
        if(remaining) {
            labelVisual = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
            addToVisualLabelExtra('place', labelVisual, true, endTime);
        }
    }
    return "Last build within 5 hours";
}

/**
 * Reads the paladin training end time from the cached localStorage key 'statue_knight_endtime'
 * and injects a countdown on the statue tile. If the cache is missing or expired, fetches
 * the statue page to get the current data-endtime and refreshes the cache.
 * The cache is also updated whenever the user visits the statue page directly
 * (see injectScriptAutoTrainerPaladin in bot_trainerPaladin.user.js).
 * @returns {string}
 */
function getStatueInfo() {
    const cachedEndTime = parseInt(localStorage.getItem('statue_knight_endtime'), 10);
    const nowSec = Math.floor(Date.now() / 1000);

    if (cachedEndTime && cachedEndTime > nowSec) {
        // Cache still valid — inject label without a network request
        const remaining = endTimeToTimer(cachedEndTime);
        if (remaining) {
            addToVisualLabelExtra('statue', `${remaining[0]}:${remaining[1]}:${remaining[2]}`, true, cachedEndTime);
        }
        return "Last build within 5 hours";
    }

    // Cache expired or missing — fetch the statue page to read the live training countdown
    if (game_data) {
        $.ajax({
            url: game_data.link_base_pure + 'statue',
            method: 'GET',
            success: function (data) {
                const endtimeAttr = $(data).find('#knight_activity span[data-endtime]').attr('data-endtime');
                if (endtimeAttr) {
                    const endTime = parseInt(endtimeAttr, 10);
                    localStorage.setItem('statue_knight_endtime', endTime);
                    const remaining = endTimeToTimer(endTime);
                    if (remaining) {
                        addToVisualLabelExtra('statue', `${remaining[0]}:${remaining[1]}:${remaining[2]}`, true, endTime);
                    }
                }
            }
        });
    }
    return "Last build within 5 hours";
}

/**
 * Takes an array of barracks training finish timestamps and injects a countdown
 * for the last queued unit onto the barracks tile.
 * @param {number[]} barrracksTimes - UTC epoch timestamps in ms.
 * @returns {string}
 */
function getBarracksTime(barrracksTimes) {
    if (barrracksTimes && barrracksTimes.length) {
        var lastTrain = Math.floor(barrracksTimes[barrracksTimes.length - 1] / 1000);
        var remaining = endTimeToTimer(lastTrain);
        let labelVisual;
        
        if(remaining) {
            labelVisual = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
            addToVisualLabelExtra('barracks', labelVisual, true, lastTrain);
        }
    }
    return "Queue empty";
}

/**
 * Same as getBarracksTime but for the stable.
 * @param {number[]} stableTimes
 * @returns {string}
 */
function getStableTime(stableTimes) {
    if (stableTimes && stableTimes.length) {
        var lastTrain = Math.floor(stableTimes[stableTimes.length - 1] / 1000);
        var remaining = endTimeToTimer(lastTrain);
        let labelVisual;
        
        if(remaining) {
            labelVisual = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
            addToVisualLabelExtra('stable', labelVisual, true, lastTrain);
        }
    }
    return "Queue empty";
}

/**
 * Same as getBarracksTime but for the garage.
 * @param {number[]} garageTimes
 * @returns {string}
 */
function getGarageTime(garageTimes) {
    if (garageTimes && garageTimes.length) {
        var lastTrain = Math.floor(garageTimes[garageTimes.length - 1] / 1000);
        var remaining = endTimeToTimer(lastTrain);
        let labelVisual;
        
        if(remaining) {
            labelVisual = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
            addToVisualLabelExtra('garage', labelVisual, true, lastTrain);
        }
    }
    return "Queue empty";
}

/**
 * Stub for farm info. Not yet implemented.
 * @returns {string}
 */
function getFarmInfo() {
    return ''
}

/**
 * Reads the active building queue and the fake (pending) queue from localStorage
 * and updates the "+N" order-level overlay on each matching building tile.
 */
function setOngoingBuildingLevels() {
    var buildingQueueActive = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active')));
    var buildIds = buildingQueueActive ? buildingQueueActive.map(item => item.replace(/[0-9]/g, '')) : [];
    var fakeBuildingQueue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')));
    var fakeBuildIds = fakeBuildingQueue ? fakeBuildingQueue.map(item => item?.replace(/[0-9]/g, '')) : [];

    document.querySelectorAll('.order-level').forEach(el => el.textContent = '');
    Object.keys(infoOverview).forEach(key => {
        let count = buildIds.filter(id => id === key).length;
        let fakeCount = fakeBuildIds.filter(id => id === key).length;
        if (count > 0) addToVisualLevelLabel(key, count);
        if (fakeCount > 0) addToVisualLevelLabel(key, fakeCount, true);
    });
}

/**
 * Parses unit recruitment costs, images, localised names, and in-village counts
 * from the training page HTML and stores the result in localStorage as 'unit_managers_costs'.
 * @param {string} data - Raw HTML of the training screen.
 */
function storeAvailableUnitsCosts(data) {
    let unitCosts = {};
    $(data).find(".recruit_req").each(function(index, reqEl) {
        $(reqEl).find('span').each(function(i, span) {
            let match = span.id.match(/^([a-z]+)_\d+_cost_([a-z_]+)$/);
            if (match) {
                let unitType = match[1];
                let resource = match[2];
    
                if (!unitCosts[unitType]) {
                    unitCosts[unitType] = {};
                }
                if (resource !== 'time') {
                    let costValue = parseFloat(span.textContent.replace('.', '')) || 0;
                    unitCosts[unitType][resource] = costValue;
                } else {
                    unitCosts[unitType].build_time = timeToMilliseconds(span.textContent);
                }
            }
        });
    
        let unitTypeFromId = reqEl.id.split('_')[0];
        if (game_data.units[unitTypeFromId]) {
            unitCosts[unitTypeFromId].requirements_met = game_data.units[unitTypeFromId].requirements_met || false;
        }
    });

    // Also store localized name, image src, and in-village count from each unit row
    $(data).find('tr.row_a, tr.row_b').each(function(_, row) {
        const link = $(row).find('a.unit_link');
        if (!link.length) return;
        const unitType = link.data('unit');
        if (!unitType || !unitCosts[unitType]) return;

        const img = link.find('img');
        if (img.length) unitCosts[unitType].img = img.attr('src');

        // Localized name: last text node inside the link element
        const linkEl = link[0];
        for (let i = linkEl.childNodes.length - 1; i >= 0; i--) {
            const node = linkEl.childNodes[i];
            if (node.nodeType === 3 && node.textContent.trim()) {
                unitCosts[unitType].name = node.textContent.trim();
                break;
            }
        }

        // In-village count from 3rd column (format "X/Y")
        const tds = $(row).find('td');
        if (tds.length >= 3) {
            const countText = $(tds[2]).text().trim();
            if (countText && countText.includes('/')) {
                unitCosts[unitType].count = countText;
            }
        }
    });

    localStorage.setItem('unit_managers_costs', JSON.stringify(unitCosts));
}

/**
 * Parses the current training queue for barracks, stable, and garage from the training
 * page HTML and stores a structured list in localStorage as 'train_queue_data'.
 * @param {string} data - Raw HTML of the training screen.
 */
function storeTrainQueueData(data) {
    const lang = JSON.parse(localStorage.getItem('tw_lang')) || {};
    const stringToday = lang['aea2b0aa9ae1534226518faaefffdaad'] || '';
    const stringTomorrow = lang['57d28d1b211fddbb7a499ead5bf23079'] || '';
    const todayPat = stringToday.replace('%s', '(\\d{1,2}:\\d{2})');
    const tomorrowPat = stringTomorrow.replace('%s', '(\\d{1,2}:\\d{2})');
    const timeRegex = todayPat || tomorrowPat
        ? new RegExp((todayPat || '') + (todayPat && tomorrowPat ? '|' : '') + (tomorrowPat || ''), 'i')
        : null;

    const queueData = [];

    ['barracks', 'stable', 'garage'].forEach(function (building) {
        $(data).find('#trainqueue_wrap_' + building + ' tr').each(function (_, row) {
            const img = $(row).find('img').first();
            if (!img.length) return;

            const src = img.attr('src') || '';
            const unitMatch = src.match(/(?:unit_|recruit\/)([a-z_]+)(?:\.png|\.webp)/);
            if (!unitMatch) return;

            const unit = unitMatch[1];
            const imgSrc = src;
            const name = img.attr('title') || img.attr('alt') || unit;

            let count = 1;
            let finishTimestamp = 0;

            $(row).find('td').each(function (_, td) {
                const text = $(td).text().trim();
                if (/^\d+$/.test(text)) {
                    count = parseInt(text, 10);
                }
                if (timeRegex && timeRegex.test(text)) {
                    const ts = extractBuildTimestampFromHTML(text);
                    if (ts) finishTimestamp = ts;
                }
            });

            queueData.push({ unit: unit, imgSrc: imgSrc, name: name, count: count, finishTimestamp: finishTimestamp, building: building });
        });
    });

    localStorage.setItem('train_queue_data', JSON.stringify(queueData));
}

/**
 * Fetches the training screen and extracts queue finish times for all training buildings,
 * updates building tile labels, and caches unit costs and queue data.
 * @param {Function} [callback] - Called after all processing completes.
 */
function fetchTrainInfo(callback) {
    if (game_data) {
        $.ajax({
            url: game_data.link_base_pure + 'train',
            method: "GET",
            success: function (data) {
                const lang = JSON.parse(localStorage.getItem('tw_lang'));
                const stringToday = lang['aea2b0aa9ae1534226518faaefffdaad'];
                const stringTomorrow = lang['57d28d1b211fddbb7a499ead5bf23079'];
                const todayString = stringToday?.replace('%s', '\\d{1,2}:\\d{2}');
                const tomorrowString = stringTomorrow?.replace('%s', '\\d{1,2}:\\d{2}');
                const regex = new RegExp(`${todayString}|${tomorrowString}`, 'i');
                let barrracksTimes = [],
                    stableTimes = [],
                    garageTimes = [];
                // Collect barracks training finish times
                $(data).find("#trainqueue_wrap_barracks td").each(function () {
                    const text = $(this).text().trim();
                    if (regex.test(text)) {
                        barrracksTimes.push(extractBuildTimestampFromHTML(text))
                    }
                });
                getBarracksTime(barrracksTimes);

                // Collect stable training finish times
                $(data).find("#trainqueue_wrap_stable td").each(function () {
                    const text = $(this).text().trim();
                    if (regex.test(text)) {
                        stableTimes.push(extractBuildTimestampFromHTML(text))
                    }
                });
                getStableTime(stableTimes)

                // Collect garage training finish times
                $(data).find("#trainqueue_wrap_garage td").each(function () {
                    const text = $(this).text().trim();
                    if (regex.test(text)) {
                        garageTimes.push(extractBuildTimestampFromHTML(text))
                    }
                });
                getGarageTime(garageTimes);

                // Extract and store unit recruitment costs and queue data
                storeAvailableUnitsCosts(data);
                storeTrainQueueData(data);
                if (typeof callback === 'function') callback();
                }
        })
    }
}

/**
 * Orchestrates all overview info gathering when the overview page loads.
 * Calls each building's info function and persists the results to localStorage.
 */
function updatePremiumInfoOverview() {
    const show__overview_premmium_info = settings_cookies.general['show__overview_premmium_info'];

    if (show__overview_premmium_info) {
        infoOverview.storage = getStorageTime();
        infoOverview.wood = getWoodInfo();
        infoOverview.stone = getStoneInfo();
        infoOverview.iron = getIronInfo();
        infoOverview.garage = getGarageTime();
        infoOverview.smith = getSmithTime();
        infoOverview.main = getMainQueueTime();
        infoOverview.wall = getWallTime();
        infoOverview.market = getMarketInfo();
        infoOverview.place = getPlaceInfo();
        infoOverview.statue = getStatueInfo();
        infoOverview.farm = getFarmInfo();
        //setOngoingBuildingLevels();

        fetchTrainInfo();

        //infoOverview.stable = getStableTime();
        //infoOverview.barracks = getBarracksTime();

        localStorage.setItem("infoOverview", JSON.stringify(infoOverview));
    }
}

/**
 * Injects (or replaces) a countdown or text sub-label inside the named building's visual tile.
 * Clears any existing interval before starting a new one to prevent timer leaks.
 * @param {string} buildingName - CSS class suffix of the target tile (e.g. 'main', 'barracks').
 * @param {string} newTextContent - Initial text to display.
 * @param {boolean} [isTimer=false] - If true, starts a live countdown from endtime.
 * @param {number} [endtime=0] - Unix timestamp in seconds for the countdown target.
 */
function addToVisualLabelExtra(buildingName, newTextContent, isTimer = false, endtime = 0) {
    const labelStorage = document.getElementsByClassName(`visual-label-${buildingName}`)[0];

    if (labelStorage) {
        const labelContent = labelStorage.querySelector('a');

        if (labelContent) {
            // Remove previously injected div and clear its interval to avoid duplicates
            const existing = labelContent.querySelector('.visual-label-extra');
            if (existing) {
                if (labelContent.dataset.interval) {
                    clearInterval(parseInt(labelContent.dataset.interval, 10));
                    delete labelContent.dataset.interval;
                }
                existing.remove();
            }

            const div = document.createElement('div');
            div.className = 'visual-label-extra';
            div.style.whiteSpace = 'pre-line';
            div.textContent = newTextContent;
            div.style.fontSize = "9px";
        
            labelContent.appendChild(div);

            if (isTimer && endtime > 0) {
                labelContent.dataset.interval = setInterval(function () {
                    startTimerOnLabel(endtime, div);
                }, 500); // Update every 500 ms
            }
        }
    }
}

/**
 * Appends a "+N" indicator to the order-level element of a building tile.
 * @param {string} buildingName - CSS class suffix of the target tile.
 * @param {number} level - Number of queued upgrades to display.
 * @param {boolean} fakeQueue - If true, colours the indicator orange (fake/pending queue).
 */
function addToVisualLevelLabel(buildingName, level, fakeQueue) {
    const labelStorage = document.querySelector(`.visual-label-${buildingName}`);
    if (labelStorage) {
        const orderLevel = labelStorage.querySelector('.order-level');
        if (orderLevel) {
            orderLevel.textContent = orderLevel.textContent + `+${level}`;
            if (fakeQueue) {
                orderLevel.style.color = "orange";
            }
        }
    }
}

