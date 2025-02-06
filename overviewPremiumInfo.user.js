// Carrega o objeto do localStorage ou cria um novo garantindo que todas as propriedades existam
var infoOverview = JSON.parse(localStorage.getItem("infoOverview")) || {};

infoOverview.storage = infoOverview.storage || "";
infoOverview.wood = infoOverview.wood || "";
infoOverview.stone = infoOverview.stone || "";
infoOverview.iron = infoOverview.iron || "";
infoOverview.stable = infoOverview.stable || "";
infoOverview.barracks = infoOverview.barracks || "";
infoOverview.garage = infoOverview.garage || "";
infoOverview.smith = infoOverview.smith || "";
infoOverview.main = infoOverview.main || "";
infoOverview.wall = infoOverview.wall || "";

//pmudar de sitio maybe, defini +1 para construçoes em progresso
var infoOverview = JSON.parse(localStorage.getItem("infoOverview")) || {};
var buildingQueueActive = JSON.parse(localStorage.getItem("building_queue_active"));
var buildIds = buildingQueueActive ? buildingQueueActive.map(item => item.replace(/[0-9]/g, '')) : {};

Object.keys(infoOverview).forEach(key => {
    if (buildIds.includes(key)) {
        addToVisualLabel(key, '+1')
    } 
});


//por agora ja fa fetch dos tempos dos materiais, guarda na local storaage e aplica os hovers
function getStorageTime() {
    let minTime = 0;
    if (settings_cookies.general['show__time_storage_full_hover'] && game_data) {
        $.ajax({
            url: game_data.link_base_pure + 'storage',
            method: "GET",
            success: function (data) {
                var spans = $(data).find("span[data-endtime]");
                var fullStorageTimes = {
                    wood: $(spans[0]).attr("data-endtime"),
                    stone: $(spans[1]).attr("data-endtime"),
                    iron: $(spans[2]).attr("data-endtime")
                };
                localStorage.setItem('full_storage_times', JSON.stringify(fullStorageTimes));

                //hovers resources
                var storageTimes = fullStorageTimes;
                if (storageTimes) {
                    Object.keys(storageTimes).forEach(resourceId => {
                        var element = document.getElementById(resourceId);
                        if (element) {
                            var parentInfoBox = element.parentElement;
                            var iconBox = parentInfoBox.previousElementSibling;

                            //Check if storage is getting full
                            var remaining = getRemainingHours(parseInt(storageTimes[resourceId]));
                            if (remaining < 2) {
                                parentInfoBox.classList.add('waran_90');
                            }
                            
                            var tooltip = document.getElementById("tooltip");
                            if (tooltip) {
                                var bodyElement = tooltip.querySelector(".body");
                                if (bodyElement) {
                                    parentInfoBox.dataset.interval = setInterval(function () {
                                        const resourceHover = localStorage.getItem('resourceHover');
                                        if (resourceHover) {
                                            startResourceTimerFull(parseInt(storageTimes[resourceHover]), bodyElement);
                                        } else {
                                            //bodyElement.style.display = "none";
                                        }
                                    }, 500);
                                    
                                    parentInfoBox.addEventListener("mouseenter", function () {
                                        startResourceTimerFull(parseInt(storageTimes[resourceId]), bodyElement);
                                        localStorage.setItem('resourceHover', resourceId);
                                    });
                                    iconBox.addEventListener("mouseenter", function () {
                                        startResourceTimerFull(parseInt(storageTimes[resourceId]), bodyElement);
                                        localStorage.setItem('resourceHover', resourceId);
                                    });
        
                                    parentInfoBox.addEventListener("mouseleave", function () {
                                        localStorage.setItem('resourceHover', '');
                                    });
                                    iconBox.addEventListener("mouseleave", function () {
                                        localStorage.setItem('resourceHover', '');
                                    });
                                }
                            }
                        }
                    });
                }
                
                if (fullStorageTimes) {
                    minTime = Math.min(...Object.values(fullStorageTimes));
                    var now = Math.floor(Timing.getCurrentServerTime() / 1000);
                    var remaining = minTime - now;
                    var hours = Math.floor(remaining / 3600);
                    var minutes = Math.floor((remaining % 3600) / 60);
                    var seconds = remaining % 60;
                    
                    addToVisualLabelExtra('storage', `${hours}h ${minutes}m ${seconds}s`, true, minTime);
                }
            }
        });
    }
    return minTime; //"Tempo calculado para o recurso mais cheio"
}

function getWoodInfo() {
    const storageFullTime = JSON.parse(localStorage.getItem('full_storage_times'));
    if (storageFullTime) {
        const fullTime = storageFullTime['wood'];
        if (fullTime) {
            var remaining = endTimeToTimer(fullTime);

            const wood = document.getElementById('wood');
            let production;
            if (wood?.hasAttribute('data-title')) {
                production = wood.getAttribute('data-title').split('- ')[1].split(' ')[0];
                const labelVisual = production + '/h\n' + `${remaining[0]}h ${remaining[1]}m ${remaining[2]}s`;;
                if (production) addToVisualLabelExtra('wood', labelVisual , true, fullTime);
            }

            return {perHour: production, fullEndTime: '0'}; //get value from label?
        }
    }
    return {};
}

function getStoneInfo() {
    const storageFullTime = JSON.parse(localStorage.getItem('full_storage_times'));
    if (storageFullTime) {
        const fullTime = storageFullTime['stone'];
        if (fullTime) {
            var remaining = endTimeToTimer(fullTime);

            const stone = document.getElementById('stone');
            let production;
            if (stone?.hasAttribute('data-title')) {
                production = stone.getAttribute('data-title').split('- ')[1].split(' ')[0];
                const labelVisual = production + '/h\n' + `${remaining[0]}h ${remaining[1]}m ${remaining[2]}s`;;
                if (production) addToVisualLabelExtra('stone', labelVisual , true, fullTime);
            }

            return {perHour: production, fullEndTime: '0'}; //get value from label?
        }
    }
    return {};
}

function getIronInfo() {
    const storageFullTime = JSON.parse(localStorage.getItem('full_storage_times'));
    if (storageFullTime) {
        const fullTime = storageFullTime['iron'];
        if (fullTime) {
            var remaining = endTimeToTimer(fullTime);

            const iron = document.getElementById('iron');
            let production;
            if (iron?.hasAttribute('data-title')) {
                production = iron.getAttribute('data-title').split('- ')[1].split(' ')[0];
                const labelVisual = production + '/h\n' + `${remaining[0]}h ${remaining[1]}m ${remaining[2]}s`;;
                if (production) addToVisualLabelExtra('iron', labelVisual , true, fullTime);
            }

            return {perHour: production, fullEndTime: '0'}; //get value from label?
        }
    }
    return {};
}

function getStableTime() {
    return "30 minutos para terminar";
}

function getBarracksTime() {
    return "45 minutos para terminar";
}

function getGarageTime() {
    return "1 hora para terminar";
}

function getSmithTime() {
    return "2 horas para pesquisa";
}

function getMainQueueTime() {
    return "Última construção em 5 horas";
}

function getWallTime() {
    return "Última construção em 5 horas";
}

function updateInfoOverview() {
    infoOverview.storage = getStorageTime();
    infoOverview.wood = getWoodInfo();
    infoOverview.stone = getStoneInfo();
    infoOverview.iron = getIronInfo();
    infoOverview.stable = getStableTime();
    infoOverview.barracks = getBarracksTime();
    infoOverview.garage = getGarageTime();
    infoOverview.smith = getSmithTime();
    infoOverview.main = getMainQueueTime();
    infoOverview.wall = getWallTime();

    localStorage.setItem("infoOverview", JSON.stringify(infoOverview));
}

function addToVisualLabelExtra(buildingName, textContent, isTimer = false, endtime = 0) {
    const labelStorage = document.getElementsByClassName(`visual-label-${buildingName}`)[0];

    if (labelStorage) {
        const labelContent = labelStorage.querySelector('a');

        if (labelContent) {
            const div = document.createElement('div');
            div.style.whiteSpace = 'pre-line';
            div.textContent = textContent;
            div.style.fontSize = "10px";
        
            labelContent.appendChild(div);

            if (isTimer && endtime > 0) {
                labelContent.dataset.interval = setInterval(function () {
                    startTimerOnLabel(endtime, div);
                }, 500); // Atualiza a cada 500ms
            }
        }
    }
}

function addToVisualLabel(buildingName, textContent) {
    const labelStorage = document.getElementsByClassName(`visual-label-${buildingName}`)[0];
    if (labelStorage) {
        const labelContent = labelStorage.querySelector('a');
        const text = labelContent.firstChild;

        if (labelContent) {
            text.textContent = text.textContent + textContent;
        }
    }
}
