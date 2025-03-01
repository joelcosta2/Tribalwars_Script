
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
        },
        {
            name: 'recruit_troops',
            column: LEFT_COLUMN,
            pos: 3,
            open: false
        },
    ],
    general: {
        keep_awake: true,
        redirect__train_buildings: false,
        remove__premium_promo: true,
        show__village_list: true,
        show__recruit_troops: true,
        show__navigation_arrows: true,
        show__notepad: true,
        show__building_queue: true,
        show__extra_options_map_hover: true,
        show__overview_premmium_info: true,
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
    { "name": "redirect__train_buildings", "label": "Redirect Train Buildings", "description": "All buildings used for training purposes redirect directly to the train screen."},
    { "name": "show__navigation_arrows", "label": "Use Navigation Arrows", "description": "Enables navigation arrows for easier movement." },

    { "name": "show__village_list", "label": "Village List Widget", "description": "Displays the village list widget on the overview screen." },
    { "name": "show__recruit_troops", "label": "Recruitment Widget", "description": "Displays a widget to recruit troops on overview page (NOT FULLY IMPLEMENTED)" },
    { "name": "show__notepad", "label": "Notepad Widget", "description": "Displays a notepad widget for taking notes." },
    { "name": "show__building_queue", "label": "Building Queue Widget", "description": "Displays the building queue and available upgrades on the overview page. Allows adding buildings to the queue from the overview screen." },
    { "name": "show__building_queue_all", "label": "All Buildings in Queue", "description": "Displays all buildings in the queue, including those that cannot be upgraded due to a lack of resources or a full queue and allows to use the fake building queue. (IN TESTING)" },
    
    { "name": "show__extra_options_map_hover", "label": "Show Extra Map Hover Info", "description": "Displays additional info when hovering over a village on the map." },
    { "name": "show__overview_premmium_info", "label": "Displays Premium overview information", "description": "Displays additional premium information for buildings (graphical overview)" },
    { "name": "show__navigation_bar", "label": "Navigation Bar", "description": "Displays the navigation bar at the top of the screen." },
    { "name": "show__time_storage_full_hover", "label": "Show Time Until Full Storage on Hover", "description": "Displays the remaining time until storage is full when hovering over a resource." },
    
    { "name": "show__auto_scavenging", "label": "Enable Auto Scavenging", "description": "Automatically manages scavenging tasks. Requires the browser to be open." },
    { "name": "show__auto_paladin_train", "label": "Enable Auto Paladin Training", "description": "Automatically trains paladins. Requires the browser to be open." },
    
    { "name": "remove__premium_promo", "label": "Remove Premium Promos", "description": "Removes premium promotional content from all pages." }
    // Add more settings as needed
];

var widgetsInjectFunctions = {
    'village_list': injectVillagesListWidget,
    'notepad': injectNotepadWidget,
    'building_queue': fetchBuildQueueWidget,
    'recruit_troops': injectRecruitTroopsWidget
};

var currentVillageIndex,
    textSelected,
    isBuildQueueFull = false;

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
    localStorage.setItem('map_custom_height', localStorage.getItem('map_custom_height') ?? '600');
    localStorage.setItem('map_custom_width', localStorage.getItem('map_custom_width') ?? '900');
}

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
                settings_cookies.widgets.find(widget => widget.name === elemName).open = false;
            } else {
                miniElem.src = miniElem.src.replace('plus', 'minus');
                // Encontra o objeto correspondente no array de widgets e atualiza o valor de 'open' para true
                settings_cookies.widgets.find(widget => widget.name === elemName).open = true;
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

        // Verifica se o índice fornecido é válido
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
    if (isVisible) {
        tooltip.style.display = 'block';
        tooltip.style.top = (Math.ceil(elementPosition.top) + 22) + 'px';
        tooltip.style.left = (Math.ceil(elementPosition.left) + 25) + 'px';
        tooltip.classList.add('tooltip-style');
        var h3 = tooltip.getElementsByTagName('h3')[0];
        h3.innerHTML = element.parentNode.getAttribute('data-title');
    } else {
        tooltip.style.display = 'none';
        tooltip.classList.remove('tooltip-style');
    }
}

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

function extractBuildTimeFromHTML(stringHTML) {
    const stringToday = localStorage.getItem('today_build_time_string');
    const stringTomorow = localStorage.getItem('tomorrow_build_time_string');
    var time;
    debugger
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
                day = index.toString();
                hora = match[1].toString();
                minuto = match[2].toString();
            }
        }
        if (day && hora && minuto) {
            time = [day, hora, minuto];
            return time;
        }
    } 
    
    showAutoHideBox('Error extractBuildTimeFromHTML: ')
    return time;
}

function extractBuildTimestampFromHTML(stringHTML) {
    const stringToday = localStorage.getItem('today_build_time_string');
    const stringTomorow = localStorage.getItem('tomorrow_build_time_string');

    if (stringToday && stringTomorow) {
        const modelosStrings = [stringToday, stringTomorow];
        let day, hora, minuto;

        for (const [index, modeloString] of modelosStrings.entries()) {
            const regexString = modeloString
                .replace(/\\/g, "\\\\")
                .replace(/%s/, "(\\d{1,2}):(\\d{2})");

            const regex = new RegExp(regexString);
            const match = stringHTML.match(regex);

            if (match) {
                day = index; // 0 = hoje, 1 = amanhã
                hora = parseInt(match[1]);
                minuto = parseInt(match[2]);
                break;
            }
        }

        if (day !== undefined && hora !== undefined && minuto !== undefined) {
            const now = new Date();
            now.setHours(hora, minuto, 0, 0);

            if (day === 1) { // Se for amanhã, adicionar 1 dia
                now.setDate(now.getDate() + 1);
            }

            return now.getTime(); // Retorna o timestamp em milissegundos
        }
    } else {
        alert('Erro no extractBuildTimestampFromHTML');
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
        return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')];
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

var activeTimeouts = {};
function setFunctionOnTimeOut(id, func, timeToRun) {
    if (activeTimeouts[id]) {
        clearTimeout(activeTimeouts[id]);
    }

    // Adiciona até 3 minutos (180000 ms) de aleatoriedade
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

function checkInactivity(minutes) {
    if (TribalWars.getIdleTime() >= minutes * 60 * 1000) {
        showAutoHideBox('Inactivity detected! Reloading page...');
        wait(5);
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
        element.textContent = 'END';
        clearInterval(element.dataset.interval);
    } else {
        element.textContent = `${remaining[0]}:${remaining[1]}:${remaining[2]}`;
    }
    element.style.display = "block";
    //element.classList.toggle('not-hidden');
}

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

function getRemainingHours (endtime) {
    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
    var remaining = endtime - now;
    return Math.floor(remaining / 3600);
}

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

function injectAttackCalculations() {
    console.log(parseInt(document.querySelector('#command-data-form .village-distance').textContent.match(/(\d+)/), 10));
}

function start() {
    var urlPage = document.location.href;
    //validation to session expired, automatically select active world (not yet :D)
    if (!urlPage.includes('?session_expired') && typeof game_data != 'undefined') {
        prepareVillageList();
        villageList = localStorage.getItem('villages_show') ? JSON.parse(localStorage.getItem('villages_show')) : [];
        settings_cookies = localStorage.getItem('settings_cookies') ? JSON.parse(localStorage.getItem('settings_cookies')) : settings_cookies;
        listenTextAreas();
        setCookieCurrentVillage();
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

        //Override the sortable update function from Tribalwars
        var originalSortableUpdate = $("#overviewtable").sortable("option", "update");
        $("#overviewtable").sortable("option", "update", function () {
            saveColumnOrder(this);
            if (typeof originalSortableUpdate === "function" && !arguments[1].item[0].classList.contains('script_widget')) {
                $(this).find('.script_widget').detach();
                originalSortableUpdate.apply(this, arguments);
                
                settings_cookies.widgets.forEach(function (widget) {
                    var functionName = widgetsInjectFunctions[widget.name];
                    if (functionName) {
                        functionName(widget.column);
                    }
                });
            }
        });
    }
}

//redirect barracks and stable to train screen
if (settings_cookies.general['redirect__train_buildings']) {
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href], area[href]");

        if (link) {
            const url = new URL(link.href);
            const screenParam = url.searchParams.get("screen");

            if (screenParam === "barracks" || screenParam === "stables") {
                event.preventDefault();
                url.searchParams.set("screen", "train");
                window.location.href = url.href;
            }
        }
    });
}


/*<----------- Not fully implementeded functions ------------>*/
function autoDailyBonusCollect() {
    //falta conseguir o dia facilmente... posso fazer um fetch para criar a primeira vez e depois conta dai...
    //so tenho de saber o que acontece quando nao recolhe um dia
    if (game_data) {
        fetch(game_data.link_base_pure + "daily_bonus&ajaxaction=open", {
            "headers": {
            "tribalwars-ajax": "1",
            "x-requested-with": "XMLHttpRequest"
            },
            "referrer": game_data.link_base_pure + "info_player&mode=daily_bonus",
            "body": "day=8&from_screen=profile&h=" + game_data.csrf,
            "method": "POST",
            "credentials": "include"
        });  
    }
}

function sendScavengeAjax() {
    //falta conseguir as tropas a enviar... se tiver os numeros das settings sao esses
    //se nao tiver, tenho de os arranjar
    // falta tere o nivel a enviar
    if (game_data) {
        const squadRequest = {
            village_id: 14520,
            candidate_squad: {
                unit_counts: {
                    spear: 303,
                    sword: 150,
                    axe: 0,
                    archer: 0,
                    light: 32,
                    marcher: 0,
                    heavy: 0,
                    knight: 0
                },
                carry_max: 12385
            },
            option_id: 3, //NIVEL DISPONIVEL??? guardar na primeira vez que se entra na pagina do scavenger, e so mudar se voltar lá
            use_premium: false
        };
        
        const requestData = {
            squad_requests: [squadRequest],
            h: game_data.csrf
        };
        
        // Converte o objeto para um formato adequado para envio
        const body = new URLSearchParams();
        Object.entries(requestData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    Object.entries(item).forEach(([subKey, subValue]) => {
                        if (typeof subValue === "object") {
                            Object.entries(subValue).forEach(([unitKey, unitValue]) => {
                                body.append(`squad_requests[${index}][${subKey}][unit_counts][${unitKey}]`, unitValue);
                            });
                        } else {
                            body.append(`squad_requests[${index}][${subKey}]`, subValue);
                        }
                    });
                });
            } else {
                body.append(key, value);
            }
        });
        
       fetch(game_data.link_base_pure + "scavenge_api&ajaxaction=send_squads", {
            headers: {
                "tribalwars-ajax": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: game_data.link_base_pure + "place&mode=scavenge",
            body: body.toString(),
            method: "POST",
            credentials: "include"
        });
    }
}
