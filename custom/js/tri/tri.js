/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */

/*
 * Execution
 */
(function (jQuery) {

    var getScript = jQuery.getScript;

    jQuery.getScript = function (resources, callback) {

        var // reference declaration & localization
            length = resources.length,
            handler = function () {
                counter++;
            },
            deferredCalls = [],
            counter = 0,
            idx = 0;

        for (; idx < length; idx++) {
            deferredCalls.push(
                getScript(resources[idx], handler)
            );
        }

        jQuery.when.apply(null, deferredCalls).then(function () {
            callback && callback();
        });
    };

})(jQuery);

var scripts = [
    "custom/js/tri/config.js",
    "custom/js/tri/constants.js",
    "custom/js/tri/backend.js",
    "custom/js/tri/backend_helpers.js",
    "custom/js/tri/general_helpers.js",
    "custom/js/tri/general.js",
    "custom/js/tri/edc.js",
    "custom/js/tri/gla.js",
    "custom/js/tri/rec.js",
    "custom/js/tri/rec_backend.js"
];


jQuery.getScript(scripts, function () {
    rock();
});

/*
 * Methods
 */

/**
 * Comment
 */
function rock() {
    preInit();
    loadIncidentTypeData(function (incidentTypeResult) {
            incidentTypeData = incidentTypeResult.data;
            backendLogId = incidentTypeResult.dt_suf;
            //loadCorrData();
            loadRulesData(function (rulesDataResult) {
                    availableTrnFields = rulesDataResult.data.availableTrnFields.sort(
                        function (a, b) {
                            if (a.lbl < b.lbl)
                                return -1;
                            if (a.lbl > b.lbl)
                                return 1;
                            return 0;
                        });
                    dropdownListItems = rulesDataResult.data.dropdownListItems;
                    edcRulesData = rulesDataResult.data.edcRulesData;
                    glaRule1Data = rulesDataResult.data.glaRule1Data;
                    glaRule2Data = rulesDataResult.data.glaRule2Data;
                    glaRule3Data = rulesDataResult.data.glaRule3Data;
                    corrList = rulesDataResult.data.corrList;
                    backendLogId = rulesDataResult.dt_suf;
                    recRulesData = rulesDataResult.data.recRulesData;
                    //todo parse real availableEvtFields from the server response
                    availableEvtFields = rulesDataResult.data.availableTrnFields.sort(
                        function (a, b) {
                            if (a.lbl < b.lbl)
                                return -1;
                            if (a.lbl > b.lbl)
                                return 1;
                            return 0;
                        });
                    //loadUsedDropdownLists();
                    init();
                },
                function () {
                    showMessage(languageConstants.general.messagePopup.loadRulesData.fail);
                    unlockScreen();
                });
        },
        function () {
            showMessage(languageConstants.general.messagePopup.loadIncidentTypeData.fail);
            unlockScreen();
        });
}
/**
 * Comment
 */



function preInit() {
    RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    initLockScreenPopup();
    initMessagePopup();
    lockScreen();
    initTracePanel();
}

/**
 * Comment
 */
function init() {
    initGeneral();
    initEdc();
    initGla();
    initRec();
    finishInit();
}


/**
 * Comment
 */
function finishInit() {
    unlockScreen();
    showGeneralLayout();
    $('#menuTemplates').show();
}

/**
 * Comment
 */
function showGeneralLayout() {
    $('#generalLayout').show();
}
/**
 * Comment
 */
function hideGeneralLayout() {
    $('#generalLayout').hide();
}





