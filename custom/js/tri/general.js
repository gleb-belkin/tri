/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */


//lbl = label
//avl = isUserAvailable in GLA rule 1
//lid = listId

var availableTrnFields = [];
var availableEvtFields = [];

//lbl = label
//lid = listId

var trnDropdownListItems = [];
var evtDropdownListItems = [];

//lbl = label

var availableOperands = [
    {id: 1, name: '>', lbl: ">"},
    {id: 2, name: '>=', lbl: ">="},
    {id: 3, name: '<=', lbl: "<="},
    {id: 4, name: '<', lbl: "<"},
    {id: 5, name: '=', lbl: "="},
    {id: 6, name: '<>', lbl: "!="},
    {id: 7, name: 'LIKE', lbl: "содержит"},
    {id: 8, name: 'NOT LIKE', lbl: "не содержит"},
    {id: 9, name: 'LIKE', lbl: "начинается с"},
    {id: 10, name: 'NOT LIKE', lbl: "не начинается с"},
    {id: 11, name: 'LIKE', lbl: "оканчивается на"},
    {id: 12, name: 'NOT LIKE', lbl: "не оканчивается на"}
];

var fieldTypeOperands = {
    text: [availableOperands[4], availableOperands[5], availableOperands[6], availableOperands[7], availableOperands[8], availableOperands[9], availableOperands[10], availableOperands[11]],
    number: [availableOperands[0], availableOperands[1], availableOperands[2], availableOperands[3], availableOperands[4], availableOperands[5]],
    date: [availableOperands[0], availableOperands[1], availableOperands[2], availableOperands[3], availableOperands[4], availableOperands[5]],
    dropdown: [availableOperands[0], availableOperands[1], availableOperands[2], availableOperands[3], availableOperands[4], availableOperands[5]]
};

//lbl = label

var availableLogicalOperands = [
    {id: 1, name: 'AND', lbl: "AND"},
    {id: 2, name: 'OR', lbl: "OR"}
];

var bracketMenuItems = [
    {id: 1, lbl: "+1"},
    {id: 2, lbl: "-1"}
];

//lbl = label

var emptyLogicalOperandData = {id: -1, name: '', lbl: ''};

//fid = fieldId
//oid = operandId
//iv = inputValue
//ivid = inputValueId
//loid = logicalOperandId
//lbrl = leftBracketLabel
//rbrl = rightBracketLabel
//rdo = isReadOnly

var initialConditionData = {fid: -1, oid: -1, iv: '', ivid: -1, loid: -1, lbrl: '', rbrl: '', rdo: 0, rqr: 0};

var activeRuleProcessType, currentActiveAddRuleButton, addConditionMenu, addBracketMenu, currentActiveBracketButton, currentActiveBracketButtonSign, lockScreenPopup, messagePopup, ruleHistoryPopup, confirmActionPopup;

var backendLogId = '';

var activeRuleProcessTypeConstants = {
    edc: 'edc',
    gl1: 'gl1',
    gl2: 'gl2',
    gl3: 'gl3',
    rec: 'rec'
};

var messagePopupOkButtonData, messagePopupCancelButtonData;
var traceOnce = 0;

/**
 * Comment
 */
function initGeneral() {
    $(document).prop('title', languageConstants.general.pageTitle);
    $('a[href*=\'processTabs-1\']').html(languageConstants.general.edcLabel);
    $('a[href*=\'processTabs-2\']').html(languageConstants.general.glaLabel);
    $('a[href*=\'processTabs-3\']').html(languageConstants.general.recLabel);
    //initTemplates();
    initLogicalOperandsMenu();
    initBracketMenu();
    initRuleHistoryPopup();
    initLogoutButton();
    $("#processTabs").tabs({
        activate: function (event, ui) {
            switch ($(':first-child', ui.newPanel).prop('id')) {
                case 'edcTab':
                    activeRuleProcessType = activeRuleProcessTypeConstants.edc;
                    break;
                case 'glaTab':
                    activeRuleProcessType = $('#ruleTypeSelector').data('type');
                    break;
                case 'recTab':
                    activeRuleProcessType = activeRuleProcessTypeConstants.rec;
                    break;
            }
        },
        create: function (event, ui) {
            switch ($(':first-child', ui.panel).prop('id')) {
                case 'edcTab':
                    activeRuleProcessType = activeRuleProcessTypeConstants.edc;
                    break;
                case 'glaTab':
                    //
                    break;
                case 'recTab':
                    activeRuleProcessType = activeRuleProcessTypeConstants.rec;
                    break;
            }
        }
    });
}


/**
 * Comment
 */
function initLogoutButton() {
    $("#logoutButtonContainer").find("button").button({
        label: languageConstants.general.logoutButtonLabel,
        icons: {
            secondary: "ui-icon-close"
        }
    }).click(function () {
        openConfirmActionPopup(languageConstants.general.confirmationPopup.general.logoutNote, false, true, "", logoutButtonClickHandler);

    }).focus(function () {
        this.blur();
    });
}
/**
 * Comment
 */
function initTracePanel() {
    $("#clearTracePanelButtonContainer").find("button").button().click(function () {
        $('#tracePanel').html('');
    });
    $('#tracePanelContainer').show();
}
/**
 * Comment
 */
function initTemplates() {

}
/**
 * Comment
 */
function initLockScreenPopup() {
    var lockScreenMessageBlock = $("#lockScreenMessage");
    lockScreenMessageBlock.append($("<img>").prop("src", lockMessagePopupImagePath));
    lockScreenPopup = $("#lockScreenMessage").dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        dialogClass: "no-close",
        minWidth: 30,
        minHeight: 30,
        width: 60,
        height: 55
    });
    lockScreenPopup.show();
}


function initMessagePopupButtons() {
    messagePopupOkButtonData = {
        text: languageConstants.general.messagePopup.okButtonLabel
    };
    messagePopupCancelButtonData = {
        text: languageConstants.general.messagePopup.cancelButtonLabel,
        click: function () {
            $(this).dialog("close");
        }
    };
}
/**
 * Comment
 */
function initMessagePopup() {
    initMessagePopupButtons();
    messagePopup = $("#messagePopup").dialog({
        autoOpen: false,
        modal: false,
        draggable: false,
        resizable: false,
        dialogClass: "no-close",
        minWidth: 200,
        minHeight: 60/*,
         buttons: [
         {
         text: "Ok",
         click: function () {
         $(this).dialog("close");
         }
         }
         ]*/
    });
}
/**
 * Comment
 */
function showMessage(message, isModal, isCancelAvailable, okButtonCallback) {
    message = defaultFor(message, '');
    isModal = defaultFor(isModal, false);
    isCancelAvailable = defaultFor(isCancelAvailable, false);
    okButtonCallback = defaultFor(okButtonCallback, undefined);
    $('p', messagePopup).html(message);
    var popupButtonsArray = [messagePopupOkButtonData];
    if (isCancelAvailable) {
        popupButtonsArray.push(messagePopupCancelButtonData);
    }
    if (typeof okButtonCallback !== 'undefined') {
        messagePopupOkButtonData.click = function () {
            $(this).dialog("close");
            okButtonCallback();
        };
    } else {
        messagePopupOkButtonData.click = function () {
            $(this).dialog("close");
        };
    }
    messagePopup.dialog('option', 'buttons', popupButtonsArray);
    messagePopup.dialog('option', 'modal', isModal).dialog('open');
}


/**
 * Comment
 */
function initConfirmActionPopup() {
    confirmActionPopup = $("#confirmActionPopup").dialog({
        title: languageConstants.general.confirmationPopup.edc.title,
        autoOpen: false,
        modal: true,
        width: 315,
        buttons: [
            {
                text: languageConstants.general.confirmationPopup.edc.submitButtonLabel,
                click: function () {
                    var popup = $(this);
                    if (popup.data('inputIsRequired') == true && popup.find("textarea").val().length == 0) {
                        popup.find("#confirmActionPopupErrorPanel").html(popup.data('emptyInputErrorText'));
                        return;
                    }
                    if (typeof $(this).data('submitCallback') !== 'undefined') {
                        popup.data('submitCallback').apply(null, popup.data('submitCallbackArgs'));
                    }
                    popup.dialog("close");
                }
            },
            {
                text: languageConstants.general.confirmationPopup.edc.cancelButtonLabel,
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
}

/**
 * Comment
 */
function logoutButtonClickHandler() {
    logout();
}


/**
 * Comment
 */
function getRuleData(ruleType) {
    var name;
    //var processType = activeRuleProcessType;
    var incidentTypeId = '';
    var conditionsData;
    var ruleData;
    switch (activeRuleProcessType) {
        case activeRuleProcessTypeConstants.edc:
            name = $("#ruleNameInputContainer").find("input").val();
            incidentTypeId = $('#incidentTypeSelector', addEdcRulePopup).data('data').id;
            conditionsData = getConditionsData($('#rulesTable', addEdcRulePopup));
            ruleData = $.extend({}, initialEdcRuleData);
            ruleData.itid = incidentTypeId;
            ruleData.lbl = name;
            ruleData.cnds = conditionsData.list;
            break;
        case activeRuleProcessTypeConstants.gl1:
            name = '';
            conditionsData = getRuleFromBlock1();
            ruleData = glaRule1Data;
            break;
        case activeRuleProcessTypeConstants.gl2:
            name = '';
            conditionsData = getRuleFromBlock2();
            ruleData = glaRule2Data;
            break;
        case activeRuleProcessTypeConstants.gl3:
            name = '';
            conditionsData = getRuleFromBlock3();
            ruleData = glaRule3Data;
            break;
    }
    var conditionsWeb = conditionsData.web;
    var conditionsText = conditionsData.text;
    var conditionsSql = conditionsData.sql;
    var userComment = $('textarea', confirmActionPopup).val();
    var type = ruleType;
    var requestData = {
        name: name,
        processType: activeRuleProcessType,
        incidentTypeId: incidentTypeId,
        conditionsWeb: conditionsData.web,
        conditionsSql: conditionsData.sql,
        conditionsText: conditionsData.text,
        userComment: userComment,
        type: type
    };
    return {
        data: ruleData,
        requestData: requestData
    };
}

/**
 * Comment
 */
function initCheckbox(checkbox, block) {
    checkbox.change(function () {
        block.toggle($(this).prop('checked'));
    });
}


/**
 * Comment
 */
function initRuleHistoryPopup() {
    ruleHistoryPopup = $("#ruleHistoryPopup").dialog({
        title: languageConstants.general.ruleHistoryPopup.title,
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 600,
        buttons: [
            {
                text: languageConstants.general.ruleHistoryPopup.closeButtonLabel,
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
    $('p', ruleHistoryPopup).html(languageConstants.general.ruleHistoryPopup.introText);
}

/**
 * Initializes rule history popup elements list.
 * @param data - rule history elements list.
 */
function initHistoryPopupElementsContainer(data) {
    var container = $("#ruleHistoryElementsContainer", ruleHistoryPopup);
    container.html('');
    for (var i = 0; i < data.length; i++) {
        var div = $('<div></div>');
        div.prop('class', 'ruleHistoryElement');
        div.data('data', data[i]);
        var dateText = $('<p><b>' + languageConstants.general.ruleHistoryPopup.historyElementDateLabel + '</b> ' + data[i].vf + '</p>');
        var userText = $('<p><b>' + languageConstants.general.ruleHistoryPopup.historyElementUserLabel + '</b> ' + data[i].usr + '</p>');
        var commentText = $('<p><b>' + languageConstants.general.ruleHistoryPopup.historyElementCommentLabel + '</b> ' + data[i].com + '</p>');
        var ruleDescriptionText = $('<p><b>' + languageConstants.general.ruleHistoryPopup.historyElementRuleDescriptionLabel + '</b> ' + data[i].rule_desc + '</p>');
        div.append(dateText).append(userText).append(ruleDescriptionText).append(commentText);
        //div.html(data[i].vf + ' || ' + data[i].usr + ' || ' + data[i].com + ' || ' + data[i].rule_desc);
        container.append(div);
    }
}


/**
 * Comment
 */
function getConditionsData(rulesTable) {
    var conditionsArray = [];
    var conditionsText = '';
    var conditionsSql = '';
    $.each(rulesTable.data('rules'), function (index, rule) {
        updateConditionData(rule);
        conditionsArray.push($.extend({}, rule.data('data')));
        if (index !== 0) {
            conditionsText += ' ';
            conditionsSql += ' ';
        }
        conditionsText += rule.data('text');
        conditionsSql += rule.data('sql');
    });
    return {web: JSON.stringify(conditionsArray), text: conditionsText, sql: conditionsSql, list: conditionsArray};
}

/**
 * Comment
 */
function getRecConditionsData(conditionsTable) {
    var conditionsArray = [];
    var conditionsText = '';
    var conditionsCode = '';
    $.each(conditionsTable.data('rules'), function (index, conditionLayoutElement) {
        var conditionData = getRecConditionData(conditionLayoutElement);
        conditionsArray.push($.extend({}, conditionData.web));
        if (index !== 0) {
            conditionsText += ' ';
            //todo: move delimiter to constants
            conditionsCode += ' @ ';
        }
        conditionsText += conditionData.text;
        conditionsCode += conditionData.code;
    });
    return {web: JSON.stringify(conditionsArray), text: conditionsText, code: conditionsCode, list: conditionsArray};
}

/**
 * Comment
 */
function updateConditionData(condition) {
    condition.data('data').fid = $('#propertySelector option:selected', condition).data('data').id;
    condition.data('data').oid = $('#operandSelector option:selected', condition).data('data').id;
    var fieldType = $('#propertySelector option:selected', condition).data('data').type;
    var sqlStringPrefix = condition.data('data').oid === 11 || condition.data('data').oid === 12 ? '%' : '';
    var sqlStringSuffix = condition.data('data').oid === 9 || condition.data('data').oid === 10 ? '%' : '';
    var fieldValue = getInputFieldValue($('#inputField', condition), fieldType, sqlStringPrefix, sqlStringSuffix);
    condition.data('data').iv = fieldValue.inputValue;
    condition.data('data').ivid = fieldValue.inputValueId;
    condition.data('data').loid = $('#operandButton button', condition).data('data').id;
    condition.data('data').lbrl = $('#leftBracketButton button', condition).button('option', 'label');
    condition.data('data').rbrl = $('#rightBracketButton button', condition).button('option', 'label');
    var text = '';
    text += condition.data('data').lbrl;
    text += $('#propertySelector option:selected', condition).data('data').lbl + ' ';
    text += $('#operandSelector option:selected', condition).data('data').lbl + ' ';
    text += condition.data('data').iv;
    text += condition.data('data').rbrl + ' ';
    text += $('#operandButton button', condition).data('data').lbl;
    condition.data('text', $.trim(text));
    //condition.data('text', $.trim(condition.data('data').lbrl + $('#propertySelector option:selected', condition).data('data').lbl + ' ' + $('#operandSelector option:selected', condition).data('data').lbl + ' ' + condition.data('data').iv + condition.data('data').rbrl + ' ' + $('#operandButton button', condition).data('data').lbl));
    //todo: substitute value with code for dimentional fields
    var sql = '';
    sql += condition.data('data').lbrl;
    sql += $('#propertySelector option:selected', condition).data('data').name + ' ';
    sql += $('#operandSelector option:selected', condition).data('data').name + ' ';
    sql += fieldValue.sqlValue;
    sql += condition.data('data').rbrl + ' ';
    sql += $('#operandButton button', condition).data('data').name;
    condition.data('sql', $.trim(sql));
    //condition.data('sql', $.trim(condition.data('data').lbrl + $('#propertySelector option:selected', condition).data('data').name + ' ' + $('#operandSelector option:selected', condition).data('data').name + ' ' + fieldValue.sqlValue + condition.data('data').rbrl + ' ' + $('#operandButton button', condition).data('data').name));
}

/**
 * Comment
 */
function getRecConditionData(conditionLayoutElement) {
    var trnPropertySelectorData = $('#trnPropertySelector option:selected', conditionLayoutElement).data('data');
    var operandSelectorData = $('#operandSelector option:selected', conditionLayoutElement).data('data');
    var evtPropertySelectorData = $('#evtPropertySelector option:selected', conditionLayoutElement).data('data');
    var relativeWeightInputValue = $('#relativeWeight input', conditionLayoutElement).val();
    var web = $.extend({}, initialRecConditionData);
    web.tfid = trnPropertySelectorData.id;
    web.oid = operandSelectorData.id;
    web.efid = evtPropertySelectorData.id;
    web.rw = relativeWeightInputValue;
    var text = '';
    text += trnPropertySelectorData.lbl + ' ';
    text += operandSelectorData.lbl + ' ';
    text += evtPropertySelectorData.lbl + ' ';
    text += 'RW' + relativeWeightInputValue;
    //todo: move prefixes to constants
    var code = '';
    code += 't.' + trnPropertySelectorData.name + ' ';
    code += operandSelectorData.name + ' ';
    code += 'e.' + evtPropertySelectorData.name + ' ';
    //todo: move delimiter to constants
    code += '# ';
    code += relativeWeightInputValue;
    return {web: web, text: text, code: code};
}


/**
 * Comment
 */
function getInputFieldValue(inputFieldContainer, inputFieldType, sqlStringPrefix, sqlStringSuffix) {
    sqlStringPrefix = defaultFor(sqlStringPrefix, '');
    sqlStringSuffix = defaultFor(sqlStringSuffix, '');
    var inputValue;
    var inputValueId = -1;
    var sqlValue;
    switch (inputFieldType) {
        case inputFieldTypeConstants.text:
            inputValue = $('input', inputFieldContainer).val();
            sqlValue = '\'' + sqlStringPrefix + $('input', inputFieldContainer).val() + sqlStringSuffix + '\'';
            break;
        case inputFieldTypeConstants.number:
            inputValue = $('input', inputFieldContainer).val();
            sqlValue = $('input', inputFieldContainer).val();
            break;
        case inputFieldTypeConstants.date:
            inputValue = $('input', inputFieldContainer).val();
            sqlValue = "to_date('" + $('input', inputFieldContainer).val() + "', 'dd/mm/yyyy')";
            break;
        case inputFieldTypeConstants.dropdown:
            inputValue = $('option:selected', inputFieldContainer).data('data').name;
            inputValueId = $('option:selected', inputFieldContainer).data('data').id;
            sqlValue = "'" + $('option:selected', inputFieldContainer).data('data').name + "'";
            break;
    }
    return {inputValue: inputValue, inputValueId: inputValueId, sqlValue: sqlValue};
}


/**
 * Comment
 */
function initLogicalOperandsMenu() {
    var logicalOperandsMenuTemplate = $('#logicalOperandsMenuTemplate');
    for (var i = 0, max = availableLogicalOperands.length; i < max; i++) {
        var element = $('<li></li>');
        element.html(availableLogicalOperands[i].lbl);
        element.data('data', availableLogicalOperands[i]);
        logicalOperandsMenuTemplate.append(element);
    }
    addConditionMenu = logicalOperandsMenuTemplate.menu({
        select: function (event, ui) {
            var rulesTable = $("#rulesTable", currentActiveAddRuleButton.parent().parent());
            var conditionsType = rulesTable.data('type');
            if (typeof conditionsType === 'undefined') {
                return;
            }
            switch (activeRuleProcessType) {
                case activeRuleProcessTypeConstants.gl1:
                    addCondition(rulesTable, initialConditionData, conditionsType, true);
                    break;
                case activeRuleProcessTypeConstants.edc:
                case activeRuleProcessTypeConstants.gl2:
                case activeRuleProcessTypeConstants.gl3:
                    addCondition(rulesTable);
                    break;
                case activeRuleProcessTypeConstants.rec:
                    switch (conditionsType) {
                        case conditionTypeConstants.trn:
                        case conditionTypeConstants.evt:
                            addCondition(rulesTable, initialConditionData, conditionsType, true);
                            break;
                        case conditionTypeConstants.rec:
                            addRecCondition(rulesTable, initialRecConditionData);
                            break;
                    }
                    break;
            }

            var rulesArray = rulesTable.data('rules');
            initRuleLogicalOperandButton(rulesArray[rulesArray.length - 2], ui.item.data('data'));
            addEdcRulePopup.dialog('option', 'position', {my: "center", at: "center", of: window});
        }
    }).hide();
}

/**
 * Comment
 */
function initRuleLogicalOperandButton(rule, logicalOperandData) {
    $('#operandButton button', rule).button('option', 'label', logicalOperandData.lbl).data('data', logicalOperandData).show();
}


/**
 * Comment
 */
function addCondition(rulesTable, conditionData, conditionType, considerAvl) {
    conditionData = defaultFor(conditionData, initialConditionData);
    conditionType = defaultFor(conditionType, conditionTypeConstants.trn);
    considerAvl = defaultFor(considerAvl, false);
    var rule = $("#ruleTemplate").find("tr").eq(0).clone();
    rule.data('data', conditionData);
    rule.hide();
    rulesTable.append(rule);
    rulesTable.data('rules').push(rule);
    initCondition(rule, conditionType, considerAvl);
    rule.show();
}


/**
 * Comment
 */
function addRecCondition(rulesTable, ruleData, considerAvl) {
    ruleData = defaultFor(ruleData, initialRecConditionData);
    var rule = $("#recRuleTemplate").find("tr").eq(0).clone();
    rule.data('data', ruleData);
    rule.hide();
    rulesTable.append(rule);
    rulesTable.data('rules').push(rule);
    initRecCondition(rule, considerAvl);
    rule.show();
}


/**
 * Comment
 */
function initCondition(conditionContainer, conditionType, considerAvl) {
    var availableBusinessObjectFields = [];
    switch (conditionType) {
        case conditionTypeConstants.trn:
            availableBusinessObjectFields = availableTrnFields;
            break;
        case conditionTypeConstants.evt:
            availableBusinessObjectFields = availableEvtFields;
            break;
    }
    var ruleData = conditionContainer.data('data');
    //init left to right
    var inputFieldContainer = $('#inputField', conditionContainer);
    //
    //
    //left bracket button
    initBracketButton('#leftBracketButton', '(', conditionContainer);
    //business object property selector
    var fieldSelector = $('#propertySelector select', conditionContainer);
    for (var i = 0; i < availableBusinessObjectFields.length; i++) {
        if ((availableBusinessObjectFields[i].avl === 0 && considerAvl) && ruleData.rdo !== 1) {
            continue;
        }
        var option = $('<option>' + availableBusinessObjectFields[i].lbl + '</option>');
        option.data('data', availableBusinessObjectFields[i]);
        fieldSelector.append(option);
    }

    fieldSelector.selectmenu({
        select: function (event, ui) {
            initInputField(inputFieldContainer, ui.item.element.data('data'), conditionContainer, conditionType, false);
            initOperandSelector(ui.item.element.data('data'), conditionContainer);
        },
        open: function () {
            fieldSelector.selectmenu("refresh");
        }
    }).selectmenu("menuWidget").addClass("propertySelectorOverflow");
    if (typeof ruleData !== 'undefined') {
        $('option', fieldSelector).filter(function () {
            return $(this).data('data').id === ruleData.fid;
        }).attr('selected', true);
        if (ruleData.rdo === 1 || ruleData.rqr === 1) {
            fieldSelector.selectmenu('disable');
        }
    }
    fieldSelector.selectmenu("refresh");
    //operand selector
    initOperandSelector($('option:selected', fieldSelector).data('data'), conditionContainer);
    //input field
    initInputField(inputFieldContainer, $('option:selected', fieldSelector).data('data'), conditionContainer, conditionType);
    //right bracket button
    initBracketButton('#rightBracketButton', ')', conditionContainer);
    /*if (ruleData !== undefined) {
     rightBracketButton.button('option', 'label', ruleData.rbrl);
     if (ruleData.rdo === 1) {
     rightBracketButton.button('disable');
     }
     }*/
//operand button
    var operandButton = $('#operandButton button', conditionContainer);
    operandButton.button().hide();
    operandButton.click(function (event) {
        //
    });
    if (typeof ruleData !== 'undefined') {
        initOperandButtonData(operandButton, ruleData.loid, ruleData.rdo, ruleData.rqr);
    }
//remove button
    var removeButton = $('#remove', conditionContainer);
    removeButton.button({
        label: languageConstants.templates.rulesTable.removeButtonLabel,
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
    });
    //remove button initialisation
    var rulesTable = conditionContainer.parent().parent();
    var rulesArray = rulesTable.data('rules');
    if (rulesArray.length > 1 && !(typeof ruleData !== 'undefined' && (ruleData.rdo === 1 || ruleData.rqr === 1))) {
        removeButton.click(function () {
            var arrayIndex = $.inArray(conditionContainer, rulesArray);
            if (arrayIndex !== -1) {
                if (arrayIndex === rulesArray.length - 1) {
                    $('#operandButton button', rulesArray[arrayIndex - 1]).button('option', 'label', emptyLogicalOperandData.lbl).data('data', emptyLogicalOperandData).hide();
                } else {
                    $('#operandButton button', rulesArray[arrayIndex - 1]).button('option', 'label', $('#operandButton button', rulesArray[arrayIndex]).data('data').lbl).data('data', $('#operandButton button', rulesArray[arrayIndex]).data('data'));
                }
                rulesArray.splice(arrayIndex, 1);
                conditionContainer.remove();
            }
        });
    } else {
        removeButton.hide();
    }
}


/**
 * Comment
 */
function initOperandButtonData(operandButton, logicalOperandId, ruleIsReadOnly) {
    ruleIsReadOnly = defaultFor(ruleIsReadOnly, 0);
    var operandButtonData = $.grep(availableLogicalOperands,
        function (element) {
            return element.id === logicalOperandId;
        })[0];
    if (typeof operandButtonData !== 'undefined') {
        operandButton.data('data', operandButtonData);
        operandButton.button('option', 'label', operandButtonData.lbl).show();
    } else {
        operandButton.data('data', emptyLogicalOperandData);
    }

    if (ruleIsReadOnly === 1) {
        operandButton.button('disable');
    }
}


/**
 * Comment
 */
//todo: rework cheat with processType
function initAddConditionButton(conditionButton, processType) {
    conditionButton.button({
        label: languageConstants.templates.rulesTable.addConditionButtonLabel,
        icons: {
            primary: "ui-icon-plus",
            secondary: "ui-icon-triangle-1-s"
        }
    }).click(function () {
        if (typeof processType !== 'undefined') {
            activeRuleProcessType = processType;
        }
        currentActiveAddRuleButton = conditionButton;
        addConditionMenu.zIndex(conditionButton.zIndex() + 1);
        addConditionMenu.show().position({
            my: "left top",
            at: "left bottom",
            of: this
        });
        $(document).one("click", function () {
            addConditionMenu.hide();
        });
        return false;
    });
}


/**
 * Comment
 */
function initBracketButton(buttonContainerIdWithHash, buttonLabel, rule) {
    var button = $(buttonContainerIdWithHash + ' button', rule);
    button.button();
    var ruleData = rule.data('data');
    if (typeof ruleData !== 'undefined') {
        switch (buttonContainerIdWithHash) {
            case '#leftBracketButton':
                button.button('option', 'label', ruleData.lbrl);
                break;
            case '#rightBracketButton':
                button.button('option', 'label', ruleData.rbrl);
                break;
        }

        if (ruleData.rdo === 1 || ruleData.rqr === 1) {
            button.button('disable');
        }
    }
    button.click(function () {
        currentActiveBracketButton = button;
        currentActiveBracketButtonSign = buttonLabel;
        addBracketMenu.zIndex(addEdcRulePopup.zIndex() + 1);
        addBracketMenu.position({
            my: "left top",
            at: "left bottom",
            of: this,
            //By some means, 'using' is the only way found to place menu in correct position. Position of 'this' is calculated incorrectly.
            //note: probably, position increasing takes place on every outside click
            using: function () {
                addBracketMenu.css({
                    position: "absolute",
                    top: button.offset().top + button.height(),
                    left: button.offset().left
                });
            }
        }).show();
        $(document).one("click", function () {
            addBracketMenu.hide();
        });
        return false;
    });
    return button;
}


/**
 * Comment
 */
function initBracketMenu() {
    var bracketMenuTemplate = $('#bracketMenuTemplate');
    for (var i = 0, max = bracketMenuItems.length; i < max; i++) {
        var element = $('<li></li>');
        element.html(bracketMenuItems[i].lbl);
        element.data('data', bracketMenuItems[i]);
        bracketMenuTemplate.append(element);
    }
    addBracketMenu = bracketMenuTemplate.menu({
        select: function (event, ui) {
            var label = currentActiveBracketButton.button('option', 'label');
            switch (ui.item.html()) {
                case '+1':
                    label += currentActiveBracketButtonSign;
                    break;
                case '-1':
                    if (label.length === 0) {
                        return;
                    }
                    label = label.substr(0, label.length - 1);
                    break;
            }
            currentActiveBracketButton.button('option', 'label', label);
        }
    }).hide();
}

/**
 * Comment
 */
function initOperandSelector(fieldData, rule) {
    var ruleData = rule.data('data');
    var operandSelector = $("#operandSelector select", rule);
    operandSelector.html('');
    operandSelector.selectmenu({
        select: function (event, ui) {
        },
        open: function () {
            operandSelector.selectmenu("refresh");
        }
    }).selectmenu("menuWidget").addClass("operandSelectorOverflow");
    var operands;
    switch (fieldData.type) {
        case inputFieldTypeConstants.text:
            operands = fieldTypeOperands.text;
            break;
        case inputFieldTypeConstants.number:
            operands = fieldTypeOperands.number;
            break;
        case inputFieldTypeConstants.date:
            operands = fieldTypeOperands.date;
            break;
        case inputFieldTypeConstants.dropdown:
            operands = fieldTypeOperands.dropdown;
            break;
        default :
            return;
    }
    for (var i = 0; i < operands.length; i++) {
        var option = $('<option>' + operands[i].lbl + '</option>');
        option.data('data', operands[i]);
        operandSelector.append(option);
    }
    if (typeof ruleData !== 'undefined') {
        //check if operand is found
        $('option', operandSelector).filter(function () {
            return $(this).data('data').id === ruleData.oid;
        }).attr('selected', true);
        if (ruleData.rdo === 1 || ruleData.rqr === 1) {
            operandSelector.selectmenu('disable');
        }
    }
    operandSelector.selectmenu("refresh");
}


/**
 * Locks screen.
 */
function lockScreen() {
    //$.blockUI();
    $('body').css('cursor', 'progress');
    lockScreenPopup.dialog('open');
    lockScreenPopup.dialog('moveToTop');
}

/**
 * Unlocks screen.
 */
function unlockScreen() {
    //$.unblockUI();
    $('body').css('cursor', 'default');
    lockScreenPopup.dialog('close');
}

/**
 * Locks screen.
 */
function openConfirmActionPopup(noteText, inputAreaIsVisible, inputIsRequired, emptyInputErrorText, submitCallback, submitCallbackArgs) {
    noteText = defaultFor(noteText, '');
    inputAreaIsVisible = defaultFor(inputAreaIsVisible, true);
    resetConfirmActionPopup();
    $('textarea', confirmActionPopup).toggle(inputAreaIsVisible);
    confirmActionPopup.data('inputIsRequired', defaultFor(inputIsRequired, false));
    confirmActionPopup.data('emptyInputErrorText', defaultFor(emptyInputErrorText, ""));
    confirmActionPopup.data('submitCallback', submitCallback);
    confirmActionPopup.data('submitCallbackArgs', defaultFor(submitCallbackArgs, []));
    $('p', confirmActionPopup).html(noteText);
    confirmActionPopup.dialog('open');
}

/**
 * Locks screen.
 */
function resetConfirmActionPopup() {
    $('#confirmActionPopupErrorPanel', confirmActionPopup).html('');
    $('textarea', confirmActionPopup).val('');
}

/**
 * Locks screen.
 */
function checkRulesTableInputFormat(conditionTables) {
    var inputIsValid = true;
    conditionTables.each(function () {
        var rulesList = $(this).data('rules');
        if (typeof rulesList === 'undefined') {
            inputIsValid = false;
            return false;
        }
        for (var i = 0, max = rulesList.length; i < max; i++) {
            var fieldSelector = $('#propertySelector select', rulesList[i]);
            if (typeof fieldSelector === 'undefined') {
                continue;
            }
            var fieldData = $('option:selected', fieldSelector).data('data');
            if (typeof fieldData === 'undefined') {
                continue;
            }
            var inputElement = $('#inputField input', rulesList[i]);
            var fieldInputValue = getInputFieldValue($('#inputField', rulesList[i]), fieldData.type).inputValue;
            switch (fieldData.type) {
                case inputFieldTypeConstants.text:
                    if (!textFieldIsValid(fieldInputValue)) {
                        inputIsValid = false;
                        inputElement.addClass('invalidInput');
                    }
                    break;
                case inputFieldTypeConstants.number:
                    if (!numericFieldIsValid(fieldInputValue)) {
                        inputIsValid = false;
                        inputElement.addClass('invalidInput');
                    }
                    break;
                case inputFieldTypeConstants.date:
                    if (!dateFieldIsValid(fieldInputValue)) {
                        inputIsValid = false;
                        inputElement.addClass('invalidInput');
                    }
                    break;
                case inputFieldTypeConstants.dropdown:
                    if (!dropdownFieldIsValid(fieldInputValue)) {
                        inputIsValid = false;
                        inputElement.addClass('invalidInput');
                    }
                    break;
                default :
                    return false;
            }
        }
    });
    return inputIsValid;
}

/**
 * Locks screen.
 */
function checkRuleFormat() {
    var inputIsValid = true;
    switch (activeRuleProcessType) {
        case activeRuleProcessTypeConstants.edc:
            return checkRulesTableInputFormat($('#rulesTable', addEdcRulePopup));
        case activeRuleProcessTypeConstants.gl1:
            if ($("#ruleBlock1GeneralExceptionCheckboxContainer").find("input").prop('checked')) {
                inputIsValid = inputIsValid && checkRulesTableInputFormat($("#ruleBlock1GeneralExceptionConditionsBlock").find("#rulesTable"));
            }
            for (var i = 0, max = glaRule1Data.stel.length; i < max; i++) {
                if (!$('#ruleBlock1 #' + glaRule1Data.stel[i].laid + ' #controlChecboxContainer input').prop('checked')) {
                    continue;
                }
                inputIsValid = inputIsValid && checkRulesTableInputFormat($('#ruleBlock1 #' + glaRule1Data.stel[i].laid + ' #rulesTable'));

            }
            break;
        case activeRuleProcessTypeConstants.gl2:
            if ($("#ruleBlock2GeneralExceptionCheckboxContainer").find("input").prop('checked')) {
                var exceptionTableInputIsValid = checkRulesTableInputFormat($("#ruleBlock2GeneralExceptionBlock").find("#rulesTable"));
                inputIsValid = inputIsValid && exceptionTableInputIsValid;
            }
            var corrBlocksArray = $("#ruleBlock2FormBlocks").data('corrBlocks');
            for (var i = 0, max = corrBlocksArray.length; i < max; i++) {
                if (!$('#ruleBlock2 #' + corrBlocksArray[i].prop('id') + ' #controlChecboxContainer input').prop('checked')) {
                    continue;
                }
                var tableInputIsValid = checkRulesTableInputFormat($('#ruleBlock2 #' + corrBlocksArray[i].prop('id') + ' #rulesTable'));
                inputIsValid = inputIsValid && tableInputIsValid;
            }
            break;
        case activeRuleProcessTypeConstants.gl3:
            var input = $("#ruleBlock3FormBlocks").find("input");
            if (!numericFieldIsValid(input.val())) {
                inputIsValid = false;
                input.addClass('invalidInput');
            }
            break;
        case activeRuleProcessTypeConstants.rec:
            //todo: check exceptions
            return checkRulesTableInputFormat($('#rulesTable', addRecRulePopup));
    }
    return inputIsValid;
}

/**
 * Locks screen.
 */
/**
 * Comment
 */
function resetRuleValidationNotes() {
    var glaRulesErrorPanel = $('#glaRulesErrorPanel');
    switch (activeRuleProcessType) {
        case activeRuleProcessTypeConstants.edc:
            resetAddEdcRulePopup(2);
            break;
        case activeRuleProcessTypeConstants.gl1:
            glaRulesErrorPanel.html('');
            resetRulesTableLayout($("#ruleBlock1GeneralExceptionConditionsBlock").find("#rulesTable"));
            for (var i = 0, max = glaRule1Data.stel.length; i < max; i++) {
                resetRulesTableLayout($('#ruleBlock1 #' + glaRule1Data.stel[i].laid + ' #rulesTable'));
            }
            break;
        case activeRuleProcessTypeConstants.gl2:
            glaRulesErrorPanel.html('');
            resetRulesTableLayout($("#ruleBlock2GeneralExceptionBlock").find("#rulesTable"));
            var corrBlocksArray = $("#ruleBlock2FormBlocks").data('corrBlocks');
            for (var i = 0, max = corrBlocksArray.length; i < max; i++) {
                resetRulesTableLayout($('#ruleBlock2 #' + corrBlocksArray[i].prop('id') + ' #rulesTable'));
            }
            break;
        case activeRuleProcessTypeConstants.gl3:
            glaRulesErrorPanel.html('');
            $("#ruleBlock3FormBlocks").find("input").removeClass("invalidInput");
            break;
        case activeRuleProcessTypeConstants.rec:
            resetAddRecRulePopup(2);
            break;
    }
}

/**
 * Comment
 */
function initFieldToValueConditionsBlock(conditionsBlock, conditionsBlockType) {
    conditionsBlock.html($('#conditionsBlockTemplate').html());
    switch (conditionsBlockType) {
        case conditionsBlockConstants.trn:
            $('#rulesTableFieldSelectorHeader', conditionsBlock).html(languageConstants.templates.rulesTable.trnFieldSelectorHeader);
            $('#rulesTableInputValueHeader', conditionsBlock).html(languageConstants.templates.rulesTable.trnInputValueHeader);
            break;
        case conditionsBlockConstants.evt:
            $('#rulesTableFieldSelectorHeader', conditionsBlock).html(languageConstants.templates.rulesTable.evtFieldSelectorHeader);
            $('#rulesTableInputValueHeader', conditionsBlock).html(languageConstants.templates.rulesTable.evtInputValueHeader);
            break;
    }
}

/**
 * Comment
 */
function initRulesTable(rulesTable, conditionType) {
    conditionType = defaultFor(conditionType, conditionTypeConstants.trn);
    rulesTable.data('rules', []);
    rulesTable.data('type', conditionType);
    return rulesTable;
}