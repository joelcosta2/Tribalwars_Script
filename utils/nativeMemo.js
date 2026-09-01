// Native TW memo ("Bloco de notas") integration — appends text via the game's own memo endpoint.

// Fallback char limit if 'var char_limit = N;' can't be found on the fetched page (free-account default).
const MEMO_DEFAULT_CHAR_LIMIT = 500;

// Per-village guard so two concurrent calls can't read-then-write and clobber each other's content.
var memoAppendInFlightByVillage = {};

/**
 * Appends text to a village's native memo ("Bloco de notas"). Reads the current content, `tab_id`
 * and csrf `h` fresh via GET each time (these are page/session-specific, never hardcoded) before
 * POSTing the combined text back. If the result would exceed the tab's character limit (read from
 * the page's 'var char_limit = N;' — free accounts get 500/1 tab, premium up to 60000/9 tabs), the
 * OLDEST content is trimmed first so the newly added text always survives intact.
 * @param {string} textToAdd
 * @param {string|number} [villageId] - Defaults to the currently loaded village.
 * @param {string|number} [tabId] - Which memo tab to target (premium accounts can have several).
 *   Defaults to the first tab found on the page.
 * @returns {Promise<boolean>} Whether the memo was saved successfully.
 */
async function appendToVillageMemo(textToAdd, villageId, tabId) {
    const vId = villageId || game_data?.village?.id;
    if (!vId || !textToAdd) return false;

    if (memoAppendInFlightByVillage[vId]) {
        console.warn('[Memo] Update already in flight for village ' + vId + ' — skipping to avoid clobbering.');
        return false;
    }
    memoAppendInFlightByVillage[vId] = true;

    try {
        const linkBase = typeof getVillageLinkBase === 'function' ? getVillageLinkBase(vId) : game_data.link_base_pure;

        const getResp = await fetch(linkBase + 'memo', { credentials: 'include' });
        if (!getResp.ok) {
            console.error('[Memo] Failed to load memo page:', getResp.status, getResp.statusText);
            return false;
        }
        const pageText = await getResp.text();
        const doc = new DOMParser().parseFromString(pageText, 'text/html');

        // Premium accounts can have several tabs (each its own .memo_container/<form>); pick the
        // requested one or fall back to the first, warning if the choice is ambiguous.
        const containers = doc.querySelectorAll('.memo_container');
        let form = tabId ? doc.querySelector('#memo_' + tabId + ' form') : null;
        if (!form) {
            form = doc.querySelector('.memo_container form');
            if (containers.length > 1) {
                console.warn('[Memo] Village ' + vId + ' has ' + containers.length + ' memo tabs — defaulting to the first one. Pass tabId to target a specific tab.');
            }
        }

        const textarea = form?.querySelector('textarea[name="memo"]');
        const tabIdInput = form?.querySelector('input[name="tab_id"]');
        // No hidden "h" field exists — the csrf token only lives in the form's action URL query string.
        const hMatch = form?.getAttribute('action')?.match(/[?&]h=([^&]+)/);

        if (!textarea || !tabIdInput || !hMatch) {
            console.error('[Memo] Could not find memo form fields for village ' + vId + ' — page structure may have changed.');
            return false;
        }

        // Limit is a JS var on the page (no maxlength attribute exists on the textarea itself).
        const limitMatch = pageText.match(/var\s+char_limit\s*=\s*(\d+)/i);
        const maxLength = limitMatch ? parseInt(limitMatch[1], 10) : MEMO_DEFAULT_CHAR_LIMIT;

        const existingContent = textarea.value || '';
        const addition = (existingContent ? '\n' : '') + textToAdd;

        let newContent;
        if (addition.length >= maxLength) {
            // The new text alone already fills (or exceeds) the limit — old content is fully
            // dropped and even the new text has to be trimmed from its start to fit.
            newContent = addition.slice(addition.length - maxLength);
            console.warn('[Memo] New text alone exceeds the ' + maxLength + '-char limit for village ' + vId + ' — it was trimmed too.');
        } else {
            const combined = existingContent + addition;
            newContent = combined.length > maxLength ? combined.slice(combined.length - maxLength) : combined;
            if (combined.length > maxLength) {
                console.warn('[Memo] Oldest content trimmed to fit the ' + maxLength + '-char limit for village ' + vId);
            }
        }

        const body = new URLSearchParams();
        body.append('tab_id', tabIdInput.value);
        body.append('memo', newContent);
        body.append('h', hMatch[1]);

        const postResp = await fetch(linkBase + 'memo&action=edit', {
            method: 'POST',
            credentials: 'include',
            body
        });

        if (!postResp.ok) {
            console.error('[Memo] Save failed for village ' + vId + ':', postResp.status, postResp.statusText);
            return false;
        }
        return true;
    } catch (e) {
        console.error('[Memo] Error appending to memo for village ' + vId + ':', e);
        return false;
    } finally {
        delete memoAppendInFlightByVillage[vId];
    }
}
