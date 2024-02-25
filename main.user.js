// ==UserScript==
// @name         Script Extra Widgets Premiun
// @version      3.5.2
// @description  Widgets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad, Extra Build Queue(experimental); Maps extra options; Auto-Scavenger; Auto-Train Knight and auto Knights Training
// @author       kilwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/navigationArrows_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/villageList_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/notepad_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/extraBuildQueue_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/scriptSettings.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/map_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/scavenger_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/autoTrainerKnight_script.user.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include      https://*.tribalwars.*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function () {
    'use strict';
    init();
    var villageList;
    function init() {
        restoreTimeouts();
        prepareStorage();
        if (!document.getElementById('mobileContent')) {
            var urlPage = document.location.href;
            //validation to session expired, automatically select active world
            if (!urlPage.includes('?session_expired')) {
                prepareVillageList();
                villageList = localStorage.getItem('villages_show') ? JSON.parse(localStorage.getItem('villages_show')) : [];
                settings_cookies = localStorage.getItem('settings_cookies') ? JSON.parse(localStorage.getItem('settings_cookies')) : settings_cookies;
                listenTextAreas();
                setCookieCurrentVillage();
                if (urlPage.includes("screen=overview") && !urlPage.includes("screen=overview_villages")) {
                    injectScriptColumn();

                    settings_cookies.assets.forEach(function (asset) {
                        var functionName = assetsInjectFunctions[asset.name];
                        if (functionName) {
                            functionName(asset.column);
                        }
                    });
                } else if (urlPage.includes("&screen=place&mode=scavenge")) {
                    $(document).ready(function () {
                        injectAutoScavenger();
                    });
                } else if (urlPage.includes("screen=statue")) {
                    $(document).ready(function () {
                        injectScriptAutoTrainerKnight();
                    });
                }
                insertNavigationArrows();
                defineKeyboardShortcuts();
                injectScriptSettingsPopUp();
                injectNavigationBar();

                //Timeouts Extra Queue
                var extra_building_queue = JSON.parse(localStorage.getItem('extra_building_queue') || '[]');
                var waiting_for_queue = JSON.parse(localStorage.getItem('waiting_for_queue') || '{}');
                if (!waiting_for_queue.time) {
                    if (extra_building_queue.length) {
                        var nextTimeDate = new Date(parseInt(localStorage.getItem('extra_building_queue_next_slot')));
                        var waitTime = (nextTimeDate.getTime() - Date.now() + timeToMilliseconds('00:01:50')); //adds 2min to try to avoid bot catching
                        if (waitTime > 0) {
                            setFunctionOnTimeOut('extra_building_queue', addToBuildQueue, waitTime);
                        } else {
                            addToBuildQueue();
                        }
                    }
                } else {
                    var nextTimeDate = waiting_for_queue.time;
                    var addToQueueDate = new Date();
                    addToQueueDate.setDate(addToQueueDate.getDate() + nextTimeDate[0]);
                    addToQueueDate.setHours(nextTimeDate[1], nextTimeDate[2] + 2); //adds 2min to try to avoid bot catching
                    var waitTime = (addToQueueDate.getTime() - Date.now());
                    if (waitTime > 0) {
                        //avoid this for now.... or not
                        setFunctionOnTimeOut('extra_building_queue', addToBuildQueue, waitTime);
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
    }

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
        .btn-build.current-quest {
            min-width: 0;
            padding: 3px 9px;
            background: linear-gradient(to bottom, #0bac00 0%,#0e7a1e 100%);
        }
        .btn-build.current-quest:hover {
            background: linear-gradient(to bottom, #13c600 0%,#129e23 100%);
        }

        #toggleButton.toggle-on {
            background-color: green;
        }

        #toggleButton {
            width: 35px;
            height: 18px;
            margin-left: 5px;
            background-color: red;
            border: none;
            border-radius: 15px;
            position: relative;
            cursor: pointer;
        }

        #toggleButton:before {
            content: '';
            position: absolute;
            top: 3px;
            left: 5px;
            width: 12px;
            height: 12px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s, background-color 0.3s;
        }

        .toggle-on:before {
            transform: translateX(12px);
        }
    `;
    GM_addStyle(customCSS);
})();