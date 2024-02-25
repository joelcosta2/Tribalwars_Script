// Villages Arrows
function prepareLinkToArrows(goToUrl) {
    var str = document.location.href,
        temp = str.indexOf("="),
        temp2 = str.indexOf("&", temp),
        urlFirst = str.slice(0, temp + 1),
        urlLast = str.slice(temp2);

    // substituir por cookie 'global_village_id
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
    if (settings_cookies.general['show__navigation_bar']) {
        var urlsObject = {
            "Main": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/main3.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=main"
            },
            "Barracks": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/barracks2.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=barracks"
            },
            "Stable": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/stable2.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=stable"
            },
            "Watchtower": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/watchtower1.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=watchtower"
            },
            "Smith": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/smith2.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=smith"
            },
            "Place": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/place1.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=place"
            },
            "Market": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/market2.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=market"
            },
            "Wall": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/buildings/mid/wall2.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=wall"
            },
            "Busca Minuciosa": {
                img: "https://dspt.innogamescdn.com/asset/7fe7ab60/graphic/scavenging/options/3.png",
                href: "/game.php?village=" + game_data.village.id + "&screen=place&mode=scavenge"
            },
            "Start Test": {
                img: "https://cdn-icons-png.flaticon.com/512/2285/2285551.png",
                run: functionToCallTest
            }
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
        for (var key in urlsObject) {
            index++;
            if (urlsObject.hasOwnProperty(key)) {
                var boxTd = document.createElement('td');
                boxTd.classList.add('box-item', 'icon-box', 'nav-bar-item');

                var link = document.createElement('a');
                if (urlsObject[key].href) {
                    link.href = urlsObject[key].href;
                } else {
                    if (localStorage.getItem(key)) {
                        alert('ja esta a correr');
                    } else {
                        link.onclick = function (event) {
                            //setFunctionOnTimeOut('test-call-' + index, urlsObject[key].run, timeToMilliseconds('0:02:00'));
                            urlsObject[key].run();
                        }

                    }
                }
                link.setAttribute('data-title', key);
                var img = document.createElement('img');
                img.src = urlsObject[key].img;
                img.classList.add('menu-event-icon')
                img.style.maxHeight = '18px';
                link.appendChild(img);
                boxTd.appendChild(link);
                boxTr.appendChild(boxTd);
                img.addEventListener('mouseover', function (event) {
                    showTooltip(event.target, true);
                });
                img.addEventListener('mouseleave', function (event) {
                    showTooltip(event.target, false);
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

        if (false) {
            var existingHeaderInfo = document.getElementById('header_info');
            existingHeaderInfo.parentNode.insertBefore(table, existingHeaderInfo.nextSibling);
        } else {
            var existingTopAlign = document.querySelectorAll('#header_info .topAlign')[0];
            existingTopAlign.parentNode.insertBefore(table, existingTopAlign.nextSibling);
        }
    }


    //delete premiun promotion:
    if (settings_cookies.general['remove__premiun_promo']) {
        var premiunPromo = document.querySelectorAll('.icon.header.premium')[0];
        var parent = premiunPromo;

        while (parent && !parent.classList.contains('topAlign')) {
            parent = parent.parentElement;
        }
        if (parent) {
            parent.remove();
        }
        var premiunPromoHint = document.querySelectorAll('.premium_account_hint.main')[0];
        if (premiunPromoHint) {
            premiunPromoHint.remove();
        }
    }

}