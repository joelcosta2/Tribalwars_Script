// ==UserScript==
// @name         Add Extra Options Tribalwars (for nonpremium)
// @version      2.8.4
// @description  Assets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad and Extra Build Queue(experimental)
// @author       kilwilll
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

    //Utils
    function setCookieCurrentVillage() {
        var str = currentURL;
        var temp = str.indexOf("="),
            temp2 = str.indexOf("&", temp),
            villageID = str.slice(temp + 1, temp2);

        var i = 0,
            villgersNum = sizeOfObject(villageList);

        for (i = 0; i < villgersNum; i++) {
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
        if (usarAtalhosTrocarAldeias) {
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

    //Village List
    function getVillagesDataURL() {
        var i = 0,
            villgersNum = sizeOfObject(villageList);

        var villagesDataUrl = '';

        for (i = 0; i < villgersNum; i++) {
            var url = villageList[i].url,
                name = villageList[i].name;

            villagesDataUrl = villagesDataUrl + "<tr><td style='' class=''><a class='' href='" + url + "'><span class='icon header village'></span>" + name + "</a></td></tr>"
        }
        return villagesDataUrl;
    }

    function injectVillagesListColumn(columnToUse) {
        if (showVillagesList) {
            var villagesDataUrl = getVillagesDataURL();
            // Criação da tabela
            var table = document.createElement('table');
            table.id = 'village_overview_table';
            table.className = 'vis bordered-table';
            table.width = '100%';
            table.style.verticalAlign = 'middle';

            // Criação do corpo da tabela
            var tbody = document.createElement('tbody');
            tbody.innerHTML = villagesDataUrl; // Adiciona os dados diretamente ao corpo da tabela

            // Anexa o corpo da tabela à tabela
            table.appendChild(tbody);

            createAssetElement('Village List', table, columnToUse);
        }
    }

    // Villages Arrows
    function prepareLinkToArrows(goToUrl) {
        var str = currentURL,
            temp = str.indexOf("="),
            temp2 = str.indexOf("&", temp),
            urlFirst = str.slice(0, temp + 1),
            urlLast = str.slice(temp2);

        // substituir por cookie 'global_village_id
        temp = goToUrl.indexOf("=");
        temp2 = goToUrl.indexOf("&", temp);

        var villagenumber = goToUrl.slice(temp + 1, temp2);

        var FINALURL = urlFirst + villagenumber + urlLast;

        return FINALURL;
    }

    function nextVillage() {
        var goToUrl;
        if (villageList[currentVillageIndex + 1]) {
            goToUrl = villageList[currentVillageIndex + 1].url;
        } else {
            goToUrl = villageList[0].url;
        }

        document.location.href = prepareLinkToArrows(goToUrl);
    }

    function previousVillage() {
        var goToUrl;
        if (villageList[currentVillageIndex - 1]) {
            goToUrl = villageList[currentVillageIndex - 1].url;
        } else {
            goToUrl = villageList[sizeOfObject(villageList) - 1].url;
        }

        document.location.href = prepareLinkToArrows(goToUrl);
    }

    function insertNavigationArrows() {
        if (villageNavigationArrows) {
            var menu_row1_container = document.getElementById('menu_row2');
            var htmlToInject = '<td class="box-item icon-box separate arrowCell"><a id="village_switch_previous" class="village_switch_link" accesskey="a"><span class="arrowLeft" style="cursor:pointer;"> </span></a></td><td class="box-item icon-box arrowCell"><a id="village_switch_next" class="village_switch_link" accesskey="d"><span class="arrowRight" style="cursor:pointer;"> </span></a></td>';

            menu_row1_container.innerHTML = htmlToInject + menu_row1_container.innerHTML;

            var leftArrowContainer = document.getElementById('village_switch_previous');
            var rightArrowContainer = document.getElementById('village_switch_next');

            leftArrowContainer.onclick = function () { previousVillage() };
            rightArrowContainer.onclick = function () { nextVillage() };
        }
    }


    // Notepad Module
    function loadNote() {
        var cookieNotepadJson = getCookie('vilagges_notepad');
        var notepadArray = cookieNotepadJson ? JSON.parse(cookieNotepadJson) : [];
        var textToShow = notepadArray[currentVillageIndex];

        if (textToShow !== '') {
            // village_note_script show this
            toggleElement('village_note_script');
            //set text to village-note-body_script
            var textPlacer = document.getElementById('village-note-body_script');
            textPlacer.textContent = textToShow;

        }
    }

    function saveNote() {
        var textToSave = document.getElementById('message_note_script').value;
        var currentCookieValue = getCookie('vilagges_notepad');
        var notepadArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
        notepadArray[currentVillageIndex] = textToSave;
        var jsonToSave = JSON.stringify(notepadArray);
        setCookie('vilagges_notepad', jsonToSave, 100000000000000);
        toggleElement('note_body_edit');
        loadNote();
        toggleElement('edit_notepad_link_script');
    }

    function openEditModeNote() {
        listenTextAreas();
        var currentCookieValue = getCookie('vilagges_notepad');
        var notepadArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
        document.getElementById('message_note_script').value = notepadArray[currentVillageIndex];
        toggleElement('note_body_edit');
        document.getElementById('village_note_script').style.display = 'none';
        document.getElementById('edit_notepad_link_script').style.display = 'none';
    }

    function injectNotepadOveriew(columnToUse) {
        if (showNotepad) {
            // Criação do botão "Editar"
            var editLink = document.createElement('a');
            editLink.id = 'edit_notepad_link_script';
            editLink.textContent = '» Editar';
            editLink.onclick = function () {
                openEditModeNote();
            };

            // Criação da área de texto para a nota e do botão "Guardar"
            var noteTextarea = document.createElement('textarea');
            noteTextarea.id = 'message_note_script';
            noteTextarea.name = 'note';
            noteTextarea.style.width = '97%';
            noteTextarea.rows = '10';
            noteTextarea.cols = '40';

            var saveButton = document.createElement('a');
            saveButton.id = 'note_submit_button_script';
            saveButton.className = 'btn btn-default';
            saveButton.textContent = 'Guardar';
            saveButton.onclick = function () {
                saveNote();
            };

            // Criação da estrutura da tabela
            var table = document.createElement('table');
            table.width = '100%';

            var tbody = document.createElement('tbody');

            // Criação da linha para mostrar a nota
            var noteRow = document.createElement('tr');
            noteRow.id = 'village_note_script';
            noteRow.style.display = 'none';

            var noteCell = document.createElement('td');
            var noteDiv = document.createElement('div');
            noteDiv.className = 'village-note';
            var noteBodyDiv = document.createElement('div');
            noteBodyDiv.id = 'village-note-body_script';
            noteBodyDiv.className = 'village-note-body';
            noteBodyDiv.style.whiteSpace = 'pre-wrap';

            noteDiv.appendChild(noteBodyDiv);
            noteCell.appendChild(noteDiv);
            noteRow.appendChild(noteCell);

            // Criação da linha para editar a nota
            var editRow = document.createElement('tr');
            editRow.id = 'note_body_edit';
            editRow.style.display = 'none';

            var editCell = document.createElement('td');
            var editDiv = document.createElement('div');
            editDiv.className = 'village-note';
            editDiv.style.width = '100%';
            editDiv.style.overflow = 'hidden';

            var textareaDiv = document.createElement('div');
            textareaDiv.appendChild(noteTextarea);

            var buttonDiv = document.createElement('div');
            buttonDiv.appendChild(saveButton);

            editDiv.appendChild(textareaDiv);
            editDiv.appendChild(buttonDiv);

            var editNoteBodyDiv = document.createElement('div');
            editNoteBodyDiv.className = 'village-note-body';
            editDiv.appendChild(editNoteBodyDiv);

            editCell.appendChild(editDiv);
            editRow.appendChild(editCell);

            // Criação da linha para o botão "Editar"
            var editButtonRow = document.createElement('tr');
            var editButtonCell = document.createElement('td');
            editButtonCell.appendChild(editLink);
            editButtonRow.appendChild(editButtonCell);

            tbody.appendChild(noteRow);
            tbody.appendChild(editRow);
            tbody.appendChild(editButtonRow);
            table.appendChild(tbody);

            createAssetElement('Notepad', table, columnToUse);
            loadNote();
        }
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

    // Build Extra List
    function initializeBuilderInfo() {
        var villageBuilderid = getVillageBuilderid();
        setCookie('village_builder_id', villageBuilderid, 30);
    }

    function getVillageBuilderid() {
        var builderid = document.getElementsByClassName('btn-cancel')[0].href.split('h=')[1].split('&')[0];
        return builderid;
    }

    function addToBuildQueue(build_id) {
        build_queue.push(build_id);
        setCookie('build_queue', JSON.stringify(build_queue), 30);
        getBuildQueueElement(true);
    }

    function removeFromBuildQueue(build_id) {
        build_queue.splice(build_id, 1);
        setCookie('build_queue', JSON.stringify(build_queue), 30);
        getBuildQueueElement(true);
    }

    function getBuildQueueElement(update) {
        var td = document.createElement('td');
        td.style = '';
        td.className = '';

        build_queue.forEach(function (id, index) {
            var anchor = document.createElement('a');
            anchor.className = '';
            anchor.onclick = function () {
                removeFromBuildQueue(index);
            }

            var span = document.createElement('span');
            span.className = 'icon header village';
            span.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/b56f49d7/graphic/buildings/mid/' + id + '.png)';
            span.style.backgroundPosition = '0px 0px';
            span.style.backgroundSize = 'contain';
            span.style.backgroundRepeat = 'no-repeat';
            span.style.width = '24px';
            span.style.cursor = 'pointer';
            span.classList.add('tooltip');

            anchor.appendChild(span);
            td.appendChild(anchor);
        });
        if (update) {
            var extra_build_queue_table_tr = document.getElementById('extra_build_queue_table').getElementsByTagName('tr')[0];
            extra_build_queue_table_tr.innerHTML = td.outerHTML;
        }
        return td;
    }

    function injectBuildQueueExtraList(columnToUse) {
        if (showExtraBuildingQueue) {
            var visualBuildingElements = document.getElementById("show_summary").getElementsByClassName("visual-building");
            var otherClasses = [];
            var imageUrls = [];

            for (var i = 0; i < visualBuildingElements.length; i++) {
                var allClasses = visualBuildingElements[i].classList;

                // Itera sobre as classes do elemento
                for (var j = 0; j < allClasses.length; j++) {
                    var currentClass = allClasses[j];

                    // Verifica se a classe não é "visual-building"
                    if (currentClass !== "visual-building") {
                        currentClass = currentClass.replace("visual-building-", "");
                        otherClasses.push(currentClass);
                        var imageUrl = "https://dspt.innogamescdn.com/asset/b56f49d7/graphic/buildings/mid/" + currentClass.replace("visual-building-", "") + ".png";
                        imageUrls.push(imageUrl);
                        console.log("%c" + imageUrl, "color: blue; text-decoration: underline; cursor: pointer;");
                    }
                }
            }

            //Create the extra build queue table
            var extraBuildQueueTable = document.createElement('table');
            extraBuildQueueTable.id = 'extra_build_queue_table';
            extraBuildQueueTable.className = 'vis bordered-table';
            extraBuildQueueTable.setAttribute('width', '100%');
            extraBuildQueueTable.style.verticalAlign = 'middle';

            var buildQueueElment = getBuildQueueElement();

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

            var upgradableBuildingsIds = [];
            upgradesAvailableUrls.forEach(function (url) {
                var parts = url.split('&');
                parts.forEach(function (part) {
                    var param = part.split('=');
                    if (param[0] === 'id') {
                        upgradableBuildingsIds.push(param[1]);
                    }
                });
            });

            upgradableBuildingsIds.forEach(function (id, index) {
                var row = document.createElement('tr');
                row.id = 'main_buildrow_' + index;

                var cell = document.createElement('td');
                cell.style.display = 'flex';

                var imgLink = document.createElement('a');
                imgLink.href = '/game.php?village=' + game_data.village.id + '&screen=' + id;
                var img = document.createElement('img');
                img.className = 'bmain_list_img';
                var buildGraphicId = otherClasses.find(function (elem) {
                    return elem.includes(id);
                });

                img.src = "https://dspt.innogamescdn.com/asset/b56f49d7/graphic/buildings/mid/" + buildGraphicId + ".png";
                img.setAttribute('data-title', id + upgradesAvailablesLevels[index]);
                imgLink.appendChild(img);
                cell.appendChild(imgLink);

                var textLink = document.createElement('a');
                textLink.href = '/game.php?village=' + game_data.village.id + '&screen=' + id;
                textLink.textContent = id + upgradesAvailablesLevels[index];
                cell.appendChild(textLink);

                var br = document.createElement('br');
                cell.appendChild(br);

                // Create the link for upgrading the building
                var upgradeLink = document.createElement('a');
                upgradeLink.href = '/game.php?village=' + game_data.village.id + '&screen=main&action=upgrade_building&id=' + otherClasses[index] + '&type=main&h=' + 'toChange_token_buildilg';
                upgradeLink.className = 'btn current-quest';
                upgradeLink.setAttribute('data-building', id + upgradesAvailablesLevels[index]);
                upgradeLink.setAttribute('data-level-next', upgradesAvailablesLevels[index]);
                upgradeLink.setAttribute('data-title', 'O mercador');
                upgradeLink.id = 'main_buildlink_' + id + '_' + upgradesAvailablesLevels[index];
                upgradeLink.style.width = '-webkit-fill-available';
                upgradeLink.textContent = 'Nível ' + upgradesAvailablesLevels[index];
                upgradeLink.onclick = function () {
                    addToBuildQueue(buildGraphicId)
                }

                var upgradeCell = document.createElement('td');
                upgradeCell.appendChild(upgradeLink);

                row.appendChild(cell);
                row.appendChild(upgradeCell);
                buildsListTable.appendChild(row);
            });

            var extraBuildDiv = document.createElement('div');
            extraBuildDiv.appendChild(extraBuildQueueTable);
            extraBuildDiv.appendChild(buildsListTable);

            createAssetElement('Extra Building Queue', extraBuildDiv, columnToUse);
        }
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

            setCookie('settings_cookies', JSON.stringify(settings_cookies), 100000000);
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




    //Override the sortable update function from Tribalwars
    var originalSortableUpdate = $("#overviewtable").sortable("option", "update");
    $("#overviewtable").sortable("option", "update", function () {
        saveColumnOrder(this);
        // Chame a função original
        if (typeof originalSortableUpdate === "function") {
            originalSortableUpdate.apply(this, arguments);
        }
    });

    //Override the sortable update function from Tribalwars
    if (typeof TWMap !== 'undefined') {
        var originalHandleMouseMove = TWMap.popup.handleMouseMove;
        TWMap.popup.handleMouseMove = function (e) {
            originalHandleMouseMove.call(this, e);

            var villageHoverCoords = TWMap.map.coordByEvent(e);
            var mapPopupElement = document.getElementById('map_popup');
            var tbody = mapPopupElement.getElementsByTagName('tbody')[0];

            // Criando o elemento tr
            var tr = document.createElement('tr');
            tr.id = 'map_popup_extra';

            if (tbody && !tbody.querySelector('#map_popup_extra')) {
                tbody.appendChild(tr);

                $.ajax({
                    'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=report&mode=attack',
                    'type': 'GET',
                    'success': function (data) {
                        var tempElement = document.createElement('div');
                        tempElement.innerHTML = data;
                        var reportLabels = tempElement.querySelectorAll('.quickedit-label');
                        var elementsWithVillageHoverCoords = [];

                        reportLabels.forEach(function (label) {
                            var text = label.innerText;
                            var coords = villageHoverCoords.join('|');
                            if (text.includes(coords)) {
                                elementsWithVillageHoverCoords.push(label.parentElement);
                            }
                        });

                        var lastReportUrl = elementsWithVillageHoverCoords[0] ? elementsWithVillageHoverCoords[0].href : null;
                        if (lastReportUrl) {
                            $.ajax({
                                'url': lastReportUrl,
                                'type': 'GET',
                                'success': function (data) {
                                    var tempElement = document.createElement('div');
                                    tempElement.innerHTML = data;
                                    var attackLootResults = tempElement.querySelector('#attack_results tr');
                                    tbody.appendChild(attackLootResults);

                                    debugger;

                                }
                            });
                        }
                    }
                });
            }
        };
    }

})();