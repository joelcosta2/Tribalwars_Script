
var coords, mapPopUpBody;
function getOutgoingCommandsFromOverview() {
    if (settings_cookies.general['show__extra_options_map_hover'] || settings_cookies.general['show__outgoingInfo_map'] ) {
        $.ajax({
            'url': game_data.link_base_pure + 'overview',
            'type': 'GET',
            'success': function (data) {
                var outgoing_units = [];
                var tempElement = document.createElement('div');
                tempElement.innerHTML = data;
                var outgoingTable = tempElement.querySelector('#commands_outgoings');
                if (outgoingTable) {
                    var outgoing_unitsElement = outgoingTable.querySelectorAll('.command-row');
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
    
                        // Espera até que os elementos do mapa carreguem antes de adicionar os ícones
                        if (settings_cookies.general['show__outgoingInfo_map'] ) {
                            waitForMapElements(addOutgoingIcons);
                        }
                    }
                } else {
                    localStorage.setItem('outgoing_units_saved', JSON.stringify([]));
                }
            }
        });
    }
}

function waitForMapElements(callback) {
    let checkExist = setInterval(() => {
        // Verifica se pelo menos uma aldeia foi carregada no mapa
        let firstVillage = document.querySelector("[id^='map_village_']");
        if (firstVillage) {
            clearInterval(checkExist); // Para a verificação
            callback(); // Chama a função para adicionar os ícones
        }
    }, 500); // Verifica a cada 500ms
}

function addOutgoingIcons() {
    let outgoingCommands = JSON.parse(localStorage.getItem('outgoing_units_saved')) || [];

    outgoingCommands.forEach(command => {
        let villageCoords = command.name.replace('|', ''); // Remove o "|"
        let villageInfo = TWMap.villages[villageCoords];

        if (!villageInfo) {
            return;
        }

        let villageElement = document.getElementById(`map_village_${villageInfo.id}`);

        if (!villageElement) {
            return;
        }

        // Obtém a posição do ícone original
        let { top, left } = villageElement.style;
        
        //Add icons
        var icons = command.imgs.split(',');
        icons.forEach(function (icon, index) {
            let farmIcon = document.createElement("img");
            farmIcon.id = `${villageCoords}-${icon}-img`
            farmIcon.src = `https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/command/${icon}.png`;
            farmIcon.classList.add('icon_outgoing_unit')
            farmIcon.width = 18;
            farmIcon.height = 18;
            farmIcon.style.position = "absolute";
            farmIcon.style.top = top;
            farmIcon.style.left = (parseInt(left) - index * 20) + "px";
            farmIcon.style.marginLeft = '30px';
            farmIcon.style.zIndex = 4;

            // Adiciona o ícone antes da aldeia no DOM
            var currentImg = document.getElementById(`${villageCoords}-${icon}-img`);
            if (!currentImg) {
                villageElement.parentNode.insertBefore(farmIcon, villageElement);
            }
        })
    });
}

async function getReportsList() {
    if (!settings_cookies.general['show__extra_options_map_hover']) return;

    let storedReports = localStorage.getItem('reports_list') ? JSON.parse(localStorage.getItem('reports_list')) : [];

    // Criar um mapa para armazenar o relatório mais recente por coordenada
    let reportsMap = new Map();
    storedReports.forEach(report => {
        reportsMap.set(report.coords, report);
    });

    let groupIds = [0, 7600]; // IDs dos grupos de relatórios
    let allNewReports = [];

    for (let groupId of groupIds) {
        let newReports = await fetchAllReports(groupId);
        allNewReports.push(...newReports);
    }

    // Atualizar o mapa com os novos relatórios
    allNewReports.forEach(report => {
        let existingReport = reportsMap.get(report.coords);
        if (!existingReport || isNewer(report.date, existingReport.date)) {
            reportsMap.set(report.coords, report);
        }
    });

    // Converter de volta para array e salvar no localStorage
    let updatedReports = Array.from(reportsMap.values());
    localStorage.setItem('reports_list', JSON.stringify(updatedReports));
}

async function fetchAllReports(groupId) {
    let pages = 0;
    let firstPageData = await fetchReportsPage(groupId, 0);
    if (!firstPageData) return [];

    let tempElement = document.createElement('div');
    tempElement.innerHTML = firstPageData;

    pages = tempElement.querySelectorAll('.paged-nav-item').length + 1;

    let newReports = extractReports(tempElement);

    let requests = [];
    for (let i = 12; i < pages * 12; i += 12) {
        requests.push(fetchReportsPage(groupId, i));
    }

    let results = await Promise.all(requests);
    results.forEach(data => {
        let tempEl = document.createElement('div');
        tempEl.innerHTML = data;
        newReports.push(...extractReports(tempEl));
    });

    return newReports;
}

function fetchReportsPage(groupId, from) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: game_data.link_base_pure + `report&mode=attack&group_id=${groupId}&from=${from}`,
            type: 'GET',
            success: resolve,
            error: reject
        });
    });
}

function extractReports(tempElement) {
    let reports = [];
    let reportLabels = tempElement.querySelectorAll('.quickedit-label');

    reportLabels.forEach(label => {
        let reportId = label.parentElement.getAttribute('data-id');

        let tempReport = {
            coords: (label.innerHTML).match(/\(([^)]+)\)[^\(]*$/)[1],
            date: tempElement.querySelector('.report-' + reportId).querySelector('tr > .nowrap').innerText,
            id: reportId
        };

        reports.push(tempReport);
    });

    return reports;
}

// Função para comparar datas e determinar qual é mais recente
function isNewer(date1, date2) {
    let d1 = new Date(convertDateToISO(date1));
    let d2 = new Date(convertDateToISO(date2));
    
    return d1 > d2;
}

// Função para converter formato de data para ISO (YYYY-MM-DD HH:MM) para comparação
function convertDateToISO(dateStr) {
    let parts = dateStr.match(/([a-z]{3})\. (\d+), (\d+):(\d+)/i); // Exemplo: "mar. 14, 17:56"
    let monthMap = { 
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, 
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12 
    };

    if (!parts) return null;

    let month = monthMap[parts[1].toLowerCase()];
    let day = parseInt(parts[2], 10);
    let hour = parseInt(parts[3], 10);
    let minute = parseInt(parts[4], 10);
    let currentYear = new Date().getFullYear(); // Assume o ano atual

    let isoString = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

    return isoString;
}

function insertReportData(report) {
    var tr = document.createElement('tr');
    tr.id = "info_last_attack";
    var th = document.createElement('th');
    th.innerHTML = '↓Last Attack:  ';
    var td = document.createElement('td');
    td.innerHTML = report.date;
    tr.appendChild(th);
    tr.appendChild(td);
    mapPopUpBody.appendChild(tr);

    if (report.attackLootResults) {
        const tempTable = document.createElement('table');
        tempTable.innerHTML = report.attackLootResults; 
        const extractedElement = tempTable.querySelector('tr');
        mapPopUpBody.appendChild(extractedElement);
    }

    if (report.attackLootDiscoverResults) {
        const tempTable = document.createElement('table');
        tempTable.innerHTML = report.attackLootDiscoverResults; 
        const extractedElement = tempTable.querySelector('tr');
        mapPopUpBody.appendChild(extractedElement);
    }
}

function getReportInfoToMap() {
    if (settings_cookies.general['show__extra_options_map_hover']) {
        var reports_list = localStorage.getItem('reports_list') ? JSON.parse(localStorage.getItem('reports_list')) : null;
        var outgoing_units_saved = localStorage.getItem('outgoing_units_saved') ? JSON.parse(localStorage.getItem('outgoing_units_saved')) : null;

        if (reports_list) {
            for (var i = 0; i < reports_list.length; i++) {
                var report = reports_list[i];

                if ((report.coords).includes(coords)) {
                    // Se já tem os dados salvos, usa-os diretamente
                    if (report.attackLootResults || report.attackLootDiscoverResults) {
                        insertReportData(report);
                    } else {
                        // Caso contrário, faz o fetch e armazena os dados
                        $.ajax({
                            'url': '/game.php?screen=report&view=' + report.id,
                            'type': 'GET',
                            'success': function (data) {
                                var tempElement = document.createElement('div');
                                tempElement.innerHTML = data;

                                // Criar linha com a data do último ataque
                                var tr = document.createElement('tr');
                                tr.id = "info_last_attack";
                                var th = document.createElement('th');
                                th.innerHTML = '↓Last Attack:  ';
                                var td = document.createElement('td');
                                td.innerHTML = report.date;
                                tr.appendChild(th);
                                tr.appendChild(td);
                                mapPopUpBody.appendChild(tr);

                                // Coletar informações do loot
                                var attackLootResults = tempElement.querySelector('#attack_results tr');
                                if (attackLootResults) {
                                    attackLootResults.querySelectorAll('th')[0].innerHTML += ' (' + attackLootResults.querySelectorAll('td')[1].textContent + ')';
                                    attackLootResults.removeChild(attackLootResults.querySelectorAll('td')[1]);
                                    mapPopUpBody.appendChild(attackLootResults);

                                    // Armazena os dados no report
                                    report.attackLootResults = attackLootResults.outerHTML;
                                }

                                // Coletar informações do espionagem
                                var attackLootDiscoverResults = tempElement.querySelector('#attack_spy_resources tr');
                                if (attackLootDiscoverResults) {
                                    mapPopUpBody.appendChild(attackLootDiscoverResults);

                                    // Armazena os dados no report
                                    report.attackLootDiscoverResults = attackLootDiscoverResults.outerHTML;
                                }

                                // Atualiza localStorage com as novas informações
                                localStorage.setItem('reports_list', JSON.stringify(reports_list));
                            }
                        });
                    }
                    break;
                }
            }
        }

        if (outgoing_units_saved) {
            outgoing_units_saved.forEach(function (unit) {
                if ((unit.name).includes(coords)) {
                    var tdElement = document.createElement('td');
                    tdElement.id = "info_outgoing_units";
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
        mapImages.forEach(function (img) {
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

        // Define os novos tamanhos
        mapWrap.style.width = mapWidth;
        mapWrap.style.height = mapHeight;
        map.style.width = mapWidth;
        map.style.height = mapHeight;
        coordYWrap.style.height = mapHeight;
        coordXWrap.style.width = mapWidth;

        mapImages.forEach(function (img) {
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
            
            TWMap.focusSubmit();
        });
        
    }
}

function createBigMapOption() {
    const tr = document.createElement('tr');
    tr.style.background = '#e27f26 !important';

    //option to enable big map
    const tdCheckbox = document.createElement('td');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.name = 'show_biggermap';
    inputCheckbox.id = 'show_biggermap';
    inputCheckbox.checked = settings_cookies.general['show__big_map'];
    inputCheckbox.onclick = function () {
        settings_cookies.general['show__big_map'] = !settings_cookies.general['show__big_map'];
        localStorage.setItem('settings_cookies', JSON.stringify(settings_cookies));
        if (settings_cookies.general['show__big_map']) {
            setMapSize();
        } else {
            location.reload();
        }
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
        if (settings_cookies.general['show__big_map']) {
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
        if (settings_cookies.general['show__big_map']) {
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
    getOutgoingCommandsFromOverview();
    createBigMapOption();
    if (settings_cookies.general['show__extra_options_map_hover']) {
        var originalHandleMouseMove = TWMap.popup.handleMouseMove;
        getReportsList();
        TWMap.popup.handleMouseMove = function (e) {
            TWMap.popup.extraInfo = true;
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
                document.querySelectorAll("#info_last_attack, #info_outgoing_units").forEach(el => el.remove());
                getReportInfoToMap();
            }
        };
    }
    if (settings_cookies.general['show__big_map']) {
        setMapSize();
    }
    if (settings_cookies.general['show__outgoingInfo_map']) {
        if(TWMap.map) {
            //on map drag move
            var originalMapOnMove = TWMap.map.handler.onMovePixel;
            TWMap.map.handler.onMovePixel = function (e, a) {
                originalMapOnMove.call(this, e, a);
                waitForMapElements(addOutgoingIcons);
            }
        }
    }

    TWMap.context._originalSpawn = TWMap.context.spawn;
    TWMap.context.spawn = function (n, o, s) {
        // Chama a função original
        TWMap.context._originalSpawn(n, o, s);

        setTimeout(() => {
            const newButton = document.getElementById("mp_farm_fA");
            if (newButton) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === "style") {
                            if (newButton.style.opacity !== "1") {
                                newButton.style.opacity = "1";
                            }
                        }
                    });
                });
                observer.observe(newButton, { attributes: true, attributeFilter: ["style"] });
            }
        }, 100);
    };
}

function addFakeFarmAssistantButton() {
    const ctxButtons = document.getElementById("map-ctx-buttons");
    const referenceElement = document.getElementById("mp_info");

    if (!ctxButtons) {
        console.warn("Elemento #map-ctx-buttons não encontrado.");
        return;
    }

    if (!referenceElement) {
        console.warn("Elemento #mp_info não encontrado.");
        return;
    }

    // Criar o novo botão <a>
    const newButton = document.createElement("a");
    newButton.className = "mp";
    newButton.id = "mp_farm_fA";
    newButton.setAttribute("data-minspeed", "0.00075757575757576");
    newButton.setAttribute(
        "data-tooltip-tpl",
        `<img src="https://dspt.innogamescdn.com/asset/95eda994/graphic/unit/unit_spear.png" title="" alt="" class="" />10<br />
        <img src="https://dspt.innogamescdn.com/asset/95eda994/graphic/unit/unit_sword.png" title="" alt="" class="" />5<br />
        <span class="icon header ressources" title="Recursos"> </span>325<br />`
    );
    newButton.setAttribute("data-has-no-units", "false");
    newButton.style.backgroundPosition= '-647px 0px'

    newButton.onclick = async function fetchData() {
        try {
            const response = await fetch("https://pt106.tribalwars.com.pt/game.php?village=15844&screen=place&target=15815", {
                headers: {
                    "tribalwars-ajax": "1",
                    "x-requested-with": "XMLHttpRequest"
                }
            });
    
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
    
            const data = response;
            
                // Cria um contêiner invisível para processar o HTML
                const container = document.createElement("div");
                container.style.display = "none";
                container.innerHTML = response;
                document.body.appendChild(container);

                // Preenche os campos do formulário
                container.querySelector("#unit_input_spear").value = 20;
                container.querySelector("#unit_input_sword").value = 20;
                container.querySelector("#unit_input_light").value = 0;

                // Simula o clique no botão de ataque
                container.querySelector("#target_attack").click();
        } catch (error) {
            console.warn("Erro ao buscar dados:", error);
        }
    }
    
    function copyStyles() {
        let leftValue = parseFloat(referenceElement.style.left); // Pega o valor numérico do "left"
        if (!isNaN(leftValue)) {
            newButton.style.left = `${leftValue + 60}px`; // Adiciona 30px
        }
        newButton.style.top = referenceElement.style.top;
        newButton.style.opacity = referenceElement.style.opacity;
    }
    copyStyles();

    // Observar mudanças nos estilos do mp_info
    const observer = new MutationObserver(copyStyles);
    observer.observe(referenceElement, { attributes: true, attributeFilter: ["style"] });

    // Adicionar o novo botão ao ctxButtons
    ctxButtons.parentElement.appendChild(newButton);
}
addFakeFarmAssistantButton();