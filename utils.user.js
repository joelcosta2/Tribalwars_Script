
//Utils

//GLOBAL VARIABLES
var RIGHT_COLUMN = "rightcolumn";
var CENTER_COLUMN = "leftcolumn";
var LEFT_COLUMN = "script_column";
var upgradesAvailablesLevels = [];

var availableSettings = [
    { name: 'show__village_list', label: 'Show village list', description: 'Show village list on the main screen' },
    { name: 'show__navigation_arrows', label: 'Use navigation arrows', description: 'Use navigation arrows' },
    { name: 'show__notepad', label: 'Show notepad', description: 'Show notepad' },
    { name: 'show__extra_building_queue', label: 'Show extra building queue', description: 'Show extra building queue' },
    { name: 'show__extra_options_map_hover', label: 'Show extra options map hover', description: 'Show extra options map hover' },
    // Add more settings as needed
];

var villageList = [
    { name: '001 - The', url: 'https://' + game_data.world + '.tribalwars.com.pt/game.php?screen=main&village=' + game_data.village.id + '' },
    { name: '002 - The', url: 'https://' + game_data.world + '.tribalwars.com.pt/game.php?screen=main&village=' + game_data.village.id + '' },
];

var settings_cookies = {
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

var build_queue = [
    'wood1', 'main2', 'smith3', 'main3'
]

var assetsInjectFunctions = {
    'village_list': injectVillagesListColumn,
    'notepad': injectNotepadOveriew,
    'extra_building_queue': injectBuildQueueExtraList,
};

var currentVillageIndex,
    textSelected;
function setCookieCurrentVillage() {
    var villageID = game_data.village.id,
        villgersNum = sizeOfObject(villageList);

    for (var i = 0; i < villgersNum; i++) {
        var urlTemp = villageList[i].url;
        if (urlTemp.includes(villageID)) {
            currentVillageIndex = i;
            setCookie('current_village', currentVillageIndex, 1000000000000);
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

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sizeOfObject(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function createAssetElement(title, contents, columnToUse, extra_name) {
    var columnElement = document.getElementById(columnToUse);
    var elemId = title.toLowerCase().replace(/ /g, '_'); // Obtém o título do elemento
    var elemName = extra_name ? elemId + '_' + extra_name : elemId;

    // Create a container div
    var containerDiv = document.createElement('div');
    containerDiv.id = 'show_' + elemName;
    containerDiv.className = 'vis moveable widget';

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

    var assetIndex = settings_cookies.assets.find(asset => asset.name === elemId).pos;
    var children = columnElement.childNodes;
    // Verifica se o índice fornecido é válido
    if (assetIndex >= 0 && assetIndex <= children.length) {
        var refChild = (assetIndex + 1 === children.length) ? null : children[assetIndex + 1];
        columnElement.insertBefore(containerDiv, refChild);
    } else {
        columnElement.appendChild(containerDiv);
    }

    //columnElement.appendChild(containerDiv);
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
        // Obtém o elemento pai pelo ID
        var parentElement = document.getElementById(parentId);
        if (parentElement) {
            // Obtém os elementos filhos do pai
            var children = parentElement.children;
            // Itera sobre os elementos filhos
            for (var i = 0; i < children.length; i++) {
                var childId = children[i].id.replace("show_", "");
                // Verifica se o ID do filho está presente em settings_cookies.assets
                var assetIndex = settings_cookies.assets.findIndex(function (asset) {
                    return asset.name === childId;
                });
                if (assetIndex !== -1) {
                    // Atualiza a coluna com o ID do pai e a posição com a posição do filho no HTML
                    settings_cookies.assets[assetIndex].column = parentId;
                    settings_cookies.assets[assetIndex].pos = i;
                }
            }
        }
    });

    setCookie('settings_cookies', JSON.stringify(settings_cookies), 100000000);
}