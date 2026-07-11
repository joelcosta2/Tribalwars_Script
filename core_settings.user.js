

/**
 * Serialises the current settings_cookies object to JSON and triggers a browser download.
 */
function exportSettings() {
    const data = JSON.stringify(settings_cookies, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tw_script_settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Opens a file picker for a JSON file, validates its structure,
 * writes it to localStorage as settings_cookies, and reloads the page.
 */
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (typeof imported !== 'object' || !imported.general || !imported.widgets) {
                    throw new Error('Invalid structure');
                }
                localStorage.setItem('settings_cookies', JSON.stringify(imported));
                location.reload();
            } catch (_e) {
                alert('Invalid settings file.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

/**
 * Reads all checkbox and number inputs from the settings popup and writes their
 * values back into settings_cookies, then persists to localStorage and reloads.
 * Handles three storage shapes:
 *   - Three-part name (e.g. show__auto_paladin_train__maxLevel) → nested object key
 *   - Two-part name with extraSettings                          → stored as { enabled: value }
 *   - Simple name                                               → stored as boolean/number
 */
function saveScriptSettings() {
    var allSettings = document.querySelectorAll('input[type="checkbox"], input[type="number"]');

    for (var i = 0; i < allSettings.length; i++) {
        var settingName = allSettings[i].name;
        var settingValue = allSettings[i].type === "checkbox" ? allSettings[i].checked : parseInt(allSettings[i].value, 10);

        var parts = settingName.split("__");

        // Check if the setting has extra sub-settings
        var settingConfig = availableSettings.find(s => s.name === parts[0] + (parts[1] ? "__" + parts[1] : ""));
        var hasExtraSettings = settingConfig && settingConfig.extraSettings;

        if (parts.length === 3) {
            // Three-part key: e.g. show__auto_paladin_train__maxLevel
            var parentKey = parts.slice(0, -1).join("__");
            var childKey = parts[2];

            if (!settings_cookies.general[parentKey] || typeof settings_cookies.general[parentKey] !== "object") {
                settings_cookies.general[parentKey] = {};
            }

            settings_cookies.general[parentKey][childKey] = settingValue;

        } else if (hasExtraSettings) {
            // Two-part key with extra settings: save the top-level checkbox as "enabled"
            if (!settings_cookies.general[settingName] || typeof settings_cookies.general[settingName] !== "object") {
                settings_cookies.general[settingName] = {};
            }
            settings_cookies.general[settingName]["enabled"] = settingValue;
        } else {
            // Simple boolean/number setting: e.g. "show__overview_premmium_info"
            settings_cookies.general[settingName] = settingValue;
        }
    }

    // Remove any empty or undefined keys that may have been created in error
    Object.keys(settings_cookies.general).forEach(key => {
        if (key === "" || settings_cookies.general[key] === undefined) {
            delete settings_cookies.general[key];
        }
    });

    // Persist the full settings object to localStorage, then reload
    localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
    location.reload();
}

/**
 * Injects the script settings button into the UI.
 * Priority: QuestLog > MainCell Absolute Position.
 * @param {HTMLElement} maincell - The game's main content container.
 */
function injectScriptSettingsButtom(maincell) {
    const questLog = document.querySelector('.questlog');

    // Create the button container
    const btn = document.createElement('div');
    btn.id = 'settings_popup_button';
    btn.classList.add('script-settings-btn');

    // Create the icon (using game class 'quest' + our custom class)
    const icon = document.createElement('div');
    icon.className = 'quest script-settings-icon';
    btn.appendChild(icon);

    // Single click handler
    btn.onclick = () => {
        const popup = document.getElementById('settings_popup');
        if (typeof togglePopup === 'function') {
            togglePopup(popup);
        }
    };

    if (questLog) {
        // Option A: Inside the quest log (standard layout)
        questLog.appendChild(btn);
    } else if (maincell?.children[0]) {
        // Option B: Absolute positioning (fallback layout)
        btn.classList.add('script-settings-btn-fixed');
        maincell.children[0].appendChild(btn);
    }
}

/**
 * Injects the settings popup by assembling components from helper functions.
 */
function injectScriptSettingsPopUp() {
    // 1. Initialize the entry button
    const maincell = document.getElementsByClassName('maincell')[0];
    if (maincell) {
        injectScriptSettingsButtom(maincell);
    }

    // 2. Create UI components
    const wrapper = document.createElement('div');
    const container = createPopupContainer();
    const header = createPopupHeader(container);
    const tabNavigation = createTabNavigation();

    // Deconstruct tab data
    const { tabContents } = createTabs(tabNavigation);
    const saveButton = createSaveButton();

    // 3. Assemble the hierarchy
    // Append header and navigation first
    container.append(header, tabNavigation);

    // Append all content areas
    tabContents.forEach(content => container.appendChild(content));

    // Append the final save button
    container.appendChild(saveButton);

    // 4. Final injection into the DOM
    wrapper.appendChild(container);
    document.body.appendChild(wrapper);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const p = document.getElementById('settings_popup');
        if (p && p.style.display !== 'none') p.style.display = 'none';
    });

    // Close on click outside the settings popup
    document.addEventListener('mousedown', (e) => {
        const p = document.getElementById('settings_popup');
        if (!p || p.style.display === 'none') return;
        if (!p.contains(e.target) && !e.target.closest('#settings_popup_button')) p.style.display = 'none';
    });
}

/**
 * Creates the main container for the settings popup.
 * Appearance and positioning are handled via CSS classes.
 */
function createPopupContainer() {
    const popup = document.createElement('div');

    // TribalWars native classes + our custom class
    popup.classList.add('popup_style', 'borderimage', 'popup_box', 'script-settings-popup');

    popup.id = 'settings_popup';

    return popup;
}

/**
 * Creates the header for the settings popup with a title and close button.
 * @param {HTMLElement} popup - The parent popup element to toggle.
 */
function createPopupHeader(popup) {
    const header = document.createElement('div');
    header.classList.add('script-popup-header');
    header.textContent = 'Script Settings';

    const closeLink = document.createElement('a');
    closeLink.classList.add('script-popup-close');
    closeLink.textContent = 'X';

    // Toggle logic: Switches between 'none' and 'block'
    closeLink.onclick = (e) => {
        e.preventDefault();
        const isHidden = popup.style.display === 'none';
        popup.style.display = isHidden ? 'block' : 'none';
    };

    header.appendChild(closeLink);
    return header;
}

/**
 * Creates the horizontal tab navigation bar container.
 * Tabs are appended to this element by createTabs().
 */
function createTabNavigation() {
    var tabNav = document.createElement('div');
    tabNav.id = 'tabNav';
    Object.assign(tabNav.style, {
        display: 'flex',
        justifyContent: 'space-around'
    });
    return tabNav;
}

/**
 * Creates all tab buttons and their corresponding content areas from the settings groups,
 * appends the buttons to tabNav, and returns both arrays for cross-reference.
 * @param {HTMLElement} tabNav - The navigation container to append tab buttons to.
 * @returns {{ tabButtons: HTMLElement[], tabContents: HTMLElement[] }}
 */
function createTabs(tabNav) {
    var tabButtons = [];
    var tabContents = [];

    var settingsGroups = getSettingsGroups();

    Object.keys(settingsGroups).forEach((groupName, index) => {
        var tabButton = createTabButton(groupName, index, tabButtons, tabContents);
        var tabContent = createTabContent(groupName, index);

        tabButtons.push(tabButton);
        tabContents.push(tabContent);

        tabNav.appendChild(tabButton);
    });

    return { tabButtons, tabContents };
}

/**
 * Creates an individual tab button.
 * @param {string} groupName - The label for the tab.
 * @param {number} index - The index of the tab (0 for default active).
 * @param {Array} tabButtons - Array of all buttons for state management.
 * @param {Array} tabContents - Array of all content divs for state management.
 */
function createTabButton(groupName, index, tabButtons, tabContents) {
    const tabButton = document.createElement('button');
    const safeId = groupName.replace(/\s/g, "_");

    tabButton.textContent = groupName;
    tabButton.id = `tabButton_${safeId}`;
    tabButton.classList.add('script-tab-btn');

    // Set initial state
    if (index === 0) {
        tabButton.classList.add('active');
    }

    tabButton.onclick = () => {
        // 1. Reset all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 2. Set current button to active
        tabButton.classList.add('active');

        // 3. Find and show corresponding content
        const activeContent = document.getElementById(`tabContent_${safeId}`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    };

    return tabButton;
}

/**
 * Creates the content area for a specific tab, including setting rows.
 */
function createTabContent(groupName, index) {
    const safeId = groupName.replace(/\s/g, "_");
    const tabContent = document.createElement('div');
    tabContent.id = `tabContent_${safeId}`;
    tabContent.classList.add('script-tab-content');

    // Initial visibility state based on index
    if (index === 0) tabContent.classList.add('active');

    const table = document.createElement('table');
    table.classList.add('vis', 'settings-table');

    const settingsGroups = getSettingsGroups();
    const currentGroup = settingsGroups[groupName] || [];

    // Filter and build rows
    availableSettings.forEach(setting => {
        if (!currentGroup.includes(setting.name)) return;

        // 1. Create Main Setting Row
        const row = table.insertRow();
        const cellLabel = row.insertCell(0);
        const cellInput = row.insertCell(1);

        cellLabel.classList.add('settings-label-cell');
        cellLabel.textContent = setting.label;

        const labelWrapper = document.createElement('label');
        const checkbox = Object.assign(document.createElement('input'), {
            type: 'checkbox',
            name: setting.name,
            checked: typeof settings_cookies.general[setting.name] === 'object'
                ? settings_cookies.general[setting.name].enabled
                : !!settings_cookies.general[setting.name]
        });

        labelWrapper.append(checkbox, document.createTextNode(` ${setting.description}`));
        cellInput.appendChild(labelWrapper);
        cellInput.classList.add('settings-input-cell');

        // 2. Handle Extra Settings (Sub-rows)
        if (setting.extraSettings) {
            Object.keys(setting.extraSettings).forEach(extraKey => {
                const extraData = setting.extraSettings[extraKey];
                const extraRow = table.insertRow();
                extraRow.classList.add('extra-setting-row');

                const exCell1 = extraRow.insertCell(0);
                const exCell2 = extraRow.insertCell(1);

                exCell1.textContent = extraData.label;

                const extraInput = Object.assign(document.createElement('input'), {
                    type: extraData.type,
                    name: `${setting.name}__${extraKey}`,
                    value: settings_cookies.general[setting.name]?.[extraKey] ?? extraData.default
                });

                exCell2.appendChild(extraInput);
            });
        }
    });

    tabContent.appendChild(table);
    return tabContent;
}

/**
 * Creates the Save button container and the submit input.
 * Styling is managed via the #saveButtonDiv and .btn-save-settings classes.
 */
function createSaveButton() {
    const saveButtonDiv = document.createElement('div');
    saveButtonDiv.id = 'saveButtonDiv';

    const saveButton = Object.assign(document.createElement('input'), {
        type: 'submit',
        value: 'Save Changes',
        className: 'btn btn-save-settings'
    });
    saveButton.onclick = (e) => {
        e.preventDefault();
        if (typeof saveScriptSettings === 'function') {
            saveScriptSettings();
        }
    };

    const exportButton = Object.assign(document.createElement('input'), {
        type: 'button',
        value: 'Export',
        className: 'btn'
    });
    exportButton.onclick = () => exportSettings();

    const importButton = Object.assign(document.createElement('input'), {
        type: 'button',
        value: 'Import',
        className: 'btn'
    });
    importButton.onclick = () => importSettings();

    saveButtonDiv.append(saveButton, exportButton, importButton);
    return saveButtonDiv;
}

var availableSettings = [
    // General / Utility
    { "name": "keep_awake", "label": "Keep Awake", "description": "Automatically refreshes the page after 5 minutes of inactivity to prevent timeout." },
    { "name": "redirect__train_buildings", "label": "Smart Training Redirect", "description": "Directly opens the recruitment screen when clicking on training-related buildings." },
    { "name": "show__navigation_arrows", "label": "Village Navigation Arrows", "description": "Adds arrows to the UI for faster switching between your villages." },

    // Overview Widgets
    { "name": "show__village_list", "label": "Village List Widget", "description": "Displays a quick-access list of your villages on the overview screen." },
    { "name": "show__recruit_troops", "label": "Recruitment Widget", "description": "Enables a troop recruitment panel on the overview page (Experimental)." },
    { "name": "show__notepad", "label": "Village Notepad", "description": "Adds a village-specific notepad for personalized notes and reminders." },
    { "name": "show__building_queue", "label": "Construction Manager", "description": "Manage your building queue and upgrades directly from the overview screen." },
    { "name": "show__building_queue_all", "label": "Enhanced Queue Info", "description": "Shows all potential upgrades, including those limited by resources. Supports local fake queues." },
    { "name": "show__resource_dashboard", "label": "Resource Dashboard", "description": "Displays last known wood/stone/iron for all visited villages." },

    // Map Enhancements
    { "name": "show__extra_options_map_hover", "label": "Advanced Map Hover", "description": "Reveals detailed village information when hovering over the map." },
    { "name": "show__outgoingInfo_map", "label": "Map Command Overlay", "description": "Displays outgoing command icons directly on the map." },
    { "name": "show__heatmap_reports", "label": "Attack Heat-Map", "description": "Overlays a colour-coded heat-map on the map based on attack reports. Intensity reflects frequency and recency." },
    { "name": "show__ctx_attack_buttons", "label": "Map CTX Attack Buttons", "description": "Shows quick-send attack buttons in the map context menu based on your troop templates. Clicking a village opens template buttons for instant attacks." },
    // UI / Premium Features
    { "name": "show__overview_premmium_info", "label": "Visual Building Overview", "description": "Provides a graphical overview of building levels, similar to Premium Account features." },
    { "name": "show__navigation_bar", "label": "Custom Navigation Bar", "description": "The customizable quick access bar appears at the top of the screen and allows you to speed up your gaming experience. Navigate anywhere or run a script with just one click!" },
    { "name": "show__time_storage_full_hover", "label": "Storage Timer", "description": "Shows the time remaining until your storage is full when hovering over resources." },

    // Automation
    {
        "name": "show__auto_paladin_train", "label": "Auto-Paladin Trainer", "description": "Automatically manages paladin training tasks. (Requires active browser tab).",
        "extraSettings": {
            "maxLevel": { "label": "Train until level:", "type": "number", "default": 30 },
        }
    },
    { "name": "show__auto_daily_bonus", "label": "Auto Daily Bonus", "description": "Automatically collects the daily login bonus whenever available. Schedules itself for the next day after collecting." },
    { "name": "show__auto_build_instant_free", "label": "Auto Build Instant Free", "description": "Automatically completes the active building upgrade for free when the 3-minute free window opens." },

    // Cleanup
    { "name": "remove__premium_promo", "label": "Hide Premium Ads", "description": "Removes all premium promotional banners and intrusive advertisements from the interface." }
];

/**
 * Groups setting names into categories for tabbed navigation.
 * Each key represents a tab name in the settings popup.
 */
function getSettingsGroups() {
    return {
        "Widgets": [
            "show__village_list",
            "show__recruit_troops",
            "show__notepad",
            "show__building_queue",
            "show__building_queue_all",
            "show__resource_dashboard"
        ],
        "Map": [
            "show__extra_options_map_hover",
            "show__outgoingInfo_map",
            "show__heatmap_reports",
            "show__ctx_attack_buttons"
        ],
        "UI & UX": [
            "show__navigation_arrows",
            "show__time_storage_full_hover",
            "show__overview_premmium_info",
            "show__navigation_bar"
        ],
        "Automation": [
            "show__auto_paladin_train",
            "show__auto_daily_bonus",
            "show__auto_build_instant_free"
        ],
        "General": [
            "keep_awake",
            "redirect__train_buildings",
            "remove__premium_promo"
        ]
    };
}

