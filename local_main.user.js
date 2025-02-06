// ==UserScript==
// @name         Script Extra Widgets Premium
// @version      3.8.1
// @description  Widgets available: Village Navigation Arrors; Adds a new column on the left of the main screen with: Village List, Notepad, Extra Build Queue(experimental); Maps extra options; Auto-Scavenging; Auto-Train Paladin
// @author       kilwilll
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\utils.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\custom_css.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\settings_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\map_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\navigationArrows_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\villageList_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\notepad_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\extraBuildQueue_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\scavenging_script.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\overviewPremiumInfo.user.js
// @require      file://C:\Users\jcsta\Desktop\Tribalwars_Script\trainerPaladin_script.user.js
// @updateURL    file://C:\Users\jcsta\Desktop\Tribalwars_Script\1main.user.js
// @downloadURL  file://C:\Users\jcsta\Desktop\Tribalwars_Script\1main.user.js
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