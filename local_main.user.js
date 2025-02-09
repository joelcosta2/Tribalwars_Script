// ==UserScript==
// @name         Script Extra Widgets Premium
// @version      4.8.1
// @description  Widgets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad, Extra Build Queue(experimental); Maps extra options; Auto-Scavenging; Auto-Train Paladin
// @author       kilwilll
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\utils.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\custom_css.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\settings_script.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\navigationArrows_script.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\map_script.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\overviewPremiumInfo.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\bot_trainerPaladin.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\bot_scavenging.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\widget_villagelist.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\widget_notepad.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\widget_extrabuildqueue.user.js
// @require      file://C:\{YOUR_PATH}\Tribalwars_Script\widget_recruitTroops.user.js
// @updateURL    file://C:\{YOUR_PATH}\Tribalwars_Script\1main.user.js
// @downloadURL  file://C:\{YOUR_PATH}\Tribalwars_Script\1main.user.js
// @include      https://*.tribalwars.*/*
// @connect      pt.twstats.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function () {
    'use strict';
    init();
    var villageList;
    function init() {
        restoreTimeouts();
        prepareLocalStorageItems();
        if (!document.getElementById('mobileContent')) {
            start();
            testAntiBot();  
        }
    }
})();