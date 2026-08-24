// ==UserScript==
// @name         Tribalwars: Premium Features
// @version      5.0.3
// @description  Feature-rich enhancement suite for TribalWars. Widgets: Village List, Notepad, Extra Build Queue, Recruit Troops. Map: hover details, outgoing command overlay, attack heat-map, custom CTX attack template buttons, large map view. Automation: Auto-Scavenging (per-level & per-village config), Auto-Paladin Trainer, Auto Daily Bonus collection. UI: Custom Navigation Bar, Navigation Arrows, Visual Building Overview. Settings: full import/export support.
// @author       killwilll
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/i18n/i18n_utils.js
// @resource     i18n_en      https://github.com/joelcosta2/Tribalwars_Script/raw/master/i18n/en.json
// @resource     i18n_pt      https://github.com/joelcosta2/Tribalwars_Script/raw/master/i18n/pt.json
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/core_utils.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/core_indexeddb.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/core_bot_protection.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/core_css.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/core_darkmode.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/core_settings.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/utils/mapSdk.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_villageArrows.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_navigationBar.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_map.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_mapGroups.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_overview.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_overviewVillages.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_TroopTemplates.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_simulator.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_playerProfile.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/features/feature_ExtraMemo.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_trainerPaladin.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_scavenging.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_dailyBonus.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/bots/bot_buildInstantFree.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_villageList.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_notepad.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_extraBuildQueue.js
// @require      https://github.com/joelcosta2/Tribalwars_Script/raw/master/widgets/widget_recruitTroops.js
// @updateURL    https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @downloadURL  https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js
// @include      https://*.tribalwars.*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
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
    async function init() {
        if (isBotProtectionActive()) return;
        await hydrateBuildQueueCache();
        cleanupLegacyRecruitQueueLocalStorage();
        cleanupLegacyReportsLocalStorage();
        await cleanupLegacyNotepadStorage();
        await hydrateNotepadCache();
        cleanupLegacyMapDataLocalStorage();
        await hydrateMapDataCache();
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
