

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
                alert(t('settings.invalidFile'));
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
 *   - Two-part name with extraSettings type=select              → stored as { enabled: value, source: value }
 *   - Simple name                                               → stored as boolean/number
 */
function saveScriptSettings() {
    var allSettings = document.querySelectorAll('input[type="checkbox"], input[type="number"], select');

    for (var i = 0; i < allSettings.length; i++) {
        var settingName = allSettings[i].name;
        var settingValue;
            if (allSettings[i].tagName === 'SELECT') {
            settingValue = allSettings[i].value;
        } else {
            settingValue = allSettings[i].type === "checkbox" ? allSettings[i].checked : parseInt(allSettings[i].value, 10);
        }

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
            // Simple boolean/number setting: e.g. "show__overview_premium_info"
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

    document.getElementById('settings_popup_button')?.remove();

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
        // overview_villages' wide multi-village table pushes the page into horizontal scroll,
        // stranding the quest log off-screen via its native left:-65px gutter trick.
        questLog.classList.toggle('questlog-pin-left', game_data.screen === 'overview_villages');
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
    document.getElementById('settings_popup_button')?.remove();
    document.getElementById('settings_popup')?.remove();
    document.querySelector('.script-settings-popup-wrapper')?.remove();

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
    // Sidebar tabs + content panels sit side by side below the header
    const body = document.createElement('div');
    body.classList.add('script-settings-body');
    body.appendChild(tabNavigation);
    tabContents.forEach(content => body.appendChild(content));

    container.append(header, body);
    container.appendChild(saveButton);

    // 4. Final injection into the DOM
    wrapper.classList.add('script-settings-popup-wrapper');
    wrapper.appendChild(container);
    document.body.appendChild(wrapper);

    // Close on ESC key
    $(document).off('keydown.script_settings_popup').on('keydown.script_settings_popup', function (e) {
        if (e.key !== 'Escape') return;
        const p = document.getElementById('settings_popup');
        if (p && p.style.display !== 'none') p.style.display = 'none';
    });

    // Close on click outside the settings popup
    $(document).off('mousedown.script_settings_popup').on('mousedown.script_settings_popup', function (e) {
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
    header.textContent = t('settings.title');

    const closeLink = document.createElement('a');
    closeLink.classList.add('script-popup-close');
    closeLink.textContent = t('button.close');

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
 * Creates the left sidebar tab navigation container.
 * Tabs are appended to this element by createTabs().
 */
function createTabNavigation() {
    var tabNav = document.createElement('div');
    tabNav.id = 'tabNav';
    tabNav.classList.add('script-tab-sidebar');
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

        // Select-type setting (e.g. language): plain dropdown, no checkbox/extraSettings
        if (setting.type === 'select') {
            const select = document.createElement('select');
            select.name = setting.name;
            (setting.options || []).forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt.value;
                optionEl.textContent = opt.label;
                if (settings_cookies.general[setting.name] === opt.value) optionEl.selected = true;
                select.appendChild(optionEl);
            });

            const description = document.createElement('small');
            description.style.cssText = 'display:block;color:#555;margin-top:2px;';
            description.textContent = setting.description;

            cellInput.append(select, description);
            cellInput.classList.add('settings-input-cell');
            return;
        }

        if (setting.type === 'section') {
            const description = document.createElement('small');
            description.style.cssText = 'display:block;color:#555;margin-top:2px;';
            description.textContent = setting.description;

            cellInput.appendChild(description);
            cellInput.classList.add('settings-input-cell');
        } else {
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
        }

        // 2. Handle Extra Settings (Sub-rows)
        if (setting.extraSettings) {
            Object.keys(setting.extraSettings).forEach(extraKey => {
                const extraData = setting.extraSettings[extraKey];
                const extraRow = table.insertRow();
                extraRow.classList.add('extra-setting-row');

                const exCell1 = extraRow.insertCell(0);
                const exCell2 = extraRow.insertCell(1);

                exCell1.textContent = extraData.label;

                if (extraData.desc) {
                    const extraDescription = document.createElement('small');
                    extraDescription.style.cssText = 'display:block;color:#555;margin-top:2px;';
                    extraDescription.textContent = extraData.desc;
                    exCell1.appendChild(extraDescription);
                }

                if (extraData.type === 'select') {
                    const extraSelect = document.createElement('select');
                    extraSelect.name = `${setting.name}__${extraKey}`;
                    (extraData.options || []).forEach(opt => {
                        const optionEl = document.createElement('option');
                        optionEl.value = opt.value;
                        optionEl.textContent = opt.label;
                        if ((settings_cookies.general[setting.name]?.[extraKey] ?? extraData.default) === opt.value) optionEl.selected = true;
                        extraSelect.appendChild(optionEl);
                    });
                    exCell2.appendChild(extraSelect);
                } else {
                    const extraInput = Object.assign(document.createElement('input'), {
                        type: extraData.type,
                        name: `${setting.name}__${extraKey}`,
                        value: settings_cookies.general[setting.name]?.[extraKey] ?? extraData.default
                    });

                    exCell2.appendChild(extraInput);
                }
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
        value: t('button.saveChanges'),
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
        value: t('button.export'),
        className: 'btn'
    });
    exportButton.onclick = () => exportSettings();

    const importButton = Object.assign(document.createElement('input'), {
        type: 'button',
        value: t('button.import'),
        className: 'btn'
    });
    importButton.onclick = () => importSettings();

    saveButtonDiv.append(saveButton, exportButton, importButton);
    return saveButtonDiv;
}

var availableSettings = [
    // Overview Widgets
    { "name": "show__village_list", "label": t('settings.villageListLabel'), "description": t('settings.villageListDesc'), "group": t('settings.groupWidgets') },
    { "name": "show__recruit_troops", "label": t('settings.recruitTroopsLabel'), "description": t('settings.recruitTroopsDesc'), "group": t('settings.groupWidgets') },
    { "name": "show__notepad", "label": t('settings.notepadLabel'), "description": t('settings.notepadDesc'), "group": t('settings.groupWidgets') },
    { "name": "show__building_queue", "label": t('settings.buildingQueueLabel'), "description": t('settings.buildingQueueDesc'), "group": t('settings.groupWidgets') },
    { "name": "show__building_queue_all", "label": t('settings.buildingQueueAllLabel'), "description": t('settings.buildingQueueAllDesc'), "group": t('settings.groupWidgets') },

    // Overview Villages Premium Features
    { "name": "show__overview_villages_queue", "label": t('settings.overviewVillagesQueueLabel'), "description": t('settings.overviewVillagesQueueDesc'), "group": t('settings.groupOverviewVillages') },
    { "name": "show__overview_villages_troops", "label": t('settings.overviewVillagesTroopsLabel'), "description": t('settings.overviewVillagesTroopsDesc'), "group": t('settings.groupOverviewVillages') },
    {
        "name": "show__overview_villages_quicklinks",
        "label": t('settings.overviewVillagesQuicklinksLabel'),
        "description": t('settings.overviewVillagesQuicklinksDesc'),
        "group": t('settings.groupOverviewVillages'),
        "extraSettings": {
            "source": {
                "label": t('settings.overviewVillagesQuicklinksSourceLabel'),
                "type": "select",
                "default": "navbar",
                "options": [
                    { "value": "navbar", "label": t('settings.overviewVillagesQuicklinksSourceNavbar') },
                    { "value": "custom", "label": t('settings.overviewVillagesQuicklinksSourceCustom') + '- NOT IMPLEMENTED' }
                ]
            }
        }
    },

    // Map Enhancements
    { "name": "show__extra_options_map_hover", "label": t('settings.mapHoverLabel'), "description": t('settings.mapHoverDesc'), "group": t('settings.groupMap') },
    //adicionar opçoes para cada tipo
    //morale, last saque, last ressources, troops time,
    { "name": "show__outgoingInfo_map", "label": t('settings.mapCommandOverlayLabel'), "description": t('settings.mapCommandOverlayDesc'), "group": t('settings.groupMap') },
    { "name": "show__heatmap_reports", "label": t('settings.heatmapReportsLabel'), "description": t('settings.heatmapReportsDesc'), "group": t('settings.groupMap') },
    { "name": "show__ctx_attack_buttons", "label": t('settings.ctxAttackButtonsLabel'), "description": t('settings.ctxAttackButtonsDesc'), "group": t('settings.groupMap') },

    // UI / Premium Features
    { "name": "show__navigation_arrows", "label": t('settings.navigationArrowsLabel'), "description": t('settings.navigationArrowsDesc'), "group": t('settings.groupUiUx') },
    { "name": "show__overview_premium_info", "label": t('settings.visualBuildingOverviewLabel'), "description": t('settings.visualBuildingOverviewDesc'), "group": t('settings.groupUiUx') },
    //hide because not finished yet
    //{ "name": "show__soft_dark_mode", "label": t('settings.softDarkModeLabel'), "description": t('settings.softDarkModeDesc'), "group": t('settings.groupUiUx') },
    { "name": "show__navigation_bar", "label": t('settings.navigationBarLabel'), "description": t('settings.navigationBarDesc'), "group": t('settings.groupUiUx') },
    { "name": "show__time_storage_full_hover", "label": t('settings.storageTimerLabel'), "description": t('settings.storageTimerDesc'), "group": t('settings.groupUiUx') },
    { "name": "show__player_profile_stats", "label": t('settings.playerProfileStatsLabel'), "description": t('settings.playerProfileStatsDesc'), "group": t('settings.groupUiUx') },
    {
        "name": "language", "label": t('settings.language'), "description": t('settings.languageDesc'), "type": "select", "group": t('settings.groupUiUx'),
        "options": [
            { "value": "en", "label": "English" },
            { "value": "pt", "label": "Portugu\u00eas" }
        ]
    },

    // Automation
    { "name": "show__auto_daily_bonus", "label": t('settings.autoDailyBonusLabel'), "description": t('settings.autoDailyBonusDesc'), "group": t('settings.groupAutomation') },
    { "name": "show__auto_build_instant_free", "label": t('settings.autoBuildInstantFreeLabel'), "description": t('settings.autoBuildInstantFreeDesc'), "group": t('settings.groupAutomation') },
    {
        "name": "show__auto_paladin_train", "label": t('settings.autoPaladinTrainLabel'), "description": t('settings.autoPaladinTrainDesc') + ' - ONLY WITH 1 VILLAGE', "group": t('settings.groupAutomation'),
        "extraSettings": {
            "maxLevel": { "label": t('settings.autoPaladinTrainLevelLabel'), "type": "number", "default": 30 },
        }
    },

    // Anti-Bot Protection settings
    { "name": "antiBot__disableOnDetection", "label": t('settings.antibot.disableOnDetection.label'), "description": t('settings.antibot.disableOnDetection.desc'), "group": t('settings.groupAntiBot') },
    { "name": "antiBot__offlineMode", "label": t('settings.antibot.offlineMode.label'), "description": t('settings.antibot.offlineMode.desc') + '- NOT IMPLEMENTED', "group": t('settings.groupAntiBot') },
    {
        "name": "antiBot__cacheIntervals", "label": t('settings.antibot.cache.label'), "description": t('settings.antibot.cache.desc') + '- NOT IMPLEMENTED', "group": t('settings.groupAntiBot'),
        "type": "section",
        "extraSettings": {
            "overviewMain": { "label": t('settings.antibot.cache.overviewMain.label'), "desc": t('settings.antibot.cache.overviewMain.desc'), "type": "number", "default": 1 },
            "overviewTroops": { "label": t('settings.antibot.cache.overviewTroops.label'), "desc": t('settings.antibot.cache.overviewTroops.desc'), "type": "number", "default": 1 }
        }
    },

    // General / Utility
    { "name": "keep_awake", "label": t('settings.keepAwakeLabel'), "description": t('settings.keepAwakeDesc'), "group": t('settings.groupGeneral') },
    { "name": "redirect__train_buildings", "label": t('settings.redirectTrainBuildingsLabel'), "description": t('settings.redirectTrainBuildingsDesc'), "group": t('settings.groupGeneral') },
    { "name": "remove__premium_promo", "label": t('settings.hidePremiumAdsLabel'), "description": t('settings.hidePremiumAdsDesc'), "group": t('settings.groupGeneral') }
];

/**
 * Fixed tab display order; each setting declares its own group via availableSettings[].group.
 */
var SETTINGS_GROUPS_ORDER = [
    t('settings.groupWidgets'),
    t('settings.groupOverviewVillages'),
    t('settings.groupMap'),
    t('settings.groupUiUx'),
    t('settings.groupAutomation'),
    t('settings.groupAntiBot'),
    t('settings.groupGeneral')
];

/**
 * Groups setting names into categories for tabbed navigation, derived from
 * each setting's own `group` field so membership only needs to be declared once.
 * Each key represents a tab name in the settings popup.
 */
function getSettingsGroups() {
    var groups = {};
    SETTINGS_GROUPS_ORDER.forEach(groupName => groups[groupName] = []);

    availableSettings.forEach(setting => {
        if (!groups[setting.group]) groups[setting.group] = [];
        groups[setting.group].push(setting.name);
    });

    return groups;
}

