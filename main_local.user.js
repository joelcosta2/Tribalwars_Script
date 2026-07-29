// ==UserScript==
// @name         Script Extra Widgets Premium (local)
// @version      4.15.0
// @description  Feature-rich enhancement suite for TribalWars. Widgets: Village List, Notepad, Extra Build Queue, Recruit Troops, Resource Dashboard. Map: hover details, outgoing command overlay, attack heat-map, custom CTX attack template buttons, large map view. Automation: Auto-Scavenging (per-level & per-village config), Auto-Paladin Trainer, Auto Daily Bonus collection. UI: Custom Navigation Bar, Navigation Arrows, Visual Building Overview. Settings: full import/export support.
// @author       killwilll

// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/core_utils.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/core_css.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/core_settings.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/widgets/widget_villageArrows.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/widgets/widget_navigationBar.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/features/feature_map.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/features/feature_overview.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/features/feature_simulator.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/bots/bot_trainerPaladin.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/bots/bot_scavenging.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/bots/bot_dailyBonus.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/bots/bot_buildInstantFree.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/widgets/widget_villageList.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/widgets/widget_notepad.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/widgets/widget_extraBuildQueue.user.js
// @require      file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/widgets/widget_recruitTroops.user.js

// @updateURL    file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/main_local.user.js
// @downloadURL  file:///Users/joel.costa@diconium.com/Library/CloudStorage/OneDrive-diconiumGmbH/Documents/Github/Tribalwars-Premium-Features/main_local.user.js

// @include      https://*.tribalwars.*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      twstats.com
// ==/UserScript==

(function () {
    'use strict';

    let botProtectionActive = false;
    let botProtectionObserver = null;
    let botProtectionHookTimer = null;

    function stopBotProtectionWatchers() {
        if (botProtectionObserver) {
            botProtectionObserver.disconnect();
            botProtectionObserver = null;
        }
        if (botProtectionHookTimer) {
            clearInterval(botProtectionHookTimer);
            botProtectionHookTimer = null;
        }
    }

    function blockPremiumFeatures() {
        if (botProtectionActive) return;
        botProtectionActive = true;
        console.warn('Bot protection detected. Aborting script execution.');
        stopBotProtectionWatchers();
        $(document).off('partial_reload_end.premium_features');
    }

    function hookBotProtection() {
        if (window.BotProtect && typeof window.BotProtect.show === 'function' && !window.BotProtect.__premiumHooked) {
            const originalShow = window.BotProtect.show.bind(window.BotProtect);
            window.BotProtect.show = function (state) {
                blockPremiumFeatures();
                return originalShow(state);
            };
            window.BotProtect.__premiumHooked = true;
            return true;
        }

        return false;
    }

    function watchForBotProtection() {
        if (hookBotProtection()) {
            return;
        }

        if (!botProtectionHookTimer) {
            botProtectionHookTimer = setInterval(() => {
                if (hookBotProtection()) {
                    stopBotProtectionWatchers();
                }
            }, 250);
        }

        if (!botProtectionObserver && document.body && window.MutationObserver) {
            botProtectionObserver = new MutationObserver(() => {
                if (
                    document.querySelector('td.bot-protection-row') ||
                    document.getElementById('botprotection_quest') ||
                    document.querySelector('.captcha')
                ) {
                    blockPremiumFeatures();
                }
            });
            botProtectionObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    watchForBotProtection();

    // Listen for partial reload events and re-initialize the script when they occur
    $(document)
        .off('partial_reload_end.premium_features')
        .on('partial_reload_end.premium_features', function () {
            if (!botProtectionActive && !document.getElementById('mobileContent')) {
                start();
            }
        });

    var villageList;
    function init() {
        if (botProtectionActive) return;
        restoreTimeouts();
        prepareLocalStorageItems();
        if (!document.getElementById('mobileContent')) {
            start();
        }
    }

    setTimeout(() => {
        if (!botProtectionActive) {
            init();
        }
    }, 250);
})();