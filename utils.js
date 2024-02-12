(function () {
    'use strict';

    //Utils
    function setCookieCurrentVillage() {
        var str = currentURL;
        var temp = str.indexOf("="),
            temp2 = str.indexOf("&", temp),
            villageID = str.slice(temp + 1, temp2);

        var i = 0,
            villgersNum = sizeOfObject(villageList);

        for (i = 0; i < villgersNum; i++) {
            var urlTemp = villageList[i].url;
            if (urlTemp.includes(villageID)) {
                currentVillageIndex = i;
                setCookie('current_village', currentVillageIndex, 1000000000000);
                return;
            }
        }
    }

    function toggleElement(element) {
        var elementToToggle = document.getElementById(element);
        if (elementToToggle) {
            if (elementToToggle.style.display === 'none') {
                elementToToggle.style.display = 'contents';
            } else {
                elementToToggle.style.display = 'none';
            }
        }
    }

    function togglePopUp(className) {
        var elementToToggle = document.getElementsByClassName(className)[0];
        if (elementToToggle.style.display === 'none') {
            elementToToggle.style.display = 'block';
        } else {
            elementToToggle.style.display = 'none';
        }
    }

    function listenTextAreas() {
        // get all inputs || textareas
        var textAreas = document.getElementsByTagName('textarea');
        var i = 0;
        for (i = 0; i < textAreas.length; i++) {
            textAreas[i].onfocus = function () { textSelected = true };
            textAreas[i].onblur = function () { textSelected = false };
        }
        textAreas = document.getElementsByTagName('input');
        for (i = 0; i < textAreas.length; i++) {
            textAreas[i].onfocus = function () { textSelected = true };
            textAreas[i].onblur = function () { textSelected = false };
        }
    }

    function defineKeyboardShortcuts() {
        if (usarAtalhosTrocarAldeias) {
            $(document).keydown(function (evt) {
                if (evt.keyCode == 65 && !textSelected) {
                    evt.preventDefault();
                    previousVillage();
                }
            });
            $(document).keydown(function (evt) {
                if (evt.keyCode == 68 && !textSelected) {
                    evt.preventDefault();
                    nextVillage();
                }
            });
        }
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function sizeOfObject(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }

    function createAssetElement(title, contents, columnToUse, extra_name) {
        var columnElement = document.getElementById(columnToUse);
        var elemId = title.toLowerCase().replace(/ /g, '_'); // Obtém o título do elemento
        var elemName = extra_name ? elemId + '_' + extra_name : elemId;

        // Create a container div
        var containerDiv = document.createElement('div');
        containerDiv.id = 'show_' + elemName;
        containerDiv.className = 'vis moveable widget';

        // Create the header with button
        var header = document.createElement('h4');
        header.className = 'head with-button';
        header.textContent = title;
        header.style.minWidth = 'max-content';
        header.style.width = '-webkit-fill-available';
        header.style.cursor = 'pointer';
        header.onclick = function () {
            var content = document.getElementById('widget_content_' + elemName);
            var miniElem = document.getElementById('mini_' + elemName);
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            if (miniElem.src.includes('minus')) {
                miniElem.src = miniElem.src.replace('minus', 'plus');
                // Encontra o objeto correspondente no array de assets e atualiza o valor de 'open' para false
                settings_cookies.assets.find(asset => asset.name === elemId).open = false;
            } else {
                miniElem.src = miniElem.src.replace('plus', 'minus');
                // Encontra o objeto correspondente no array de assets e atualiza o valor de 'open' para true
                settings_cookies.assets.find(asset => asset.name === elemId).open = true;
            }

            setCookie('settings_cookies', JSON.stringify(settings_cookies), 100000000);
        };


        // Create the image for the button
        var buttonImg = document.createElement('img');
        buttonImg.className = 'widget-button';
        buttonImg.src = settings_cookies.assets.find(asset => asset.name === elemId).open ? 'graphic/minus.png' : 'graphic/plus.png';
        buttonImg.id = 'mini_' + elemName;
        header.appendChild(buttonImg);

        var contentDiv = document.createElement('div');
        contentDiv.id = 'widget_content_' + elemName;
        contentDiv.style.display = settings_cookies.assets.find(asset => asset.name === elemId).open ? 'block' : 'none';
        contentDiv.appendChild(contents);
        containerDiv.appendChild(header);
        containerDiv.appendChild(contentDiv);

        var assetIndex = settings_cookies.assets.find(asset => asset.name === elemId).pos;
        var children = columnElement.childNodes;
        // Verifica se o índice fornecido é válido
        if (assetIndex >= 0 && assetIndex <= children.length) {
            var refChild = (assetIndex + 1 === children.length) ? null : children[assetIndex + 1];
            columnElement.insertBefore(containerDiv, refChild);
        } else {
            columnElement.appendChild(containerDiv);
        }

        //columnElement.appendChild(containerDiv);
    }

    function saveColumnOrder() {
        var childDivs = Array.from(document.getElementById('script_column').children);
        var childDivIds = childDivs.map(function (div) {
            return div.id.replace('show_', '');
        });

        childDivIds.forEach(function (id, index) {
            var asset = settings_cookies.assets.find(function (asset) {
                return asset.name === id;
            });
            if (asset) {
                asset.pos = index;
            }
        });

        var parentIds = [RIGHT_COLUMN, LEFT_COLUMN, CENTER_COLUMN];
        parentIds.forEach(function (parentId) {
            // Obtém o elemento pai pelo ID
            var parentElement = document.getElementById(parentId);
            if (parentElement) {
                // Obtém os elementos filhos do pai
                var children = parentElement.children;
                // Itera sobre os elementos filhos
                for (var i = 0; i < children.length; i++) {
                    var childId = children[i].id.replace("show_", "");
                    // Verifica se o ID do filho está presente em settings_cookies.assets
                    var assetIndex = settings_cookies.assets.findIndex(function (asset) {
                        return asset.name === childId;
                    });
                    if (assetIndex !== -1) {
                        // Atualiza a coluna com o ID do pai e a posição com a posição do filho no HTML
                        settings_cookies.assets[assetIndex].column = parentId;
                        settings_cookies.assets[assetIndex].pos = i;
                    }
                }
            }
        });

        setCookie('settings_cookies', JSON.stringify(settings_cookies), 100000000);
    }
})();