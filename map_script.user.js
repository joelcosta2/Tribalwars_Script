//Override the sortable update function from Tribalwars
//TODO: Refactor this code to split it up into smaller pieces
if (typeof TWMap !== 'undefined') {
    var originalHandleMouseMove = TWMap.popup.handleMouseMove;
    TWMap.popup.handleMouseMove = function (e) {
        originalHandleMouseMove.call(this, e);

        var villageHoverCoords = TWMap.map.coordByEvent(e);
        var coords = villageHoverCoords.join('|');
        var mapPopupElement = document.getElementById('map_popup');
        var tbody = mapPopupElement.getElementsByTagName('tbody')[0];

        // Criando o elemento tr
        var tr = document.createElement('tr');
        tr.id = 'map_popup_extra';

        if (tbody && !tbody.querySelector('#map_popup_extra')) {
            tbody.appendChild(tr);

            $.ajax({
                'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=overview',
                'type': 'GET',
                'success': function (data) {
                    var tempElement = document.createElement('div');
                    tempElement.innerHTML = data;
                    outgoing_unitsElement = tempElement.querySelectorAll('.command-row');
                    if (outgoing_unitsElement.length > 0) {
                        outgoing_unitsElement.forEach(function (element) {
                            var villageName = element.querySelector('.quickedit-label');
                            var text = villageName.innerText;
                            if (text.includes(coords)) {
                                tbody.appendChild(element);
                            }
                        })
                    }
                }
            });


            $.ajax({
                'url': 'https://' + game_data.world + '.tribalwars.com.pt/game.php?village=' + game_data.village.id + '&screen=report&mode=attack',
                'type': 'GET',
                'success': function (data) {
                    var tempElement = document.createElement('div');
                    tempElement.innerHTML = data;
                    var reportLabels = tempElement.querySelectorAll('.quickedit-label');
                    var elementsWithVillageHoverCoords = [];
                    var lastReportsDate = [];

                    reportLabels.forEach(function (label) {
                        var text = label.innerText;
                        if (text.includes(coords)) {
                            elementsWithVillageHoverCoords.push(label.parentElement);
                            var reportId = label.parentElement.getAttribute('data-id');
                            //TODO: IMPROVE UI for date
                            lastReportsDate.push(tempElement.querySelector('.report-' + reportId).querySelector('tr > .nowrap')); //date
                        }
                    });

                    var lastReportUrl = elementsWithVillageHoverCoords[0] ? elementsWithVillageHoverCoords[0].href : null;

                    tbody.appendChild(lastReportsDate[0]);

                    if (lastReportUrl) {
                        $.ajax({
                            'url': lastReportUrl,
                            'type': 'GET',
                            'success': function (data) {
                                var tempElement = document.createElement('div');
                                tempElement.innerHTML = data;
                                var attackLootResults = tempElement.querySelector('#attack_results tr');
                                tbody.appendChild(attackLootResults);
                                tempElement.innerHTML = data;
                                var attackLootDiscoverResults = tempElement.querySelector('#attack_spy_resources tr');
                                if (attackLootDiscoverResults) {
                                    tbody.appendChild(attackLootDiscoverResults);
                                }

                            }
                        });
                    }
                }
            });
        }
    };
}