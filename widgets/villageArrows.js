// Village Arrows

function getVillageNavigationId(village) {
    return String(village.id || new URL(village.url, window.location.origin).searchParams.get('village'));
}

function getVillageNavigationList(villages) {
    const navigation = typeof getOverviewManualGroupNavigation === 'function'
        ? getOverviewManualGroupNavigation()
        : null;
    return navigation
        ? villages.filter(village => navigation.villageIds.includes(getVillageNavigationId(village)))
        : villages;
}

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
            currentUrl.searchParams.delete('group');

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

        const navigationVillages = getVillageNavigationList(villages);
        if (!navigationVillages.length) {
            console.warn("[Navigation] No village information found in localStorage.");
            return;
        }

        const currentUrl = new URL(window.location.href);
        const currentId = currentUrl.searchParams.get('village');
        const currentIndex = navigationVillages.findIndex(village => getVillageNavigationId(village) === String(currentId));
        const nextIndex = (currentIndex + 1) % navigationVillages.length;

        const targetVillage = navigationVillages[nextIndex];

        if (targetVillage?.url) {
            // 3. Update global index (optional, depends on your script's state management)
            window.currentVillageIndex = villages.indexOf(targetVillage);

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

        const navigationVillages = getVillageNavigationList(villages);
        if (!navigationVillages.length) {
            console.warn("[Navigation] No village list found.");
            return;
        }

        const currentUrl = new URL(window.location.href);
        const currentId = currentUrl.searchParams.get('village');
        const currentIndex = navigationVillages.findIndex(village => getVillageNavigationId(village) === String(currentId));
        const prevIndex = (currentIndex - 1 + navigationVillages.length) % navigationVillages.length;

        const targetVillage = navigationVillages[prevIndex];

        if (targetVillage?.url) {
            window.currentVillageIndex = villages.indexOf(targetVillage);
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
    document.getElementById('village_switch_left')?.closest('td')?.remove();
    document.getElementById('village_switch_right')?.closest('td')?.remove();

    const currentUrl = new URL(window.location.href);
    const currentVillageId = currentUrl.searchParams.get('village') || '';
    const isGroupMode = typeof getOverviewManualGroupNavigation === 'function'
        && Boolean(getOverviewManualGroupNavigation());
    const previousUrl = new URL(currentUrl);
    const nextUrl = new URL(currentUrl);
    if (isGroupMode) {
        previousUrl.searchParams.set('village', `p${currentVillageId}`);
        nextUrl.searchParams.set('village', `n${currentVillageId}`);
        previousUrl.searchParams.delete('group');
        nextUrl.searchParams.delete('group');
    }
    const previousHref = isGroupMode ? previousUrl.toString() : '#';
    const nextHref = isGroupMode ? nextUrl.toString() : '#';

    const htmlToInject = `
        <td class="box-item icon-box separate arrowCell">
            <a id="village_switch_left" class="village_switch_link" href="${previousHref}" accesskey="a" data-title="${t('villageArrows.previous')}">
                <span class="${isGroupMode ? 'groupLeft' : 'arrowLeft'}"></span>
            </a>
        </td>
        <td class="box-item icon-box arrowCell">
            <a id="village_switch_right" class="village_switch_link" href="${nextHref}" accesskey="d" data-title="${t('villageArrows.next')}">
                <span class="${isGroupMode ? 'groupRight' : 'arrowRight'}"></span>
            </a>
        </td>`;

    // Inject at the beginning of the row without refreshing the whole innerHTML
    menuRow.insertAdjacentHTML('afterbegin', htmlToInject);

    // Attach events
    const prevBtn = document.getElementById('village_switch_left');
    const nextBtn = document.getElementById('village_switch_right');

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

    if (localStorage.getItem(VILLAGE_LIST_POPUP_OPEN_KEY) === 'true') {
        openVillageListPopup();
    }
}

const VILLAGE_LIST_POPUP_POSITION_KEY = 'twpf_village_list_popup_position';
const VILLAGE_LIST_POPUP_OPEN_KEY = 'twpf_village_list_popup_open';

function getVillageListPopupPosition() {
    try {
        const position = JSON.parse(localStorage.getItem(VILLAGE_LIST_POPUP_POSITION_KEY) || 'null');
        return Number.isFinite(position?.left) && Number.isFinite(position?.top)
            ? position
            : null;
    } catch (error) {
        return null;
    }
}

function saveVillageListPopupPosition(popup) {
    const rect = popup.getBoundingClientRect();
    localStorage.setItem(VILLAGE_LIST_POPUP_POSITION_KEY, JSON.stringify({
        left: rect.left,
        top: rect.top
    }));
}

function clampVillageListPopupPosition(popup, left, top) {
    const rect = popup.getBoundingClientRect();
    const maxLeft = Math.max(0, window.innerWidth - rect.width);
    const maxTop = Math.max(0, window.innerHeight - rect.height);
    popup.style.left = `${Math.min(Math.max(left, 0), maxLeft)}px`;
    popup.style.top = `${Math.min(Math.max(top, 0), maxTop)}px`;
}

function makeVillageListPopupDraggable(popup, header) {
    header.style.cursor = 'grab';
    header.style.touchAction = 'none';

    let dragState = null;

    header.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target.closest('a, button, input, textarea, select')) return;

        const rect = popup.getBoundingClientRect();
        popup.style.transform = 'none';
        popup.style.left = `${rect.left}px`;
        popup.style.top = `${rect.top}px`;
        dragState = {
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };
        header.setPointerCapture(event.pointerId);
        header.style.cursor = 'grabbing';
        event.preventDefault();
    });

    header.addEventListener('pointermove', event => {
        if (!dragState || event.pointerId !== dragState.pointerId) return;

        clampVillageListPopupPosition(
            popup,
            event.clientX - dragState.offsetX,
            event.clientY - dragState.offsetY
        );
        event.preventDefault();
    });

    function stopDragging(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        if (header.hasPointerCapture(event.pointerId)) header.releasePointerCapture(event.pointerId);
        saveVillageListPopupPosition(popup);
        dragState = null;
        header.style.cursor = 'grab';
    }

    header.addEventListener('pointerup', stopDragging);
    header.addEventListener('pointercancel', stopDragging);
}

/**
 * Opens a popup containing a list of all villages for quick navigation.
 */
function openVillageListPopup(cursorPosition) {
    const lang = JSON.parse(localStorage.getItem('tw_lang') || '{}');

    // 1. Toggle: If it exists, remove it and stop
    const existing = document.getElementById("group_popup");
    if (existing) {
        localStorage.removeItem(VILLAGE_LIST_POPUP_OPEN_KEY);
        existing.closest('.popup_helper_village_list')?.remove();
        return;
    }

    localStorage.setItem(VILLAGE_LIST_POPUP_OPEN_KEY, 'true');

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
        localStorage.removeItem(VILLAGE_LIST_POPUP_OPEN_KEY);
        popupHelper.remove();
    };

    const escHandler = (e) => {
        if (e.key === 'Escape') closePopup();
    };
    document.addEventListener('keydown', escHandler);

    // Close on 'X' click
    closeBtn.onclick = closePopup;

    popupMenu.appendChild(closeBtn);

    // 4. Content and Table
    const popupContent = Object.assign(document.createElement("div"), {
        id: "group_popup_content",
        className: "popup_content",
        style: "height: 380px; overflow-y: auto;"
    });

    const groupForm = document.createElement('form');
    groupForm.id = 'select_group_box';
    groupForm.addEventListener('submit', event => event.preventDefault());

    const groupLabel = document.createElement('p');
    groupLabel.style.cssText = 'margin: 0 0 10px 0; font-weight: bold;';
    groupLabel.appendChild(document.createTextNode(t('overviewVillages.manualGroupsGroups') + ':'));

    const groupSelect = document.createElement('select');
    groupSelect.id = 'group_id';
    groupSelect.name = 'group_id';
    groupSelect.style.marginLeft = '3px';
    const allGroupsOption = new Option(t('overviewVillages.manualGroupsAllVillages'), '0');
    groupSelect.appendChild(allGroupsOption);

    const manualGroups = typeof loadOverviewManualGroups === 'function'
        ? loadOverviewManualGroups()
        : [];
    manualGroups.forEach(group => groupSelect.appendChild(new Option(group.name, group.id)));
    const navigation = typeof getOverviewManualGroupNavigation === 'function'
        ? getOverviewManualGroupNavigation()
        : null;
    const currentGroupId = navigation?.groupId;
    if (currentGroupId && manualGroups.some(group => group.id === currentGroupId)) groupSelect.value = currentGroupId;
    groupLabel.appendChild(groupSelect);
    groupForm.appendChild(groupLabel);
    popupContent.appendChild(groupForm);

    const listContent = Object.assign(document.createElement('div'), {
        id: 'group_list_content',
        style: 'overflow: auto; height: 340px;'
    });
    listContent.appendChild(createWidgetLoadingElement('340px'));

    let villagesData = JSON.parse(localStorage.getItem("villages_info") || "[]");

    const villagesList = Array.isArray(villagesData)
        ? villagesData
        : Object.values(villagesData);

    function renderVillageList(groupId) {
        listContent.replaceChildren();
        const group = manualGroups.find(item => item.id === groupId);
        const filteredVillages = group
            ? villagesList.filter(village => {
                if (!village) return false;
                const villageUrl = new URL(village.url, window.location.origin);
                const villageId = village.id || villageUrl.searchParams.get('village');
                return group.villageIds.includes(String(villageId));
            })
            : villagesList;

        const table = Object.assign(document.createElement('table'), {
            id: 'group_table',
            className: 'vis',
            width: '100%'
        });
        const headerRow = table.insertRow();
        const headerTh = document.createElement('th');
        headerTh.colSpan = 2;
        headerTh.className = 'group_label';
        headerTh.textContent = lang['abc63490c815af81276f930216c8d92b'] ?? t('common.village');
        headerRow.appendChild(headerTh);
        listContent.appendChild(table);

        if (!filteredVillages.length) {
            const empty = document.createElement('div');
            empty.className = 'info_box';
            empty.innerHTML = '<div class="content center"><em>' + t('overviewVillages.manualGroupsNoVillages') + '</em></div>';
            listContent.appendChild(empty);
            return;
        }

        const villageTable = Object.assign(document.createElement('table'), {
            id: 'group_village_table',
            className: 'vis',
            width: '100%'
        });
        filteredVillages.forEach(village => {
            if (!village) return;
            const row = villageTable.insertRow();
            const villageUrl = new URL(village.url, window.location.origin);
            const villageId = village.id || villageUrl.searchParams.get('village');
            const currentVillageId = typeof game_data !== 'undefined' ? game_data.village?.id : null;
            const isCurrentVillage = String(villageId) === String(currentVillageId);
            const cellName = row.insertCell(0);
            if (isCurrentVillage) cellName.id = 'selected_popup_village';
            cellName.className = isCurrentVillage ? 'selected' : '';
            const link = Object.assign(document.createElement('a'), {
                href: getVillageLinkCurrentScreen(village.url),
                className: 'select-village',
                textContent: village.name?.trim() || t('common.unknown')
            });
            cellName.appendChild(link);

            const cellCoords = row.insertCell(1);
            cellCoords.className = `${isCurrentVillage ? 'selected ' : ''}village-list-coords`;
            cellCoords.textContent = village.coords || t('common.notAvailable');
        });
        listContent.appendChild(villageTable);
    }

    groupSelect.addEventListener('change', () => {
        const group = manualGroups.find(item => item.id === groupSelect.value);
        if (typeof setOverviewManualGroupNavigation === 'function') {
            setOverviewManualGroupNavigation(group?.id || '', group?.villageIds || []);
        }
        renderVillageList(groupSelect.value);
    });
    popupContent.appendChild(listContent);
    popup.appendChild(popupMenu);
    popup.appendChild(popupContent);
    popupHelper.appendChild(popup);

    document.body.appendChild(popupHelper);
    renderVillageList(groupSelect.value);

    const popupWidth = popup.offsetWidth || 320;
    const popupHeight = popup.offsetHeight || 380;
    const margin = 8;
    const offset = 12;
    const savedPosition = getVillageListPopupPosition();

    if (savedPosition) {
        popup.style.transform = 'none';
        clampVillageListPopupPosition(popup, savedPosition.left, savedPosition.top);
    } else if (cursorPosition && Number.isFinite(cursorPosition.x) && Number.isFinite(cursorPosition.y)) {
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

    makeVillageListPopupDraggable(popup, popupMenu);
}

// If the setting is enabled, inject a CSS rule that hides the in-game premium promotion banner.
if (settings_cookies.general['remove__premium_promo']) {
    const style = document.createElement("style");
    style.innerHTML = ".premium_account_hint { display: none !important; }";
    document.head.appendChild(style);
}