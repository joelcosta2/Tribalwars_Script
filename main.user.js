// ==UserScript==
// @name         Script Extra Widgets Premium
// @version      4.8.1
// @description  Widgets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad, Extra Build Queue(experimental); Maps extra options; Auto-Scavenging; Auto-Train Paladin and auto Paladins Training; Larger map view
// @author       kilwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/custom_css.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/settings_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/navigationArrows_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/map_script.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/overviewPremiumInfo.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bot_trainerPaladin.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bot_scavenging.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_villagelist.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_notepad.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_extrabuildqueue.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_recruitTroops.user.js
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
    var widgetsInjectFunctions;
    function init() {
        widgetsInjectFunctions = {
            'village_list': injectVillagesListWidget,
            'notepad': injectNotepadWidget,
            'building_queue': fetchBuildQueueWidget,
            'recruit_troops': injectRecruitTroopsWidget
        };
        restoreTimeouts();
        prepareLocalStorageItems();
        if (!document.getElementById('mobileContent')) {
            start();
            testAntiBot();  
        }
    }
})();