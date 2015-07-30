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
    "custom/js/config.js",
    "custom/js/constants.js",
    "custom/js/backend.js",
    "custom/js/backend_helpers.js",
    "custom/js/general_helpers.js",
    "custom/js/general.js",
    "custom/js/edc.js",
    "custom/js/gla.js",
    "custom/js/rec.js"
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
    loadIncidentTypeData();
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





