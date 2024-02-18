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
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/scavenger_script.user.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include https://pt*.tribalwars.com.pt/*
// ==/UserScript==
(function () {
    'use strict';
    init();

    function init() {
        restoreTimeouts();
        if (!document.getElementById('mobileContent')) {
            villageList = getCookie('villages_show') ? JSON.parse(getCookie('villages_show')) : villageList;
            settings_cookies = getCookie('settings_cookies') ? JSON.parse(getCookie('settings_cookies')) : settings_cookies;
            build_queue = getCookie('build_queue') ? JSON.parse(getCookie('build_queue')) : build_queue;
            listenTextAreas();
            var urlPage = document.location.href;

            if (villageList) {
                setCookieCurrentVillage();
                if (urlPage.includes("screen=overview") && !urlPage.includes("screen=overview_villages")) {
                    injectScriptColumn();

                    settings_cookies.assets.forEach(function (asset) {
                        var functionName = assetsInjectFunctions[asset.name];
                        if (functionName) {
                            functionName(asset.column);
                        }
                    });

                    //TO FUNTIOON
                    /* ver se tem na fila;
                    se sim, pegar no nextTimeSlot e obtera diferenca para o tempo atual, com essa diferenca, criar um temporizador a chamar o  */
                    var extra_building_queue = JSON.parse(getCookie('extra_building_queue')) || [];
                    if (extra_building_queue.length) {
                        var nextTimeDate = new Date(parseInt(getCookie('extra_building_queue_next_slot')));
                        var waitTime = nextTimeDate.getTime() - Date.now();
                        if (waitTime > 0) {
                            setFunctionOnTimeOut('extra_building_queue', addToBuildQueue, waitTime);
                        }
                    }
                }
                insertNavigationArrows();
                defineKeyboardShortcuts();
                injectScriptSettingsPopUp();
                injectNavigationBar();

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

    // CSS que você deseja injetar
    var customCSS = `
        .box-nav-bar {
            background-size: auto 100% !important;
        }
        .nav-bar-item:first-child {
            background-size: auto 100% !important;
        }
        .nav-bar-item {
            background-size: auto 123% !important;
        }
    `;

    // Adiciona os estilos ao documento da página
    GM_addStyle(customCSS);

})();