
//Utils

//GLOBAL VARIABLES
var RIGHT_COLUMN = "rightcolumn";
var CENTER_COLUMN = "leftcolumn";
var LEFT_COLUMN = "script_column";

var default_settings_cookies = {
    assets: [
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
            name: 'extra_building_queue',
            column: LEFT_COLUMN,
            pos: 2,
            open: true
        }
    ],
    general: {
        show__village_list: true,
        show__navigation_arrows: true,
        show__notepad: true,
        show__extra_building_queue: true,
        show__extra_options_map_hover: true
    }
};

var settings_cookies = JSON.parse(localStorage.getItem('settings_cookies')) || default_settings_cookies;

var availableSettings = [
    { name: 'show__village_list', label: 'Show village list', description: 'Show village list on the main screen' },
    { name: 'show__navigation_arrows', label: 'Use navigation arrows', description: 'Use navigation arrows' },
    { name: 'show__notepad', label: 'Show notepad', description: 'Show notepad' },
    { name: 'show__extra_building_queue', label: 'Show extra building queue', description: 'Show extra building queue' },
    { name: 'show__extra_building_queue_all', label: 'Show all buildings in extra queue ', description: 'Show all buildings in extra building queue (Testing EXTRA QUEUE)' },

    { name: 'allow_pre_queue', label: 'Allow pre queue', description: 'Allow to queue extra "real" queue, If a building in queue does have enough resources, it will prepare the queue to auto add it when time arrives' },
    { name: 'show__extra_options_map_hover', label: 'Show extra options map hover', description: 'Show extra options map hover' },

    { name: 'show__navigation_bar', label: 'Show Navigation Bar', description: 'Show Navigation Bar on the top' },
    { name: 'remove__premiun_promo', label: 'Remove Premiun Promos', description: 'Remove Premiun Promos, for now its just one promo that apears next to the nav bar.' },
    // Add more settings as needed
];

var assetsInjectFunctions = {
    'village_list': injectVillagesListColumn,
    'notepad': injectNotepadOveriew,
    'extra_building_queue': injectBuildQueueExtraList,
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

function toggleElement(element) {
    var elementToToggle = document.getElementById(element);
    if (elementToToggle) {
        if (elementToToggle.style.display === 'none') {
            elementToToggle.style.display = 'contents';
        } else {
            elementToToggle.style.display = 'none';
        }
    }
}

function togglePopUp(className) {
    var elementToToggle = document.getElementsByClassName(className)[0];
    if (elementToToggle.style.display === 'none') {
        elementToToggle.style.display = 'block';
    } else {
        elementToToggle.style.display = 'none';
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

function createWidgetElement(title, contents, columnToUse, update, extra_name) {
    var columnElement = document.getElementById(columnToUse);
    var elemId = title.toLowerCase().replace(/ /g, '_'); // Obtém o título do elemento
    var elemName = extra_name ? elemId + '_' + extra_name : elemId;

    // Create a container div
    var containerDiv = document.createElement('div');
    containerDiv.id = 'show_' + elemName;
    containerDiv.className = 'vis moveable widget script_widget';

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
            // Encontra o objeto correspondente no array de assets e atualiza o valor de 'open' para false
            settings_cookies.assets.find(asset => asset.name === elemId).open = false;
        } else {
            miniElem.src = miniElem.src.replace('plus', 'minus');
            // Encontra o objeto correspondente no array de assets e atualiza o valor de 'open' para true
            settings_cookies.assets.find(asset => asset.name === elemId).open = true;
        }
    };
    // Create the help link
    var helpLink = document.createElement('a');
    helpLink.href = '#';
    helpLink.className = 'help-link help_link';
    helpLink.style.backgroundSize = 'contain';
    helpLink.style.marginLeft = '3px';
    header.appendChild(helpLink);

    helpLink.addEventListener('click', function (event) {
        alert('Help link clicked');
    });
    // Create the image for the button
    var buttonImg = document.createElement('img');
    buttonImg.className = 'widget-button';
    buttonImg.src = settings_cookies.assets.find(asset => asset.name === elemId).open ? 'graphic/minus.png' : 'graphic/plus.png';
    buttonImg.id = 'mini_' + elemName;
    header.appendChild(buttonImg);

    var contentDiv = document.createElement('div');
    contentDiv.id = 'widget_content_' + elemName;
    contentDiv.style.display = settings_cookies.assets.find(asset => asset.name === elemId).open ? 'block' : 'none';
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
    var assetIndex = settings_cookies.assets.find(asset => asset.name === elemId).pos;
    var children = columnElement.childNodes;
    if (assetIndex >= 0 && assetIndex <= children.length) {
        var refChild = (assetIndex + 1 === children.length) ? children[assetIndex] : children[assetIndex + 1];
        columnElement.insertBefore(containerDiv, refChild);
    } else {
        columnElement.appendChild(containerDiv);
    }
}

function saveColumnOrder() {
    var childDivs = Array.from(document.getElementById('script_column').children);
    var childDivIds = childDivs.map(function (div) {
        return div.id.replace('show_', '');
    });

    childDivIds.forEach(function (id, index) {
        var asset = settings_cookies.assets.find(function (asset) {
            return asset.name === id;
        });
        if (asset) {
            asset.pos = index;
        }
    });

    var parentIds = [RIGHT_COLUMN, LEFT_COLUMN, CENTER_COLUMN];
    parentIds.forEach(function (parentId) {
        var parentElement = document.getElementById(parentId);
        if (parentElement) {
            var children = parentElement.children;
            for (var i = 0; i < children.length; i++) {
                var childId = children[i].id.replace("show_", "");
                var assetIndex = settings_cookies.assets.findIndex(function (asset) {
                    return asset.name === childId;
                });
                if (assetIndex !== -1) {
                    settings_cookies.assets[assetIndex].column = parentId;
                    settings_cookies.assets[assetIndex].pos = i;
                }
            }
        }
    });

    localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
}

function injectScriptColumn() {
    var overviewtableElement = document.getElementById('overviewtable');
    var trElement = overviewtableElement.getElementsByTagName('tr')[0];
    var scriptColumn = document.createElement('td');
    scriptColumn.setAttribute('valign', 'top');
    scriptColumn.setAttribute('id', 'script_column');
    scriptColumn.style.width = document.getElementById('rightcolumn').offsetWidth + 'px';
    trElement.insertBefore(scriptColumn, trElement.firstChild);
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

function functionToCallTest() {
    /* GM_xmlhttpRequest({
         method: 'GET',
         //url: 'https://pt.twstats.com/pt97/index.php?page=player&id=848974103&utm_source=pt&utm_medium=player&utm_campaign=dsref',
         url: '/game.php?village=' + game_data.village.id + '&screen=statue',
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

    $.ajax({
        url: '/game.php?village=' + game_data.village.id + '&screen=overview_villages',
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
    });
}

function extractTimeFromHTML(stringHTML) {
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
        alert('erro no extractTimeFromHTML');
        return null;
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

    //train timeouts
    /*if (localStorage.getItem('auto_trainer_knight_level') !== '-1') {
        var auto_trainer_next_train = new Date(parseInt(localStorage.getItem('auto_trainer_next_train')));
        var waitTime = (auto_trainer_next_train.getTime() - Date.now() + timeToMilliseconds('00:00:01'));
        if (waitTime > 0) {
            setFunctionOnTimeOut('auto_trainer_knight', function () {
                //localStorage.setItem('auto_trainer_next_train', '-1');
                //window.location.href = '/game.php?village=' + game_data.village.id + '&screen=statue';
            }, waitTime);
        }
    }*/
}

function prepareStorage() {
    if (unsafeWindow.lang) {
        const stringToday = unsafeWindow.lang['aea2b0aa9ae1534226518faaefffdaad'];
        const stringTomorow = unsafeWindow.lang['57d28d1b211fddbb7a499ead5bf23079'];

        if (stringToday) {
            localStorage.setItem('today_build_time_string', stringToday);
        }
        if (stringTomorow) {
            localStorage.setItem('tomorrow_build_time_string', stringTomorow);
        }
    }

    localStorage.setItem('waiting_for_queue', localStorage.getItem('waiting_for_queue') ?? '{}');
    localStorage.setItem('extra_building_queue', localStorage.getItem('extra_building_queue') ?? '[]');
    localStorage.setItem('villages_show', localStorage.getItem('villages_show') ?? '[]');
    localStorage.setItem('build_queue', localStorage.getItem('build_queue') ?? '[]');
}