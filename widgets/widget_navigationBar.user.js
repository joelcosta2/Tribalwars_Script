// Navigation Bar (Quick Access Bar)

function _getNavAssetBase() {
    const img = document.querySelector('img[src*="innogamescdn.com/asset/"]');
    if (img) {
        const match = img.src.match(/innogamescdn\.com\/asset\/([^/]+)\//);
        if (match) return `https://dspt.innogamescdn.com/asset/${match[1]}/graphic/`;
    }
    return 'https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/';
}

function _openNavIconPicker(targetInput, anchorEl, onSelect) {
    const base = _getNavAssetBase();
    const slideDown = base + 'icons/slide_down.png';
    const slideUp   = base + 'icons/slide_up.png';

    // Toggle: if picker already open for this input, close it
    const existing = document.querySelector('.nav-icon-picker-popup');
    if (existing) {
        const isToggle = existing.__navPickerTarget === targetInput;
        existing.remove();
        if (isToggle) { anchorEl.src = slideDown; return; }
    }

    const icons = [
        { src: 'face.webp',                 title: 'Farm (resource)' },
        { src: 'lehm.webp',                 title: 'Clay (resource)' },
        { src: 'holz.webp',                 title: 'Wood (resource)' },
        { src: 'eisen.webp',                title: 'Iron (resource)' },
        { src: 'command/attack.webp',       title: 'Attack' },
        { src: 'command/support.webp',      title: 'Support' },
        { src: 'unit/unit_spear.webp',      title: 'Spear' },
        { src: 'unit/unit_sword.webp',      title: 'Sword' },
        { src: 'unit/unit_axe.webp',        title: 'Axe' },
        { src: 'unit/unit_archer.webp',     title: 'Archer' },
        { src: 'unit/unit_spy.webp',        title: 'Scout' },
        { src: 'unit/unit_light.webp',      title: 'Light Cavalry' },
        { src: 'unit/unit_marcher.webp',    title: 'Mounted Archer' },
        { src: 'unit/unit_heavy.webp',      title: 'Heavy Cavalry' },
        { src: 'unit/unit_ram.webp',        title: 'Ram' },
        { src: 'unit/unit_catapult.webp',   title: 'Catapult' },
        { src: 'unit/unit_knight.webp',     title: 'Paladin' },
        { src: 'unit/unit_snob.webp',       title: 'Noble' },
        { src: 'unit/unit_militia.webp',    title: 'Militia' },
        { src: 'buildings/main.webp',       title: 'Main Building' },
        { src: 'buildings/barracks.webp',   title: 'Barracks' },
        { src: 'buildings/stable.webp',     title: 'Stable' },
        { src: 'buildings/garage.webp',     title: 'Workshop' },
        { src: 'buildings/church.webp',     title: 'Church' },
        { src: 'buildings/watchtower.webp', title: 'Watchtower' },
        { src: 'buildings/snob.webp',       title: 'Academy' },
        { src: 'buildings/smith.webp',      title: 'Smithy' },
        { src: 'buildings/place.webp',      title: 'Rally Point' },
        { src: 'buildings/statue.webp',     title: 'Statue' },
        { src: 'buildings/market.webp',     title: 'Market' },
        { src: 'buildings/wood.webp',       title: 'Timber Camp' },
        { src: 'buildings/stone.webp',      title: 'Clay Pit' },
        { src: 'buildings/iron.webp',       title: 'Iron Mine' },
        { src: 'buildings/farm.webp',       title: 'Farm' },
        { src: 'buildings/storage.webp',    title: 'Warehouse' },
        { src: 'buildings/hide.webp',       title: 'Hiding Place' },
        { src: 'buildings/wall.webp',       title: 'Wall' },
    ];

    const picker = document.createElement('div');
    picker.className = 'nav-icon-picker-popup popup_style';
    picker.style.cssText = 'position:fixed; z-index:20000; width:220px; display:block;';
    picker.__navPickerTarget = targetInput;

    const header = Object.assign(document.createElement('div'), {
        className: 'popup_menu',
        innerHTML: 'Select icon'
    });
    const closeX = Object.assign(document.createElement('a'), {
        href: '#', innerText: 'X',
        style: 'float:right; cursor:pointer; font-weight:bold; text-decoration:none;'
    });
    closeX.onclick = (e) => { e.preventDefault(); anchorEl.src = slideDown; picker.remove(); };
    header.appendChild(closeX);

    const content = Object.assign(document.createElement('div'), { className: 'popup_content' });
    content.style.cssText = 'padding:8px; display:flex; flex-wrap:wrap; gap:4px; max-height:180px; overflow-y:auto;';

    icons.forEach(icon => {
        const img = Object.assign(document.createElement('img'), {
            src: base + icon.src,
            title: icon.title,
            style: 'width:24px; height:24px; cursor:pointer; padding:2px;'
        });
        img.onclick = () => {
            targetInput.value = icon.src;
            if (onSelect) onSelect();
            anchorEl.src = slideDown;
            picker.remove();
        };
        content.appendChild(img);
    });

    picker.appendChild(header);
    picker.appendChild(content);
    document.body.appendChild(picker);
    anchorEl.src = slideUp;

    // Position near the toggle button
    const rect = anchorEl.getBoundingClientRect();
    const pickerW = 220;
    let left = rect.left;
    let top = rect.bottom + 4;
    if (left + pickerW > window.innerWidth) left = window.innerWidth - pickerW - 8;
    if (left < 0) left = 4;
    picker.style.left = `${left}px`;
    picker.style.top = `${top}px`;

    // Close when clicking outside
    const closeOnOutside = (e) => {
        if (!picker.contains(e.target) && e.target !== anchorEl) {
            anchorEl.src = slideDown;
            picker.remove();
            document.removeEventListener('mousedown', closeOnOutside);
        }
    };
    setTimeout(() => document.addEventListener('mousedown', closeOnOutside), 0);
}

/**
 * Opens a popup to edit the custom navigation bar shortcuts.
 */
function openNavEditorPopup() {
    // 1. Toggle: If the editor already exists, remove it and stop
    const existing = document.querySelector(".popup_helper_editor");
    if (existing) {
        existing.remove();
        return;
    }

    // 2. Create the Overlay (Dark background)
    const popupHelper = Object.assign(document.createElement("div"), {
        className: "popup_helper popup_helper_editor",
        style: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: block;"
    });

    // 3. Create the Popup Container
    const popup = Object.assign(document.createElement("div"), {
        id: "nav_editor_popup",
        className: "popup_style",
        style: "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; max-width: 95vw; max-height: 90vh; overflow: hidden; z-index: 10001; display: block;"
    });

    // 4. Header & Close button logic
    const popupMenu = Object.assign(document.createElement("div"), {
        className: "popup_menu",
        innerHTML: "<strong>Navigation Items</strong>",
        style: "cursor: default;"
    });

    const closeBtn = Object.assign(document.createElement("a"), {
        href: "#",
        innerText: "X",
        style: "float: right; cursor: pointer; font-weight: bold; text-decoration: none;"
    });

    closeBtn.onclick = (e) => {
        e.preventDefault();
        popupHelper.remove();
    };
    popupMenu.appendChild(closeBtn);

    // 5. Content Area
    const popupContent = Object.assign(document.createElement("div"), {
        className: "popup_content",
        style: "padding: 15px; background: #f4e4bc; max-height: calc(90vh - 130px); overflow-y: auto;"
    });

    const table = Object.assign(document.createElement("table"), {
        className: "vis",
        style: "width: 100%; border-collapse: collapse;"
    });

    table.innerHTML = `
        <thead>
            <tr>
                <th style="text-align:left;">Name</th>
                <th style="text-align:left;">URL</th>
                <th style="text-align:left;">Icon (URL)</th>
                <th style="width: 30px;"></th>
            </tr>
        </thead>
        <tbody id="nav_editor_body"></tbody>
    `;

    /**
     * Helper to add a new row to the editor table
     */
    const addRow = (item = { name: '', href: '', img: '' }) => {
        const tbody = document.getElementById('nav_editor_body');
        if (!tbody) return;

        const row = tbody.insertRow();
        const deleteText = lang['1063e38cb53d94d386f21227fcd84717'] ?? 'Remove';
        const _rowBase = _getNavAssetBase();

        row.innerHTML = `
            <td><input type="text" class="nav-name" value="${item.name}" style="width: 100px; font-size:12px"></td>
            <td><input type="text" class="nav-href" value="${item.href}" style="width: 180px; font-size:12px" placeholder="/game.php?screen=..."></td>
            <td>
                <div style="display:flex; align-items:center; gap:3px;">
                    <img class="nav-img-preview" src="" style="width:18px; height:18px; display:none; vertical-align:middle;">
                    <input type="text" class="nav-img" value="${item.img}" style="width: 120px; font-size:12px" placeholder="ex: unit/att.png">
                    <img class="nav-img-pick" src="${_rowBase}icons/slide_down.png" style="width:14px; height:14px; cursor:pointer; vertical-align:middle;">
                </div>
            </td>
            <td style="text-align:center;">
                <span class="delete-icon-large hint-toggle" 
                      style="cursor:pointer;" 
                      data-title="${deleteText}">
                </span>
            </td>
        `;

        const imgInput = row.querySelector('.nav-img');
        const imgPreview = row.querySelector('.nav-img-preview');
        const pickBtn = row.querySelector('.nav-img-pick');

        const updatePreview = () => {
            const val = imgInput.value.trim();
            if (val) {
                const assetBase = _getNavAssetBase();
                imgPreview.src = val.startsWith('http') ? val : assetBase + val;
                imgPreview.style.display = 'inline';
                imgPreview.onerror = () => { imgPreview.style.display = 'none'; };
            } else {
                imgPreview.style.display = 'none';
            }
        };
        if (item.img) updatePreview();
        imgInput.addEventListener('input', updatePreview);

        pickBtn.addEventListener('click', () => {
            _openNavIconPicker(imgInput, pickBtn, updatePreview);
        });

        const deleteBtn = row.querySelector('.delete-icon-large');

        // 1. Click event to remove the row
        deleteBtn.onclick = () => {
            // Important: Hide the tooltip before removing the element from DOM
            // to prevent the tooltip from getting "stuck" on the screen.
            if (typeof toggleTooltip === 'function') toggleTooltip(deleteBtn, false);
            row.remove();
        };

        // 2. Hover events for the Native Tooltip
        if (typeof toggleTooltip === 'function') {
            deleteBtn.onmouseenter = () => toggleTooltip(deleteBtn, true);
            deleteBtn.onmouseleave = () => toggleTooltip(deleteBtn, false);
        }
    };

    popupContent.appendChild(table);

    // 6. Control Buttons (Footer)
    const footer = document.createElement("div");
    footer.style.marginTop = "15px";
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";

    const addBtn = Object.assign(document.createElement("button"), {
        className: "btn",
        innerText: lang['ee251fffae6371d31aa2d3f958b76353'] ?? 'Add new'
    });
    addBtn.onclick = () => addRow();

    const saveBtn = Object.assign(document.createElement("button"), {
        className: "btn btn-confirm",
        innerText: lang['c9cc8cce247e49bae79f15173ce97354'] ?? 'Save Changes'
    });

    saveBtn.onclick = () => {
        const newItems = [];
        document.querySelectorAll('#nav_editor_body tr').forEach(tr => {
            const name = tr.querySelector('.nav-name').value;
            if (name.trim()) {
                newItems.push({
                    name: name,
                    href: tr.querySelector('.nav-href').value,
                    img: tr.querySelector('.nav-img').value
                });
            }
        });

        // Save data to LocalStorage and refresh page
        localStorage.setItem('nav_shortcuts', JSON.stringify(newItems));
        partialReload();
    };

    footer.append(addBtn, saveBtn);
    popupContent.appendChild(footer);

    // 7. Final Assembly
    popup.append(popupMenu, popupContent);
    popupHelper.appendChild(popup);
    document.body.appendChild(popupHelper);

    // Close when clicking the background overlay
    popupHelper.onclick = (e) => {
        if (e.target === popupHelper) { document.removeEventListener('keydown', escHandlerNav); popupHelper.remove(); }
    };

    // Close on ESC key
    const escHandlerNav = (e) => {
        if (e.key !== 'Escape') return;
        document.removeEventListener('keydown', escHandlerNav);
        popupHelper.remove();
    };
    document.addEventListener('keydown', escHandlerNav);

    // Load existing data into the table
    const savedData = JSON.parse(localStorage.getItem('nav_shortcuts') || "[]");
    if (savedData.length > 0) {
        savedData.forEach(item => addRow(item));
    } else {
        // Add one empty row by default if no data exists
        addRow();
    }
}

/**
 * Injects a custom navigation bar (Quickbar) into the game interface.
 */
function injectNavigationBar() {
    if (!settings_cookies.general?.['show__navigation_bar']) return;

    document.getElementById('quickbar_outer')?.remove();

    const villageId = game_data.village.id;
    const assetBase = _getNavAssetBase();

    // 1. Hardcoded Script Functions
    const scriptActions = {

    };

    // 2. Load User Links from LocalStorage
    const customShortcuts = JSON.parse(localStorage.getItem('nav_shortcuts') || "[]");

    // 3. Default Items (Used only if LocalStorage is empty)
    const defaultItems = [
        { name: "Main", img: "buildings/mid/main3.png", href: `/game.php?village=${villageId}&screen=main` },
        { name: "Train", img: "unit/att.png", href: `/game.php?village=${villageId}&screen=train` },
        { name: "Smith", img: "buildings/mid/smith2.png", href: `/game.php?village=${villageId}&screen=smith` }
    ];

    // 4. Merge Logic
    // Convert scripts into list items and combine with user items
    const scriptItems = Object.keys(scriptActions).map(key => ({
        name: key,
        img: scriptActions[key].img,
        actionKey: key
    }));

    const userItems = customShortcuts.length > 0 ? customShortcuts : defaultItems;
    const finalItems = [...userItems, ...scriptItems];

    // --- DOM Construction ---
    const tableHTML = `
        <table id="quickbar_outer" align="center" width="100%" cellspacing="0">
            <tbody>
                <tr><td>
                    <table id="quickbar_inner" style="border-collapse: collapse;" width="100%">
                        <tbody>
                            <tr class="topborder"><td class="left"></td><td class="main"></td><td class="right"></td></tr>
                            <tr>
                                <td class="left"></td>
                                <td id="quickbar_contents" class="main">
                                    <ul id="script_quickbar_ul" class="menu quickbar"></ul>
                                </td>
                                <td class="right" style="padding: 0 5px;">
                                    <img id="nav_edit_icon" src="graphic/plus.png" class="navbar-edit-icon" title="Edit Navigation Bar" style="cursor:pointer">
                                </td>
                            </tr>
                            <tr class="bottomborder"><td class="left"></td><td class="main"></td><td class="right"></td></tr>
                            <tr><td class="shadow" colspan="3"><div class="leftshadow"></div><div class="rightshadow"></div></td></tr>
                        </tbody>
                    </table>
                </td></tr>
            </tbody>
        </table>`;

    const target = document.querySelector('.newStyleOnly');
    if (!target) return;
    target.insertAdjacentHTML('afterend', tableHTML);

    // 5. Populate the UI
    const ul = document.getElementById('script_quickbar_ul');

    finalItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'quickbar_item';

        const link = Object.assign(document.createElement('a'), {
            className: 'quickbar_link',
            href: item.href || "#"
        });

        // Event Handling: If item has an actionKey, run the script instead of navigating
        if (item.actionKey && scriptActions[item.actionKey]) {
            link.onclick = (e) => {
                e.preventDefault();
                scriptActions[item.actionKey].run();
            };
        }

        const img = Object.assign(document.createElement('img'), {
            className: 'navbar-icon',
            src: item.img.startsWith('http') ? item.img : assetBase + item.img,
            style: "width: 18px; height: 18px; margin-right: 4px; vertical-align: middle;"
        });

        link.append(img, `${item.name}`);
        li.appendChild(link);
        ul.appendChild(li);
    });

    document.getElementById('nav_edit_icon').onclick = openNavEditorPopup;
}
