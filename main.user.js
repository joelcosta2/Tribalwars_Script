// ==UserScript==
// @name         Script Extra Assets Premiun
// @version      2.8.4
// @description  Assets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad and Extra Build Queue(experimental)
// @author       kilwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/navigationArrows_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/villageList_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/notepad_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/extraBuildQueue_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/map_script.user.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include https://pt*.tribalwars.com.pt/*
// ==/UserScript==
(function () {
    'use strict';

    //GLOBAL VARIABLES
    //false/true: toggle the assets visibility
    var villageNavigationArrows = true;
    var showVillagesList = true;
    var usarAtalhosTrocarAldeias = true;
    var showNotepad = true;
    var showExtraBuildingQueue = true;

    var TEST_RUN = true;  //set true to run the script in test mode
    var USE_SCRIPT_COLUMN = true;  // create a column on the left side of the main screen
    var COLUMN_ASSETS = "script_column";  //column where add the assets: rightcolumn || leftcolumn || script_column
    var RIGHT_COLUMN = "rightcolumn";
    var CENTER_COLUMN = "leftcolumn";
    var LEFT_COLUMN = "script_column";

    var upgradesAvailableUrls = [];
    var upgradesAvailablesLevels = [];
    // Criar as linhas e colunas da tabela
    var availableSettings = [
        { name: 'feature_share_status', label: 'Partilhar o estado Premium', description: 'Permitir que os membros da tribo vejam se tem funcionalidades premium activas.' },
        { name: 'ally_share_units', label: 'Partilhar tropas próprias', description: 'Permita que a aristocracia da tribo veja suas tropas nas suas aldeias.' },
        // Adicionar mais configurações conforme necessário
    ];
    var villageList = [
        { name: '001 - The', url: 'https://' + game_data.world + '.tribalwars.com.pt/game.php?screen=main&village=' + game_data.village.id + '' },
        { name: '001 - The', url: 'https://' + game_data.world + '.tribalwars.com.pt/game.php?screen=main&village=' + game_data.village.id + '' },
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
        ]
    };

    var build_queue = [
        'wood1', 'main2', 'smith3', 'main3'
    ]

    var assetsInjectFunctions = {
        'village_list': injectVillagesListColumn,
        'notepad': injectNotepadOveriew,
        'extra_building_queue': injectBuildQueueExtraList,
    };

    var currentURL = document.location.href,
        currentVillageIndex,
        textSelected;

    $.ajax({
        'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=main',
        'type': 'GET',
        'success': function (data) {
            var tempElement = document.createElement('div');
            tempElement.innerHTML = data;
            var btnCancelElements = tempElement.querySelectorAll('.btn-cancel:not([style*="display: none"])');
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
            init();
        }
    });

    function init() {
        villageList = getCookie('villages_show') ? JSON.parse(getCookie('villages_show')) : villageList;
        settings_cookies = getCookie('settings_cookies') ? JSON.parse(getCookie('settings_cookies')) : settings_cookies;
        build_queue = getCookie('build_queue') ? JSON.parse(getCookie('build_queue')) : build_queue;
        listenTextAreas();
        var urlPage = document.location.href;

        if (getCookie('villages_show') || TEST_RUN) {
            setCookieCurrentVillage();
            if (urlPage.includes("screen=overview") && !urlPage.includes("screen=overview_villages")) {
                if (USE_SCRIPT_COLUMN) {
                    injectScriptColumn();
                }
                var sortedKeys = settings_cookies.assets.sort(function (a, b) {
                    return a.pos - b.pos;
                });
                sortedKeys.forEach(function (asset) {
                    var functionName = assetsInjectFunctions[asset.name];
                    if (functionName) {
                        functionName(asset.column);
                    }
                });
            }
            insertNavigationArrows();
            defineKeyboardShortcuts();
            injectSettingsPopUp();

        } else {
            var missingVillageError = getCookie('missing_village_error') === 'true';
            var d = new Date();
            d.setDate(d.getDate() + 7);
            if (missingVillageError) {
                document.cookie = "missing_village_error=true;expires=" + date.toGMTString();
                alert("Vai a 'Visualizações Gerais' para carregar a lista de aldeias.");
            }
        }

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

    // Settings PopUp
    function injectSettingsPopUp() {
        var maincell = document.getElementsByClassName('maincell')[0];

        var settingsPopupButton = document.createElement('div');
        settingsPopupButton.id = 'settings_popup_button';
        settingsPopupButton.style.position = 'absolute';
        settingsPopupButton.style.top = '5px';
        settingsPopupButton.style.left = '-65px';
        settingsPopupButton.style.top = '39px';
        settingsPopupButton.onclick = function () {
            var settingsPopup = document.getElementsByClassName('settings-popup')[0];
            if (settingsPopup.style.display === 'none') {
                settingsPopup.style.display = 'block';
            } else {
                settingsPopup.style.display = 'none';
            }
        };

        var questIcon = document.createElement('div');
        questIcon.className = 'quest';
        questIcon.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/b56f49d7/graphic/icons/settings.png)';

        settingsPopupButton.appendChild(questIcon);
        maincell.children[0].appendChild(settingsPopupButton);

        // Criar o elemento <div> do popup_helper
        var popupHelperDiv = document.createElement('div');
        popupHelperDiv.classList.add('popup_helper');

        // Criar o elemento <div> do popup_style
        var popupStyleDiv = document.createElement('div');
        popupStyleDiv.classList.add('popup_style', 'ui-draggable', 'settings-popup');
        popupStyleDiv.style.width = '700px';
        popupStyleDiv.style.position = 'fixed';
        popupStyleDiv.style.top = '59px';
        popupStyleDiv.style.left = '322px';
        popupStyleDiv.style.display = 'none';

        // Criar o elemento <div> do popup_menu
        var popupMenuDiv = document.createElement('div');
        popupMenuDiv.classList.add('popup_menu', 'ui-draggable-handle');
        popupMenuDiv.id = 'unit_popup_spear_menu';
        popupMenuDiv.textContent = 'Script Settings';

        // Criar o elemento <a> para fechar o popup
        var closeLink = document.createElement('a');
        closeLink.onclick = function () {
            var content = document.getElementsByClassName('settings-popup')[0]
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
        closeLink.id = 'closelink_unit_popup_spear';
        closeLink.textContent = 'X';
        closeLink.style.cursor = 'pointer';

        // Adicionar o link de fechar ao menu popup
        popupMenuDiv.appendChild(closeLink);

        // Criar o elemento <div> do popup_content
        var popupContentDiv = document.createElement('div');
        popupContentDiv.classList.add('popup_content');
        popupContentDiv.id = 'unit_popup_spear_content';
        popupContentDiv.style.height = 'auto';
        popupContentDiv.style.overflowY = 'auto';

        // Criar a tabela dentro do conteúdo do popup
        var tableElement = document.createElement('table');
        tableElement.classList.add('vis');
        tableElement.style.width = '100%';

        availableSettings.forEach(function (setting) {
            var row = tableElement.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            cell1.textContent = setting.label;
            cell2.innerHTML = `<label><input type="checkbox" name="${setting.name}">${setting.description}</label>`;
        });

        // Adicionar o botão de "Guardar alterações" no último <tr> da tabela
        var saveButtonRow = tableElement.insertRow();
        var saveButtonCell = saveButtonRow.insertCell(0);
        saveButtonCell.colSpan = 2;
        saveButtonCell.innerHTML = '<input type="submit" class="btn" style="margin: 4px;" value="Guardar alterações">';

        // Adicionar a tabela ao conteúdo do popup
        popupContentDiv.appendChild(tableElement);

        // Adicionar os elementos criados à hierarquia do DOM
        popupStyleDiv.appendChild(popupMenuDiv);
        popupStyleDiv.appendChild(popupContentDiv);
        popupHelperDiv.appendChild(popupStyleDiv);

        // Adicionar o popup_helper ao documento
        document.body.appendChild(popupHelperDiv);
    }

    function loadSetting() {

    }




    //Override the sortable update function from Tribalwars
    var originalSortableUpdate = $("#overviewtable").sortable("option", "update");
    $("#overviewtable").sortable("option", "update", function () {
        saveColumnOrder(this);
        // Chame a função original
        if (typeof originalSortableUpdate === "function") {
            originalSortableUpdate.apply(this, arguments);
        }
    });



})();