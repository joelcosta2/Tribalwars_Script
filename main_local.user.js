// ==UserScript==
// @name         Script Extra Widgets Premium (local)
// @version      4.15.0
// @description  Feature-rich enhancement suite for TribalWars. Widgets: Village List, Notepad, Extra Build Queue, Recruit Troops, Resource Dashboard. Map: hover details, outgoing command overlay, attack heat-map, custom CTX attack template buttons, large map view. Automation: Auto-Scavenging (per-level & per-village config), Auto-Paladin Trainer, Auto Daily Bonus collection. UI: Custom Navigation Bar, Navigation Arrows, Visual Building Overview. Settings: full import/export support.
// @author       killwilll

// ADD HERE LOCAL TAMPERMONKEY IMPORTS

// @include      https://*.tribalwars.*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
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