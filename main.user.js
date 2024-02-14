// ==UserScript==
// @name         Script Extra Assets Premiun
// @version      2.10.2
// @description  Assets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad and Extra Build Queue(experimental)
// @author       kilwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/navigationArrows_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/villageList_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/notepad_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/extraBuildQueue_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/scriptSettings.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/map_script.user.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include https://pt*.tribalwars.com.pt/*
// ==/UserScript==
(function () {
    'use strict';
    init();

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
            injectScriptSettingsPopUp();

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