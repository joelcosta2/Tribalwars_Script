/**
 * Checks if the daily bonus has been collected today (by server date) and attempts
 * collection if not. Schedules the next run at server midnight plus a random delay.
 */
async function checkAndScheduleDailyBonus() {
    if (!settings_cookies.general['show__auto_daily_bonus']) return;

    try {
        // Use server-local date to correctly identify "today" — toISOString() gives UTC,
        // so we shift by serverTimezoneOffsetMs first to get the server's wall-clock date.
        const serverLocalMs = Timing.getCurrentServerTime() + serverTimezoneOffsetMs;
        const todayKey = new Date(serverLocalMs).toISOString().split('T')[0];
        const lastDate = localStorage.getItem('daily_bonus_last_date');

        if (lastDate !== todayKey) {
            // New day (or never run) — attempt collection
            await autoDailyBonusCollect();
            // Mark today as attempted regardless of outcome
            // (autoDailyBonusCollect handles the "already collected" case silently)
            localStorage.setItem('daily_bonus_last_date', todayKey);
        }

        // Schedule next run at next server midnight + random delay (up to 2 min).
        // twWallClockToEpochMs(0,0,0,1) returns the UTC epoch of tomorrow's 00:00:00 server time.
        const nextServerMidnightMs = twWallClockToEpochMs(0, 0, 0, 1);
        const msUntilMidnight = nextServerMidnightMs - Timing.getCurrentServerTime();
        const randomDelay = Math.random() * 120000; // up to 2 minutes

        setTimeout(() => checkAndScheduleDailyBonus(), msUntilMidnight + randomDelay);

    } catch (err) {
        console.error('[DailyBonus] Schedule error:', err);
    }
}

/**
 * Two-step HTTP fetch to collect the available daily bonus chest.
 * Step 1: loads the bonus page to find the unlocked chest and its day number.
 * Step 2: POSTs to the collect endpoint with the day number and CSRF token.
 */
async function autoDailyBonusCollect() {
    if (!game_data) return;

    try {
        // Step 1: Load the daily bonus page to find today's collectible chest
        const pageRes = await fetch(game_data.link_base_pure + "info_player&mode=daily_bonus", {
            credentials: "include"
        });
        const html = await pageRes.text();

        // Step 2: Parse HTML — chest state classes (unlocked/opened) are applied by JS at runtime
        // and don't exist in the server-rendered HTML. Extract data from the DailyBonus.init({...})
        // script block instead, which carries is_locked and is_collected for every chest.
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const scripts = Array.from(doc.querySelectorAll('script'));
        const initScriptText = scripts.map(s => s.textContent).find(t => t.includes('DailyBonus.init('));

        let bonusData;
        if (initScriptText) {
            const initStart = initScriptText.indexOf('DailyBonus.init(') + 'DailyBonus.init('.length;
            let depth = 0, pos = initStart;
            while (pos < initScriptText.length) {
                if (initScriptText[pos] === '{') depth++;
                else if (initScriptText[pos] === '}') { depth--; if (depth === 0) break; }
                pos++;
            }
            try { bonusData = JSON.parse(initScriptText.slice(initStart, pos + 1)); } catch (e) {
                console.error('[DailyBonus] Failed to parse DailyBonus.init data:', e);
            }
        }

        if (!bonusData?.chests) {
            console.warn('[DailyBonus] No chest data found in page script.');
            return;
        }
        console.log('[DailyBonus] Chests parsed:', Object.values(bonusData.chests).map(c => `day${c.day}:locked=${c.is_locked},collected=${c.is_collected}`));

        // Find first chest that is unlocked and not yet collected
        const targetChest = Object.values(bonusData.chests).find(c => !c.is_locked && !c.is_collected);

        if (!targetChest) {
            console.log('[DailyBonus] No chest available to collect today (already collected or all locked).');
            return;
        }

        const day = targetChest.day;
        console.log(`[DailyBonus] Collecting day ${day}...`);

        // Step 3: POST to collect the chest
        const collectRes = await fetch(game_data.link_base_pure + "daily_bonus&ajaxaction=open", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "tribalwars-ajax": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: game_data.link_base_pure + "info_player&mode=daily_bonus",
            body: `day=${day}&from_screen=profile&h=${game_data.csrf}`,
            credentials: "include"
        });

        const result = await collectRes.json();

        if (result?.error) {
            showAutoHideBox(`Daily bonus: ${result.error}`, true);
        } else {
            showAutoHideBox(`Daily bonus day ${day} collected!`, false);
            console.log('[DailyBonus] Success:', result);
        }

    } catch (err) {
        console.error('[DailyBonus] Failed:', err);
        showAutoHideBox('Error collecting daily bonus.', true);
    }
}
