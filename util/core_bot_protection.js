(function () {
    'use strict';

    if (window.PremiumFeaturesBotProtection) {
        return;
    }

    const state = {
        active: false,
        observer: null,
        hookTimer: null
    };

    function hasBotProtectionMarkers() {
        return Boolean(
            document.querySelector('td.bot-protection-row') ||
            document.getElementById('botprotection_quest') ||
            document.querySelector('.captcha')
        );
    }

    function stopHookTimer() {
        if (state.hookTimer) {
            clearInterval(state.hookTimer);
            state.hookTimer = null;
        }
    }

    function stopObserver() {
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }
    }

    function shouldDisableFeaturesOnDetection() {
        return getSetting('antiBot__disableOnDetection') !== false;
    }

    function blockPremiumFeatures() {
        if (!shouldDisableFeaturesOnDetection()) return;
        if (state.active) return;
        state.active = true;
        console.warn('Bot protection detected. Aborting script execution.');
        stopHookTimer();
        stopObserver();
        $(document).off('partial_reload_end.premium_features');
    }

    function hookBotProtection() {
        if (window.BotProtect && typeof window.BotProtect.show === 'function' && !window.BotProtect.__premiumHooked) {
            const originalShow = window.BotProtect.show.bind(window.BotProtect);
            window.BotProtect.show = function (stateValue) {
                blockPremiumFeatures();
                return originalShow(stateValue);
            };
            window.BotProtect.__premiumHooked = true;
            return true;
        }

        return false;
    }

    function watchForBotProtection() {
        if (!shouldDisableFeaturesOnDetection()) {
            stopHookTimer();
            stopObserver();
            return;
        }

        if (state.active) return;

        if (hasBotProtectionMarkers()) {
            blockPremiumFeatures();
            return;
        }

        if (hookBotProtection()) {
            stopHookTimer();
        } else if (!state.hookTimer) {
            state.hookTimer = setInterval(() => {
                if (hookBotProtection()) {
                    stopHookTimer();
                }
            }, 250);
        }

        if (!state.observer && document.body && window.MutationObserver) {
            state.observer = new MutationObserver(() => {
                if (hasBotProtectionMarkers()) {
                    blockPremiumFeatures();
                }
            });
            state.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    window.PremiumFeaturesBotProtection = {
        isActive() {
            return state.active;
        },
        watch() {
            watchForBotProtection();
        },
        block() {
            blockPremiumFeatures();
        }
    };

    if (document.body) {
        watchForBotProtection();
    } else {
        document.addEventListener('DOMContentLoaded', watchForBotProtection, { once: true });
    }
})();