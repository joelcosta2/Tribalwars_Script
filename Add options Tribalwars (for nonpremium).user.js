// ==UserScript==
// @name         Add options Tribalwars (for nonpremium)
// @version      1.6.1
// @description  NavigationArrors; VillagesList; NotesOnVillage (in progress)
// @author       kilwilll
// @updateURL https://github.com/joelcosta2/Tribalwars_Script/raw/master/Add%20options%20Tribalwars%20(for%20nonpremium).user.js
// @downloadURL https://github.com/joelcosta2/Tribalwars_Script/raw/master/Add%20options%20Tribalwars%20(for%20nonpremium).user.js
// @include https://pt*.tribalwars.com.pt/*
// ==/UserScript==
(function() {
    'use strict';

    //VARIAVEIS GLOBAIS - configuraçoes de assets:
    //false para nao mostrar; true para mostrar
    var mostrarSetas = true;
    var mostrarListaAldeias = false;
    var usarAtalhosTrocarAldeias = true;
    var mostrarNotes = true;


    var villageList = {
        '001 - Valhalla': '....'
    };
    var jsonFromCookies,
        currentURL = document.location.href,
        currentVilageIndex,
        textSelected;

    init();

     function init () {
        jsonFromCookies = getCookie('villages_show');
         listenTextAreas();
        var urlPage = document.location.href;

        if(jsonFromCookies){
            villageList = JSON.parse(jsonFromCookies);
            setCookieCurrentVillage();
            if(urlPage.includes("screen=overview") && !urlPage.includes("screen=overview_villages")){
                //so na pagina overview
                insertVillagesListColumn();
                setNotesOverview();
            }
            //em todas as paginas
            insertNavigationArrows();
            defineKeyboardShortcuts();

        } else {
            alert("Vai a 'Visualizações Gerais' para carregar a lista de aldeias.");
        }

     }

    function toggleElement (element) {
        var elementToToggle = document.getElementById(element);
        if (elementToToggle.style.display === 'none'){
            elementToToggle.style.display = 'contents';
        } else {
            elementToToggle.style.display = 'none';
        }
        console.log("abre-te sesamo",elementToToggle);
    }

    function loadNote () {
        var cookieNotesJson = getCookie('vilagges_notes');
        var notesArray = cookieNotesJson ? JSON.parse(cookieNotesJson) : [];
        var textToShow = notesArray[currentVilageIndex];
        if(textToShow !== ''){
            // village_note_script show this
            toggleElement('village_note_script');
            //set text to village-note-body_script
            var textPlacer = document.getElementById('village-note-body_script');
            textPlacer.textContent = textToShow;

        }
    }

    function saveNote () {
        var textToSave = document.getElementById('message_note_script').value;
        var currentCookieValue = getCookie('vilagges_notes');
        var notesArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
        notesArray[currentVilageIndex] = textToSave;
        var jsonToSave = JSON.stringify(notesArray);
        setCookie('vilagges_notes',jsonToSave,100000000000000);
        toggleElement('note_body_edit');
        loadNote();
        toggleElement('edit_notes_link_script');
    }

    function openEditModeNote() {
        listenTextAreas();
        var currentCookieValue = getCookie('vilagges_notes');
        var notesArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
        document.getElementById('message_note_script').value = notesArray[currentVilageIndex];
        toggleElement('note_body_edit');
        document.getElementById('village_note_script').style.display = 'none';
        document.getElementById('edit_notes_link_script').style.display = 'none';
    }

    function setNotesOverview (){
        if(mostrarNotes){
            var leftColoumn = document.getElementById('leftcolumn');
            var htmlInject = '<div id="show_notes_script" class="vis moveable widget "><h4 class="head with-button ui-sortable-handle"><img id="mini_notes_script" class="widget-button" src="graphic/minus.png">Bloco de notas</h4><div class="widget_content" style="display: block;"><table width="100%"><tbody><tr id="village_note_script" style="display:none;"><td><div class="village-note"><div id="village-note-body_script" style="white-space: pre-wrap;" class="village-note-body"></div></div></td></tr><tr id="note_body_edit" style="display:none"><td><div class="village-note"><div style="width:100%; overflow:hidden;"><div><textarea id="message_note_script" name="note" style="width:97%;" rows="10" cols="40"></textarea></div><div><a id="note_submit_button_script" class="btn btn-default">Guardar</a></div></div><div class="village-note-body"></div></div></td></tr><tr><td><a id="edit_notes_link_script">» Editar</a></td></tr></tbody></table></div></div>'
            leftColoumn.innerHTML = htmlInject + leftColoumn.innerHTML;

            var editButton = document.getElementById('edit_notes_link_script');
            var btnSaveNote = document.getElementById('note_submit_button_script');
            var minNotes = document.getElementById('mini_notes_script');

            minNotes.onclick = function() {VillageOverview.toggleWidget( 'show_notes_script', this );};
            editButton.onclick = function() {openEditModeNote()};
            btnSaveNote.onclick = function() {saveNote()};
            loadNote();
        }
    }


    function listenTextAreas () {
        // get all inputs || textareas
        var textAreas=document.getElementsByTagName('textarea');
        var i=0;
        for(i=0;i<textAreas.length;i++){
            textAreas[i].onfocus = function(){textSelected=true};
            textAreas[i].onblur = function(){textSelected=false};
        }
        textAreas=document.getElementsByTagName('input');
        for(i=0;i<textAreas.length;i++){
            textAreas[i].onfocus = function(){textSelected=true};
            textAreas[i].onblur = function(){textSelected=false};
        }
    }

    function defineKeyboardShortcuts (){
        if(usarAtalhosTrocarAldeias){
            $(document).keydown(function(evt){
                if (evt.keyCode==65 && !textSelected){
                    evt.preventDefault();
                    previousVillage();
                }
            });
            $(document).keydown(function(evt){
                if (evt.keyCode==68 && !textSelected){
                    evt.preventDefault();
                    nextVillage();
                }
            });
        }
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function sizeOfObject (obj) {
         var size = 0, key;
         for (key in obj) {
             if (obj.hasOwnProperty(key)) size++;
         }
         return size;
     }

    function getVillagesHTML () {
         var i = 0,
             villgersNum = sizeOfObject(villageList);

         var villagesDataUrl = '';

         for(i = 0; i<villgersNum; i++){
             var url = villageList[i].url,
                name = villageList[i].name;

             villagesDataUrl = villagesDataUrl + "<tr><td style='' class=''><a class='' href='"+url+"'><span class='icon header village'></span>"+name+"</a></td></tr>"
            }
         return villagesDataUrl;
     }

     function insertVillagesListColumn () {
         if(mostrarListaAldeias){
            var rightlColoumn = document.getElementById('rightcolumn');
            var villagesDataUrl = getVillagesHTML();
            var villagersHtmlInject = "<div style='display: block'><table id='vilage_overview_table' class='vis bordered-table' width='100%' style='vertical-align: middle;'><tbody>"+villagesDataUrl+"</tbody></table></div>"
            var htmlInject = '<div id="show_villages" class="vis moveable hidden_widget"><h4 class="head with-button"><img id="mini_list_villages" class="widget-button" src="graphic/minus.png">Aldeias</h4>'+villagersHtmlInject+'</div></div>';

            rightlColoumn.innerHTML = htmlInject + rightlColoumn.innerHTML;

            var minVillagesList = document.getElementById('mini_list_villages');
            minNotes.onclick = function() {VillageOverview.toggleWidget( 'mini_list_villages', this );};
         }
     }

     function prepareLinkToArrows (goToUrl) {
        var str = currentURL,
            temp = str.indexOf("="),
            temp2 = str.indexOf("&",temp),
            urlFirst = str.slice(0, temp+1),
            urlLast = str.slice(temp2);

         // substituir por cookie 'global_village_id
            temp = goToUrl.indexOf("=");
            temp2 = goToUrl.indexOf("&",temp);

        var villagenumber = goToUrl.slice(temp+1, temp2);

        var FINALURL = urlFirst + villagenumber + urlLast;

        return FINALURL;
     }

     function setCookieCurrentVillage() {
        var str = currentURL;
        var temp = str.indexOf("="),
            temp2 = str.indexOf("&",temp),
            villageID = str.slice(temp+1, temp2);

        var i = 0,
            villgersNum = sizeOfObject(villageList);

        for(i = 0; i<villgersNum; i++){
             var urlTemp = villageList[i].url;
             if(urlTemp.includes(villageID)){
                currentVilageIndex = i;
                 setCookie('current_vilage',currentVilageIndex,1000000000000);
                return;
             }
        }
     }

     function nextVillage () {
         var goToUrl;
         if(villageList[currentVilageIndex+1]){
            goToUrl= villageList[currentVilageIndex+1].url;
         } else {
            goToUrl = villageList[0].url;
         }

         document.location.href = prepareLinkToArrows(goToUrl);
     }

     function previousVillage () {
         var goToUrl;
         if(villageList[currentVilageIndex-1]){
            goToUrl = villageList[currentVilageIndex-1].url;
         } else {
            goToUrl = villageList[sizeOfObject(villageList)-1].url;
         }

         document.location.href = prepareLinkToArrows(goToUrl);
     }

     function insertNavigationArrows () {
         if(mostrarSetas){
            var menu_row1_container = document.getElementById('menu_row2');
         var htmlToInject = '<td class="box-item icon-box separate arrowCell"><a id="village_switch_previous" class="village_switch_link" accesskey="a"><span class="arrowLeft"> </span></a></td><td class="box-item icon-box arrowCell"><a id="village_switch_next" class="village_switch_link" accesskey="d"><span class="arrowRight"> </span></a></td>';

         menu_row1_container.innerHTML = htmlToInject + menu_row1_container.innerHTML;

         var leftArrowContainer = document.getElementById('village_switch_previous');
         var rightArrowContainer = document.getElementById('village_switch_next');

         leftArrowContainer.onclick = function() {previousVillage()};
         rightArrowContainer.onclick = function() {nextVillage()};
            }
    }

})();