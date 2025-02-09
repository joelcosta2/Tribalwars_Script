

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

    // Criar o elemento <div> do popup_helper
    var popupHelperDiv = document.createElement('div');
    //popupHelperDiv.classList.add('popup_helper');

    // Criar o elemento <div> do popup_style
    var popupStyleDiv = document.createElement('div');
    popupStyleDiv.classList.add('popup_style', 'borderimage', 'popup_box');
    popupStyleDiv.id = 'settings_popup';
    popupStyleDiv.style.width = '700px';
    popupStyleDiv.style.opacity = '1';
    popupStyleDiv.style.position = 'absolute';
    popupStyleDiv.style.top = '50%';
    popupStyleDiv.style.left = '50%';
    popupStyleDiv.style.transform = 'translate(-50%, -70%)';
    popupStyleDiv.style.display = 'none';

    // Criar o elemento <div> do popup_menu
    var popupMenuDiv = document.createElement('div');
    popupMenuDiv.style.fontSize = "17px";
    popupMenuDiv.style.fontWeight = "bold";
    popupMenuDiv.textContent = 'Script Settings';

    // Criar o elemento <a> para fechar o popup
    var closeLink = document.createElement('a');
    closeLink.onclick = function () {
        var content = document.getElementById('settings_popup');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
    closeLink.textContent = 'X';
    closeLink.style.float = 'right';
    closeLink.style.cursor = 'pointer';

    // Adicionar o link de fechar ao menu popup
    popupMenuDiv.appendChild(closeLink);

    // Criar o elemento <div> do popup_content
    var popupContentDiv = document.createElement('div');
    popupContentDiv.classList.add('popup_content');
    popupContentDiv.style.height = 'auto';
    popupContentDiv.style.overflowY = 'auto';
    popupContentDiv.style.display = 'flex';
    popupContentDiv.style.padding = '0';
    popupContentDiv.style.paddingTop = '10px';

    // Criar a tabela dentro do conteúdo do popup
    var tableElement = document.createElement('table');
    tableElement.classList.add('vis');
    tableElement.style.width = '100%';
    var tableElement2 = document.createElement('table');
    tableElement2.classList.add('vis');
    tableElement2.style.width = '100%';


    //no max 9 por coluna, do lado direito tem de ter mais 1, e na ultima é um botao de salvar
    availableSettings.forEach(function (setting) {
        var row = tableElement.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.textContent = setting.label;
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.name = setting.name;
        if (typeof settings_cookies.general[setting.name] === 'object') {
            input.checked = settings_cookies.general[setting.name].enabled;
        } else {
            input.checked = settings_cookies.general[setting.name];
        }
        var textDescription = document.createTextNode(setting.description);
        label.append(input);
        label.append(textDescription);

        cell2.appendChild(label);
        //cell2.innerHTML = `<label><input type="checkbox" checked=${settings_cookies.general[setting.name]} name="${setting.name}">${setting.description}</label>`;
    });

    // Adicionar o botão de "Guardar alterações" no último <tr> da tabela
    var saveButtonRow = tableElement.insertRow();
    var saveButtonCell = saveButtonRow.insertCell(0);
    var inputButtonCell = document.createElement('input');
    inputButtonCell.type = 'submit';
    inputButtonCell.value = 'Save Changes';
    inputButtonCell.className = 'btn';
    inputButtonCell.style.margin = '4px';
    inputButtonCell.onclick = function () {
        saveScriptSettings();
    }

    saveButtonCell.colSpan = 2;
    saveButtonCell.appendChild(inputButtonCell);

    // Adicionar a tabela ao conteúdo do popup
    popupContentDiv.appendChild(tableElement);

    // Adicionar os elementos criados à hierarquia do DOM
    popupStyleDiv.appendChild(popupMenuDiv);
    popupStyleDiv.appendChild(popupContentDiv);
    popupHelperDiv.appendChild(popupStyleDiv);

    // Adicionar o popup_helper ao documento
    document.body.appendChild(popupHelperDiv);
}