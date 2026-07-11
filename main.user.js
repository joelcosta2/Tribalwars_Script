// ==UserScript==
// @name         Tribalwars: Premium Features
// @version      4.15.0
// @description  Feature-rich enhancement suite for TribalWars. Widgets: Village List, Notepad, Extra Build Queue, Recruit Troops, Resource Dashboard. Map: hover details, outgoing command overlay, attack heat-map, custom CTX attack template buttons, large map view. Automation: Auto-Scavenging (per-level & per-village config), Auto-Paladin Trainer, Auto Daily Bonus collection. UI: Custom Navigation Bar, Navigation Arrows, Visual Building Overview. Settings: full import/export support.
// @author       killwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/core_utils.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/core_css.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/core_settings.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_villageArrows.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_navigationBar.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/feature_map.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/feature_overview.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bot_trainerPaladin.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bot_scavenging.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bot_dailyBonus.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bot_buildInstantFree.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_villageList.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_notepad.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_extraBuildQueue.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widget_recruitTroops.user.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include      https://*.tribalwars.*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
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
        }
    }
})();
