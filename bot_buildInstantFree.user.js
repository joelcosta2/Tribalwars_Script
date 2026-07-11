// Bot: Auto Build Instant Free
// Completes the active building upgrade for free during the last 3-minute window.
// TribalWars allows free instant completion when ≤ 3 minutes remain on the active build.
//
// Flow:
//   1. checkAndScheduleBuildInstantFree() — called on page load. Reads building_queue_next_slot
//      (real epoch ms, no jitter) from localStorage, derives the free-window start time,
//      and schedules a zero-jitter setTimeout.
//   2. When the setTimeout fires: fetchAndExecuteBuildInstantFree() fetches screen=main,
//      finds .btn-instant-free, extracts the orderId, and calls the API.
//   3. buildInstantFreeApiCall(orderId) — stub. Replace once POST format is confirmed.
//
// Integration points (called externally):
//   • start() in main_local.user.js → checkAndScheduleBuildInstantFree()
//   • scheduleCompletionNotification() in widget_extraBuildQueue.user.js (after build finishes)
//     → checkAndScheduleBuildInstantFree() to re-arm for the next queued build.

// ─── Constants ────────────────────────────────────────────────────────────────

/** Seconds the free-complete window is open before the build would finish naturally. */
const BUILD_INSTANT_FREE_WINDOW_SEC = 180; // 3 minutes

/** Active setTimeout id — kept so we can cancel if queue changes. */
let buildInstantFreeTimeoutId = null;

// ─── Public entry point ────────────────────────────────────────────────────────

/**
 * Derives the free-window start from building_queue_next_slot (already stored in real
 * epoch ms by the widget) and arms a zero-jitter setTimeout.
 *
 * Call this:
 *   • on every page load (from start())
 *   • after each build completes (from scheduleCompletionNotification callback)
 */
function checkAndScheduleBuildInstantFree() {
    if (!settings_cookies?.general?.show__auto_build_instant_free) return;

    const villageId = game_data?.village?.id;
    if (!villageId) return;

    const nextSlotMs = parseInt(localStorage.getItem(getBuildQueueKey('building_queue_next_slot')), 10);

    if (!nextSlotMs || isNaN(nextSlotMs)) {
        _clearBuildInstantFreeTimeout();
        return;
    }

    const freeWindowStartMs = nextSlotMs - BUILD_INSTANT_FREE_WINDOW_SEC * 1000;
    const now = Date.now();
    const msUntilWindow = freeWindowStartMs - now;

    _clearBuildInstantFreeTimeout();

    if (msUntilWindow > 0) {
        buildInstantFreeTimeoutId = setTimeout(() => {
            fetchAndExecuteBuildInstantFree(nextSlotMs);
        }, msUntilWindow);
    } else if (now < nextSlotMs) {
        fetchAndExecuteBuildInstantFree(nextSlotMs);
    }
    // else: build already completed — nothing to do
}

// ─── Core execution ────────────────────────────────────────────────────────────

/**
 * Fetches screen=main, verifies the free-complete button is present and active,
 * extracts the orderId, then calls the API stub.
 *
 * @param {number} expectedCompletionMs - epoch ms when the build was expected to finish.
 *   Used as a sanity guard to detect if a different build is now active.
 */
async function fetchAndExecuteBuildInstantFree(expectedCompletionMs) {
    let doc;
    try {
        const resp = await fetch(game_data.link_base_pure + 'main', { credentials: 'include' });
        if (!resp.ok) {
            console.error('[BuildInstantFree] Fetch failed:', resp.status, resp.statusText);
            return;
        }
        doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    } catch (e) {
        console.error('[BuildInstantFree] Fetch exception:', e);
        return;
    }

    // Find the instant-free button
    const freeBtn = doc.querySelector('.btn-instant-free');
    if (!freeBtn) {
        console.warn('[BuildInstantFree] .btn-instant-free not found — build already complete or no active build.');
        checkAndScheduleBuildInstantFree();
        return;
    }

    const availableFromMs = parseInt(freeBtn.getAttribute('data-available-from'), 10) * 1000;
    const availableToMs   = parseInt(freeBtn.getAttribute('data-available-to'),   10) * 1000;
    const now             = Date.now();

    // Extract orderId from onclick: "return BuildingMain.change_order(462717, 'BuildInstantFree', 0)"
    const onclickAttr = freeBtn.getAttribute('onclick') || '';
    const orderIdMatch = onclickAttr.match(/change_order\((\d+)/);
    if (!orderIdMatch) {
        console.error('[BuildInstantFree] Could not extract orderId from onclick:', onclickAttr);
        return;
    }
    const orderId = parseInt(orderIdMatch[1], 10);

    if (now < availableFromMs) {
        // Slight timing offset — re-schedule for exact open moment
        const remaining = availableFromMs - now;
        buildInstantFreeTimeoutId = setTimeout(() => buildInstantFreeApiCall(orderId), remaining);
        return;
    }

    if (now >= availableToMs) {
        console.warn('[BuildInstantFree] Window already closed (build completed naturally). Re-arming...');
        checkAndScheduleBuildInstantFree();
        return;
    }

    await buildInstantFreeApiCall(orderId);
}

// ─── API call ─────────────────────────────────────────────────────────────────

/**
 * Executes the free instant-complete for the given build order.
 * GET game.php?...&screen=main&ajaxaction=build_order_reduce&h={csrf}&id={orderId}&destroy=0
 *
 * @param {number} orderId - The build order ID from the button onclick attribute.
 */
async function buildInstantFreeApiCall(orderId) {
    const villageId = game_data?.village?.id;
    const csrf      = game_data?.csrf;

    if (!villageId || !csrf) {
        console.error('[BuildInstantFree] Missing villageId or csrf — cannot call the API.');
        return;
    }

    const url = game_data.link_base_pure
        + 'main&ajaxaction=build_order_reduce'
        + '&h=' + csrf
        + '&id=' + orderId
        + '&destroy=0';

    try {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'tribalwars-ajax': '1',
                'x-requested-with': 'XMLHttpRequest',
            },
            credentials: 'include',
        });

        if (!resp.ok) {
            console.error('[BuildInstantFree] HTTP error:', resp.status, resp.statusText);
            return;
        }

        await resp.json();
        showAutoHideBox('Build completed for free!', false);

        // Refresh the queue widget and re-arm for the next queued build
        if (typeof fetchBuildQueueWidget === 'function') {
            setTimeout(() => fetchBuildQueueWidget(true), 1000);
        } else {
            setTimeout(() => checkAndScheduleBuildInstantFree(), 3000);
        }
    } catch (e) {
        console.error('[BuildInstantFree] Error in API call:', e);
    }
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

function _clearBuildInstantFreeTimeout() {
    if (buildInstantFreeTimeoutId !== null) {
        clearTimeout(buildInstantFreeTimeoutId);
        buildInstantFreeTimeoutId = null;
    }
}
