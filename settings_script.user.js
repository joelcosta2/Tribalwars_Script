

// Settings PopUp

function saveScriptSettings() {
    var allSettings = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < allSettings.length; i++) {
        if (typeof settings_cookies.general[allSettings[i].name] === 'object') {
            settings_cookies.general[allSettings[i].name].enabled = allSettings[i].checked;
        } else {
            settings_cookies.general[allSettings[i].name] = allSettings[i].checked;
        }
    }

    localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
    location.reload();
}

function displayWarningPopup(title, message, timeoutDuration = 5000) {
    return new Promise((resolve, reject) => {
        // Create the popup dynamically
        const popupDiv = document.createElement('div');
        popupDiv.classList.add('popup_style', 'borderimage', 'popup_box');
        popupDiv.style.width = '556px';
        popupDiv.style.position = 'absolute';
        popupDiv.style.opacity = '1';
        popupDiv.style.top = '50%';
        popupDiv.style.left = '50%';
        popupDiv.style.transform = 'translate(-50%, -70%)';
        popupDiv.style.display = 'block';

        const popupMenu = document.createElement('div');
        popupMenu.style.fontSize = "17px";
        popupMenu.style.fontWeight = "bold";
        
        const menuText = document.createElement('a');
        menuText.style.cursor = 'pointer';
        menuText.style.color = 'rgb(0 17 255)';
        menuText.innerText = title;
        
        popupMenu.appendChild(menuText);

        const popupContent = document.createElement('div');
        popupContent.className = 'popup_content';
        popupContent.style.height = 'auto';
        popupContent.style.overflowY = 'auto';
        popupContent.style.display = 'flex';
        popupContent.style.padding = '0';
        popupContent.style.paddingTop = '10px';
        
        const table = document.createElement('table');
        table.className = 'vis';
        table.style.width = '100%';
        
        const tbody = document.createElement('tbody');
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        const label = document.createElement('label');

        let countdown = timeoutDuration / 1000;
        label.innerText = message + ` It will continue in ${countdown} seconds.`;
        const interval = setInterval(() => {
            label.innerText = message + ` It will continue in ${countdown} seconds.`;
            countdown--;
            if (countdown < 0) {
                clearInterval(interval);
                label.innerText = "It will continue now!";
            }
        }, 1000);

        td1.appendChild(label);
        tr1.appendChild(td1);
        
        const tr2 = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.colSpan = 2;

        const continueButton = document.createElement('input');
        continueButton.type = 'submit';
        continueButton.value = 'Continue';
        continueButton.className = 'btn';
        continueButton.style.background = '#6bb000';
        continueButton.style.margin = '4px';
        continueButton.addEventListener('click', () => {
            clearTimeout(timeoutId);  // Clear the timeout
            resolve('continue');  // Resolve the promise with 'continue'
            togglePopup(popupDiv);  // Hide the popup
        });
        
        const cancelButton = document.createElement('input');
        cancelButton.type = 'button';
        cancelButton.value = 'Cancel';
        cancelButton.className = 'btn';
        cancelButton.style.background = '#d02c2c';
        cancelButton.style.margin = '4px';
        cancelButton.addEventListener('click', () => {
            clearTimeout(timeoutId);  // Clear the timeout
            resolve('cancel');  // Resolve the promise with 'cancel'
            togglePopup(popupDiv);  // Hide the popup
        });
        
        td2.appendChild(continueButton);
        td2.appendChild(cancelButton);
        tr2.appendChild(td2);

        tbody.appendChild(tr1);
        tbody.appendChild(tr2);
        table.appendChild(tbody);

        popupContent.appendChild(table);

        popupDiv.appendChild(popupMenu);
        popupDiv.appendChild(popupContent);

        document.body.appendChild(popupDiv);

        // Set a timeout for user choice
        const timeoutId = setTimeout(() => {
            resolve('timeout');  // Resolve the promise with 'timeout' after timeout
            togglePopup(popupDiv);  // Hide the popup after timeout
        }, timeoutDuration + 1000);
    });
}

function injectScriptSettingsButtom(maincell) {
    var questLogElem = document.getElementsByClassName('questlog');

    if (questLogElem) {
        var settingsPopupButton = document.createElement('div');
        settingsPopupButton.id = 'settings_popup_button';
        settingsPopupButton.onclick = function () {
            togglePopup(document.getElementById('settings_popup'));
        };

        var questIcon = document.createElement('div');
        questIcon.className = 'quest';
        questIcon.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/b56f49d7/graphic/icons/settings.png)';

        questIcon.onmouseover = function () {
            questIcon.style.opacity = '0.7'; // Reduz a opacidade ao passar o mouse
        };

        settingsPopupButton.appendChild(questIcon);
        questLogElem[0].appendChild(settingsPopupButton);
    } else {
        var settingsPopupButton = document.createElement('div');
        settingsPopupButton.id = 'settings_popup_button';
        settingsPopupButton.style.position = 'absolute';
        settingsPopupButton.style.top = '5px';
        settingsPopupButton.style.left = '-65px';
        settingsPopupButton.style.top = '39px';
        settingsPopupButton.onclick = function () {
            togglePopup(document.getElementById('settings_popup'));
        };

        var questIcon = document.createElement('div');
        questIcon.className = 'quest';
        questIcon.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/b56f49d7/graphic/icons/settings.png)';

        settingsPopupButton.appendChild(questIcon);
        maincell.children[0].appendChild(settingsPopupButton);
    }
}

function injectScriptSettingsPopUp() {
    var maincell = document.getElementsByClassName('maincell')[0];
    injectScriptSettingsButtom(maincell);

    var popupHelperDiv = document.createElement('div');
    var popupStyleDiv = createPopupContainer();
    var popupMenuDiv = createPopupHeader(popupStyleDiv);
    var tabNavDiv = createTabNavigation();

    var { tabButtons, tabContents } = createTabs(tabNavDiv);
    var saveButtonDiv = createSaveButton();

    popupStyleDiv.appendChild(popupMenuDiv);
    popupStyleDiv.appendChild(tabNavDiv);
    tabContents.forEach(content => popupStyleDiv.appendChild(content));
    popupStyleDiv.appendChild(saveButtonDiv);

    popupHelperDiv.appendChild(popupStyleDiv);
    document.body.appendChild(popupHelperDiv);
}

function createPopupContainer() {
    var popup = document.createElement('div');
    popup.classList.add('popup_style', 'borderimage', 'popup_box');
    popup.id = 'settings_popup';
    Object.assign(popup.style, {
        width: '700px',
        font: 'inherit',
        opacity: '1',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -70%)',
        display: 'none',
        padding: '10px',
        overflow: 'hidden'
    });
    return popup;
}

function createPopupHeader(popup) {
    var header = document.createElement('div');
    Object.assign(header.style, {
        fontSize: "17px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "5px"
    });
    header.textContent = 'Script Settings';

    var closeLink = document.createElement('a');
    closeLink.onclick = function () {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    };
    Object.assign(closeLink.style, {
        cursor: 'pointer',
        fontSize: "18px",
        fontWeight: "bold"
    });
    closeLink.textContent = 'X';

    header.appendChild(closeLink);
    return header;
}

function createTabNavigation() {
    var tabNav = document.createElement('div');
    tabNav.id = 'tabNav';
    Object.assign(tabNav.style, {
        display: 'flex',
        justifyContent: 'space-around'
    });
    return tabNav;
}

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

function createTabButton(groupName, index, tabButtons, tabContents) {
    var tabButton = document.createElement('button');
    tabButton.textContent = groupName;
    tabButton.id = `tabButton_${groupName.replace(/\s/g, "_")}`;
    Object.assign(tabButton.style, {
        padding: '0',
        border: 'none',
        cursor: 'pointer',
        background: index === 0 ? '#c1a264' : '#f4e4bc',
        border: index === 0 ? '1px solid #7d510f' : 'none',
        flex: '1'
    });

    tabButton.onclick = function () {
        tabButtons.forEach(btn => {
            btn.style.background = '#f4e4bc';
            btn.style.border = 'none';
        });

        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        tabButton.style.background = '#c1a264';
        tabButton.style.border = '1px solid #7d510f';

        let activeContent = document.getElementById(`tabContent_${groupName.replace(/\s/g, "_")}`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    };

    return tabButton;
}

function createTabContent(groupName, index) {
    var tabContent = document.createElement('div');
    tabContent.id = `tabContent_${groupName.replace(/\s/g, "_")}`;
    Object.assign(tabContent.style, {
        display: index === 0 ? 'block' : 'none',
        padding: '10px 0'
    });

    var tableElement = document.createElement('table');
    tableElement.classList.add('vis');
    tableElement.style.width = '100%';

    var settingsGroups = getSettingsGroups();

    availableSettings.forEach(function (setting) {
        if (settingsGroups[groupName].includes(setting.name)) {
            var row = tableElement.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);

            cell1.textContent = setting.label;
            var label = document.createElement('label');
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.name = setting.name;
            input.checked = typeof settings_cookies.general[setting.name] === 'object'
                ? settings_cookies.general[setting.name].enabled
                : settings_cookies.general[setting.name];

            var textDescription = document.createTextNode(setting.description);
            label.append(input, textDescription);
            cell2.appendChild(label);
        }
    });

    tabContent.appendChild(tableElement);
    return tabContent;
}

function createSaveButton() {
    var saveButtonDiv = document.createElement('div');
    saveButtonDiv.id = 'saveButtonDiv';
    Object.assign(saveButtonDiv.style, {
        textAlign: 'center',
        marginTop: '10px'
    });

    var saveButton = document.createElement('input');
    saveButton.type = 'submit';
    saveButton.value = 'Save Changes';
    saveButton.className = 'btn';
    Object.assign(saveButton.style, {
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer'
    });

    saveButton.onclick = function () {
        saveScriptSettings();
    };

    saveButtonDiv.appendChild(saveButton);
    return saveButtonDiv;
}

function getSettingsGroups() {
    return {
        "Widgets": ["show__village_list", "show__recruit_troops", "show__notepad", "show__building_queue", "show__building_queue_all"],
        "UI Enhancements": ["show__navigation_arrows", "show__navigation_bar", "show__overview_premmium_info", "show__time_storage_full_hover"],
        "Map Options": ["show__extra_options_map_hover"],
        "Automation": ["show__auto_scavenging", "show__auto_paladin_train"],
        "Other": ["keep_awake", "remove__premium_promo", "redirect__train_buildings"]
    };
}

