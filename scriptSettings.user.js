

// Settings PopUp

function saveScriptSettings() {
    var allSettings = document.querySelectorAll('input[type="checkbox"]');

    for (var i = 0; i < allSettings.length; i++) {
        settings_cookies.general[allSettings[i].name] = allSettings[i].checked;
    }

    localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
    location.reload();
}

function injectScriptSettingsPopUp() {
    var maincell = document.getElementsByClassName('maincell')[0];

    injectScriptSettingsButtom(maincell);

    // Criar o elemento <div> do popup_helper
    var popupHelperDiv = document.createElement('div');
    popupHelperDiv.classList.add('popup_helper');

    // Criar o elemento <div> do popup_style
    var popupStyleDiv = document.createElement('div');
    popupStyleDiv.classList.add('popup_style', 'ui-draggable', 'settings-popup');
    popupStyleDiv.style.width = '700px';
    popupStyleDiv.style.position = 'fixed';
    popupStyleDiv.style.top = '59px';
    popupStyleDiv.style.left = '322px';
    popupStyleDiv.style.display = 'none';

    // Criar o elemento <div> do popup_menu
    var popupMenuDiv = document.createElement('div');
    popupMenuDiv.classList.add('popup_menu', 'ui-draggable-handle');
    popupMenuDiv.id = 'unit_popup_spear_menu';
    popupMenuDiv.textContent = 'Script Settings';

    // Criar o elemento <a> para fechar o popup
    var closeLink = document.createElement('a');
    closeLink.onclick = function () {
        var content = document.getElementsByClassName('settings-popup')[0]
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
    closeLink.textContent = 'X';
    closeLink.style.cursor = 'pointer';

    // Adicionar o link de fechar ao menu popup
    popupMenuDiv.appendChild(closeLink);

    // Criar o elemento <div> do popup_content
    var popupContentDiv = document.createElement('div');
    popupContentDiv.classList.add('popup_content');
    popupContentDiv.style.height = 'auto';
    popupContentDiv.style.overflowY = 'auto';
    popupContentDiv.style.display = 'flex';

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
        input.checked = settings_cookies.general[setting.name];
        input.name = setting.name;
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

function injectScriptSettingsButtom(maincell) {

    var settingsPopupButton = document.createElement('div');
    settingsPopupButton.id = 'settings_popup_button';
    settingsPopupButton.style.position = 'absolute';
    settingsPopupButton.style.top = '5px';
    settingsPopupButton.style.left = '-65px';
    settingsPopupButton.style.top = '39px';
    settingsPopupButton.onclick = function () {
        var settingsPopup = document.getElementsByClassName('settings-popup')[0];
        if (settingsPopup.style.display === 'none') {
            settingsPopup.style.display = 'block';
        } else {
            settingsPopup.style.display = 'none';
        }
    };

    var questIcon = document.createElement('div');
    questIcon.className = 'quest';
    questIcon.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/b56f49d7/graphic/icons/settings.png)';

    settingsPopupButton.appendChild(questIcon);
    maincell.children[0].appendChild(settingsPopupButton);

}