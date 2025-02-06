
//Utils

//GLOBAL VARIABLES
var RIGHT_COLUMN = "rightcolumn";
var CENTER_COLUMN = "leftcolumn";
var LEFT_COLUMN = "script_column";

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
        }
    ],
    general: {
        keep_awake: true,
        remove__premium_promo: true,
        show__village_list: true,
        show__navigation_arrows: true,
        show__notepad: true,
        show__building_queue: true,
        show__extra_options_map_hover: true,
        show__time_storage_full_hover: true,
        show__big_map: false,
        show__auto_scavenging: {
            enabled: false,
            level: 0,
            all: true,
            troops : {
                spears: 0, 
                //.....
            }
        },
        show__auto_paladin_train: {
            enabled: false,
            level: 0,
        }
    }
};

var settings_cookies = JSON.parse(localStorage.getItem('settings_cookies')) || default_settings_cookies;

var availableSettings = [
    { "name": "keep_awake", "label": "Keep Awake", "description": "Refreshes the page after 5 minutes of inactivity." },
    { "name": "show__navigation_arrows", "label": "Use Navigation Arrows", "description": "Enables navigation arrows for easier movement." },

    { "name": "show__village_list", "label": "Show Village List", "description": "Displays the village list on the main screen." },
    { "name": "show__notepad", "label": "Show Notepad", "description": "Displays a notepad for taking notes." },
    { "name": "show__building_queue", "label": "Show Building Queue", "description": "Displays the building queue and available upgrades on the overview page. Allows adding buildings to the queue from the overview screen." },
    { "name": "show__building_queue_all", "label": "Show All Buildings in Queue", "description": "Displays all buildings in the queue, including those that cannot be upgraded due to a lack of resources or a full queue and allows to use the fake building queue. (IN TESTING)" },
    
    { "name": "show__extra_options_map_hover", "label": "Show Extra Map Hover Options", "description": "Displays additional options when hovering over the map." },
    { "name": "show__navigation_bar", "label": "Show Navigation Bar", "description": "Displays the navigation bar at the top of the screen." },
    { "name": "show__time_storage_full_hover", "label": "Show Time Until Full Storage on Hover", "description": "Displays the remaining time until storage is full when hovering over a resource." },
    
    { "name": "show__auto_scavenging", "label": "Enable Auto Scavenging", "description": "Automatically manages scavenging tasks. Requires the browser to be open." },
    { "name": "show__auto_paladin_train", "label": "Enable Auto Paladin Training", "description": "Automatically trains paladins. Requires the browser to be open." },
    
    { "name": "remove__premium_promo", "label": "Remove Premium Promos", "description": "Removes premium promotional content from all pages." }
    // Add more settings as needed
];

var widgetsInjectFunctions = {
    'village_list': injectVillagesListWidget,
    'notepad': injectNotepadWidget,
    'building_queue': injectBuildQueueWidget,
};

var currentVillageIndex,
    textSelected,
    isBuildQueueFull = false;

function setCookieCurrentVillage() {
    var villageID = game_data.village.id,
        villages = JSON.parse(localStorage.getItem('villages_show') || '[]'),
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

function togglePopup(popup) {
    if (popup.style.display === 'none' || !popup.style.display) {
        popup.style.display = 'block';  // Show the popup
    } else {
        popup.style.display = 'none';   // Hide the popup
    }
}

function listenTextAreas() {
    // get all inputs || textareas
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

function sizeOfObject(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function createWidgetElement({ title, contents, columnToUse, update, extra_name = '', description = '' }) {
    var columnElement = document.getElementById(columnToUse);
    if (columnElement) {
        var elemId = title.toLowerCase().replace(/ /g, '_'); // Obtém o título do elemento
        var elemName = extra_name != '' ? elemId + '_' + extra_name : elemId;

        // Create a container div
        var containerDiv = document.createElement('div');
        containerDiv.id = 'show_' + elemName;
        containerDiv.className = 'vis moveable widget script_widget';
        containerDiv.setAttribute('data-title', description != ''? description : title);

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
                // Encontra o objeto correspondente no array de widgets e atualiza o valor de 'open' para false
                settings_cookies.widgets.find(widget => widget.name === elemId).open = false;
            } else {
                miniElem.src = miniElem.src.replace('plus', 'minus');
                // Encontra o objeto correspondente no array de widgets e atualiza o valor de 'open' para true
                settings_cookies.widgets.find(widget => widget.name === elemId).open = true;
            }
            localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
        };
        
        header.addEventListener('mouseenter', function (event) {
            showTooltip(event.target, true);
        });
        header.addEventListener('mouseleave', function (event) {
            showTooltip(event.target, false);
        });
        // Create the image for the button
        var buttonImg = document.createElement('img');
        buttonImg.className = 'widget-button';
        buttonImg.src = settings_cookies.widgets.find(widget => widget.name === elemId).open ? 'graphic/minus.png' : 'graphic/plus.png';
        buttonImg.id = 'mini_' + elemName;
        header.appendChild(buttonImg);

        var contentDiv = document.createElement('div');
        contentDiv.id = 'widget_content_' + elemName;
        contentDiv.style.display = settings_cookies.widgets.find(widget => widget.name === elemId).open ? 'block' : 'none';
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

        // Verifica se o índice fornecido é válido
        var widgetIndex = settings_cookies.widgets.find(widget => widget.name === elemId).pos;
        var children = columnElement.childNodes;
        if (widgetIndex >= 0 && widgetIndex <= children.length) {
            var refChild = (widgetIndex + 1 === children.length) ? children[widgetIndex] : children[widgetIndex + 1];
            columnElement.insertBefore(containerDiv, refChild);
        } else {
            columnElement.appendChild(containerDiv);
        }
    }

}

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

function showTooltip(element, isVisible) {
    var rect = element.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var elementPosition = {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };

    var tooltip = document.getElementById('tooltip');
    tooltip.querySelector('.body').style.display = 'none';
    if (isVisible) {
        tooltip.style.display = 'block';
        tooltip.style.top = (Math.ceil(elementPosition.top) + 22) + 'px';
        tooltip.style.left = (Math.ceil(elementPosition.left) + 25) + 'px';
        tooltip.classList.add('tooltip-style');
        var h3 = tooltip.getElementsByTagName('h3')[0];
        h3.innerText = element.parentNode.getAttribute('data-title');
    } else {
        tooltip.style.display = 'none';
        tooltip.classList.remove('tooltip-style');
    }
}

function showTooltipNoText(element, isVisible) {
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

function extractBuildTimeFromHTML(stringHTML) {
    const stringToday = localStorage.getItem('today_build_time_string');
    const stringTomorow = localStorage.getItem('tomorrow_build_time_string');
    if (stringToday && stringTomorow) {
        const modelosStrings = [stringToday, stringTomorow];
        var day, hora, minuto;
        for (const [index, modeloString] of modelosStrings.entries()) {
            const regexString = modeloString
                .replace(/\\/g, "\\\\")
                .replace(/%s/, "(\\d{1,2}):(\\d{2})");

            const regex = new RegExp(regexString);
            const match = stringHTML.match(regex);
            if (match) {
                day = index;
                hora = match[1];
                minuto = match[2];
            }
        }
        var time = [day, hora, minuto];
        return time;
    } else {
        alert('erro no extractBuildTimeFromHTML');
        return null;
    }
}

function endTimeToTimer(endtime) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    if (remaining <= 0) {
        return null;
    } else {
        var hours = Math.floor(remaining / 3600);
        var minutes = Math.floor((remaining % 3600) / 60);
        var seconds = remaining % 60;
        return [hours, minutes, seconds];
    }
}

function timeToMilliseconds(timeString) {
    var parts = timeString.split(':');

    var hours = parseInt(parts[0], 10) * 60 * 60 * 1000;
    var minutes = parseInt(parts[1], 10) * 60 * 1000;
    var seconds = parseInt(parts[2], 10) * 1000;

    return hours + minutes + seconds;
}

function wait(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

function setFunctionOnTimeOut(id, func, timeToRun) {
    let endTime = Date.now() + timeToRun;
    localStorage.setItem('endTime_' + id, endTime);
    localStorage.setItem('function_' + id, func.toString());
    setTimeout(func, timeToRun);
}

function restoreTimeouts() {
    //general timeouts
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
                localStorage.removeItem('endTime_' + id);
                localStorage.removeItem('function_' + id);
            }
        }
    }
}

function prepareLocalStorageItems() {
    if (unsafeWindow.lang) {
        const stringToday = unsafeWindow.lang['aea2b0aa9ae1534226518faaefffdaad'];
        const stringTomorow = unsafeWindow.lang['57d28d1b211fddbb7a499ead5bf23079'];
        localStorage.setItem('tw_lang', JSON.stringify(unsafeWindow.lang));

        if (stringToday) {
            localStorage.setItem('today_build_time_string', stringToday);
        }
        if (stringTomorow) {
            localStorage.setItem('tomorrow_build_time_string', stringTomorow);
        }
    }

    localStorage.setItem('waiting_for_queue', localStorage.getItem('waiting_for_queue') ?? '{}');
    localStorage.setItem('building_queue', localStorage.getItem('building_queue') ?? '[]');
    localStorage.setItem('villages_show', localStorage.getItem('villages_show') ?? '[]');
    localStorage.setItem('full_storage_times', localStorage.getItem('full_storage_times') ?? '[]');
    localStorage.setItem('mapConfig', localStorage.getItem('mapConfig') ?? '{}');
    localStorage.setItem('auto_trainer_paladin_level', localStorage.getItem('auto_trainer_paladin_level') ?? 0);
}

function checkInactivity(minutes) {
    if (TribalWars.getIdleTime() >= minutes * 60 * 1000) {
        console.log("Inactivity detected! Reloading page...");
        location.reload();
    }
}

//Keep quests tabs open
var questButton = document.getElementById('new_quest');
if (questButton) {
    // Guarda a referência da função original
    var originalOnClick = questButton.onclick;

    // Define um novo onclick que chama o original e depois executa o custom
    questButton.onclick = function(event) {
        // Chama a função original (se existir)
        if (originalOnClick) {
            originalOnClick.call(this, event);
        }
        
        let checkExist = setInterval(function () {
            let questlineLists = document.querySelectorAll('.questline-list');
            
            if (questlineLists.length > 0) {
                clearInterval(checkExist); // Para o intervalo quando encontrar
                
                questlineLists.forEach(questlineList => {
                    let listItems = questlineList.querySelectorAll('li');
                    
                    listItems.forEach(li => {
                        let ul = li.closest('ul'); // Encontra o <ul> mais próximo
                        if (ul) {
                            ul.classList.add('opened'); // Adiciona a classe "opened"
                        }
                    });
                });
            }
        }, 500); // Verifica a cada 500ms
    };
}

function startResourceTimerFull(endtime, element) {
    var remaining = endTimeToTimer(endtime);
    if (!remaining) {
        element.textContent = "FULL!";
        clearInterval(element.dataset.interval);
    } else {
        element.textContent = `${remaining[0]}h ${remaining[1]}m ${remaining[2]}s`;
    }
    element.style.display = "block";
    //element.classList.toggle('not-hidden');
}

function startTimerOnLabel(endtime, element) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    if (remaining <= 0) {
        element.textContent = "FULL!";
        clearInterval(element.dataset.interval);
    } else {
        var hours = Math.floor(remaining / 3600);
        var minutes = Math.floor((remaining % 3600) / 60);
        var seconds = remaining % 60;
        
        // Manter o conteúdo atual e atualizar apenas os números
        var currentText = element.textContent;
        var newText = currentText.replace(/\d+h/, hours + "h")
                                  .replace(/\d+m/, minutes + "m")
                                  .replace(/\d+s/, seconds + "s");
        element.textContent = newText;
    }
    element.style.display = "block";
}

function getRemainingHours (endtime) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    return Math.floor(remaining / 3600);
}

function injectAttackCalculations() {
    console.log(parseInt(document.querySelector('#command-data-form .village-distance').textContent.match(/(\d+)/), 10));
}

function start() {
    var urlPage = document.location.href;
    //validation to session expired, automatically select active world
    if (!urlPage.includes('?session_expired') && typeof game_data != 'undefined') {
        prepareVillageList();
        villageList = localStorage.getItem('villages_show') ? JSON.parse(localStorage.getItem('villages_show')) : [];
        settings_cookies = localStorage.getItem('settings_cookies') ? JSON.parse(localStorage.getItem('settings_cookies')) : settings_cookies;
        listenTextAreas();
        setCookieCurrentVillage();
        if (urlPage.includes("screen=overview") && !urlPage.includes("screen=overview_villages")) {
            injectScriptColumn();
            updateInfoOverview();

            settings_cookies.widgets.forEach(function (widget) {
                var functionName = widgetsInjectFunctions[widget.name];
                if (functionName) {
                    functionName(widget.column);
                }
            });
        } else if (urlPage.includes("&screen=place&mode=scavenge")) {
            $(document).ready(function () {
                injectAutoScavengingOption();
            });
        } else if (urlPage.includes("screen=statue")) {
            $(document).ready(function () {
                injectScriptAutoTrainerPaladin();
            });
        } else if (urlPage.includes("&screen=place&target")) {
            $(document).ready(function () {
                injectAttackCalculations();
            });
        }
        insertNavigationArrows();
        defineKeyboardShortcuts();
        injectScriptSettingsPopUp();
        injectNavigationBar();

        if (settings_cookies.general['keep_awake']) {
            var maxInactiveMin = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            setInterval(() => checkInactivity(maxInactiveMin), 30000);
        }

        //Timeouts Extra Queue
        var building_queue = JSON.parse(localStorage.getItem('building_queue') || '[]');
        var waiting_for_queue = JSON.parse(localStorage.getItem('waiting_for_queue') || '{}');
        if (!waiting_for_queue.time) {
            if (building_queue.length) {
                var nextTimeDate = new Date(parseInt(localStorage.getItem('building_queue_next_slot')));
                var waitTime = (nextTimeDate.getTime() - Date.now());
                if (waitTime > 0) {
                    setFunctionOnTimeOut('building_queue', addToBuildQueue, waitTime);
                } else {
                    addToBuildQueue();
                }
            }
        } else {
            var nextTimeDate = waiting_for_queue.time;
            var addToQueueDate = new Date();
            addToQueueDate.setDate(addToQueueDate.getDate() + nextTimeDate[0]);
            addToQueueDate.setHours(parseInt(nextTimeDate[1]), parseInt(nextTimeDate[2]));
            var waitTime = (addToQueueDate.getTime() - Date.now());
            if (waitTime > 0) {
                //avoid this for now.... or not
                setFunctionOnTimeOut('building_queue', addToBuildQueue, waitTime);
            } else {
                addToBuildQueue();
            }
        }

        //Override the sortable update function from Tribalwars
        var originalSortableUpdate = $("#overviewtable").sortable("option", "update");
        $("#overviewtable").sortable("option", "update", function () {
            saveColumnOrder(this);
            if (typeof originalSortableUpdate === "function" && !arguments[1].item[0].classList.contains('script_widget')) {
                $(this).find('.script_widget').detach();
                originalSortableUpdate.apply(this, arguments);
            }
        });
    }
}

function testAntiBot() {
    /*
    quando apareceu a cena do bot, ao carregar na checkbox aquilo chamou o BotProtect.check() e depois de fazer o post:
        TribalWars.post("botcheck", {
                ajaxaction: "verify"
                }, {
                response: e
            }, function(e) {
                e.success ? BotProtect.success() : (UI.ErrorMessage(_("82e50c727674f251464fc7520f5bde26")),
                hcaptcha.reset())
            })
        se chamar o BotProtect.success() depois do ajax acho nem apareceu a cena do bot


        aainda tenho de testar isto : document.querySelector('#bot_check a').click()
        talvez timer para procurar pelo elemento, se sim, overide do check() e da click?
    */
    var checkBot = setInterval(function() {
        if (typeof BotProtect !== "undefined") {
            clearInterval(checkBot); // Para o timer
            var originalBotCheeck = BotProtect.check;
            BotProtect.check = function() {
                TribalWars.post("botcheck", {
                    ajaxaction: "verify"
                }, {
                    response: e
                }, function(e) {
                    BotProtect.success();
                })
            }
    
            console.log("Bot.check foi sobrescrito com sucesso!");
        }
    }, 100);
}

function functionToCallTest() {
    /* 
    Getting info from twstats :D
    GM_xmlhttpRequest({
         method: 'GET',
         url: 'https://pt.twstats.com/pt97/index.php?page=player&id=848974103&utm_source=pt&utm_medium=player&utm_campaign=dsref',
         //url: game_data.link_base_pure + 'statue',
         onload: function (responseDetails) {
             var tempElement = document.createElement('div');
             tempElement.innerHTML = responseDetails.responseText;
             debugger;
             console.log(
                 "GM_xmlhttpRequest() response is:\n",
                 responseDetails.responseText.substring(0, 80) + '...'
             );
         }
     });*/
     
     //WORKING .....---------------------------------------------------------------------------------------------
     /*GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://pt.twstats.com/pt105/index.php?page=units',
        mode: 'no-cors',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        onload: function (responseDetails) {
            var tempElement = document.createElement('div');
            tempElement.id = 'tempElemtTwStats';
            tempElement.innerHTML = responseDetails.responseText;

            const unitsWidget = tempElement.querySelector('#main .widget');
            var units = unitsWidget.querySelectorAll("tr:not(:first-child)");
            var unitSpeeds = [];

            units.forEach(unit => {
                var speed = unit.querySelectorAll("td")[2];
                if (speed) unitSpeeds.push(speed.textContent.trim());
            });

            var unitData = {};
            game_data.units.forEach((unit, index) => {
                unitData[unit] = unitSpeeds[index] || null;
            });

            localStorage.setItem("unitsSpeeds", JSON.stringify(unitData));
            console.log(unitData)

            const distance = parseInt(document.querySelector('#command-data-form .village-distance').textContent.match(/(\d+)/), 10);

            const villageItems = document.querySelector('.village-item');

            //empty
            var spanDuration = document.createElement('span');
            var strong = document.createElement('strong');
            spanDuration.classList.add('village-name');
            strong.textContent = 'Extra';
            spanDuration.appendChild(strong);
            spanDuration.appendChild(document.createTextNode(' '));
            villageItems.appendChild(spanDuration);

            //attack duration
            var spanDuration = document.createElement('span');
            spanDuration.classList.add('village-duration');
            var strong = document.createElement('strong');
            strong.textContent = 'Duration:';
            spanDuration.appendChild(strong);
            spanDuration.appendChild(document.createTextNode(' ------'));
            villageItems.appendChild(spanDuration);

            //attack carries
            var spanDuration = document.createElement('span');
            spanDuration.classList.add('village-caries');
            var strong = document.createElement('strong');
            strong.textContent = 'Caries:';
            spanDuration.appendChild(strong);
            spanDuration.appendChild(document.createTextNode(' ------'));
            villageItems.appendChild(spanDuration);

            //attack arrive
            var spanDuration = document.createElement('span');
            spanDuration.classList.add('village-arrive');
            var strong = document.createElement('strong');
            strong.textContent = 'Arrives:';
            spanDuration.appendChild(strong);
            spanDuration.appendChild(document.createTextNode(' ------'));
            villageItems.appendChild(spanDuration);

            const unitsInputs = document.querySelectorAll('.unitsInput');
            unitsInputs.forEach(input => {
                input.addEventListener('input', () => {
                    const unitName = input.name;
                    const unitSpeed = parseInt(unitData[unitName]);
                    const storedSpeed = parseInt(sessionStorage.getItem('storedSpeed'));
                    debugger;
                    if (!storedSpeed || unitSpeed > storedSpeed) {
                        sessionStorage.setItem('lastStoredSpeed', storedSpeed);
                        sessionStorage.setItem('storedSpeed', unitSpeed);
                    }
                    
                    if (input.value === '') {
                        sessionStorage.setItem('storedSpeed', sessionStorage.getItem('lastStoredSpeed'));

                        //procurar todos os preenchios e ver qual o mais lento
                    }
                    
                    const speed = sessionStorage.getItem('storedSpeed');
                    if (speed) {
                        const result = distance * speed;

                        const hours = Math.floor(result / 60);
                        const minutes = Math.floor(result % 60);
                        const seconds = Math.floor((result * 60) % 60);
                        
                        const formattedTime = ` ${hours}:${minutes}:${seconds}`;

                        const spanDuration = document.querySelector('.village-duration');
                        spanDuration.childNodes[1].textContent = formattedTime;
                    }
                });
            });
            
            console.log();
        }
    });*/

    /*TribalWars.get("api", {
        ajax: "resources_schedule", // Identificador para o cronograma de recursos
        id: game_data.village.id  // ID da vila
    }, function(e) {
        debugger
    });*/
    

    /*$.ajax({
        url: game_data.link_base_pure + 'overview_villages',
        type: 'GET'
    }).then(function (data) {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = data;
        let rows = tempElement.querySelectorAll('#production_table tbody tr');
        let villageList = {};

        rows.forEach(function (row, index) {
            let link = row.querySelector('td:first-child span:first-child a');
            let name = link.querySelector('span').innerText;
            let url = link.href;

            villageList[index] = { name: name, url: url };
        });

        let jsonToSave = JSON.stringify(villageList);
        debugger;
    }).catch(function (error) {
        debugger;
    });*/
}
