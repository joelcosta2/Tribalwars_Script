
//TODO: Refactor this code to split it up into smaller pieces
var coords, mapPopUpBody;
function getOutgoingUnitsToMap() {
    if (settings_cookies.general['show__extra_options_map_hover']) {
        $.ajax({
            'url': '/game.php?village=' + game_data.village.id + '&screen=overview',
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
            'url': '/game.php?village=' + game_data.village.id + '&screen=report&mode=attack',
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
                            var attackLootResults = tempElement.querySelector('#attack_results tr');


                            var tr = document.createElement('tr');
                            var th = document.createElement('th');
                            th.innerHTML = '↓Last Report Info:  ';
                            var td = document.createElement('td');
                            td.innerHTML = report.date;
                            tr.appendChild(th);
                            tr.appendChild(td);
                            mapPopUpBody.appendChild(tr);

                            attackLootResults.querySelectorAll('th')[0].innerHTML = attackLootResults.querySelectorAll('th')[0].innerHTML + ' (' + attackLootResults.querySelectorAll('td')[1].textContent + ')';
                            attackLootResults.removeChild(attackLootResults.querySelectorAll('td')[1]);

                            mapPopUpBody.appendChild(attackLootResults);
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
                getReportInfoToMap();
            }
        };
    }
}