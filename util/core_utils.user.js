
//Utils

//GLOBAL VARIABLES
var RIGHT_COLUMN = "rightcolumn";
var CENTER_COLUMN = "leftcolumn";
var LEFT_COLUMN = "script_column";

// Server-to-UTC timezone offset in ms (e.g. BRT=UTC-3 → -10800000).
// Detected once on start() by comparing the TW server clock with Timing.getCurrentServerTime().
var serverTimezoneOffsetMs = 0;

var default_settings_cookies = {
    widgets: [
        {
            name: 'village_list',
            column: LEFT_COLUMN,
            pos: 0,
            open: true
        },
        {
            name: 'notepad',
            column: LEFT_COLUMN,
            pos: 1,
            open: true
        },
        {
            name: 'building_queue',
            column: LEFT_COLUMN,
            pos: 2,
            open: true
        },
        {
            name: 'recruit_troops',
            column: LEFT_COLUMN,
            pos: 3,
            open: false
        },
        {
            name: 'resource_dashboard',
            column: LEFT_COLUMN,
            pos: 4,
            open: true
        },
    ],
    general: {
        keep_awake: true,
        redirect__train_buildings: false,
        remove__premium_promo: true,
        show__village_list: true,
        show__recruit_troops: false,
        show__navigation_arrows: true,
        show__notepad: true,
        show__building_queue: true,
        show__extra_options_map_hover: true,
        show__outgoingInfo_map: true,
        show__overview_premium_info: true,
        show__time_storage_full_hover: true,
        show__big_map: false,
        show__resource_dashboard: false,
        show__heatmap_reports: false,
        show__auto_daily_bonus: false,
        show__auto_build_instant_free: false,
        show__auto_scavenging: {
            enabled: false,
            level: 0,
            all: true,
            troops: {
                spears: 0,
                //.....
            }
        },
        show__auto_paladin_train: {
            enabled: false,
            maxLevel: 0,
        },
        show__player_profile_stats: true,
    }
};

var settings_cookies = JSON.parse(localStorage.getItem('settings_cookies')) || default_settings_cookies;


var widgetsInjectFunctions = {
    'village_list': injectVillagesListWidget,
    'notepad': injectNotepadWidget,
    'building_queue': fetchBuildQueueWidget,
    'recruit_troops': injectRecruitTroopsWidget,
    'resource_dashboard': injectResourceDashboardWidget
};

var currentVillageIndex,
    textSelected,
    isBuildQueueFull = false;

//-----

/**
 * Initialises required localStorage keys with defaults and migrates saved settings
 * to include any new keys added since the user last saved.
 */
function prepareLocalStorageItems() {
    if (unsafeWindow.lang) {
        localStorage.setItem('tw_lang', JSON.stringify(unsafeWindow.lang));
    }

    localStorage.setItem(getBuildQueueKey('waiting_for_queue'), localStorage.getItem(getBuildQueueKey('waiting_for_queue')) ?? '{}');
    localStorage.setItem(getBuildQueueKey('building_queue'), localStorage.getItem(getBuildQueueKey('building_queue')) ?? '[]');
    localStorage.setItem('villages_info', localStorage.getItem('villages_info') ?? '[]');
    localStorage.setItem('full_storage_times', localStorage.getItem('full_storage_times') ?? '[]');
    localStorage.setItem('mapConfig', localStorage.getItem('mapConfig') ?? '{}');
    localStorage.setItem('map_custom_height', localStorage.getItem('map_custom_height') ?? '600');
    localStorage.setItem('map_custom_width', localStorage.getItem('map_custom_width') ?? '900');
    localStorage.setItem('villages_resources', localStorage.getItem('villages_resources') ?? '{}');
    localStorage.setItem('scavenge_configs', localStorage.getItem('scavenge_configs') ?? '{}');

    // Migrate settings: ensure any new default widgets/general keys are present in saved settings
    let settingsMigrated = false;
    default_settings_cookies.widgets.forEach(function (defaultWidget) {
        if (!settings_cookies.widgets.find(function (w) { return w.name === defaultWidget.name; })) {
            settings_cookies.widgets.push(Object.assign({}, defaultWidget));
            settingsMigrated = true;
        }
    });
    Object.keys(default_settings_cookies.general).forEach(function (key) {
        if (settings_cookies.general[key] === undefined) {
            settings_cookies.general[key] = default_settings_cookies.general[key];
            settingsMigrated = true;
        }
    });
    if (settingsMigrated) {
        localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
    }

    if (typeof TribalWars !== 'undefined') {
        // Store on Tampermonkey storage
        GM_setValue("current_world", game_data?.world);
    }
}

/**
 * Finds the current village in the villages_info list and stores its index
 * in localStorage as 'current_village'.
 */
function setCookieCurrentVillage() {
    var villageID = game_data.village?.id,
        villages = JSON.parse(localStorage.getItem('villages_info') || '[]'),
        villgersNum = sizeOfObject(villages);

    for (var i = 0; i < villgersNum; i++) {
        var urlTemp = villages[i].url;
        if (urlTemp.includes(villageID)) {
            currentVillageIndex = i;
            localStorage.setItem('current_village', currentVillageIndex);
            return;
        }
    }
}

/**
 * Reads the current page's displayed resource amounts (wood/stone/iron) and saves
 * them to villages_resources in localStorage, keyed by village ID.
 */
function captureCurrentVillageResources() {
    const villageId = game_data?.village?.id;
    if (!villageId) return;
    const woodEl = document.getElementById('wood');
    const stoneEl = document.getElementById('stone');
    const ironEl = document.getElementById('iron');
    if (!woodEl || !stoneEl || !ironEl) return;
    const resources = JSON.parse(localStorage.getItem('villages_resources') || '{}');
    resources[villageId] = {
        name: game_data.village?.name || 'Unknown',
        wood: woodEl.textContent.trim(),
        stone: stoneEl.textContent.trim(),
        iron: ironEl.textContent.trim(),
        ts: Date.now()
    };
    localStorage.setItem('villages_resources', JSON.stringify(resources));
}

/**
 * Toggles a DOM element's visibility between 'block' and 'none'.
 * @param {HTMLElement} popup
 */
function togglePopup(popup) {
    if (popup.style.display === 'none' || !popup.style.display) {
        popup.style.display = 'block';  // Show the popup
    } else {
        popup.style.display = 'none';   // Hide the popup
    }
}

/**
 * Tracks focus on all textarea and input elements so keyboard shortcuts
 * can be suppressed while the user is typing.
 */
function listenTextAreas() {
    // Track focus state for all textareas and inputs
    var textAreas = document.getElementsByTagName('textarea');
    var i = 0;
    for (i = 0; i < textAreas.length; i++) {
        textAreas[i].onfocus = function () { textSelected = true };
        textAreas[i].onblur = function () { textSelected = false };
    }
    textAreas = document.getElementsByTagName('input');
    for (i = 0; i < textAreas.length; i++) {
        textAreas[i].onfocus = function () { textSelected = true };
        textAreas[i].onblur = function () { textSelected = false };
    }
}

/**
 * Registers A/D keyboard shortcuts for cycling between villages.
 * Only active when the navigation arrows setting is enabled and no input has focus.
 */
function defineKeyboardShortcuts() {
    if (settings_cookies.general['show__navigation_arrows']) {
        $(document).keydown(function (evt) {
            if (evt.keyCode == 65 && !textSelected) {
                evt.preventDefault();
                previousVillage();
            }
        });
        $(document).keydown(function (evt) {
            if (evt.keyCode == 68 && !textSelected) {
                evt.preventDefault();
                nextVillage();
            }
        });
    }
}

/**
 * Returns the number of own enumerable properties in an object.
 * @param {Object} obj
 * @returns {number}
 */
function sizeOfObject(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

/**
 * Builds a collapsible widget container and inserts it into the specified column
 * at the position saved in settings_cookies. Replaces the existing widget if update is true.
 * @param {Object} options
 */
function createWidgetElement({ identifier, contents, columnToUse, update, extra_name = '', description = '', title = '' }) {
    var columnElement = document.getElementById(columnToUse);

    if (columnElement) {
        var elemId = identifier.toLowerCase().replace(/ /g, '_'); // Derive a stable element ID from the identifier
        var elemName = extra_name != '' ? elemId + '_' + extra_name : elemId;
        title = title === '' ? identifier : title;

        // Create a container div
        var containerDiv = document.createElement('div');
        containerDiv.id = 'show_' + elemName;
        containerDiv.className = 'vis moveable widget script_widget';
        containerDiv.setAttribute('data-title', description != '' ? description : title);

        // Create the header with button
        var header = document.createElement('h4');
        header.className = 'head with-button';
        header.textContent = title;
        header.style.minWidth = 'max-content';
        header.style.width = '-webkit-fill-available';
        header.style.cursor = 'pointer';
        header.onclick = function () {
            var content = document.getElementById('widget_content_' + elemName);
            var miniElem = document.getElementById('mini_' + elemName);
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            if (miniElem.src.includes('minus')) {
                miniElem.src = miniElem.src.replace('minus', 'plus');
                settings_cookies.widgets.find(widget => widget.name === elemName).open = false; // Persist collapsed state
            } else {
                miniElem.src = miniElem.src.replace('plus', 'minus');
                settings_cookies.widgets.find(widget => widget.name === elemName).open = true; // Persist expanded state
            }
            localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
        };

        header.addEventListener('mouseenter', function (event) {
            toggleTooltip(event.target, true);
        });
        header.addEventListener('mouseleave', function (event) {
            toggleTooltip(event.target, false);
        });
        // Create the image for the button
        var buttonImg = document.createElement('img');
        buttonImg.className = 'widget-button';
        buttonImg.src = settings_cookies.widgets.find(widget => widget.name === elemName).open ? 'graphic/minus.png' : 'graphic/plus.png';
        buttonImg.id = 'mini_' + elemName;
        header.appendChild(buttonImg);

        var contentDiv = document.createElement('div');
        contentDiv.id = 'widget_content_' + elemName;
        contentDiv.style.display = settings_cookies.widgets.find(widget => widget.name === elemName).open ? 'block' : 'none';
        contentDiv.appendChild(contents);
        containerDiv.appendChild(header);
        containerDiv.appendChild(contentDiv);
        //if update, remove the current element
        if (update) {
            var currentElement = document.getElementById('show_' + elemName);
            if (currentElement) {
                columnElement.removeChild(currentElement);
            }
        }

        // Insert at the saved position if valid, otherwise append to the column
        var widgetIndex = settings_cookies.widgets.find(widget => widget.name === elemName).pos;
        var children = columnElement.childNodes;
        if (widgetIndex >= 0 && widgetIndex <= children.length) {
            var refChild = (widgetIndex + 1 === children.length) ? children[widgetIndex] : children[widgetIndex + 1];
            columnElement.insertBefore(containerDiv, refChild);
        } else {
            columnElement.appendChild(containerDiv);
        }
    }

}

/**
 * Shows a modal confirmation popup with a countdown timer.
 * Resolves with 'continue' (confirmed), 'cancel' (dismissed), or 'timeout' (countdown elapsed).
 * @param {string} title
 * @param {string} message
 * @param {number} [timeoutDuration=5000] - Auto-resolve delay in ms.
 * @returns {Promise<'continue'|'cancel'|'timeout'>}
 */
function displayWarningPopup(title, message, timeoutDuration = 5000) {
    return new Promise((resolve, reject) => {
        // Create the popup dynamically
        const popupDiv = document.createElement('div');
        popupDiv.classList.add('popup_style', 'borderimage', 'popup_box');
        popupDiv.style.width = '556px';
        popupDiv.style.maxWidth = '95vw';
        popupDiv.style.position = 'fixed';
        popupDiv.style.opacity = '1';
        popupDiv.style.top = '50%';
        popupDiv.style.left = '50%';
        popupDiv.style.transform = 'translate(-50%, -50%)';
        popupDiv.style.maxHeight = '90vh';
        popupDiv.style.overflowY = 'auto';
        popupDiv.style.zIndex = '10000';
        popupDiv.style.display = 'block';

        const popupMenu = document.createElement('div');
        popupMenu.style.fontSize = "17px";
        popupMenu.style.fontWeight = "bold";

        const menuText = document.createElement('a');
        menuText.style.cursor = 'pointer';
        menuText.style.color = 'rgb(0 17 255)';
        menuText.innerText = title;

        popupMenu.appendChild(menuText);

        const popupContent = document.createElement('div');
        popupContent.className = 'popup_content';
        popupContent.style.height = 'auto';
        popupContent.style.overflowY = 'auto';
        popupContent.style.display = 'flex';
        popupContent.style.padding = '0';
        popupContent.style.paddingTop = '10px';

        const table = document.createElement('table');
        table.className = 'vis';
        table.style.width = '100%';

        const tbody = document.createElement('tbody');
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        const label = document.createElement('label');

        let countdown = timeoutDuration / 1000;
        label.innerText = message + ` It will continue in ${countdown} seconds.`;
        const interval = setInterval(() => {
            label.innerText = message + ` It will continue in ${countdown} seconds.`;
            countdown--;
            if (countdown < 0) {
                clearInterval(interval);
                label.innerText = "It will continue now!";
            }
        }, 1000);

        td1.appendChild(label);
        tr1.appendChild(td1);

        const tr2 = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.colSpan = 2;

        const continueButton = document.createElement('input');
        continueButton.type = 'submit';
        continueButton.value = 'Continue';
        continueButton.className = 'btn';
        continueButton.style.background = '#6bb000';
        continueButton.style.margin = '4px';
        continueButton.addEventListener('click', () => {
            clearTimeout(timeoutId);  // Clear the timeout
            resolve('continue');  // Resolve the promise with 'continue'
            togglePopup(popupDiv);  // Hide the popup
        });

        const cancelButton = document.createElement('input');
        cancelButton.type = 'button';
        cancelButton.value = 'Cancel';
        cancelButton.className = 'btn';
        cancelButton.style.background = '#d02c2c';
        cancelButton.style.margin = '4px';
        cancelButton.addEventListener('click', () => {
            clearTimeout(timeoutId);  // Clear the timeout
            resolve('cancel');  // Resolve the promise with 'cancel'
            togglePopup(popupDiv);  // Hide the popup
        });

        td2.appendChild(continueButton);
        td2.appendChild(cancelButton);
        tr2.appendChild(td2);

        tbody.appendChild(tr1);
        tbody.appendChild(tr2);
        table.appendChild(tbody);

        popupContent.appendChild(table);

        popupDiv.appendChild(popupMenu);
        popupDiv.appendChild(popupContent);

        document.body.appendChild(popupDiv);

        // Close on ESC key (= cancel)
        const warningEscHandler = (e) => {
            if (e.key !== 'Escape') return;
            if (popupDiv.style.display === 'none') { document.removeEventListener('keydown', warningEscHandler); return; }
            document.removeEventListener('keydown', warningEscHandler);
            cancelButton.click();
        };
        document.addEventListener('keydown', warningEscHandler);

        // Close on click outside the popup (= cancel)
        const warningOutsideClick = (e) => {
            if (popupDiv.style.display === 'none') { document.removeEventListener('mousedown', warningOutsideClick); return; }
            if (!popupDiv.contains(e.target)) cancelButton.click();
        };
        document.addEventListener('mousedown', warningOutsideClick);

        // Set a timeout for user choice
        const timeoutId = setTimeout(() => {
            resolve('timeout');  // Resolve the promise with 'timeout' after timeout
            togglePopup(popupDiv);  // Hide the popup after timeout
        }, timeoutDuration + 1000);
    });
}

/**
 * Reads the current DOM position of all widgets and persists their column assignment
 * and position index to settings_cookies.
 */
function saveColumnOrder() {
    var childDivs = Array.from(document.getElementById('script_column').children);
    var childDivIds = childDivs.map(function (div) {
        return div.id.replace('show_', '');
    });

    childDivIds.forEach(function (id, index) {
        var widget = settings_cookies.widgets.find(function (widget) {
            return widget.name === id;
        });
        if (widget) {
            widget.pos = index;
        }
    });

    var parentIds = [RIGHT_COLUMN, LEFT_COLUMN, CENTER_COLUMN];
    parentIds.forEach(function (parentId) {
        var parentElement = document.getElementById(parentId);
        if (parentElement) {
            var children = parentElement.children;
            for (var i = 0; i < children.length; i++) {
                var childId = children[i].id.replace("show_", "");
                var widgetIndex = settings_cookies.widgets.findIndex(function (widget) {
                    return widget.name === childId;
                });
                if (widgetIndex !== -1) {
                    settings_cookies.widgets[widgetIndex].column = parentId;
                    settings_cookies.widgets[widgetIndex].pos = i;
                }
            }
        }
    });

    localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
}

/**
 * Prepends a script_column <td> to the overview table to house custom widgets.
 */
function injectScriptColumn() {
    var overviewtableElement = document.getElementById('overviewtable');
    if (overviewtableElement) {
        var trElement = overviewtableElement.getElementsByTagName('tr')[0];
        var scriptColumn = document.createElement('td');
        scriptColumn.setAttribute('valign', 'top');
        scriptColumn.setAttribute('id', 'script_column');
        scriptColumn.style.width = document.getElementById('rightcolumn').offsetWidth + 'px';
        trElement.insertBefore(scriptColumn, trElement.firstChild);
    }
}

/**
 * Shows or hides the TW native tooltip, positioned next to the target element.
 * Reads content from data-title (header) and data-tooltip-tpl (body) attributes.
 * @param {HTMLElement} element
 * @param {boolean} isVisible
 */
function toggleTooltip(element, isVisible) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var elementPosition = {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };

    var tooltip = document.getElementById('tooltip');
    tooltip.querySelector('.body').style.display = 'none';

    var body = tooltip.getElementsByClassName('body')[0];
    var h3 = tooltip.getElementsByTagName('h3')[0];

    if (isVisible) {
        tooltip.style.display = 'block';
        tooltip.style.top = (Math.ceil(elementPosition.top) + 22) + 'px';
        tooltip.style.left = (Math.ceil(elementPosition.left) + 25) + 'px';
        tooltip.classList.add('tooltip-style');

        const data_title = element.parentNode.getAttribute('data-title') ?? element.getAttribute('data-title');
        const data_tooltip = element.parentNode.getAttribute('data-tooltip-tpl') ?? element.getAttribute('data-tooltip-tpl');

        if (data_title && data_tooltip) {
            h3.innerHTML = data_title;
            h3.style.display = 'block'
            body.innerHTML = data_tooltip;
            body.style.display = 'block'
        } else if (data_title) {
            h3.innerHTML = data_title;
            h3.style.display = 'block'
            body.innerHTML = '';
        } else if (data_tooltip) {
            body.innerHTML = data_tooltip;
            body.style.display = 'block'
            h3.innerHTML = '';
        }
    } else {
        h3.innerHTML = '';
        body.innerHTML = '';
        tooltip.style.display = 'none';
        tooltip.classList.remove('tooltip-style');
    }
}

/**
 * Shows or hides the TW tooltip without modifying its content.
 * @param {HTMLElement} element
 * @param {boolean} isVisible
 */
function toggleTooltipNoText(element, isVisible) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var elementPosition = {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };

    var tooltip = document.getElementById('tooltip');
    if (isVisible) {
        tooltip.style.display = 'block';
        tooltip.style.top = (Math.ceil(elementPosition.top) + 22) + 'px';
        tooltip.style.left = (Math.ceil(elementPosition.left) + 25) + 'px';
        tooltip.classList.add('tooltip-style');
    } else {
        tooltip.style.display = 'none';
        tooltip.classList.remove('tooltip-style');
    }
}

/**
 * Detects the server's UTC offset in milliseconds by comparing the TW header clock
 * (server-local H:M:S) with Timing.getCurrentServerTime() (UTC epoch).
 * Example: BR server (BRT = UTC-3) returns -10800000.
 */
function detectServerTimezoneOffsetMs() {
    const clockEl = document.getElementById('serverTime') ||
                    document.querySelector('.servertimer');
    if (!clockEl) {
        console.warn('[TW] Server clock element not found — timezone offset defaults to 0');
        return 0;
    }
    const timeText = clockEl.textContent.trim();
    const parts = timeText.split(':');
    if (parts.length < 2) return 0;
    const displayedH = parseInt(parts[0], 10);
    const displayedM = parseInt(parts[1], 10);
    const displayedS = parts[2] ? parseInt(parts[2], 10) : 0;
    if (isNaN(displayedH) || isNaN(displayedM) || isNaN(displayedS)) return 0;

    const serverNowMs = Timing.getCurrentServerTime();
    const d = new Date(serverNowMs);
    const utcH = d.getUTCHours();
    const utcM = d.getUTCMinutes();
    const utcS = d.getUTCSeconds();

    let offsetS = (displayedH * 3600 + displayedM * 60 + displayedS) -
                  (utcH * 3600 + utcM * 60 + utcS);
    // Wrap to [-12h, +12h] to handle day-boundary reads
    const halfDayS = 12 * 3600;
    if (offsetS > halfDayS) offsetS -= 86400;
    if (offsetS < -halfDayS) offsetS += 86400;
    return offsetS * 1000;
}

/**
 * Converts a TW wall-clock time string (displayed in server timezone) to a UTC epoch in ms.
 * Use this instead of new Date().setHours() everywhere TW time strings are parsed.
 * @param {number} hora - Hour (0-23)
 * @param {number} minuto - Minute (0-59)
 * @param {number} segundo - Second (0-59)
 * @param {number} dayOffset - 0 = today, 1 = tomorrow, -1 = yesterday (relative to server's day)
 * @returns {number} UTC epoch in milliseconds
 */
function twWallClockToEpochMs(hora, minuto, segundo, dayOffset) {
    const serverNowMs = Timing.getCurrentServerTime();
    // Shift into server-local space so UTC arithmetic gives server-local H/M/S
    const serverLocalMs = serverNowMs + serverTimezoneOffsetMs;
    // Midnight of the server's current day (in server-local space)
    const serverLocalMidnightMs = serverLocalMs - (serverLocalMs % 86400000);
    // Build target in server-local space, then shift back to UTC
    return serverLocalMidnightMs
        + hora * 3600000
        + minuto * 60000
        + segundo * 1000
        + dayOffset * 86400000
        - serverTimezoneOffsetMs;
}

/**
 * Parses a TW localised build-time string (e.g. "hoje às 14:30:00") using tw_lang keys
 * and returns [dayOffset, H, M, S] as strings. dayOffset is "0" for today, "1" for tomorrow.
 * @param {string} stringHTML
 * @returns {string[]|undefined}
 */
function extractBuildTimeFromHTML(stringHTML) {
    const lang = JSON.parse(localStorage.getItem('tw_lang'));
    const stringToday = lang['aea2b0aa9ae1534226518faaefffdaad'];
    const stringTomorrow = lang['57d28d1b211fddbb7a499ead5bf23079'];
    let time;

    if (stringToday && stringTomorrow) {
        const modelosStrings = [stringToday, stringTomorrow];
        let day, hora, minuto, segundo;

        for (const [index, modeloString] of modelosStrings.entries()) {
            // Build a regex that also captures optional seconds
            const regexString = modeloString
                .replace(/\\/g, "\\\\")
                .replace(/%s/, "(\\d{1,2}):(\\d{2})(?::(\\d{2}))?"); // Segundos opcionais

            const regex = new RegExp(regexString);
            const match = stringHTML.match(regex);
            if (match) {
                day = index.toString();
                hora = match[1].toString();
                minuto = match[2].toString();
                segundo = match[3] ? match[3].toString() : "00"; // default to "00" if seconds are absent
                break;
            }
        }

        if (day && hora && minuto && segundo) {
            time = [day, hora, minuto, segundo];
            return time;
        }
    }

    showAutoHideBox('Error extractBuildTimeFromHTML: ');
    return time;
}

/**
 * Converts an explicit TW calendar date (day/month[/year]) plus a wall-clock time in the
 * server's timezone to a UTC epoch in ms. TW switches from "today"/"tomorrow" phrasing to an
 * explicit "DD.MM.[YYYY]" (or "MM.DD.[YYYY]" on the US market) date once an entry is more than
 * one day out — this is what queues render for the finish time when there's a long backlog.
 * @param {number} day
 * @param {number} month - 1-indexed
 * @param {number|null} year - Full or 2-digit year, or null/undefined if omitted from the string
 * @param {number} hora
 * @param {number} minuto
 * @param {number} segundo
 * @returns {number} UTC epoch in milliseconds
 */
function twCalendarDateToEpochMs(day, month, year, hora, minuto, segundo) {
    const serverNowMs = Timing.getCurrentServerTime();
    const serverLocalMs = serverNowMs + serverTimezoneOffsetMs;
    const serverLocalNow = new Date(serverLocalMs);
    const currentYear = serverLocalNow.getUTCFullYear();

    let targetYear = year;
    if (targetYear && targetYear < 100) targetYear += 2000;
    if (!targetYear) targetYear = currentYear;

    let targetLocalMs = Date.UTC(targetYear, month - 1, day, hora, minuto, segundo);

    // No year in the string and the resulting date is already in the past — it must be next year
    if (!year) {
        const todayLocalMidnightMs = Date.UTC(currentYear, serverLocalNow.getUTCMonth(), serverLocalNow.getUTCDate());
        if (targetLocalMs < todayLocalMidnightMs) {
            targetLocalMs = Date.UTC(targetYear + 1, month - 1, day, hora, minuto, segundo);
        }
    }

    return targetLocalMs - serverTimezoneOffsetMs;
}

/**
 * Like extractBuildTimeFromHTML but returns a UTC epoch in milliseconds,
 * corrected for the server timezone via twWallClockToEpochMs.
 * Handles "today"/"tomorrow" phrasing as well as the explicit "DD.MM. HH:MM[:SS]" date format
 * TW uses once a queue entry finishes more than a day from now (e.g. long training/build queues).
 * @param {string} stringHTML
 * @returns {number|null}
 */
function extractBuildTimestampFromHTML(stringHTML) {
    const lang = JSON.parse(localStorage.getItem('tw_lang'));
    if (!lang) {
        alert('Erro no extractBuildTimestampFromHTML');
        return null;
    }

    const stringToday = lang['aea2b0aa9ae1534226518faaefffdaad'];
    const stringTomorrow = lang['57d28d1b211fddbb7a499ead5bf23079'];

    if (stringToday && stringTomorrow) {
        const modelosStrings = [stringToday, stringTomorrow];

        for (const [index, modeloString] of modelosStrings.entries()) {
            const regexString = modeloString
                .replace(/\\/g, "\\\\")
                .replace(/%s/, "(\\d{1,2}):(\\d{2})(?::(\\d{2}))?");

            const regex = new RegExp(regexString);
            const match = stringHTML.match(regex);

            if (match) {
                const hora = parseInt(match[1]);
                const minuto = parseInt(match[2]);
                const segundo = match[3] ? parseInt(match[3]) : 0; // default to 0 if seconds are absent
                return twWallClockToEpochMs(hora, minuto, segundo, index); // index: 0 = today, 1 = tomorrow
            }
        }
    }

    // Not "today"/"tomorrow" — entries more than a day out use an explicit date instead.
    // TW has two variants of this template (with/without year in the surrounding sentence).
    const stringFutureWithYear = lang['0cb274c906d622fa8ce524bcfbb7552d'];
    const stringFutureNoYear = lang['850731037a4693bf4338a0e8b06bd2e4'];
    const isUsMarket = typeof game_data !== 'undefined' && game_data && game_data.market === 'us';
    const dateGroupRegex = "(\\d{1,2})\\.(\\d{1,2})\\.(\\d{2,4})?\\.?";

    for (const template of [stringFutureWithYear, stringFutureNoYear]) {
        if (!template) continue;

        const regexString = template
            .replace(/\\/g, "\\\\")
            .replace(/%1/, dateGroupRegex)
            .replace(/%2/, "(\\d{1,2}):(\\d{2})(?::(\\d{2}))?");

        const regex = new RegExp(regexString);
        const match = stringHTML.match(regex);

        if (match) {
            const first = parseInt(match[1]);
            const second = parseInt(match[2]);
            const year = match[3] ? parseInt(match[3]) : null;
            const day = isUsMarket ? second : first;
            const month = isUsMarket ? first : second;
            const hora = parseInt(match[4]);
            const minuto = parseInt(match[5]);
            const segundo = match[6] ? parseInt(match[6]) : 0;
            return twCalendarDateToEpochMs(day, month, year, hora, minuto, segundo);
        }
    }

    return null;
}

/**
 * Returns remaining time until a Unix timestamp (seconds) as [HH, MM, SS] strings,
 * or null if already elapsed. Uses the server's current time as 'now'.
 * @param {number} endtime - Unix timestamp in seconds.
 * @returns {string[]|null}
 */
function endTimeToTimer(endtime) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    if (remaining <= 0) {
        return null;
    } else {
        var hours = Math.floor(remaining / 3600);
        var minutes = Math.floor((remaining % 3600) / 60);
        var seconds = remaining % 60;
        return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')];
    }
}

/**
 * Converts an "HH:MM:SS" duration string to milliseconds.
 * @param {string} timeString
 * @returns {number}
 */
function timeToMilliseconds(timeString) {
    var parts = timeString.split(':');

    var hours = parseInt(parts[0], 10) * 60 * 60 * 1000;
    var minutes = parseInt(parts[1], 10) * 60 * 1000;
    var seconds = parseInt(parts[2], 10) * 1000;

    return hours + minutes + seconds;
}

/**
 * Converts a fractional-minutes value to an "H:MM:SS" string.
 * @param {number} minutes
 * @returns {string}
 */
function formatMinutesToTime(minutes) {
    const totalSeconds = Math.round(minutes * 60);

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Returns a Promise that resolves after the given number of seconds.
 * @param {number} seconds
 * @returns {Promise<void>}
 */
function wait(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

var activeTimeouts = {};
/**
 * Schedules a function with a random extra delay (up to 3 min) to reduce bot patterns.
 * Persists the end time and serialised function to localStorage so the timeout
 * survives page reloads and can be restored by restoreTimeouts().
 * @param {string} id - Unique key for deduplication and storage.
 * @param {Function} func
 * @param {number} timeToRun - Base delay in milliseconds.
 */
function setFunctionOnTimeOut(id, func, timeToRun) {
    if (activeTimeouts[id]) {
        clearTimeout(activeTimeouts[id]);
    }

    // Add up to 3 minutes of random delay to avoid predictable bot patterns
    let randomExtraTime = Math.random() * 180000;
    let finalTimeToRun = Math.floor(timeToRun + randomExtraTime);

    let endTime = Math.floor(Date.now() + finalTimeToRun);
    localStorage.setItem('endTime_' + id, endTime);
    localStorage.setItem('function_' + id, func.toString());

    activeTimeouts[id] = setTimeout(() => {
        localStorage.removeItem('endTime_' + id);
        localStorage.removeItem('function_' + id);
        func();
        delete activeTimeouts[id];
    }, finalTimeToRun);
}

/**
 * Re-schedules any pending timeouts stored in localStorage by setFunctionOnTimeOut.
 * If a timeout has already elapsed, the function is executed immediately.
 */
function restoreTimeouts() {
    // Restore all pending timeouts from previous page loads
    for (var key in localStorage) {
        if (key.startsWith('endTime_')) {
            var id = key.replace('endTime_', '');

            var endTime = localStorage.getItem(key);
            var remainingTime = parseInt(endTime) - Date.now();

            if (remainingTime > 0) {
                setTimeout(() => {
                    eval('(' + localStorage.getItem('function_' + id) + ')();');
                }, remainingTime);
            } else {
                eval('(' + localStorage.getItem('function_' + id) + ')();');
                localStorage.removeItem('endTime_' + id);
                localStorage.removeItem('function_' + id);
                if (activeTimeouts[id]) {
                    clearTimeout(activeTimeouts[id]);
                }
            }
        }
    }
}

/**
 * Reloads the page if TW's idle timer exceeds the threshold (keep_awake feature).
 * @param {number} minutes - Inactivity threshold in minutes.
 */
async function checkInactivity(minutes) {
    if (TribalWars.getIdleTime() >= minutes * 60 * 1000) {
        showAutoHideBox('Inactivity detected! Reloading page...');
        await wait(5);
        location.reload();
    }
}

// Auto-expand all quest group lists when the quest panel is opened
var questButton = document.getElementById('new_quest');
if (questButton) {
    // Store a reference to the original onclick handler
    var originalOnClick = questButton.onclick;

    // Override onclick to call the original first, then auto-expand quest groups
    questButton.onclick = function (event) {
        // Call the original handler if it exists
        if (originalOnClick) {
            originalOnClick.call(this, event);
        }

        let checkExist = setInterval(function () {
            let questlineLists = document.querySelectorAll('.questline-list');

            if (questlineLists.length > 0) {
                clearInterval(checkExist); // Stop polling once the quest lists are found

                questlineLists.forEach(questlineList => {
                    let listItems = questlineList.querySelectorAll('li');

                    listItems.forEach(li => {
                        let ul = li.closest('ul'); // Find the nearest parent <ul>
                        if (ul) {
                            ul.classList.add('opened'); // Force the quest group open
                        }
                    });
                });
            }
        }, 500); // Poll every 500 ms until the lists appear
    };
}

/**
 * Updates an element's text with the countdown to endtime, or 'END' when elapsed.
 * Intended to be called on a repeating interval.
 * @param {number} endtime - Unix timestamp in seconds.
 * @param {HTMLElement} element
 */
function startResourceTimerFull(endtime, element) {
    var remaining = endTimeToTimer(endtime);
    if (!remaining) {
        element.textContent = 'END';
        clearInterval(element.dataset.interval);
    } else {
        element.textContent = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
    }
    element.style.display = "block";
}

/**
 * Replaces the HH:MM:SS portion of an element's text content in-place with the
 * current countdown to endtime. Intended to be called on a repeating interval.
 * @param {number} endtime - Unix timestamp in seconds.
 * @param {HTMLElement} element
 */
function startTimerOnLabel(endtime, element) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;

    if (remaining <= 0) {
        element.textContent = '';
        clearInterval(element.dataset.interval);
    } else {
        var hours = Math.floor(remaining / 3600).toString().padStart(2, '0');
        var minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
        var seconds = (remaining % 60).toString().padStart(2, '0');

        var formattedTime = `${hours}:${minutes}:${seconds}`;

        element.textContent = element.textContent.replace(/\d{2}:\d{2}:\d{2}/, formattedTime);
    }
    element.style.display = "block";
}

/**
 * Returns the whole number of hours remaining until a Unix timestamp.
 * @param {number} endtime - Unix timestamp in seconds.
 * @returns {number}
 */
function getRemainingHours(endtime) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    return Math.floor(remaining / 3600);
}

/**
 * Displays a transient notification bar that auto-removes after 3 seconds.
 * @param {string} text
 * @param {boolean} [isError=true] - Uses error styling; pass false for success.
 */
function showAutoHideBox(text, isError = true) {
    let divAutoHideBox = document.querySelector('.autoHideBox');

    if (!divAutoHideBox) {
        divAutoHideBox = document.createElement('div');
        divAutoHideBox.classList.add('autoHideBox', isError ? 'error' : 'success');

        const tooltip = document.getElementById('tooltip');
        if (tooltip) tooltip.parentNode.insertBefore(divAutoHideBox, tooltip.nextSibling);
    }

    const p = document.createElement('p');
    p.textContent = text;
    divAutoHideBox
    divAutoHideBox.appendChild(p);
    divAutoHideBox.classList.toggle(divAutoHideBox.classList.contains('error') ? 'error' : 'success');
    divAutoHideBox.classList.add(isError ? 'error' : 'success');
    clearTimeout(divAutoHideBox.dataset.timeout);
    divAutoHideBox.dataset.timeout = setTimeout(() => divAutoHideBox.remove(), 3000);
}

/**
 * Stub for attack-distance injection on the place screen. Not fully implemented.
 */
function injectAttackCalculations() {
    console.log(parseInt(document.querySelector('#command-data-form .village-distance').textContent.match(/(\d+)/), 10));
}

/**
 * Converts common BBCode tags in a string to equivalent HTML markup.
 * Supports [b], [i], [u], [s], [url] and [url=link]Text[/url].
 * @param {string} text
 * @returns {string}
 */
function convertBBCodeToHTML(text) {
    const bbcodeMap = {
        '\\[b\\](.*?)\\[/b\\]': '<strong>$1</strong>',   // [b]bold[/b] -> <strong>bold</strong>
        '\\[i\\](.*?)\\[/i\\]': '<em>$1</em>',         // [i]italic[/i] -> <em>italic</em>
        '\\[u\\](.*?)\\[/u\\]': '<u>$1</u>',           // [u]underline[/u] -> <u>underline</u>
        '\\[s\\](.*?)\\[/s\\]': '<del>$1</del>',       // [s]strikethrough[/s] -> <del>strikethrough</del>
        '\\[url\\](.*?)\\[/url\\]': '<a href="$1" target="_blank">$1</a>' // [url]link[/url] -> <a>
    };

    if (text) {
        for (const bbcode in bbcodeMap) {
            const regex = new RegExp(bbcode, 'gi');
            text = text.replace(regex, bbcodeMap[bbcode]);
        }

        // Handle [url=link]Text[/url] with an explicit label
        text = text.replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, function (match, link, text) {
            if (!link.startsWith("http://") && !link.startsWith("https://")) {
                link = "https://" + link;
            }
            return `<a href="${link}" target="_blank">${text}</a>`;
        });
    }

    return text;
}

/**
 * Fetches the server's village.txt data and caches it in localStorage.
 * Skips the fetch if the cache is less than 1 hour old, unless force is true.
 * @param {boolean} [force=false]
 */
async function updateMapInfoVillages(force = false) {
    const STORAGE_KEY = 'map_villages';
    const TIMESTAMP_KEY = 'map_villages_last_update';
    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

    const lastUpdate = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    // Check if we already have data and if it's still "fresh" (less than 1 hour old)
    if (!force && (lastUpdate && (now - lastUpdate < ONE_HOUR) && localStorage.getItem(STORAGE_KEY))) {
        return;
    }

    console.log("Updating map villages data...");

    try {
        const response = await fetch(window.location.origin + "/map/village.txt");

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.text();

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, data);
        localStorage.setItem(TIMESTAMP_KEY, now.toString());

        console.log("Map villages updated and saved to localStorage.");
    } catch (error) {
        console.error("Failed to fetch village data:", error);
    }
}

/**
 * Calculates the Euclidean distance from the current village to a target coordinate.
 * @param {string} targetCoords - Target village in "X|Y" format.
 * @returns {number} Distance rounded to 2 decimal places.
 */
function calculateDistanceToTarget(targetCoords) {
    // 1. Get current village coordinates from game_data
    const currentCoords = game_data.village.coord; // Format: "454|369"

    // 2. Split both strings into X and Y arrays
    const [x1, y1] = currentCoords.split('|').map(Number);
    const [x2, y2] = targetCoords.split('|').map(Number);

    // 3. Apply the Pythagorean theorem: sqrt((x2-x1)^2 + (y2-y1)^2)
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 4. Return formatted to 2 decimal places (standard for TW)
    return parseFloat(distance.toFixed(2));
}

/**
 * Fetches unit speed and carry capacity from the server API and caches them
 * in localStorage. Skips the fetch if values are already stored.
 */
function storeUnitsInfo() {
    const hasSpeeds = localStorage.getItem('units_speed');
    const hasCarry = localStorage.getItem('units_carry');

    if (hasSpeeds && hasSpeeds !== '{}' && hasCarry && hasCarry !== '{}') {
        return; // already stored, skip fetch
    }

    fetch('/interface.php?func=get_unit_info')
        .then(res => res.text())
        .then(xmlText => {
            const xml = new DOMParser().parseFromString(xmlText, 'text/xml');

            const speeds = {};
            const carry = {};
            const units = [...xml.documentElement.children];

            units.forEach(unit => {
                const unitName = unit.tagName;

                // Extract Speed
                const speedNode = unit.querySelector('speed');
                speeds[unitName] = speedNode ? Number(speedNode.textContent) : null;

                // Extract Carry
                const carryNode = unit.querySelector('carry');
                carry[unitName] = carryNode ? Number(carryNode.textContent) : null;
            });

            localStorage.setItem('units_speed', JSON.stringify(speeds));
            localStorage.setItem('units_carry', JSON.stringify(carry));

            console.log('[TW] Unit data stored:', { speeds, carry });
        })
        .catch(err => {
            console.error('[TW] Failed to fetch unit info', err);
        });
}

/**
 * Wraps GM_xmlhttpRequest in a Promise for use with async/await.
 * Needed for cross-origin fetches (e.g. twstats.com) that regular fetch() cannot
 * perform due to CORS restrictions on the game page.
 * @param {string} url
 * @returns {Promise<string>} Response text
 */
function gmFetch(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response.responseText);
                } else {
                    reject(new Error('HTTP ' + response.status + ' — ' + url));
                }
            },
            onerror: function () {
                reject(new Error('Network error fetching ' + url));
            }
        });
    });
}

/**
 * Parses a TWStats building detail page and returns per-level cost + time data.
 *
 * The page contains two tables:
 *   - table.widget  — summary row for this building with base time and time factor
 *   - table.vis     — per-level costs (Nível, Madeira, Argila, Ferro, Pop para desenvolver)
 *
 * Build time per level is calculated as:
 *   time(n) = base_time_seconds * factor ^ (n - 1)
 * This is the raw speed-1 time with no main-building bonus applied.
 *
 * @param {Document} doc        - Parsed HTML of the TWStats building detail page.
 * @param {string}   buildingId - Building identifier (e.g. 'barracks'), used to locate
 *                                the correct row in the widget summary table.
 * @returns {Object} { 1: { wood, stone, iron, pop, timeSec }, 2: {...}, ... }
 */
function parseTWStatsBuildingPage(doc, buildingId) {
    const result = {};

    // --- Step 1: extract base_time and time_factor from table.widget ---
    let baseTimeSec = 0;
    let timeFactor  = 1;

    const widgetTable = doc.querySelector('table.widget');
    if (widgetTable) {
        const wRows = widgetTable.querySelectorAll('tr');
        const wHeaders = Array.from(wRows[0]?.querySelectorAll('th, td') || [])
            .map(th => th.textContent.trim().toLowerCase());

        // PT: "Tempo de construção base" / "Fator tempo de construção"
        const baseTimeIdx   = wHeaders.findIndex(h => /tempo.*constru|build.*time|bauzeit/i.test(h));
        const timeFactorIdx = wHeaders.findIndex(h => /fator.*tempo|time.*factor|zeitfaktor/i.test(h));

        for (let i = 1; i < wRows.length; i++) {
            // Match this row by the detail= href in the first cell's link
            if (!wRows[i].querySelector(`a[href*="detail=${buildingId}"]`)) continue;

            const cells = wRows[i].querySelectorAll('td');
            if (baseTimeIdx >= 0 && cells[baseTimeIdx]) {
                // Format is "MM:SS" (e.g. "30:0" = 30 min, "9780:0" = 9780 min)
                const [mins, secs] = cells[baseTimeIdx].textContent.trim().split(':').map(Number);
                baseTimeSec = (mins || 0) * 60 + (secs || 0);
            }
            if (timeFactorIdx >= 0 && cells[timeFactorIdx]) {
                timeFactor = parseFloat(cells[timeFactorIdx].textContent.trim()) || 1;
            }
            break;
        }
    }

    // --- Step 2: parse per-level costs from table.vis ---
    const visTable = doc.querySelector('table.vis');
    if (!visTable) return result;

    const rows = visTable.querySelectorAll('tr');
    if (rows.length < 2) return result;

    const headers = Array.from(rows[0].querySelectorAll('th, td'))
        .map(th => th.textContent.trim().toLowerCase());

    // PT headers: Nível | Madeira | Argila | Ferro | População para desenvolver | População total
    const levelIdx = headers.findIndex(h => /^n[íi]vel$|^level$|^stufe$/i.test(h));
    const woodIdx  = headers.findIndex(h => /madeira|wood|holz/i.test(h));
    const stoneIdx = headers.findIndex(h => /argila|stone|clay|lehm/i.test(h));
    const ironIdx  = headers.findIndex(h => /ferro|iron|eisen/i.test(h));
    // "para desenvolver" = pop cost for this upgrade (not cumulative total)
    const popIdx   = headers.findIndex(h => /para\s+des|for\s+dev|zum\s+aus/i.test(h));

    if (levelIdx === -1 || woodIdx === -1) return result;

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length <= levelIdx) continue;

        const level = parseInt(cells[levelIdx]?.textContent.trim(), 10);
        if (isNaN(level) || level <= 0) continue;

        // time(n) = base * factor^(n-1), rounded to nearest second
        const timeSec = baseTimeSec > 0
            ? Math.round(baseTimeSec * Math.pow(timeFactor, level - 1))
            : 0;

        result[level] = {
            wood:    woodIdx  >= 0 ? parseInt(cells[woodIdx]?.textContent.replace(/[^\d]/g, '') || '0', 10) : 0,
            stone:   stoneIdx >= 0 ? parseInt(cells[stoneIdx]?.textContent.replace(/[^\d]/g, '') || '0', 10) : 0,
            iron:    ironIdx  >= 0 ? parseInt(cells[ironIdx]?.textContent.replace(/[^\d]/g, '') || '0', 10) : 0,
            pop:     popIdx   >= 0 ? parseInt(cells[popIdx]?.textContent.replace(/[^\d]/g, '') || '0', 10) : 0,
            timeSec, // raw seconds on speed-1, no main-building bonus
        };
    }

    return result;
}

/**
 * Fetches per-level cost/time data for every building from TWStats and stores it
 * in localStorage under 'buildings_data'. The fetch is skipped entirely if the key
 * already exists — the data is static and only needs to be collected once.
 *
 * Storage format:
 *   buildings_data = { barracks: { 1: { wood, stone, iron, pop, time }, 2: {...} }, ... }
 *
 * The URL is built from game_data.market and game_data.world so it automatically
 * targets the correct server (e.g. br.twstats.com/br143 or pt.twstats.com/pt93).
 * @returns {Promise<Object|null>}
 */
async function fetchAndCacheBuildingsData() {
    const STORAGE_KEY = 'buildings_data';

    if (localStorage.getItem(STORAGE_KEY)) return JSON.parse(localStorage.getItem(STORAGE_KEY));

    const world  = game_data?.world;
    const market = game_data?.market || (world ? world.replace(/\d+$/, '') : null);

    if (!world || !market) {
        console.warn('[TW BuildingsData] Cannot determine world/market from game_data — skipping fetch');
        return null;
    }

    const buildings = [
        'main', 'barracks', 'stable', 'garage', 'church', 'church_f',
        'snob', 'smith', 'place', 'market', 'wood', 'stone', 'iron',
        'farm', 'storage', 'hide', 'wall', 'watchtower', 'statue'
    ];

    const baseUrl = `https://${market}.twstats.com/${world}/index.php?page=buildings&detail=`;
    const buildingsData = {};

    console.log(`[TW BuildingsData] Fetching from ${baseUrl}...`);

    for (const building of buildings) {
        try {
            const html = await gmFetch(baseUrl + building);
            const doc  = new DOMParser().parseFromString(html, 'text/html');
            const levelData = parseTWStatsBuildingPage(doc, building);
            if (Object.keys(levelData).length > 0) {
                buildingsData[building] = levelData;
                console.log(`[TW BuildingsData] ${building}: ${Object.keys(levelData).length} levels cached`);
            } else {
                console.warn(`[TW BuildingsData] ${building}: no level data found (building may not exist in this world)`);
            }
        } catch (e) {
            console.warn(`[TW BuildingsData] Skipping ${building}:`, e.message);
        }
    }

    if (Object.keys(buildingsData).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buildingsData));
        console.log('[TW BuildingsData] All buildings cached successfully.');
    } else {
        console.warn('[TW BuildingsData] No data was fetched — localStorage not updated.');
    }

    return buildingsData;
}



/**
 * Launches an attack automatically.
 * Explaining the two-step AJAX process used by TribalWars to prevent botting.
 * * @param {Object} units - Object containing unit counts { spear: 10, ... }
 * @param {string|number} targetId - Internal database ID of the target village
 */
async function launchAttack(units, targetId) {
    try {
        const GD = typeof unsafeWindow !== 'undefined' ? unsafeWindow.game_data : window.game_data;
        if (!GD || !GD.csrf) throw new Error("Game data not found.");

        const csrfToken = GD.csrf;
        const currentVillage = GD.village.id;
        const baseUrl = `https://${window.location.host}/game.php?village=${currentVillage}&screen=place`;

        /**
         * AJAX CALL #1: THE PREPARATION PHASE (ajax=confirm)
         * * PURPOSE: This call asks the server to validate the attack. 
         * The server checks if you have enough troops and if the target is valid.
         * * WHY IT'S NECESSARY: The server does not launch the attack yet. 
         * Instead, it returns a JSON object containing the "Confirmation Dialog" HTML.
         * This HTML contains the unique security tokens (ch and honeypot) required for Step 2.
         */
        console.log("Step 1: Requesting confirmation dialog...");

        let coordX = "", coordY = "";
        const rawFocus = unsafeWindow.TWMap.context._curFocus;
        if (rawFocus) {
            const focusStr = rawFocus.toString();
            coordX = focusStr.substring(0, 3);
            coordY = focusStr.substring(3, 6);
        }

        const step1Data = new URLSearchParams();
        step1Data.append("target", targetId);
        step1Data.append("x", coordX);
        step1Data.append("y", coordY);
        step1Data.append("attack", "1"); // In PT servers, the button internal value is "Atacar" (try for now with 1)
        step1Data.append("h", csrfToken);

        for (const [unit, amount] of Object.entries(units)) {
            step1Data.append(unit, amount);
        }

        const responseStep1 = await fetch(`${baseUrl}&ajax=confirm`, {
            method: "POST",
            body: step1Data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'TribalWars-Ajax': '1' // Tells the server to return JSON instead of a full page redirect
            }
        });

        const jsonResponse = await responseStep1.json();

        // Check for server-side logic errors (e.g., "Not enough units")
        if (jsonResponse.error) {
            const msg = Array.isArray(jsonResponse.error) ? jsonResponse.error[0] : jsonResponse.error;
            throw new Error(msg);
        }

        // The dialog HTML is stored in response.dialog
        const htmlText = jsonResponse.response.dialog;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        /**
         * TOKEN EXTRACTION (The "Secret Sauce")
         * * 'ch': Confirmation Hash. A one-time code generated by the server for this specific attack.
         * 'dynamicInput': A hidden field with a randomized name (e.g. "8219ab..."). 
         * This is a "honeypot" protection; if you don't send this exact name/value pair in Step 2, 
         * the server knows you are a bot and returns "Invalid Command".
         */
        const chInput = doc.querySelector('input[name="ch"]');
        const dynamicInput = doc.querySelector('input[type="hidden"]:not([name="ch"]):not([name="template_id"]):not([name="source_village"])');

        if (!chInput || !dynamicInput) {
            throw new Error("Security tokens (ch/honeypot) were not found in the response.");
        }

        /**
         * AJAX CALL #2: THE EXECUTION PHASE (action=command)
         * * PURPOSE: This is the actual "Confirm" click. It sends the troops out.
         * * WHY IT'S NECESSARY: You must prove to the server that you performed Step 1 
         * by providing the 'ch' hash and the dynamic honeypot token.
         */
        console.log(`Step 2: Executing attack with hash: ${chInput.value}`);

        const step2Data = new URLSearchParams();
        step2Data.append(dynamicInput.name, dynamicInput.value); // Sending the dynamic honeypot
        step2Data.append("ch", chInput.value);                  // Sending the confirmation hash
        step2Data.append("x", coordX);
        step2Data.append("y", coordY);
        step2Data.append("action", "command");                  // The action that actually triggers the movement
        step2Data.append("h", csrfToken);

        for (const [unit, amount] of Object.entries(units)) {
            step2Data.append(unit, amount);
        }

        const responseStep2 = await fetch(`${baseUrl}&action=command&h=${csrfToken}`, {
            method: "POST",
            body: step2Data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (responseStep2.ok) {
            const successMsg = `Attack successfully sent to ${coordX}|${coordY}!`;
            showAutoHideBox(successMsg, false);
            console.log("%c " + successMsg, "color: green; font-weight: bold;");
            return true;
        } else {
            throw new Error("The server rejected the final command.");
        }

    } catch (error) {
        if (typeof showAutoHideBox === 'function') {
            showAutoHideBox(error.message, true);
        }
        console.error("Attack Failed:", error.message);
        return false;
    }
}

/**
 * Fetches world settings from /page/settings and caches them in localStorage under
 * 'world_settings_{world}'. Skips the request if settings are already cached.
 * Stores: game_speed, unit_speed, resource_factor, archers, church, watchtower,
 * scavenging, paladin, militia, morale, night_bonus, milliseconds, fake_limit.
 * @returns {Promise<Object>}
 */
async function fetchAndCacheWorldSettings() {
    const worldKey = 'world_settings_' + (game_data?.world || window.location.hostname);
    const cached = localStorage.getItem(worldKey);
    if (cached) return JSON.parse(cached);

    const defaults = { game_speed: 1, unit_speed: 1, resource_factor: 1 };
    try {
        const resp = await fetch(window.location.origin + '/page/settings', { credentials: 'include' });
        if (!resp.ok) return defaults;

        const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
        const rows = [];
        doc.querySelectorAll('.content-display .data-table tr').forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 2) rows.push({ label: tds[0].textContent.trim(), value: tds[1].textContent.trim() });
        });
        if (!rows.length) return defaults;

        const toNum = v => { const n = parseFloat(v); return isFinite(n) ? n : null; };
        const settings = {
            game_speed:      toNum(rows[0]?.value) ?? 1,
            unit_speed:      toNum(rows[1]?.value) ?? 1,
            resource_factor: toNum(rows[2]?.value) ?? 1
        };
        rows.forEach(({ label, value }) => {
            const active = /activo|ativo|active|aktiviert|enabled/i.test(value);
            if (/moral/i.test(label))                          settings.morale        = value.trim();
            if (/church|igreja/i.test(label))                  settings.church        = active;
            if (/archer|arqueiro/i.test(label))                settings.archers       = active;
            if (/watchtower|torre.*vigia/i.test(label))        settings.watchtower    = active;
            if (/scaveng|busca.*minuci/i.test(label))          settings.scavenging    = active;
            if (/paladin/i.test(label))                        settings.paladin       = active;
            if (/militia|mil[ií]cia/i.test(label))             settings.militia       = active;
            if (/night.*bonus|b[oó]nus.*noit/i.test(label))   settings.night_bonus   = value.trim();
            if (/milliseconds|milissegundos/i.test(label))     settings.milliseconds  = active;
            if (/fake.*limit|limite.*ataques/i.test(label))    settings.fake_limit    = value.trim();
        });

        localStorage.setItem(worldKey, JSON.stringify(settings));
        console.log('[WorldSettings] Cached for', worldKey, ':', settings);
        return settings;
    } catch (e) {
        console.warn('[WorldSettings] Fetch failed:', e);
        return defaults;
    }
}

/**
 * Returns the cached world game speed, or 1 if not yet fetched.
 * @returns {number}
 */
function getWorldSpeed() {
    try {
        const worldKey = 'world_settings_' + (game_data?.world || window.location.hostname);
        const s = localStorage.getItem(worldKey);
        return s ? (JSON.parse(s).game_speed ?? 1) : 1;
    } catch { return 1; }
}

/**
 * Main entry point called after all scripts load. Detects server timezone, initialises
 * settings, runs page-specific feature injection, and restores persisted timeouts.
 */
function start() {
    var urlPage = document.location.href;
    // Check for expired session and auto-redirect to the last active world if so
    if (!urlPage.includes('?session_expired') && typeof game_data != 'undefined') {
        serverTimezoneOffsetMs = detectServerTimezoneOffsetMs();
        fetchAndCacheWorldSettings(); // async, caches for future use; no-op if already cached
        prepareVillageList();
        villageList = localStorage.getItem('villages_info') ? JSON.parse(localStorage.getItem('villages_info')) : [];
        settings_cookies = localStorage.getItem('settings_cookies') ? JSON.parse(localStorage.getItem('settings_cookies')) : settings_cookies;
        listenTextAreas();
        setCookieCurrentVillage();
        captureCurrentVillageResources();
        if (typeof checkEarlyBuildOpportunity === 'function') checkEarlyBuildOpportunity();
        // On overview, the widget re-fetches the main page and calls checkAndScheduleBuildInstantFree()
        // via scheduleCompletionNotification with fresh data — skip here to avoid a duplicate call.
        if (typeof checkAndScheduleBuildInstantFree === 'function' && !urlPage.includes('screen=overview')) {
            checkAndScheduleBuildInstantFree();
        }
        addRessourcesHover(localStorage.getItem('full_storage_times') ? JSON.parse(localStorage.getItem('full_storage_times')) : null);
        if (urlPage.includes("screen=overview") && !urlPage.includes("screen=overview_villages")) {
            injectScriptColumn();
            updatePremiumInfoOverview();

            settings_cookies.widgets.forEach(function (widget) {
                var functionName = widgetsInjectFunctions[widget.name];
                if (functionName) {
                    functionName(widget.column);
                }
            });
        } else if (urlPage.includes("mode=scavenge")) {
            waitForScavengeWidget(injectAutoScavengingOption);
        } else if (urlPage.includes("screen=statue")) {
            $(document).ready(function () {
                injectScriptAutoTrainerPaladin();
            });
        } else if (urlPage.includes('&screen=place&target')) {
            $(document).ready(function () {
                injectAttackCalculations();
            });
        } else if (urlPage.includes('screen=place') && urlPage.includes('mode=sim')) {
            $(document).ready(function () {
                if (typeof injectSimulatorPrefill === 'function') injectSimulatorPrefill();
            });
        } else if (urlPage.includes('screen=report') && urlPage.includes('view=')) {
            $(document).ready(function () {
                if (typeof injectReportToSimulatorButton === 'function') injectReportToSimulatorButton();
            });
        } else if (urlPage.includes('screen=train')) {
            $(document).ready(function () {
                injectTrainSectionToggles();
            });
        } else if (urlPage.includes('screen=info_player') && settings_cookies.general['show__player_profile_stats']) {
            $(document).ready(function () {
                if (typeof injectPlayerProfileTWStats === 'function') injectPlayerProfileTWStats();
            });
        }
        insertNavigationArrows();
        insertListVillagesPopup();
        injectNavigationBar();
        defineKeyboardShortcuts();
        injectScriptSettingsPopUp();

        if (settings_cookies.general['keep_awake']) {
            var maxInactiveMin = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            setInterval(() => checkInactivity(maxInactiveMin), 30000);
        }

        const table = $("#overviewtable");

        if (table.length && table.data("ui-sortable")) {
            const originalSortableUpdate = table.sortable("option", "update");
            table.sortable("option", "update", function () {
                saveColumnOrder(this);
                if (
                    typeof originalSortableUpdate === "function" &&
                    !arguments[1].item[0].classList.contains('script_widget')
                ) {
                    $(this).find('.script_widget').detach();
                    originalSortableUpdate.apply(this, arguments);

                    settings_cookies.widgets.forEach(function (widget) {
                        const functionName = widgetsInjectFunctions[widget.name];
                        if (functionName) {
                            functionName(widget.column);
                        }
                    });
                }
            });
        }

        updateMapInfoVillages();
        storeUnitsInfo();
        fetchAndCacheBuildingsData();

        if (settings_cookies.general['show__auto_daily_bonus']) {
            checkAndScheduleDailyBonus();
        }

        if (settings_cookies.general['show__auto_paladin_train']?.enabled) {
            checkAndSchedulePaladinTrainer();
        }

    } else {
        // get from TM storage
        let lastWorld = GM_getValue("current_world");
        const targetLink = document.querySelector('.world-select[href*="' + lastWorld + '"]');

        if (targetLink) {
            window.location.href = targetLink.href;
        } else {
            console.warn("No last world was found.");
        }
    }
}

/**
 * Adds a collapse/expand toggle button to each training section (.current_prod_wrapper)
 * on the screen=train page. State persists in localStorage per building.
 */
function injectTrainSectionToggles() {
    const toggleKey = 'train_section_collapsed';
    const collapsed = JSON.parse(localStorage.getItem(toggleKey) || '{}');

    document.querySelectorAll('.current_prod_wrapper').forEach(wrapper => {
        // Identify this section by its inner replace_* div id (e.g. 'barracks', 'stable')
        const replaceDiv = wrapper.querySelector('[id^="replace_"]');
        if (!replaceDiv) return;
        const sectionId = replaceDiv.id.replace('replace_', '');

        // Find the heading row inside the first vis table (the "next unit" row)
        const firstTable = replaceDiv.querySelector('table.vis');
        if (!firstTable) return;
        const headRow = firstTable.querySelector('tr');
        if (!headRow) return;

        // Don't inject twice
        if (headRow.querySelector('.train-section-toggle')) return;

        const isCollapsed = !!collapsed[sectionId];

        // Content to toggle: everything except the first table (i.e. the queue div + footnote)
        const toggleTargets = Array.from(replaceDiv.children).filter(el => el !== firstTable);
        toggleTargets.forEach(el => { el.style.display = isCollapsed ? 'none' : ''; });

        // Build toggle button cell
        const th = document.createElement('th');
        th.style.cssText = 'width:24px;text-align:center;padding:0;background:none';

        const btn = document.createElement('img');
        btn.className = 'train-section-toggle';
        btn.src = `graphic/${isCollapsed ? 'plus' : 'minus'}.png`;
        btn.style.cssText = 'cursor:pointer;display:block;margin:0 auto;';
        btn.title = isCollapsed ? 'Expand' : 'Collapse';

        btn.onclick = () => {
            const nowCollapsed = btn.src.includes('minus');
            toggleTargets.forEach(el => { el.style.display = nowCollapsed ? 'none' : ''; });
            btn.src = `graphic/${nowCollapsed ? 'plus' : 'minus'}.png`;
            btn.title = nowCollapsed ? 'Expand' : 'Collapse';
            const state = JSON.parse(localStorage.getItem(toggleKey) || '{}');
            if (nowCollapsed) state[sectionId] = 1; else delete state[sectionId];
            localStorage.setItem(toggleKey, JSON.stringify(state));
        };

        th.appendChild(btn);

        // Building name: prefer localized title from overview visual-label, fall back to capitalised id
        const buildingName = document.querySelector('.visual-label-' + sectionId)?.getAttribute('data-title')
            || (sectionId.charAt(0).toUpperCase() + sectionId.slice(1));

        const nameTh = document.createElement('th');
        nameTh.style.cssText = 'text-align:left;padding:0 4px;font-weight:bold;';
        nameTh.textContent = buildingName;

        headRow.prepend(nameTh);
        headRow.prepend(th);
    });
}

// Intercept Barracks/Stable link clicks and redirect to the unified training screen
if (settings_cookies.general['redirect__train_buildings']) {
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href], area[href]");

        if (link) {
            const url = new URL(link.href);
            const screenParam = url.searchParams.get("screen");

            if (screenParam === "barracks" || screenParam === "stable") {
                event.preventDefault();
                url.searchParams.set("screen", "train");
                window.location.href = url.href;
            }
        }
    });
}
