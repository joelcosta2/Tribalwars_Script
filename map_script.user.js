
//TODO: Refactor this code to split it up into smaller pieces
var coords, mapPopUpBody;
function getOutgoingUnitsToMap() {
    if (settings_cookies.general['show__extra_options_map_hover']) {
        $.ajax({
            'url': game_data.link_base_pure + 'overview',
            'type': 'GET',
            'success': function (data) {
                var outgoing_units = [];
                var tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                var outgoing_unitsElement = tempElement.querySelectorAll('.command-row');
                if (outgoing_unitsElement.length > 0) {
                    outgoing_unitsElement.forEach(function (element) {
                        var outgoing_units_temp = {};

                        var villageName = element.querySelector('.quickedit-label');
                        var text = villageName.innerText;
                        outgoing_units_temp.name = text.match(/\((.*?)\)/)?.[1];
                        outgoing_units_temp.imgs = '';

                        element.querySelectorAll('.command_hover_details').forEach(function (iconElem) {
                            outgoing_units_temp.imgs = (iconElem.querySelector('img').src).match(/\/([^\/]+)\.png$/)[1] + (outgoing_units_temp.imgs != '' ? ',' + outgoing_units_temp.imgs : '');
                        });

                        outgoing_units.push(outgoing_units_temp);
                    })
                    localStorage.setItem('outgoing_units_saved', JSON.stringify(outgoing_units));
                }
            }
        });
    }
}

function getReportsList() {
    if (settings_cookies.general['show__extra_options_map_hover']) {
        var reportsList = [];
        $.ajax({
            'url': game_data.link_base_pure + 'report&mode=attack',
            'type': 'GET',
            'success': function (data) {
                var tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                var reportLabels = tempElement.querySelectorAll('.quickedit-label');

                reportLabels.forEach(function (label) {
                    var reportId = label.parentElement.getAttribute('data-id');
                    var tempReport = {};

                    tempReport.coords = (label.innerHTML).match(/\(([^)]+)\)[^\(]*$/)[1];
                    tempReport.date = tempElement.querySelector('.report-' + reportId).querySelector('tr > .nowrap').innerText;
                    tempReport.id = label.parentElement.getAttribute('data-id');
                    reportsList.push(tempReport);

                });
                localStorage.setItem('reports_list', JSON.stringify(reportsList));
            }
        });
    }
}

function getReportInfoToMap() {
    if (settings_cookies.general['show__extra_options_map_hover']) {
        var reports_list = localStorage.getItem('reports_list') ? JSON.parse(localStorage.getItem('reports_list')) : null;
        var outgoing_units_saved = localStorage.getItem('outgoing_units_saved') ? JSON.parse(localStorage.getItem('outgoing_units_saved')) : null;
        if (reports_list) {
            for (var i = 0; i < reports_list.length; i++) {
                var report = reports_list[i];
                var reportDone = false;

                if ((report.coords).includes(coords)) {
                    $.ajax({
                        'url': '/game.php?screen=report&view=' + report.id,
                        'type': 'GET',
                        'success': function (data) {
                            var tempElement = document.createElement('div');
                            tempElement.innerHTML = data;

                            var tr = document.createElement('tr');
                            var th = document.createElement('th');
                            th.innerHTML = '↓Last Attack:  ';
                            var td = document.createElement('td');
                            td.innerHTML = report.date;
                            tr.appendChild(th);
                            tr.appendChild(td);
                            mapPopUpBody.appendChild(tr);

                            var attackLootResults = tempElement.querySelector('#attack_results tr');
                            if (attackLootResults) {
                                attackLootResults.querySelectorAll('th')[0].innerHTML = attackLootResults.querySelectorAll('th')[0].innerHTML + ' (' + attackLootResults.querySelectorAll('td')[1].textContent + ')';
                                attackLootResults.removeChild(attackLootResults.querySelectorAll('td')[1]);
                                mapPopUpBody.appendChild(attackLootResults);
                            }
                            tempElement.innerHTML = data;
                            var attackLootDiscoverResults = tempElement.querySelector('#attack_spy_resources tr');
                            if (attackLootDiscoverResults) {
                                mapPopUpBody.appendChild(attackLootDiscoverResults);
                            }

                        }
                    });
                    reportDone = true;
                }
                if (reportDone) { break; }
            }
        }

        if (outgoing_units_saved) {
            outgoing_units_saved.forEach(function (unit) {
                if ((unit.name).includes(coords)) {
                    var tdElement = document.createElement('td');
                    var span1Element = document.createElement('span');
                    span1Element.className = 'icon-container';
                    var icons = unit.imgs.split(',');
                    icons.forEach(function (icon) {
                        if (icon !== '') {
                            var img1Element = document.createElement('img');
                            img1Element.src = 'https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/command/' + icon + '.png';
                            img1Element.alt = '';
                            span1Element.appendChild(img1Element);
                        }
                    })
                    tdElement.appendChild(span1Element);

                    var popUpTitle = mapPopUpBody.querySelector('th');
                    popUpTitle.insertBefore(span1Element, popUpTitle.firstChild);
                }
            })
        }
    }
}

function setMapSize() {
    var isBigMapOpened = settings_cookies.general['show__big_map'];
    
    var mapWrap = document.getElementById('map_wrap');
    if (mapWrap) {
        var map = document.getElementById('map');
        var extraMapContainer = document.getElementById('map_container');
        var goHomeBoundarie = document.getElementById('map_go_home_boundary');
        var coordYWrap = document.getElementById('map_coord_y_wrap');
        var coordXWrap = document.getElementById('map_coord_x_wrap');
    
        // Recupera as configurações originais salvas do localStorage
        var storedMapConfig = JSON.parse(localStorage.getItem('mapConfig')) || {};
        if (!storedMapConfig.originalWidth || !storedMapConfig.originalHeight) {
            storedMapConfig.originalWidth = map.style.width || 'auto';
            storedMapConfig.originalHeight = map.style.height || 'auto';
        }
    
        var mapImages = document.querySelectorAll('#map img');
        mapImages.forEach(function(img) {
            if (!storedMapConfig.originalMapImgWidth || !storedMapConfig.originalMapImgHeight) {
                storedMapConfig.originalMapImgWidth = img.style.width || 'auto';
                storedMapConfig.originalMapImgHeight = img.style.height || 'auto';
            }
        });
    
        // Salva as configurações iniciais no localStorage
        localStorage.setItem('mapConfig', JSON.stringify(storedMapConfig));

        const mapHeightInput = document.querySelector('#map_custom_height');
        const mapWidthInput = document.querySelector('#map_custom_width');
        
        if (mapHeightInput.value != localStorage.getItem('map_custom_height')) {
            localStorage.setItem('map_custom_height', mapHeightInput.value);
        }        
        if (mapWidthInput.value != localStorage.getItem('map_custom_width')) {
            localStorage.setItem('map_custom_width', mapWidthInput.value);
        }

        const mapHeight = localStorage.getItem('map_custom_height') + 'px';
        const mapWidth = localStorage.getItem('map_custom_width') + 'px';
    
        if (isBigMapOpened && mapWrap) {
            // Define os novos tamanhos
            mapWrap.style.width = mapWidth;
            mapWrap.style.height = mapHeight;
            map.style.width = mapWidth;
            map.style.height = mapHeight;
            coordYWrap.style.height = mapHeight;
            coordXWrap.style.width = mapWidth;
    
            mapImages.forEach(function(img) {
                img.style.width = 'auto';
                img.style.height = 'auto';
            });
    
            // Remove o container antigo e recria o mapa
            extraMapContainer.remove();
            goHomeBoundarie.remove(); //it will generate again
            TWMap.size = [9, 9];
            TWMap.init();

            wait(1).then(() => { 
                // Captura a parte do hash da URL (depois do #)
                const hash = window.location.hash.substring(1); // Remove o #
                if (hash && hash.includes(";")) {
                    const [x, y] = hash.split(";");
                    TWMap.focus(x, y);
                } else {
                    TWMap.focusSubmit();
                }
            });
        } else {
            // Restaura os tamanhos originais a partir do objeto salvo
            mapWrap.style.width = storedMapConfig.originalWidth;
            mapWrap.style.height = storedMapConfig.originalHeight;
            map.style.width = storedMapConfig.originalWidth;
            map.style.height = storedMapConfig.originalHeight;
            coordYWrap.style.height = storedMapConfig.originalHeight;
            coordXWrap.style.width = storedMapConfig.originalWidth;
    
            mapImages.forEach(function(img) {
                img.style.width = storedMapConfig.originalMapImgWidth;
                img.style.height = storedMapConfig.originalMapImgHeight;
            });
    
            // Remove o container antigo e recria o mapa no tamanho original
            extraMapContainer.remove();
            goHomeBoundarie.remove(); //it will generate again
            TWMap.size = [9, 9];
            TWMap.init(); 
            // Captura a parte do hash da URL (depois do #)
            const hash = window.location.hash.substring(1); // Remove o #
            if (hash && hash.includes(";")) {
                const [x, y] = hash.split(";");
                TWMap.focus(x, y);
            } else {
                TWMap.focusSubmit();
            }
        }
    }
}

function createBigMapOption() {
    const tr = document.createElement('tr');
    tr.style.background = '#e27f26 !important'; 
    
    //option to enable big map
    const tdCheckbox = document.createElement('td');
    const inputCheckbox = document.createElement('input');
    var isBigMapOpened = settings_cookies.general['show__big_map'];
    inputCheckbox.type = 'checkbox';
    inputCheckbox.name = 'show_biggermap';
    inputCheckbox.id = 'show_biggermap';
    inputCheckbox.checked = isBigMapOpened;
    inputCheckbox.onclick = function() {
        var isBigMapOpened = settings_cookies.general['show__big_map'];
        settings_cookies.general['show__big_map'] = !isBigMapOpened;
        localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
        setMapSize();
    };
    tdCheckbox.appendChild(inputCheckbox);
    
    const tdLabel = document.createElement('td');
    tdLabel.colSpan = 2;
    tdLabel.style.background = 'none';
    const label = document.createElement('label');
    label.setAttribute('for', 'show_biggermap');
    label.textContent = 'Show Large Map';
    tdLabel.appendChild(label);
    
    tr.appendChild(tdCheckbox);
    tr.appendChild(tdLabel);

    //option to set map size
    let trMapSize = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.classList.add("nowrap");
    let td2 = document.createElement("td");
    td2.classList.add("nowrap");

    let labelHeight = document.createTextNode("Height: ");
    let inputHeight = document.createElement("input");
    inputHeight.type = "number";
    inputHeight.name = "x";
    inputHeight.id = "map_custom_height";
    inputHeight.value = localStorage.getItem('map_custom_height');
    inputHeight.setAttribute('step', '100');
    inputHeight.style.width = "50px";
    inputHeight.oninput = function () {
        var isBigMapOpened = settings_cookies.general['show__big_map'];
        if(isBigMapOpened){
            setMapSize();
        }
        //save value
    }

    let labelWidth = document.createTextNode(" Width: ");
    let inputWidth = document.createElement("input");
    inputWidth.type = "number";
    inputWidth.name = "y";
    inputWidth.id = "map_custom_width";
    inputWidth.value = localStorage.getItem('map_custom_width');
    inputWidth.setAttribute('step', '100');
    inputWidth.style.width = "50px";
    inputWidth.oninput = function () {
        var isBigMapOpened = settings_cookies.general['show__big_map'];
        if(isBigMapOpened){
            setMapSize();
        }
        //save value
    }
    td1.appendChild(labelHeight);
    td1.appendChild(inputHeight);
    td2.appendChild(labelWidth);
    td2.appendChild(inputWidth);
    trMapSize.appendChild(td1);
    trMapSize.appendChild(td2);
    
    const visTables = document.querySelectorAll('#map_config .vis');
    
    if (visTables.length > 1) {
        const tbody = visTables[1].querySelector('tbody');
        if (tbody) {
            const secondTr = tbody.querySelectorAll('tr')[1];
            if (secondTr) {
                tbody.insertBefore(tr, secondTr);
            } else {
                tbody.appendChild(tr);
            }
            tbody.insertBefore(trMapSize, secondTr);
        }
    }
}

if (typeof TWMap !== 'undefined') {
    if (settings_cookies.general['show__extra_options_map_hover']) {
        var originalHandleMouseMove = TWMap.popup.handleMouseMove;
        getOutgoingUnitsToMap();
        getReportsList();
        TWMap.popup.handleMouseMove = function (e) {
            originalHandleMouseMove.call(this, e);
            var villageHoverCoords = TWMap.map.coordByEvent(e);
            coords = villageHoverCoords.join('|');
            var mapPopupElement = document.getElementById('map_popup');
            mapPopUpBody = mapPopupElement.getElementsByTagName('tbody')[0];

            var tr = document.createElement('tr');
            tr.className = 'nowrap';
            tr.id = 'map_popup_extra';

            if (mapPopUpBody && !mapPopUpBody.querySelector('#map_popup_extra')) {
                mapPopUpBody.appendChild(tr);
                getReportInfoToMap(); //mudar isto para nao fazer fetch em cada hover, mas apenas um fetch e guardar info
            }
        };
    }
    createBigMapOption();
    setMapSize();
}