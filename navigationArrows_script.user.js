// Villages Arrows
function prepareLinkToArrows(goToUrl) {
    var str = currentURL,
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
    var goToUrl;
    if (villageList[currentVillageIndex + 1]) {
        goToUrl = villageList[currentVillageIndex + 1].url;
    } else {
        goToUrl = villageList[0].url;
    }

    document.location.href = prepareLinkToArrows(goToUrl);
}

function previousVillage() {
    var goToUrl;
    if (villageList[currentVillageIndex - 1]) {
        goToUrl = villageList[currentVillageIndex - 1].url;
    } else {
        goToUrl = villageList[sizeOfObject(villageList) - 1].url;
    }

    document.location.href = prepareLinkToArrows(goToUrl);
}

function insertNavigationArrows() {
    if (villageNavigationArrows) {
        var menu_row1_container = document.getElementById('menu_row2');
        var htmlToInject = '<td class="box-item icon-box separate arrowCell"><a id="village_switch_previous" class="village_switch_link" accesskey="a"><span class="arrowLeft" style="cursor:pointer;"> </span></a></td><td class="box-item icon-box arrowCell"><a id="village_switch_next" class="village_switch_link" accesskey="d"><span class="arrowRight" style="cursor:pointer;"> </span></a></td>';

        menu_row1_container.innerHTML = htmlToInject + menu_row1_container.innerHTML;

        var leftArrowContainer = document.getElementById('village_switch_previous');
        var rightArrowContainer = document.getElementById('village_switch_next');

        leftArrowContainer.onclick = function () { previousVillage() };
        rightArrowContainer.onclick = function () { nextVillage() };
    }
}