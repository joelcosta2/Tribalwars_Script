// Villages Arrows
function prepareLinkToArrows(goToUrl) {
    var str = document.location.href,
        temp = str.indexOf("="),
        temp2 = str.indexOf("&", temp),
        urlFirst = str.slice(0, temp + 1),
        urlLast = str.slice(temp2);

    temp = goToUrl.indexOf("=");
    temp2 = goToUrl.indexOf("&", temp);
    var villagenumber = goToUrl.slice(temp + 1, temp2);
    var FINALURL = urlFirst + villagenumber + urlLast;

    return FINALURL;
}

function nextVillage() {
    var goToUrl,
        villages = JSON.parse(localStorage.getItem('villages_show') || '[]');
    if (villages) {
        if (villages[currentVillageIndex + 1]) {
            goToUrl = villages[currentVillageIndex + 1].url;
        } else {
            goToUrl = villages[0].url;
        }
    }
    document.location.href = prepareLinkToArrows(goToUrl);
}

function previousVillage() {
    var goToUrl,
        villages = JSON.parse(localStorage.getItem('villages_show') || '[]');
    if (villages) {
        if (villages[currentVillageIndex - 1]) {
            goToUrl = villages[currentVillageIndex - 1].url;
        } else {
            goToUrl = villages[sizeOfObject(villages) - 1].url;
        }
    }
    document.location.href = prepareLinkToArrows(goToUrl);
}

function insertNavigationArrows() {
    if (settings_cookies.general['show__navigation_arrows']) {
        var menu_row1_container = document.getElementById('menu_row2');
        var htmlToInject = '<td class="box-item icon-box separate arrowCell"><a id="village_switch_previous" class="village_switch_link" accesskey="a"><span class="arrowLeft" style="cursor:pointer;"> </span></a></td><td class="box-item icon-box arrowCell"><a id="village_switch_next" class="village_switch_link" accesskey="d"><span class="arrowRight" style="cursor:pointer;"> </span></a></td>';

        menu_row1_container.innerHTML = htmlToInject + menu_row1_container.innerHTML;

        var leftArrowContainer = document.getElementById('village_switch_previous');
        var rightArrowContainer = document.getElementById('village_switch_next');

        leftArrowContainer.onclick = function () { previousVillage() };
        rightArrowContainer.onclick = function () { nextVillage() };
    }
}

function injectNavigationBar() {
    const tw_lang = JSON.parse(localStorage.getItem('tw_lang'));
    if (settings_cookies.general['show__navigation_bar']) {
        var urlsObject = {
            "Main": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/main3.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=main"
            },
            "Recruitment": {
                img: "https://dspt.innogamescdn.com/asset/243a567d/graphic/unit/att.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=train"
            },
            "Smith": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/smith2.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=smith"
            },
            "Place": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/place1.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=place"
            },
            [String(tw_lang["52e136b31c4cc30c8f3d9eeb8dc56013"])]: {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/scavenging/options/3.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=place&mode=scavenge"
            },
            "Del Misc Reports": {
                img: "https://dspt.innogamescdn.com/asset/243a567d/graphic/delete.png",
                run: async function() {
                    try {
                        const response = await fetch(game_data.link_base_pure + "report&action=del_all&mode=other&h=" + game_data.csrf, {
                            "headers": {
                                "priority": "u=0, i",
                                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                                "sec-ch-ua-platform": "\"Windows\""
                            },
                            "referrer": game_data.link_base_pure + "report&mode=other",
                            "credentials": "include"
                        });
                
                        if (!response.ok) {
                            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                        }
                
                        showAutoHideBox('Misc reports deleted', false);
                    } catch (error) {
                        showAutoHideBox('Error deleting misc reports', true);
                    }
                }
            },
            "Quests": {
                img: "https://dsen.innogamescdn.com/asset/243a567d/graphic/quests_new/quest_icon.png",
                run: function() {
                    Questlines.showDialog(0, 'main-tab');
                    let checkExist = setInterval(function () {
                        let questlineLists = document.querySelectorAll('.questline-list');
                        
                        if (questlineLists.length > 0) {
                            clearInterval(checkExist); // Para o intervalo quando encontrar
                            
                            questlineLists.forEach(questlineList => {
                                let listItems = questlineList.querySelectorAll('li');
                                
                                listItems.forEach(li => {
                                    let ul = li.closest('ul'); // Encontra o <ul> mais próximo
                                    if (ul) {
                                        ul.classList.add('opened'); // Adiciona a classe "opened"
                                    }
                                });
                            });
                        }
                    }, 500); // Verifica a cada 500ms
                }
            },
        };

        var table = document.createElement('table');
        table.id = 'header_info';
        table.setAttribute('align', 'center');
        table.setAttribute('width', '100%');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('style', 'display: flex; align-content: inherit; justify-content: space-around;');

        var tbody = document.createElement('tbody');

        var innerTable = document.createElement('table');
        innerTable.classList.add('header-border', 'menu_block_right');
        innerTable.setAttribute('style', 'border-collapse: collapse; background-size: auto 77%;');

        var innerTr = document.createElement('tr');
        var innerTd = document.createElement('td');

        var innerTrShadow = document.createElement('tr');
        var innerTdShadow = document.createElement('td');
        var divLeftShadow = document.createElement('div');
        var divRightShadow = document.createElement('div');

        divLeftShadow.classList.add('leftshadow');
        divRightShadow.classList.add('rightshadow');
        innerTdShadow.classList.add('shadow');
        innerTdShadow.appendChild(divLeftShadow);
        innerTdShadow.appendChild(divRightShadow);
        innerTrShadow.appendChild(innerTdShadow);

        var boxTable = document.createElement('table');
        boxTable.classList.add('box', 'box-nav-bar');
        boxTable.setAttribute('cellspacing', '0');

        var boxTr = document.createElement('tr');
        var index = 0;
        for (let key in urlsObject) {
            index++;
            if (urlsObject.hasOwnProperty(key)) {
                var boxTd = document.createElement('td');
                boxTd.classList.add('box-item', 'icon-box', 'nav-bar-item');
                boxTd.style.cursor = 'pointer';
                boxTd.style.width = 'auto';
                boxTd.style.minWidth = 'max-content';
                boxTd.setAttribute('data-title', key);
                var link = document.createElement('a');
                if (urlsObject[key].href) {
                    link.href = urlsObject[key].href;
                } else {
                    if (!localStorage.getItem(key)) {
                        link.onclick = (function(currentKey) {
                            return async function(event) {
                                if (typeof urlsObject[currentKey].run === "function") {
                                    urlsObject[currentKey].run();
                                }
                            };
                        })(key);

                    }
                }
                link.setAttribute('data-title', key);
                link.style.display = 'flex';
                link.style.alignItems = 'center';
                link.style.minWidth = 'fit-content';

                var img = document.createElement('img');
                img.src = urlsObject[key].img;
                img.classList.add('menu-event-icon')
                img.style.maxHeight = '18px';
                img.style.marginRight = '2px';
                link.appendChild(img);

                var titleSpan = document.createElement('span');
                titleSpan.textContent = key;
                titleSpan.style.whiteSpace = 'nowrap';
                titleSpan.style.textAlign = 'center';
                titleSpan.style.flexGrow = '1';

                link.appendChild(titleSpan);

                boxTd.appendChild(link);
                boxTr.appendChild(boxTd);
                [titleSpan, img].forEach(element => {
                    element.addEventListener('mouseover', event => toggleTooltip(event.target, true));
                    element.addEventListener('mouseleave', event => toggleTooltip(event.target, false));
                });
            }
        }

        boxTable.appendChild(boxTr);
        innerTd.appendChild(boxTable);
        innerTr.appendChild(innerTd);
        innerTable.appendChild(innerTr);
        innerTable.appendChild(innerTrShadow);
        tbody.appendChild(innerTable);
        table.appendChild(tbody);

        if (true) {
            var existingHeaderInfo = document.getElementById('header_info');
            existingHeaderInfo.parentNode.insertBefore(table, existingHeaderInfo);
        } else {
            var existingTopAlign = document.querySelectorAll('#header_info .topAlign')[0];
            existingTopAlign.parentNode.insertBefore(table, existingTopAlign.nextSibling);
        }
    }


    //delete premium promotion
    if (settings_cookies.general['remove__premium_promo']) {
        const style = document.createElement("style"); 
        style.innerHTML = ".premium_account_hint { display: none !important; }"; 
        document.head.appendChild(style);
    }

}