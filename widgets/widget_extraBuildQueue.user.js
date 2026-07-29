
// Build Extra List

/**
 * Returns a village-scoped localStorage key by appending the current village id.
 * @param {string} key - Base key name.
 * @returns {string}
 */
function getBuildQueueKey(key) {
    const villageId = game_data?.village?.id;
    return villageId ? key + '_' + villageId : key;
}

/**
 * Returns a unique timeout identifier for the building queue of the current village.
 * @returns {string}
 */
function getBuildQueueTimeoutId() {
    return 'building_queue_' + (game_data?.village?.id || '');
}

/**
 * Returns the maximum number of simultaneous active build queue slots.
 * Premium accounts support up to 15; free accounts support 2.
 * @returns {number}
 */
function getMaxBuildQueueSize() {
    return game_data?.features?.Premium?.active ? 5 : 2;
}

/**
 * Renders the extra building queue widget: the active queue header and the full list
 * of available buildings with their upgrade buttons.
 * @param {string[]} availableBuildingsImgs - Image URLs of buildings that can currently be upgraded.
 * @param {string[]} buildingImgs - Image URLs used to determine if a building can be queued.
 * @param {number[]} availableBuildingLevels - Current level of each building in availableBuildingsImgs.
 * @param {HTMLElement} buildQueueElment - Pre-built TD element containing the active/fake queue icons.
 * @param {boolean} [update=false] - If true, replaces an existing widget instead of inserting a new one.
 */
function injectBuildQueue(availableBuildingsImgs, buildingImgs, availableBuildingLevels, buildQueueElment, update = false) {
    //Create the extra build queue table
    var extraBuildQueueTable = document.createElement('table');
    const widgetConfig = settings_cookies.widgets.find(widget => widget.name === 'building_queue');
    const columnToUse = widgetConfig?.column ?? LEFT_COLUMN;
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
    const buildingQueue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue'))) || [];
    const buildingActiveQueue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active'))) || [];
    availableBuildingsImgs.forEach(function (url, index) {
        var buildId = url.match(/([^/]+?)(?=\d+\.\w+$)/)[1];
        var buildLvel = url.match(/([^/]+?)(?=\.\w+$)/)[1];
        var row = document.createElement('tr');
        row.id = 'main_buildrow_' + index;

        // get next level
        let nextLevel = parseInt(availableBuildingLevels[index]) + 1;
        const queuedBuilding = buildingQueue.filter(id => id === buildId).length;
        const activeQueuedCount = buildingActiveQueue.filter(id => id.replace(/\d+/g, '') === buildId).length;
        nextLevel += queuedBuilding || 0;
        nextLevel += activeQueuedCount || 0;

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
        img.loading = 'lazy';
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
        upgradeLink.setAttribute('data-building', (buildId + nextLevel));
        upgradeLink.setAttribute('data-level-next', nextLevel);

        upgradeLink.id = 'main_buildlink_' + buildId + '_' + nextLevel;
        upgradeLink.style.width = '-webkit-fill-available';
        upgradeLink.style.margin = '0';
        upgradeLink.style.setProperty('font-size', '11px', 'important');
        upgradeLink.style.padding = '1px 3px';
        upgradeLink.textContent = 'Level ' + nextLevel;
        upgradeLink.onclick = function () {
            addToBuildQueue(buildId);
        }

        upgradeLink.addEventListener('mouseenter', function (event) {
            toggleTooltip(event.target, true);
        });
        upgradeLink.addEventListener('mouseleave', function (event) {
            toggleTooltip(event.target, false);
        });

        var upgradeCell = document.createElement('td');
        const dataTitle = canAddToQueue ?
            'Add to queue' :
            'Add to waiting queue';
        const dataText = createResourceElementsString(buildId, nextLevel);
        upgradeCell.setAttribute('data-title', dataTitle);
        upgradeCell.setAttribute('data-tooltip-tpl', dataText);
        upgradeCell.appendChild(upgradeLink);

        row.appendChild(cell);
        row.appendChild(upgradeCell);
        buildsListTable.appendChild(row);
    });
    var extraBuildDiv = document.createElement('div');

    extraBuildDiv.appendChild(extraBuildQueueTable);
    extraBuildDiv.appendChild(buildsListTable);

    createWidgetElement({ identifier: 'Building Queue', contents: extraBuildDiv, columnToUse, update, extra_name: '', description: '' });
}

/**
 * Parses the main building page HTML, extracts active queue slots and building cost data,
 * persists them to localStorage, and returns a TD element containing the rendered queue icons.
 * @param {Document} tempElement - Parsed HTML document of the main building screen.
 * @param {string[]} allBuildingsImgs - All building image URLs (used for fake queue icons).
 * @returns {HTMLElement} TD element with active and fake queue icons injected.
 */
function getCurrentQueueListElement(tempElement, allBuildingsImgs) {
    var buildQueueElment = document.createElement('td');
    var queueBuildIdsActive = [];
    var cancelButtons = tempElement.querySelectorAll('.btn-cancel');
    var dateNextSlot, dateLastSlot;

    //Get times from the cancel buttons row and check if the queue is full
    const maxQueueSize = getMaxBuildQueueSize();
    isBuildQueueFull = cancelButtons.length >= maxQueueSize;

    if (cancelButtons.length > 0) {
        const allSlotTimestamps = Array.from(cancelButtons).map(btn =>
            extractBuildTimestampFromHTML(btn.parentElement.parentElement.children[3].textContent)
        );
        localStorage.setItem(getBuildQueueKey('building_queue_slots'), JSON.stringify(allSlotTimestamps));

        dateNextSlot = allSlotTimestamps[0];
        localStorage.setItem(getBuildQueueKey('building_queue_next_slot'), dateNextSlot);

        if (cancelButtons.length >= 2) {
            dateLastSlot = allSlotTimestamps[allSlotTimestamps.length - 1];
            localStorage.setItem(getBuildQueueKey('building_queue_last_slot'), dateLastSlot);
        } else {
            localStorage.removeItem(getBuildQueueKey('building_queue_last_slot'));
        }
        setCancelBuildIds(cancelButtons);
    } else {
        isBuildQueueFull = false;
        localStorage.removeItem(getBuildQueueKey('building_queue_next_slot'));
        localStorage.removeItem(getBuildQueueKey('building_queue_slots'));
    }

    var queueBuildLevelsActive = [];
    cancelButtons.forEach(function (element) {
        const row = element.parentElement.parentElement;
        queueBuildIdsActive.push(row.querySelector('.lit-item > img').src.split('/').pop().replace(/\.[^/.]+$/, ''));
        // Extract actual building level from .lit-item text content — last number is language-agnostic
        // e.g. "Ferreiro\nN\u00edvel 19" → 19
        const litText = row.querySelector('.lit-item')?.textContent || '';
        const lvlMatch = litText.trim().match(/(\d+)\s*$/);
        queueBuildLevelsActive.push(lvlMatch ? parseInt(lvlMatch[1], 10) : 0);
    })

    // Store current building levels and actual next-level build time (HTML-sourced, includes
    // world-speed + main-building bonus). Costs (wood/stone/iron/pop) come from buildings_data on demand.
    const buildingLevelsInfo = {};
    tempElement.querySelectorAll("[id^='main_buildrow_']").forEach(row => {
        const buildId = row.id.replace("main_buildrow_", "");
        const tds = row.querySelectorAll("td");
        if (tds.length > 2) {
            // Level from span text content (same as getAllBuildingsImages) — the image filename
            // uses a visual tier number (0-4), NOT the actual building level
            const span = tds[0]?.querySelector('span');
            const lvlMatch = span?.textContent.match(/\d+/);
            const currentLevel = lvlMatch ? parseInt(lvlMatch[0], 10) : 0;
            // Server-rendered time for the next level (exact: includes world speed + main building bonus)
            const nextLevelTimeStr = tds[4]?.innerText.trim() || '';
            buildingLevelsInfo[buildId] = { currentLevel, nextLevelTimeStr };
        }
    });

    localStorage.setItem(getBuildQueueKey('nextLevelBuildsQueueInfo'), JSON.stringify(buildingLevelsInfo));
    localStorage.setItem(getBuildQueueKey('building_queue_active'), JSON.stringify(queueBuildIdsActive));
    localStorage.setItem(getBuildQueueKey('building_queue_active_levels'), JSON.stringify(queueBuildLevelsActive));

    // inject active real queue
    injectAtiveQueueList(queueBuildIdsActive, buildQueueElment)
    // inject waiting fake queue
    injectFakeQueueList(queueBuildIdsActive, buildQueueElment, allBuildingsImgs);

    return buildQueueElment;
}

/**
 * Builds an HTML string showing resource icons and costs for the next level of a building.
 * Used as tooltip content on upgrade buttons.
 * @param {string} buildId - Building identifier (e.g. 'barracks', 'wall').
 * @returns {string} HTML string, or empty string if data is unavailable.
 */
function createResourceElementsString(buildId, nextLevel) {
    const allBuildingsData = JSON.parse(localStorage.getItem('buildings_data') || '{}');
    const buildInfo = allBuildingsData[buildId]?.[nextLevel];
    if (!buildInfo) return '';

    const currentWood = parseInt(document.getElementById('wood')?.textContent.replace(/\D/g, '') || '0');
    const currentStone = parseInt(document.getElementById('stone')?.textContent.replace(/\D/g, '') || '0');
    const currentIron = parseInt(document.getElementById('iron')?.textContent.replace(/\D/g, '') || '0');

    // Build time:
    // - Immediate next level: use server-rendered time from HTML (exact — includes world speed + main building bonus)
    // - Deeper queue levels: TWStats base time / worldSpeed * main building reduction factor
    //   Factor table (% of base time) per main building level, index 0 = not built (100%):
    const MAIN_BUILDING_FACTORS = [
        1, 0.95, 0.91, 0.86, 0.82, 0.78, 0.75, 0.71, 0.68, 0.64, 0.61,
        0.58, 0.56, 0.53, 0.51, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38,
        0.36, 0.34, 0.33, 0.31, 0.30, 0.28, 0.27, 0.26, 0.24, 0.23
    ];
    const levelsInfo = JSON.parse(localStorage.getItem(getBuildQueueKey('nextLevelBuildsQueueInfo')) || '{}');
    const levelEntry = levelsInfo[buildId];
    let timeStr = '';
    if (levelEntry?.nextLevelTimeStr && nextLevel === levelEntry.currentLevel + 1) {
        // Exact time from the last server-rendered page
        timeStr = levelEntry.nextLevelTimeStr;
    } else if (buildInfo.timeSec) {
        // Approximation for deeper levels: apply main building reduction
        const mainLevel = Math.min(
            levelsInfo['main']?.currentLevel ?? parseInt(game_data?.village?.buildings?.main || '0'),
            30
        );
        const mainFactor = MAIN_BUILDING_FACTORS[mainLevel] ?? 1;
        timeStr = formatMinutesToTime(Math.round(buildInfo.timeSec / getWorldSpeed() * mainFactor) / 60);
    }

    function createSpan(className, value, warn) {
        const span = document.createElement("span");
        span.className = `icon header ${className}`;
        span.style.margin = '0';
        const textNode = document.createTextNode(` ${value}`);
        const wrapper = document.createElement("span");
        if (warn) wrapper.className = 'warn';
        wrapper.appendChild(span);
        wrapper.appendChild(textNode);
        wrapper.style.marginRight = '1px';
        return wrapper.outerHTML;
    }

    return (`<div>` +
        createSpan("wood", buildInfo.wood, currentWood < buildInfo.wood) +
        createSpan("stone", buildInfo.stone, currentStone < buildInfo.stone) +
        createSpan("iron", buildInfo.iron, currentIron < buildInfo.iron) +
        `<div>` +
        createSpan("time", timeStr) +
        (buildInfo.pop ? createSpan("population", buildInfo.pop) : '') +
        `</div>` +
        `</div>`
    );
}

/**
 * Injects icons for buildings currently in the real (server-side) build queue.
 * Each icon shows a rich live-countdown tooltip (building name, costs, finish time,
 * cancel hint) and opens a confirmation dialog before cancelling.
 * @param {string[]} queueBuildIdsActive - Ordered list of building ids in the active queue.
 * @param {HTMLElement} buildQueueElment - Container TD to append the icons into.
 */
function injectAtiveQueueList(queueBuildIdsActive, buildQueueElment) {
    if (queueBuildIdsActive.length) {
        queueBuildIdsActive.forEach(function (id, index) {
            const buildingId = id.replace(/[0-9]/g, '');
            const buildingName = document.querySelector('.visual-label-' + buildingId)?.getAttribute('data-title') || buildingId;

            var anchor = document.createElement('a');
            anchor.className = '';
            anchor.style.display = 'inline-flex';
            anchor.setAttribute('data-title', `<b>${buildingName}</b>`);

            function fmtMs(ms) {
                if (ms <= 0) return null;
                const s = Math.floor((ms / 1000) % 60);
                const m = Math.floor((ms / 1000 / 60) % 60);
                const h = Math.floor((ms / 1000 / 60 / 60) % 24);
                const d = Math.floor(ms / 1000 / 60 / 60 / 24);
                return (d > 0 ? d + 'd ' : '') + (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
            }

            function buildTooltipBody() {
                const now = Date.now();
                const allSlots = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_slots')) || '[]').map(Number);

                let timeHtml = '';
                if (index === 0) {
                    const fmt = fmtMs((allSlots[0] || 0) - now);
                    timeHtml = fmt
                        ? `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;">Finishes in <b>${fmt}</b></div>`
                        : `<div style="margin-top:3px;color:#aaa;">Finishing soon\u2026</div>`;
                } else {
                    const startFmt = fmtMs((allSlots[index - 1] || 0) - now);
                    const endFmt = fmtMs((allSlots[index] || 0) - now);
                    timeHtml = (startFmt ? `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;">Starts in <b>${startFmt}</b></div>` : '')
                        + (endFmt ? `<div>Finishes in <b>${endFmt}</b></div>` : `<div style="color:#aaa;">Finishing soon\u2026</div>`);
                }

                const cancelHint = `<div style="margin-top:4px;border-top:1px solid #c1a264;padding-top:3px;color:#e06060;">\u2715 Click to cancel this build</div>`;
                return timeHtml + cancelHint;
            }

            function updateCountdown(event) {
                anchor.setAttribute('data-tooltip-tpl', buildTooltipBody());
                toggleTooltip(event.target, true);
                event.target.countdownTimeout = setTimeout(() => updateCountdown(event), 1000);
            }

            anchor.style.border = '1px solid #7d510f';

            anchor.onclick = function () {
                if (typeof toggleTooltip === 'function') toggleTooltip(span, false);
                clearTimeout(span.countdownTimeout);
                const tooltipEl = document.getElementById('tooltip');
                if (tooltipEl) tooltipEl.style.display = 'none';
                UI.ConfirmationBox(
                    'Cancel <b>' + escapeHtml(buildingName) + '</b> upgrade?<br><span style="color:#888;font-size:11px;">This removes it from the server queue and cannot be undone.</span>',
                    [{
                        text: 'OK',
                        callback: function () { removeFromActiveBuildQueue(index); },
                        confirm: true
                    }],
                    'tw_cancel_active_build_' + index,
                    false,
                    true
                );
            };

            var span = document.createElement('span');
            span.className = 'icon header village active_queue';
            span.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/95eda994/graphic/buildings/mid/' + id + '.png)';
            span.style.backgroundPosition = '0px 0px';
            span.style.backgroundSize = 'contain';
            span.style.backgroundRepeat = 'no-repeat';
            span.style.width = '24px';
            span.style.marginRight = '4px';
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.cursor = 'pointer';

            span.addEventListener('mouseenter', function (event) {
                anchor.setAttribute('data-tooltip-tpl', buildTooltipBody());
                toggleTooltip(event.target, true);
                updateCountdown(event);
            });
            span.addEventListener('mouseleave', function (event) {
                toggleTooltip(event.target, false);
                clearTimeout(event.target.countdownTimeout);
            });

            var progressBar = document.createElement('div');
            progressBar.style.position = 'absolute';
            progressBar.style.bottom = '0';
            progressBar.style.left = '0';
            progressBar.style.width = '100%';
            progressBar.style.height = '4px';
            progressBar.style.backgroundColor = '#4caf50';

            span.appendChild(progressBar);
            anchor.appendChild(span);
            buildQueueElment.appendChild(anchor);
        });
    }
}

/**
 * Injects icons for buildings waiting in the local (fake) queue, i.e. queued by the script
 * but not yet submitted to the server. Each icon allows removal on click.
 * The first item's tooltip shows a live countdown to the next retry attempt;
 * subsequent items show their position in the queue.
 * @param {string[]} queueBuildIdsActive - Active queue ids, used to calculate click offset.
 * @param {HTMLElement} buildQueueElment - Container TD to append the icons into.
 * @param {string[]} allBuildingsImgs - All building image URLs, used to resolve the icon src.
 */
function injectFakeQueueList(queueBuildIdsActive, buildQueueElment, allBuildingsImgs) {
    var queueBuildIds = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
    if (!queueBuildIds.length) return;

    // Scheduled time (ms epoch) when addToBuildQueue() will next fire for this village
    const scheduledEndTime = parseInt(localStorage.getItem('endTime_' + getBuildQueueTimeoutId())) || 0;
    // Target levels stored at queue-add time (building_queue_levels mirrors building_queue)
    const fakeQueueLevels = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');

    queueBuildIds.forEach(function (id, fakeIndex) {
        const buildingName = document.querySelector('.visual-label-' + id)?.getAttribute('data-title') || id;

        var anchor = document.createElement('a');
        anchor.className = '';
        anchor.style.display = 'inline-flex';
        anchor.setAttribute('data-title', `<b>${buildingName}</b>`);
        anchor.style.border = '1px solid #7d510f';
        anchor.onclick = function () {
            if (typeof toggleTooltip === 'function') toggleTooltip(span, false);
            clearTimeout(span.countdownTimeout);
            const tooltipEl = document.getElementById('tooltip');
            if (tooltipEl) tooltipEl.style.display = 'none';
            var index = Array.from(this.parentElement.children).indexOf(this);
            removeFromBuildQueue(index - queueBuildIdsActive.length);
        }

        const _fakeTargetLevel = fakeQueueLevels[fakeIndex] || 0;
        const costHtml = createResourceElementsString(id, _fakeTargetLevel) || '';

        // Builds tooltip body: resource costs + time info line
        function buildTooltipBody() {
            let timeHtml = '';
            if (fakeIndex === 0 && scheduledEndTime > 0) {
                const remaining = scheduledEndTime - Date.now();
                if (remaining > 0) {
                    const s = Math.floor((remaining / 1000) % 60);
                    const m = Math.floor((remaining / 1000 / 60) % 60);
                    const h = Math.floor((remaining / 1000 / 60 / 60) % 24);
                    const d = Math.floor(remaining / 1000 / 60 / 60 / 24);
                    const fmt = (d > 0 ? d + 'd ' : '') + (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
                    timeHtml = `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;color:#888;">Next attempt in <b>${fmt}</b></div>`;
                } else {
                    timeHtml = `<div style="margin-top:3px;color:#aaa;">Retrying soon\u2026</div>`;
                }
            } else if (fakeIndex > 0) {
                timeHtml = `<div style="margin-top:3px;border-top:1px solid #c1a264;padding-top:3px;color:#aaa;">Position ${fakeIndex + 1} in waiting queue</div>`;
            }
            const removeHint = `<div style="margin-top:4px;border-top:1px solid #c1a264;padding-top:3px;color:#e06060;">\u2715 Click to remove from waiting queue</div>`;
            return costHtml + timeHtml + removeHint;
        }

        anchor.setAttribute('data-tooltip-tpl', buildTooltipBody());

        var span = document.createElement('span');
        span.className = 'icon header village';
        span.style.backgroundImage = 'url(' + allBuildingsImgs.find(el => new RegExp('/' + id + '\\d+\\.').test(el)) + ')';
        //span.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/95eda994/graphic/buildings/mid/' + id + '.png)'
        span.style.backgroundPosition = '0px 0px';
        span.style.backgroundSize = 'contain';
        span.style.backgroundRepeat = 'no-repeat';
        span.style.width = '24px';
        span.style.marginRight = '4px';
        span.style.position = 'relative';
        span.style.display = 'inline-block';
        span.style.cursor = 'pointer';

        var progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '100%';
        progressBar.style.height = '4px';
        progressBar.style.backgroundColor = 'orange';

        span.appendChild(progressBar);

        span.addEventListener('mouseenter', function (event) {
            anchor.setAttribute('data-tooltip-tpl', buildTooltipBody());
            toggleTooltip(event.target, true);
            // Live countdown for the first waiting item only
            if (fakeIndex === 0 && scheduledEndTime > 0) {
                function updateCountdown() {
                    anchor.setAttribute('data-tooltip-tpl', buildTooltipBody());
                    toggleTooltip(event.target, true);
                    event.target.countdownTimeout = setTimeout(updateCountdown, 1000);
                }
                event.target.countdownTimeout = setTimeout(updateCountdown, 1000);
            }
        });
        span.addEventListener('mouseleave', function (event) {
            toggleTooltip(event.target, false);
            clearTimeout(event.target.countdownTimeout);
        });

        anchor.appendChild(span);
        buildQueueElment.appendChild(anchor);
    });
}

/**
 * Entry point for rendering the building queue widget from raw main-screen HTML.
 * Parses the HTML, extracts building data, builds the queue element, and injects the widget.
 * @param {string} mainElement - Raw HTML string of the main building page.
 * @param {boolean} update - If true, replaces the existing widget in the DOM.
 */
function injectQueues(mainElement, update) {
    if (mainElement) {
        const parser = new DOMParser();
        const tempElement = parser.parseFromString(mainElement, 'text/html');

        localStorage.setItem(getBuildQueueKey('last_main_page'), mainElement);
        var { availableBuildingsImgs, availableBuildingLevels, allBuildingsImgs, allAvailableBuildingLevels } = getAllBuildingsImages(tempElement);
        var buildQueueElment = getCurrentQueueListElement(tempElement, allBuildingsImgs);

        if (settings_cookies.general['show__building_queue_all']) {
            injectBuildQueue(allBuildingsImgs, availableBuildingsImgs, allAvailableBuildingLevels, buildQueueElment, update);
        } else {
            injectBuildQueue(availableBuildingsImgs, availableBuildingsImgs, availableBuildingLevels, buildQueueElment, update);
        }
        setOngoingBuildingLevels();
        scheduleCompletionNotification();
        // Refresh the main building's visual-label-extra with the updated queue end time.
        if (typeof getMainQueueTime === 'function') getMainQueueTime();
        // After fresh data: if a slot is free and there's a waiting item, decide immediately.
        const _bq = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
        const _wfq = JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}');
        if (_bq.length) {
            if (!isBuildQueueFull && !_wfq.buildId) {
                // Slot free, not already waiting for resources — compare costs against DOM values now.
                const waitingBuildId = _bq[0];
                const _allBuildingsData = JSON.parse(localStorage.getItem('buildings_data') || '{}');
                const _fakeQueueLevels = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
                const buildInfo = _allBuildingsData[waitingBuildId]?.[_fakeQueueLevels[0] || 0];
                const woodEl = document.getElementById('wood');
                const stoneEl = document.getElementById('stone');
                const ironEl = document.getElementById('iron');
                const hasResources = buildInfo && woodEl && stoneEl && ironEl &&
                    parseInt(woodEl.textContent.replace(/\D/g, '') || '0') >= buildInfo.wood &&
                    parseInt(stoneEl.textContent.replace(/\D/g, '') || '0') >= buildInfo.stone &&
                    parseInt(ironEl.textContent.replace(/\D/g, '') || '0') >= buildInfo.iron;
                if (hasResources) {
                    addToBuildQueue(); // resources available — promote immediately
                } else {
                    updateBuildQueueTimers(); // not enough resources — maintain scheduled retry
                }
            } else {
                updateBuildQueueTimers(); // queue full or already waiting for resources
            }
        }
    }
}

/**
 * Scans the buildings table and returns categorised image URL and level arrays.
 * Separates buildings that are currently upgradeable from the full building list.
 * @param {Document} tempElement - Parsed HTML document of the main building screen.
 * @returns {{ availableBuildingsImgs: string[], availableBuildingLevels: string[], allBuildingsImgs: string[], allAvailableBuildingLevels: string[] }}
 */
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
                        const span = tds[0].querySelector('span');
                        const lvl = span ? (span.textContent.match(/\d+/) || ['0']) : null;
                        const a = tds[0].querySelector('a');

                        //get lvls and images for available buildings only
                        if (buildButtons.style.display !== 'none') {
                            if (lvl) availableBuildingLevels.push(lvl[0]);
                            if (a && lvl) availableBuildingsImgs.push(a.querySelector('img').src);
                        }
                        //get lvls and images for all buildings
                        if (lvl) allAvailableBuildingLevels.push(lvl[0]);
                        if (a && lvl) allBuildingsImgs.push(a.querySelector('img').src);
                    }
                }
            }
        });
    }

    return { availableBuildingsImgs, availableBuildingLevels, allBuildingsImgs, allAvailableBuildingLevels };
}

/**
 * Extracts the server-side order ids from cancel buttons and stores them in localStorage
 * so they can be used later to cancel active queue slots.
 * @param {NodeList} cancelButtons - Cancel button elements from the active build queue rows.
 */
function setCancelBuildIds(cancelButtons) {
    var ids = [];
    cancelButtons.forEach(btn => {
        var id = new URLSearchParams(new URL(btn.href).search).get('id');
        if (id) ids.push(id);
    });
    localStorage.setItem(getBuildQueueKey('queue_cancelIds'), JSON.stringify(ids));
}

/**
 * Adds a building to the queue or immediately upgrades it if a slot is free.
 * If called without an id, attempts to promote the first waiting entry in the fake queue.
 * @param {string} [build_id] - Building id to queue. Omit to process the next queued item.
 */
function addToBuildQueue(build_id) {
    if (build_id) {
        if (!isBuildQueueFull && !JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}').buildId) {
            callUpgradeBuilding(build_id);
        } else {
            var building_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
            // Compute and store the actual target level for this new queue entry
            const _levInfo = JSON.parse(localStorage.getItem(getBuildQueueKey('nextLevelBuildsQueueInfo')) || '{}');
            const _actQueue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active')) || '[]');
            const _actCount = _actQueue.filter(x => x.replace(/\d+/g, '') === build_id).length;
            const _qCount = building_queue.filter(x => x === build_id).length;
            const _targetLevel = (_levInfo[build_id]?.currentLevel || 0) + _actCount + _qCount + 1;
            building_queue.push(build_id);
            localStorage.setItem(getBuildQueueKey('building_queue'), JSON.stringify(building_queue));
            var _bql = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
            _bql.push(_targetLevel);
            localStorage.setItem(getBuildQueueKey('building_queue_levels'), JSON.stringify(_bql));

            updateBuildQueueTimers();

            const mainElement = localStorage.getItem(getBuildQueueKey('last_main_page'));
            if (mainElement) {
                injectQueues(mainElement, true);
            } else {
                fetchBuildQueueWidget(true);
            }
            showAutoHideBox('Added to waiting queue — will build when slot is free.', false);
        }
    } else {
        const building_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
        const waitingFor = JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}');
        if (!isBuildQueueFull && building_queue.length) {
            // If a build was waiting for resources, the timer just fired meaning resources should now be available.
            // Clear the waiting state so callUpgradeBuilding can proceed normally.
            if (waitingFor.buildId) {
                localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({}));
            }
            callUpgradeBuilding(building_queue[0]);
        }
    }
}

/**
 * Removes an entry from the local (fake) waiting queue by index and refreshes the widget.
 * If the removed item was first in line, its associated timeout is also cleared.
 * @param {number} build_index - Zero-based index into the fake queue array.
 */
function removeFromBuildQueue(build_index) {
    var building_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')));
    building_queue.splice(build_index, 1);
    localStorage.setItem(getBuildQueueKey('building_queue'), JSON.stringify(building_queue));
    var _bqlRemove = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
    _bqlRemove.splice(build_index, 1);
    localStorage.setItem(getBuildQueueKey('building_queue_levels'), JSON.stringify(_bqlRemove));

    if (build_index === 0) {
        const bqId = getBuildQueueTimeoutId();
        localStorage.removeItem('function_' + bqId);
        localStorage.removeItem('endTime_' + bqId);
        localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({}));
        if (activeTimeouts[bqId]) {
            clearTimeout(activeTimeouts[bqId]);
            delete activeTimeouts[bqId];
        }
    }
    const mainElement = localStorage.getItem(getBuildQueueKey('last_main_page'));
    if (mainElement) {
        injectQueues(mainElement, true);
    } else {
        fetchBuildQueueWidget(true);
    }
    showAutoHideBox('Removed from waiting queue.', false);
}

/**
 * Cancels an active (server-side) build queue slot by index and refreshes the widget.
 * @param {number} build_index - Zero-based index into the active queue array.
 */
async function removeFromActiveBuildQueue(build_index) {
    const cancelIds = JSON.parse(localStorage.getItem(getBuildQueueKey('queue_cancelIds')));
    try {
        const cancelResponse = await callRemoveFromActiveBuildingQueue(cancelIds[build_index]);

        var building_active_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active')));
        building_active_queue.splice(build_index, 1);
        localStorage.setItem(getBuildQueueKey('building_queue_active'), JSON.stringify(building_active_queue));
        var _activeLevels = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active_levels')) || '[]');
        _activeLevels.splice(build_index, 1);
        localStorage.setItem(getBuildQueueKey('building_queue_active_levels'), JSON.stringify(_activeLevels));
        isBuildQueueFull = building_active_queue.length >= getMaxBuildQueueSize();

        const lastMainPage = localStorage.getItem(getBuildQueueKey('last_main_page'));
        if (lastMainPage && cancelResponse?.next_buildings) {
            const parser = new DOMParser();
            const patched = parser.parseFromString(lastMainPage, 'text/html');

            // Remove the cancelled build's queue row (contains the .btn-cancel and its timestamp)
            const cancelBtns = patched.querySelectorAll('.btn-cancel');
            if (cancelBtns[build_index]) {
                cancelBtns[build_index].closest('tr')?.remove();
            }

            // Replace the buildings section with the fresh one from the cancel response
            const freshDoc = parser.parseFromString(cancelResponse.next_buildings, 'text/html');
            const freshWrapper = freshDoc.querySelector('#building_wrapper');
            const existingWrapper = patched.querySelector('#building_wrapper');
            if (freshWrapper && existingWrapper) {
                existingWrapper.replaceWith(freshWrapper);
            }

            injectQueues(patched.documentElement.outerHTML, true);
        } else {
            // Fallback: fresh fetch if response lacked data or no cached page
            fetchBuildQueueWidget(true);
        }
    } catch (error) {
        showAutoHideBox('Error removing building:', error);
        console.error('Error removing building:', error);
    }
}

/**
 * Sends a GET request to upgrade the given building. Handles both success (slot freed)
 * and error (insufficient resources or full queue) cases, updating the fake queue accordingly.
 * @param {string|null} id - Building id to upgrade, or null to trigger a queue cleanup.
 */
function callUpgradeBuilding(id) {
    if (id) {
        $.ajax({
            'url': game_data.link_base_pure + 'main&action=upgrade_building&id=' + id + '&type=main&h=' + game_data.csrf,
            'type': 'GET',
            'success': function (data) {
                const parser = new DOMParser();
                const tempElement = parser.parseFromString(data, 'text/html');
                var main = tempElement.querySelector('#building_wrapper');
                var isError = tempElement.querySelector('.error_box');
                var building_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
                const wasFromQueue = building_queue[0] === id;

                if (isError !== null || !main) {
                    // Detect full queue from the response HTML in case isBuildQueueFull is stale
                    const queueFullInResponse = tempElement.querySelectorAll('.btn-cancel').length >= getMaxBuildQueueSize();
                    // Error: item was NOT removed — if it came from a direct click (not queue), add to front
                    if (!wasFromQueue) {
                        building_queue.unshift(id);
                        localStorage.setItem(getBuildQueueKey('building_queue'), JSON.stringify(building_queue));
                        const _levInfoErr = JSON.parse(localStorage.getItem(getBuildQueueKey('nextLevelBuildsQueueInfo')) || '{}');
                        const _actQueueErr = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active')) || '[]');
                        const _actCountErr = _actQueueErr.filter(x => x.replace(/\d+/g, '') === id).length;
                        const _failedLevel = (_levInfoErr[id]?.currentLevel || 0) + _actCountErr + 1;
                        var _bqlErr = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
                        _bqlErr.unshift(_failedLevel);
                        localStorage.setItem(getBuildQueueKey('building_queue_levels'), JSON.stringify(_bqlErr));
                    }
                    var missingRessourceBuildRow = tempElement.querySelector('#main_buildrow_' + id + ' .inactive');
                    var timeAvailable = missingRessourceBuildRow ? extractBuildTimeFromHTML(missingRessourceBuildRow.textContent) : null;

                    if (timeAvailable) {
                        showAutoHideBox('Added to queue at ' + (timeAvailable[0] == '0' ? 'Today' : 'Tomorrow') + ' @ ' + timeAvailable[1] + ':' + timeAvailable[2]);
                        localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({ buildId: id, time: timeAvailable }));
                        updateBuildQueueTimers();
                    } else if (isBuildQueueFull || queueFullInResponse) {
                        showAutoHideBox('Queue is full — waiting for a slot to free up.', false);
                        localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({ buildId: id }));
                        updateBuildQueueTimers();
                    } else {
                        // Countdown timer in DOM — can't parse exact time. Retry in ~1 min.
                        showAutoHideBox('Resources arriving soon — retrying in 1 minute.', false);
                        localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({ buildId: id }));
                        setFunctionOnTimeOut(getBuildQueueTimeoutId(), addToBuildQueue, 60 * 1000);
                    }
                    startBuildQueueResourcePolling();
                    injectQueues(data, true);
                } else {
                    // Success: only now shift if item was at queue[0], then clear waiting state
                    if (wasFromQueue) {
                        building_queue.shift();
                        localStorage.setItem(getBuildQueueKey('building_queue'), JSON.stringify(building_queue));
                        var _bqlShift = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
                        _bqlShift.shift();
                        localStorage.setItem(getBuildQueueKey('building_queue_levels'), JSON.stringify(_bqlShift));
                    }
                    localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({}));
                    showAutoHideBox('Build sent to queue!', false);
                    injectQueues(data, true); // updates building_queue_next_slot in localStorage
                    // Schedule the next waiting item now that the first one was promoted
                    if (building_queue.length) {
                        updateBuildQueueTimers();
                    }
                }
            }
        });
    } else {
        // Reset: remove any null entries that may have been left in the queue
        var building_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
        building_queue = building_queue.filter(item => item !== null);
        localStorage.setItem(getBuildQueueKey('building_queue'), JSON.stringify(building_queue));
        localStorage.removeItem(getBuildQueueKey('building_queue_levels'));
        localStorage.removeItem(getBuildQueueKey('building_queue_next_slot'));

        showAutoHideBox('Invalid queue entry — queue reset.', true);
        fetchBuildQueueWidget(true);
    }
}

/**
 * Sends a POST request to cancel a specific active build order on the server.
 * @param {string} idToRemove - Server-side order id to cancel.
 * @returns {Promise<void>} Resolves on success, rejects on HTTP error.
 */
function callRemoveFromActiveBuildingQueue(idToRemove) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', game_data.link_base_pure + 'main&ajaxaction=cancel_order&type=main', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.setRequestHeader('Tribalwars-Ajax', '1');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (data?.response?.success) {
                            showAutoHideBox('Active build cancelled.', false);
                            resolve(data.response);
                        } else {
                            reject(new Error('Server reported cancel failure'));
                        }
                    } catch (e) {
                        // JSON parse failed — treat as success, no response data
                        showAutoHideBox('Active build cancelled.', false);
                        resolve(null);
                    }
                } else {
                    showAutoHideBox('Error removing building:', xhr.status, xhr.statusText);
                    reject(new Error('HTTP error: ' + xhr.status));
                }
            }
        };

        var body = 'id=' + idToRemove + '&destroy=0&h=' + game_data.csrf;
        xhr.send(body);
    });
}

/**
 * Schedules the next automatic queue action via setTimeout.
 * If a build is waiting for resources, schedules for when resources become available.
 * Otherwise, schedules for when the next active build slot finishes.
 */
function updateBuildQueueTimers() {
    // Schedule the next automatic queue trigger
    var building_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue')) || '[]');
    var waiting_for_queue = JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}');
    if (waiting_for_queue.time) {
        // Build is waiting for resources — schedule for when resources become available
        var nextTimeDate = waiting_for_queue.time;
        var targetEpoch = twWallClockToEpochMs(
            parseInt(nextTimeDate[1]),
            parseInt(nextTimeDate[2]),
            parseInt(nextTimeDate[3] || '0'),
            parseInt(nextTimeDate[0])
        );
        var waitTime = targetEpoch - Date.now();
        if (waitTime > 0) {
            setFunctionOnTimeOut(getBuildQueueTimeoutId(), addToBuildQueue, waitTime);
        } else {
            addToBuildQueue();
        }
    } else {
        // Build is waiting for an active slot to free up
        if (building_queue.length) {
            const rawSlot = parseInt(localStorage.getItem(getBuildQueueKey('building_queue_next_slot')));
            if (!isNaN(rawSlot) && rawSlot > 0) {
                var waitTime = rawSlot - Date.now();
                if (waitTime > 0) {
                    setFunctionOnTimeOut(getBuildQueueTimeoutId(), addToBuildQueue, waitTime);
                } else {
                    addToBuildQueue();
                }
            } else {
                // Slot time not parseable (e.g. different server locale) —
                // if queue is known free, try to promote now; otherwise poll every 5 min.
                if (!isBuildQueueFull) {
                    addToBuildQueue();
                } else {
                    console.warn('[TW BuildQueue] building_queue_next_slot not parseable, refreshing in 5 min');
                    setTimeout(function () { fetchBuildQueueWidget(true); }, 5 * 60 * 1000);
                }
            }
        }
    }
}

/**
 * Checks whether current in-page resource counts already cover the cost of the
 * waiting build. If so, cancels the scheduled timeout and triggers the build immediately.
 * Called on DOM resource updates to catch early availability without waiting for the timer.
 */
function checkEarlyBuildOpportunity() {
    const waitingFor = JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}');
    if (!waitingFor.buildId) return;
    if (isBuildQueueFull) return;
    // Guard against stale in-memory flag on page load: check the persisted active queue
    const _activeQueue = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_active')) || '[]');
    if (_activeQueue.length >= 2) return;

    const _allBuildingsData = JSON.parse(localStorage.getItem('buildings_data') || '{}');
    const _fakeQueueLevels = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
    const buildInfo = _allBuildingsData[waitingFor.buildId]?.[_fakeQueueLevels[0] || 0];
    if (!buildInfo) return;

    const woodEl = document.getElementById('wood');
    const stoneEl = document.getElementById('stone');
    const ironEl = document.getElementById('iron');
    if (!woodEl || !stoneEl || !ironEl) return;

    const wood = parseInt(woodEl.textContent.replace(/\D/g, '') || '0');
    const stone = parseInt(stoneEl.textContent.replace(/\D/g, '') || '0');
    const iron = parseInt(ironEl.textContent.replace(/\D/g, '') || '0');

    if (wood >= buildInfo.wood && stone >= buildInfo.stone && iron >= buildInfo.iron) {
        const bqId = getBuildQueueTimeoutId();
        if (activeTimeouts[bqId]) {
            clearTimeout(activeTimeouts[bqId]);
            delete activeTimeouts[bqId];
        }
        localStorage.removeItem('function_' + bqId);
        localStorage.removeItem('endTime_' + bqId);
        const buildId = waitingFor.buildId;
        localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({}));
        showAutoHideBox('Resources available — triggering build early!', false);
        callUpgradeBuilding(buildId);
    }
}

var buildQueueResourcePollInterval = null;
var buildCompletionTimeouts = [];

/**
 * Schedules a notification + widget refresh for when each active build slot finishes.
 * Called every time the widget re-renders so timestamps are always fresh.
 */
function scheduleCompletionNotification() {
    buildCompletionTimeouts.forEach(t => clearTimeout(t));
    buildCompletionTimeouts = [];

    const _storedSlots = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_slots')) || '[]');
    const slots = _storedSlots.length > 0
        ? _storedSlots.map(Number)
        : [
            parseInt(localStorage.getItem(getBuildQueueKey('building_queue_next_slot'))),
            parseInt(localStorage.getItem(getBuildQueueKey('building_queue_last_slot')))
          ];

    slots.forEach(function (slot) {
        if (isNaN(slot) || slot <= 0) return;
        const msUntil = slot - Date.now();
        if (msUntil > 0) {
            buildCompletionTimeouts.push(setTimeout(function () {
                showAutoHideBox('Build complete! Refreshing queue...', false);
                // Delay fetch by 2s to give the server time to process the completion
                setTimeout(function () { fetchBuildQueueWidget(true); }, 2000);
            }, msUntil));
        }
    });

    // Re-arm the instant-free bot with updated queue timing (building_queue_next_slot just updated)
    if (typeof checkAndScheduleBuildInstantFree === 'function') checkAndScheduleBuildInstantFree();
}

/**
 * Starts a periodic check (every 3 minutes) that reads the current page's resource
 * counters directly from the DOM and compares them against the waiting build's cost.
 * If resources are sufficient, triggers the build immediately.
 * Stops automatically once the build fires or the waiting entry is cleared.
 */
function startBuildQueueResourcePolling() {
    const waitingFor = JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}');
    if (!waitingFor.buildId || buildQueueResourcePollInterval) return;

    buildQueueResourcePollInterval = setInterval(() => {
        const waiting = JSON.parse(localStorage.getItem(getBuildQueueKey('waiting_for_queue')) || '{}');
        if (!waiting.buildId) {
            clearInterval(buildQueueResourcePollInterval);
            buildQueueResourcePollInterval = null;
            return;
        }

        if (isBuildQueueFull) return;

        // Read resource counts directly from the live DOM — no fetch needed
        const woodEl = document.getElementById('wood');
        const stoneEl = document.getElementById('stone');
        const ironEl = document.getElementById('iron');
        if (!woodEl || !stoneEl || !ironEl) return;

        const wood = parseInt(woodEl.textContent.replace(/\D/g, '') || '0');
        const stone = parseInt(stoneEl.textContent.replace(/\D/g, '') || '0');
        const iron = parseInt(ironEl.textContent.replace(/\D/g, '') || '0');

        const _allBuildingsData = JSON.parse(localStorage.getItem('buildings_data') || '{}');
        const _fakeQueueLevels = JSON.parse(localStorage.getItem(getBuildQueueKey('building_queue_levels')) || '[]');
        const buildInfo = _allBuildingsData[waiting.buildId]?.[_fakeQueueLevels[0] || 0];
        if (!buildInfo) return;

        if (wood >= buildInfo.wood && stone >= buildInfo.stone && iron >= buildInfo.iron) {
            clearInterval(buildQueueResourcePollInterval);
            buildQueueResourcePollInterval = null;
            const bqId = getBuildQueueTimeoutId();
            if (activeTimeouts[bqId]) {
                clearTimeout(activeTimeouts[bqId]);
                delete activeTimeouts[bqId];
            }
            localStorage.removeItem('function_' + bqId);
            localStorage.removeItem('endTime_' + bqId);
            const buildId = waiting.buildId;
            localStorage.setItem(getBuildQueueKey('waiting_for_queue'), JSON.stringify({}));
            showAutoHideBox('Resources available — building now!', false);
            callUpgradeBuilding(buildId);
            // callUpgradeBuilding calls injectQueues on success, refreshing the widget
        }
    }, 3 * 60 * 1000);
}

/**
 * Fetches the main building page and re-renders the building queue widget.
 * Also starts resource polling if a build is waiting for resources.
 * @param {boolean} [update=false] - If true, replaces the existing widget element.
 */
function fetchBuildQueueWidget(update = false) {
    if (settings_cookies.general['show__building_queue']) {
        startBuildQueueResourcePolling();
        $.ajax({
            'url': game_data.link_base_pure + 'main',
            'type': 'GET',
            'cache': false,
            'success': function (data) {
                injectQueues(data, update);
            }
        });
    }
}