//Override the sortable update function from Tribalwars
if (typeof TWMap !== 'undefined') {
    var originalHandleMouseMove = TWMap.popup.handleMouseMove;
    TWMap.popup.handleMouseMove = function (e) {
        originalHandleMouseMove.call(this, e);

        var villageHoverCoords = TWMap.map.coordByEvent(e);
        var mapPopupElement = document.getElementById('map_popup');
        var tbody = mapPopupElement.getElementsByTagName('tbody')[0];

        // Criando o elemento tr
        var tr = document.createElement('tr');
        tr.id = 'map_popup_extra';

        if (tbody && !tbody.querySelector('#map_popup_extra')) {
            tbody.appendChild(tr);

            $.ajax({
                'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=report&mode=attack',
                'type': 'GET',
                'success': function (data) {
                    var tempElement = document.createElement('div');
                    tempElement.innerHTML = data;
                    var reportLabels = tempElement.querySelectorAll('.quickedit-label');
                    var elementsWithVillageHoverCoords = [];

                    reportLabels.forEach(function (label) {
                        var text = label.innerText;
                        var coords = villageHoverCoords.join('|');
                        if (text.includes(coords)) {
                            elementsWithVillageHoverCoords.push(label.parentElement);
                        }
                    });

                    var lastReportUrl = elementsWithVillageHoverCoords[0] ? elementsWithVillageHoverCoords[0].href : null;
                    if (lastReportUrl) {
                        $.ajax({
                            'url': lastReportUrl,
                            'type': 'GET',
                            'success': function (data) {
                                var tempElement = document.createElement('div');
                                tempElement.innerHTML = data;
                                var attackLootResults = tempElement.querySelector('#attack_results tr');
                                tbody.appendChild(attackLootResults);

                                debugger;

                            }
                        });
                    }
                }
            });
        }
    };
}