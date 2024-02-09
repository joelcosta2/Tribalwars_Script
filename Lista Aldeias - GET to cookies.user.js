// ==UserScript==
// @name         Lista Aldeias - GET to cookies
// @version      1.1
// @description  kilwilll LDA.
// @author       kilwilll
// @include https://pt*.tribalwars.com.pt/*screen=overview_villages
// ==/UserScript==
(function () {
    'use strict';

    var villageList = {};

    function sizeOfObject(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    init();

    function init() {
        var eachRow = document.getElementById('production_table').getElementsByTagName('tbody')[0].getElementsByTagName('tr')

        var numVillages = sizeOfObject(eachRow);
        var villageList = {};
        var i = 0;

        for (i = 1; i < numVillages; i++) {
            var url = eachRow[i].getElementsByTagName('td')[0].getElementsByTagName('span')[0].getElementsByTagName('span')[0].getElementsByTagName('a')[0].href; //url;
            var name = eachRow[i].getElementsByTagName('td')[0].getElementsByTagName('span')[0].getElementsByTagName('span')[0].getElementsByTagName('a')[0].getElementsByTagName('span')[0].innerText;;
            var temp = {
                name: name.split("(")[0],
                url: url
            };

            villageList[i - 1] = temp;

        }
        var jsonToSave = JSON.stringify(villageList);

        document.cookie = "villages_show=" + jsonToSave + ";expires=Wed, 18 Dec 2040 12:00:00 GMT";
    }
})();