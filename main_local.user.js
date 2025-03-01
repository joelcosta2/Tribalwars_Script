// ADD HERE LOCAL TAMPERMONKEY SETTINGS

(function () {
    'use strict';
    init();
    var villageList;
    var widgetsInjectFunctions;
    function init() {
        widgetsInjectFunctions = {
            'village_list': injectVillagesListWidget,
            'notepad': injectNotepadWidget,
            'building_queue': fetchBuildQueueWidget,
            'recruit_troops': injectRecruitTroopsWidget
        };
        restoreTimeouts();
        prepareLocalStorageItems();
        if (!document.getElementById('mobileContent')) {
            start();
            testAntiBot();  
        }
    }
})();