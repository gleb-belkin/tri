/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */



/**
 * Comment
 */
function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}


function trace(message) {
    var tracePanel = $("#tracePanel");
    tracePanel.html(tracePanel.html() + message + '<br>');
    return message;
}

/**
 * Comment
 */
function traceObject(object) {
    var str = '';
    for (var prop in object) {
        str += '|' + prop + ': ' + object[prop] + '<br>';
    }
    return trace(str);
}


/**
 * Filters user input allowing only numbers.
 * @param {object} e - Event object.
 */
function inputNumberFilter(e) {
// Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode === 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
    }
// Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}


/**
 * Saves rule to server.
 * @param ruleString
 */
function prepareRuleRequestString(ruleString) {
    return '\'' + ruleString + encodeURI('#') + '\'';
}


/**
 * Locks screen.
 */
function textFieldIsValid(value) {
    return value.length !== 0;
}
/**
 * Locks screen.
 */
function numericFieldIsValid(value) {
    return $.isNumeric(value);
}
/**
 * Locks screen.
 */
function dateFieldIsValid(value) {
    return value.length !== 0;
}
/**
 * Locks screen.
 */
function dropdownFieldIsValid(value) {
    return value.length !== 0;
}
