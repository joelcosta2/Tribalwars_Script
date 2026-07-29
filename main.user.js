// ==UserScript==
// @name         Tribalwars: Premium Features
// @version      4.16.0
// @description  Feature-rich enhancement suite for TribalWars. Widgets: Village List, Notepad, Extra Build Queue, Recruit Troops, Resource Dashboard. Map: hover details, outgoing command overlay, attack heat-map, custom CTX attack template buttons, large map view. Automation: Auto-Scavenging (per-level & per-village config), Auto-Paladin Trainer, Auto Daily Bonus collection. UI: Custom Navigation Bar, Navigation Arrows, Visual Building Overview. Settings: full import/export support.
// @author       killwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/util/core_utils.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/util/core_bot_protection.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/util/core_css.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/util/core_settings.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_villageArrows.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_navigationBar.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_map.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_overview.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_simulator.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_playerProfile.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_trainerPaladin.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_scavenging.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_dailyBonus.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_buildInstantFree.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_villageList.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_notepad.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_extraBuildQueue.user.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_recruitTroops.user.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include      https://*.tribalwars.*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      twstats.com
// ==/UserScript==
(function () {
    'use strict';

    function isBotProtectionActive() {
        return Boolean(window.PremiumFeaturesBotProtection && window.PremiumFeaturesBotProtection.isActive());
    }

    if (isBotProtectionActive()) {
        return;
    }

    $(document)
        .off('partial_reload_end.premium_features')
        .on('partial_reload_end.premium_features', function () {
            if (!isBotProtectionActive() && !document.getElementById('mobileContent')) {
                start();
            }
        });

    var villageList;
    function init() {
        if (isBotProtectionActive()) return;
        restoreTimeouts();
        prepareLocalStorageItems();
        if (!document.getElementById('mobileContent')) {
            start();
        }
    }

    setTimeout(() => {
        if (!isBotProtectionActive()) {
            init();
        }
    }, 500);
})();
