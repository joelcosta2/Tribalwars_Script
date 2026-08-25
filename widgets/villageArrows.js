// Village Arrows

/**
 * Swaps the village ID from a target URL into the current page's URL.
 * This allows "staying" on the same screen (e.g., Stable) while switching villages.
 * @param {string} goToUrl - The URL containing the target village ID (usually from a link).
 * @returns {string} The formatted URL for the current screen with the new village ID.
 */
function getVillageLinkCurrentScreen(goToUrl) {
    try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(goToUrl, window.location.origin);

        // Get the village ID ('village') from the target URL
        const newVillageId = targetUrl.searchParams.get('village');

        if (newVillageId) {
            // Update the 'village' parameter in the current URL
            currentUrl.searchParams.set('village', newVillageId);

            return currentUrl.toString();
        }

        // Fallback: If no ID found, return the original target
        return goToUrl;
    } catch (e) {
        console.error("Error parsing village URL:", e);
        return goToUrl;
    }
}

/**
 * Navigates to the next village in the list.
 * If at the end of the list, loops back to the first village.
 */
function nextVillage() {
    try {
        const villages = JSON.parse(localStorage.getItem('villages_info') || '[]');

        // 1. Guard clause: Ensure we have villages to navigate to
        if (!villages.length) {
            console.warn("[Navigation] No village information found in localStorage.");
            return;
        }

        // 2. Calculate next index (Loops back to 0 if at the end)
        // Using (index + 1) % length is a clean way to handle the "reset to 0" logic
        const nextIndex = (currentVillageIndex + 1) % villages.length;

        const targetVillage = villages[nextIndex];

        if (targetVillage?.url) {
            // 3. Update global index (optional, depends on your script's state management)
            window.currentVillageIndex = nextIndex;

            // 4. Redirect using the screen-preserving helper
            window.location.href = getVillageLinkCurrentScreen(targetVillage.url);
        }
    } catch (error) {
        console.error("[Navigation] Error during next village transition:", error);
    }
}

/**
 * Navigates to the previous village in the list.
 * If at the start, loops back to the last village.
 */
function previousVillage() {
    try {
        const villages = JSON.parse(localStorage.getItem('villages_info') || '[]');

        if (!villages.length) {
            console.warn("[Navigation] No village list found.");
            return;
        }

        // Calculate previous index with a positive modulo wrap-around
        // (index - 1 + length) % length ensures we never get a negative number
        const prevIndex = (currentVillageIndex - 1 + villages.length) % villages.length;

        const targetVillage = villages[prevIndex];

        if (targetVillage?.url) {
            window.currentVillageIndex = prevIndex;
            window.location.href = getVillageLinkCurrentScreen(targetVillage.url);
        }
    } catch (error) {
        console.error("[Navigation] Error navigating to previous village:", error);
    }
}

/**
 * Injects navigation arrows into the top menu bar.
 * Uses 'insertAdjacentHTML' to preserve existing menu event listeners.
 */
function insertNavigationArrows() {
    if (!settings_cookies.general?.['show__navigation_arrows']) return;

    const menuRow = document.getElementById('menu_row2');
    if (!menuRow) return;

    document.getElementById('village_switch_previous')?.closest('td')?.remove();
    document.getElementById('village_switch_next')?.closest('td')?.remove();

    const htmlToInject = `
        <td class="box-item icon-box separate arrowCell">
            <a id="village_switch_previous" class="village_switch_link" accesskey="a">
                <span class="arrowLeft"></span>
            </a>
        </td>
        <td class="box-item icon-box arrowCell">
            <a id="village_switch_next" class="village_switch_link" accesskey="d">
                <span class="arrowRight"></span>
            </a>
        </td>`;

    // Inject at the beginning of the row without refreshing the whole innerHTML
    menuRow.insertAdjacentHTML('afterbegin', htmlToInject);

    // Attach events
    const prevBtn = document.getElementById('village_switch_previous');
    const nextBtn = document.getElementById('village_switch_next');

    if (prevBtn) prevBtn.onclick = (e) => { e.preventDefault(); previousVillage(); };
    if (nextBtn) nextBtn.onclick = (e) => { e.preventDefault(); nextVillage(); };
}

/**
 * Injects a small dropdown icon into the menu bar to open the village list popup.
 */
function insertListVillagesPopup() {
    if (!settings_cookies.general?.['show__navigation_arrows']) return;

    const menuRow2 = document.getElementById("menu_row2");
    if (!menuRow2) return;

    document.querySelector('.box-item.box-item-village-list')?.remove();

    // Create container cell
    const td = document.createElement("td");
    td.className = "box-item box-item-village-list";

    // Create the toggle icon
    const img = Object.assign(document.createElement("img"), {
        src: "https://dspt.innogamescdn.com/asset/95eda994/graphic//icons/slide_down.png",
        alt: t('villageArrows.openList'),
        className: "village-list-toggle"
    });

    // Event listener
    img.onclick = (e) => {
        e.stopPropagation();
        if (typeof openVillageListPopup === 'function') {
            openVillageListPopup({ x: e.clientX, y: e.clientY });
        }
    };

    td.appendChild(img);
    menuRow2.appendChild(td);
}

/**
 * Opens a popup containing a list of all villages for quick navigation.
 */
function openVillageListPopup(cursorPosition) {
    const lang = JSON.parse(localStorage.getItem('tw_lang') || '{}');

    // 1. Toggle: If it exists, remove it and stop
    const existing = document.getElementById("group_popup");
    if (existing) {
        existing.closest('.popup_helper_village_list')?.remove();
        return;
    }

    // 2. Create Elements
    const popupHelper = document.createElement("div");
    popupHelper.className = "popup_helper_village_list";

    const popup = Object.assign(document.createElement("div"), {
        id: "group_popup",
        className: "popup_style"
    });

    // 3. Header & Close Logic
    const popupMenu = Object.assign(document.createElement("div"), {
        id: "group_popup_menu",
        className: "popup_menu",
        innerHTML: lang['49f8eff5b37c62212f0b7870b07af7bb'] || t('common.villages')
    });

    const closeBtn = Object.assign(document.createElement("a"), {
        id: "closelink_group_popup",
        href: "#",
        innerText: t('button.close')
    });

    const closePopup = (e) => {
        if (e) e.preventDefault();
        document.removeEventListener('keydown', escHandler);
        popupHelper.remove();
    };

    const escHandler = (e) => {
        if (e.key === 'Escape') closePopup();
    };
    document.addEventListener('keydown', escHandler);

    // Close on 'X' click
    closeBtn.onclick = closePopup;

    // Close when clicking the background overlay (outside the popup)
    popupHelper.onclick = (e) => {
        if (e.target === popupHelper) closePopup();
    };

    popupMenu.appendChild(closeBtn);

    // 4. Content and Table
    const popupContent = Object.assign(document.createElement("div"), {
        id: "group_popup_content",
        className: "popup_content"
    });

    const table = Object.assign(document.createElement("table"), {
        id: "group_table",
        className: "vis",
        width: "100%"
    });

    const tbody = document.createElement("tbody");

    // Table Header
    const headerRow = tbody.insertRow();
    const headerTh = document.createElement("th");
    headerTh.colSpan = 2;
    headerTh.textContent = lang['abc63490c815af81276f930216c8d92b'] ?? t('common.village');
    headerRow.appendChild(headerTh);

    // 5. Populate Villages
    let villagesData = JSON.parse(localStorage.getItem("villages_info") || "[]");

    // Convert to array if it's an object, or default to empty array
    const villagesList = Array.isArray(villagesData)
        ? villagesData
        : Object.values(villagesData);

    villagesList.forEach(village => {
        if (!village) return; // Skip empty entries

        const row = tbody.insertRow();

        const cellName = row.insertCell(0);
        cellName.className = "selected";
        const link = Object.assign(document.createElement("a"), {
            href: getVillageLinkCurrentScreen(village.url),
            className: "select-village",
            textContent: village.name?.trim() || t('common.unknown')
        });
        cellName.appendChild(link);

        const cellCoords = row.insertCell(1);
        cellCoords.className = "selected village-list-coords";
        cellCoords.textContent = village.coords || t('common.notAvailable');
    });

    // 6. Assembly
    table.appendChild(tbody);
    popupContent.appendChild(table);
    popup.appendChild(popupMenu);
    popup.appendChild(popupContent);
    popupHelper.appendChild(popup);

    document.body.appendChild(popupHelper);

    // Position popup near cursor and keep it inside viewport.
    const popupWidth = popup.offsetWidth || 320;
    const popupHeight = popup.offsetHeight || 380;
    const margin = 8;
    const offset = 12;

    if (cursorPosition && Number.isFinite(cursorPosition.x) && Number.isFinite(cursorPosition.y)) {
        let left = cursorPosition.x + offset;
        let top = cursorPosition.y + offset;

        if (left + popupWidth + margin > window.innerWidth) {
            left = Math.max(margin, cursorPosition.x - popupWidth - offset);
        }

        if (top + popupHeight + margin > window.innerHeight) {
            top = Math.max(margin, window.innerHeight - popupHeight - margin);
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.style.transform = 'none';
    }
}

// If the setting is enabled, inject a CSS rule that hides the in-game premium promotion banner.
if (settings_cookies.general['remove__premium_promo']) {
    const style = document.createElement("style");
    style.innerHTML = ".premium_account_hint { display: none !important; }";
    document.head.appendChild(style);
}