/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */


//lbl = label
//lid = listId

var addRecRulePopup, addRecRulePopupSaveButtonData, addRecRulePopupRemoveButtonData, addRecRulePopupCancelButtonData;

var recRulesData = [];

var availableEvtFields = [];

var initialRecRuleData = {
    "lbl": '', "cnds": [
        {"tfid": 1, "oid": 5, "efid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rw": 0, "rdo": 0, "rqr": 0}
    ],
    "trnExceptions": [
        {"fid": 1, "oid": 5, "iv": "123", "ivid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rdo": 0, "rqr": 0}
    ],
    "evtExceptions": [
        {"fid": 1, "oid": 5, "iv": "123", "ivid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rdo": 0, "rqr": 0}
    ],
    "etl_from": "30",
    "etl_to": "60"
};

var initialRecConditionData = {
    "tfid": -1,
    "oid": -1,
    "efid": -1,
    "loid": -1,
    "lbrl": '',
    "rbrl": '',
    "rw": 0,
    "rdo": 0,
    "rqr": 0
};


/**
 * Comment
 */
function initRec() {
    initGeneralRecInterface();
    initRecRulesBlock();
    createAddRecRulePopup();
}

/**
 * Comment
 */
function initGeneralRecInterface() {
    $("#addRecRuleButtonContainer").find("button").button({
        label: languageConstants.rec.addRecRuleButtonLabel,
        icons: {
            primary: "ui-icon-plus"
        }
    }).click(function (e) {
        ruleCreationStatus = ruleCreationStatusConstants.add;
        initAddRecRulePopup();
    });
    //init search container here
    $('#recRulesBlock').find('.formBlockHeader').html(languageConstants.rec.rulesBlockLabel);
}


/**
 * Comment
 */
function initRecCondition(rule, considerAvl) {
    considerAvl = defaultFor(considerAvl, false);
    var ruleData = rule.data('data');
    //init left to right
    //
    var evtFieldSelector = $('#evtPropertySelector select', rule);
    //
    //left bracket button
    //initBracketButton('#leftBracketButton', '(', rule);
    //transaction property selector
    var trnFieldSelector = $('#trnPropertySelector select', rule);
    for (var i = 0; i < availableTrnFields.length; i++) {
        if ((availableTrnFields[i].avl === 0 && considerAvl) && ruleData.rdo !== 1) {
            continue;
        }
        var option = $('<option>' + availableTrnFields[i].lbl + '</option>');
        option.data('data', availableTrnFields[i]);
        trnFieldSelector.append(option);
    }
    trnFieldSelector.selectmenu({
        select: function (event, ui) {
            rebuildEvtFieldSelector(evtFieldSelector, ui.item.element.data('data'), rule, considerAvl);
            initOperandSelector(ui.item.element.data('data'), rule);
        },
        open: function () {
            trnFieldSelector.selectmenu("refresh");
        }
    }).selectmenu("menuWidget").addClass("propertySelectorOverflow");
    if (typeof ruleData !== 'undefined') {
        $('option', trnFieldSelector).filter(function () {
            return $(this).data('data').id === ruleData.tfid;
        }).attr('selected', true);
        if (ruleData.rdo === 1 || ruleData.rqr === 1) {
            trnFieldSelector.selectmenu('disable');
        }
    }
    trnFieldSelector.selectmenu("refresh");
    //operand selector
    initOperandSelector($('option:selected', trnFieldSelector).data('data'), rule);
    //event property selector

//    for (var i = 0; i < availableEvtFields.length; i++) {
//        if ((availableEvtFields[i].avl === 0 && considerAvl) && ruleData.rdo !== 1) {
//            continue;
//        }
//        var option = $('<option>' + availableEvtFields[i].lbl + '</option>');
//        option.data('data', availableEvtFields[i]);
//        evtFieldSelector.append(option);
//    }
//    evtFieldSelector.selectmenu({
//        select: function (event, ui) {
////            filterEvtFieldSelector(ui.item.element.data('data'), rule, false);
////            initOperandSelector(ui.item.element.data('data'), rule);
//        },
//        open: function (event, ui) {
//            evtFieldSelector.selectmenu("refresh");
//        }
//    }).selectmenu("menuWidget").addClass("propertySelectorOverflow");
//    if (typeof ruleData !== 'undefined') {
//        $('option', evtFieldSelector).filter(function (index) {
//            return $(this).data('data').id === ruleData.efid;
//        }).attr('selected', true);
//        if (ruleData.rdo === 1 || ruleData.rqr === 1) {
//            evtFieldSelector.selectmenu('disable');
//        }
//    }
//    evtFieldSelector.selectmenu("refresh");


    //filter event field selector
    rebuildEvtFieldSelector(evtFieldSelector, $('option:selected', trnFieldSelector).data('data'), rule, considerAvl);
    //right bracket button
    //initBracketButton('#rightBracketButton', ')', rule);
    /*if (ruleData !== undefined) {
     rightBracketButton.button('option', 'label', ruleData.rbrl);
     if (ruleData.rdo === 1) {
     rightBracketButton.button('disable');
     }
     }*/
//operand button
    /*var operandButton = $('#operandButton button', rule);
     operandButton.button().hide();
     operandButton.click(function (event) {
     //
     });
     if (typeof ruleData !== 'undefined') {
     initOperandButtonData(operandButton, ruleData.loid, ruleData.rdo, ruleData.rqr);
     }*/
//remove button
    var removeButton = $('#remove', rule);
    removeButton.button({
        label: languageConstants.templates.rulesTable.removeButtonLabel,
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
    });
    //remove button initialisation
    var rulesTable = rule.parent().parent();
    var rulesArray = rulesTable.data('rules');
    if (rulesArray.length > 1 && !(typeof ruleData !== 'undefined' && (ruleData.rdo === 1 || ruleData.rqr === 1))) {
        removeButton.click(function () {
            var arrayIndex = $.inArray(rule, rulesArray);
            if (arrayIndex !== -1) {
                /*if (arrayIndex === rulesArray.length - 1) {
                 $('#operandButton button', rulesArray[arrayIndex - 1]).button('option', 'label', emptyLogicalOperandData.lbl).data('data', emptyLogicalOperandData).hide();
                 } else {
                 $('#operandButton button', rulesArray[arrayIndex - 1]).button('option', 'label', $('#operandButton button', rulesArray[arrayIndex]).data('data').lbl).data('data', $('#operandButton button', rulesArray[arrayIndex]).data('data'));
                 }*/
                rulesArray.splice(arrayIndex, 1);
                rule.remove();
            }
        });
    } else {
        removeButton.hide();
    }
}


/**
 * Comment
 */
function initRecRulesBlock() {
    for (var i = 0, max = recRulesData.length; i < max; i++) {
        var div = $('<div></div>');
        div.prop('class', 'recRulesBlockElement');
        div.data('ruleId', recRulesData[i].id);
        div.click(function () {
            showRecRule($(this).data('ruleId'), function (result) {
                ruleCreationStatus = ruleCreationStatusConstants.update;
                initAddRecRulePopup(result.data);
            });
        });
        div.html(recRulesData[i].lbl);
        $("#recRulesBlock").find("#recRulesContainer").append(div);
    }
}


/**
 * Comment
 */
function createAddRecRulePopup() {
    createAddRecRulePopupButtons();
    addRecRulePopup = $("#addRecRulePopup").dialog({
        autoOpen: false,
        modal: true,
        width: 885,
        title: languageConstants.rec.addRecRulePopup.titleAdd
    });
    //necessary for the properties menu correct display
    addRecRulePopup.dialog("widget").css({
        overflow: "visible"
    });
    $('p', addRecRulePopup).first().html(languageConstants.rec.addRecRulePopup.header);
    $('#recHistoryLinkContainer').find('a').html(languageConstants.rec.historyLinkLabel).click(function () {
        showRecRuleHistory(addRecRulePopup.data('data').ruleId, function (result) {
            initHistoryPopupElementsContainer(result.data);
            ruleHistoryPopup.dialog('open');
        });
    });
//
    var recConditionsBlock = $("#addRecRulePopupRecConditions", addRecRulePopup);
    recConditionsBlock.parent().prepend($($("#controlCheckboxBlockTemplate").html()));
    recConditionsBlock.html($('#recConditionsBlockTemplate').html());
    recConditionsBlock.prev().children().first().hide();
    recConditionsBlock.prev().children().eq(1).html(languageConstants.rec.addRecRulePopup.recRulesSectionHeader);
//
    var trnExceptionConditionsBlock = $("#addRecRulePopupTrnExceptionConditions", addRecRulePopup);
    trnExceptionConditionsBlock.parent().prepend($($("#controlCheckboxBlockTemplate").html()));
    trnExceptionConditionsBlock.html($('#conditionsBlockTemplate').html());
    trnExceptionConditionsBlock.prev().children().eq(1).html(languageConstants.rec.addRecRulePopup.trnExceptionSectionHeader);
    initCheckbox(trnExceptionConditionsBlock.prev().find("input"), trnExceptionConditionsBlock);
//
    var evtExceptionConditionsBlock = $("#addRecRulePopupEvtExceptionConditions", addRecRulePopup);
    evtExceptionConditionsBlock.parent().prepend($($("#controlCheckboxBlockTemplate").html()));
    evtExceptionConditionsBlock.html($('#conditionsBlockTemplate').html());
    evtExceptionConditionsBlock.prev().children().eq(1).html(languageConstants.rec.addRecRulePopup.evtExceptionSectionHeader);
    initCheckbox(evtExceptionConditionsBlock.prev().find("input"), evtExceptionConditionsBlock);
}

/**
 * Comment
 */
function resetAddRecRulePopup(resetLevel) {
    resetLevel = defaultFor(resetLevel, 1);
    if (resetLevel < 1) {
        return;
    }
    $('#confirmActionPopupErrorPanel', addRecRulePopup).html('');
    if (resetLevel < 2) {
        return;
    }
    resetRulesTableLayout($('#rulesTable', addRecRulePopup));
    if (resetLevel < 3) {
        return;
    }
    $('#recRuleNameInputContainer').find('input').val('');
    $("#addRecRulePopupRecConditions tbody", addRecRulePopup).children().not(':first').remove();
    $("#addRecRulePopupTrnExceptionConditions tbody", addRecRulePopup).children().not(':first').remove();
    $("#addRecRulePopupEvtExceptionConditions tbody", addRecRulePopup).children().not(':first').remove();
}


/**
 * Comment
 */
function initAddRecRulePopup(recRuleData) {
    resetAddRecRulePopup(3);
    var popupTitle = '';
    var popupButtonsArray = [];
    if (typeof recRuleData !== 'undefined') {
        $('#recRuleNameInputContainer').find('input').val(recRuleData.lbl);
        popupTitle = languageConstants.rec.addRecRulePopup.titleUpdate;
        popupButtonsArray.push(addRecRulePopupSaveButtonData, addRecRulePopupRemoveButtonData, addRecRulePopupCancelButtonData);
    } else {
        recRuleData = initialRecRuleData;
        popupTitle = languageConstants.rec.addRecRulePopup.titleAdd;
        popupButtonsArray.push(addRecRulePopupSaveButtonData, addRecRulePopupCancelButtonData);
    }
    addRecRulePopup.data('data', recRuleData);
    //
    var recConditionsTable = $('#addRecRulePopupRecConditions', addRecRulePopup).children().eq(1).children().first();
    recConditionsTable.data('rules', []);
    initAddConditionButton($("#addRecRulePopupRecConditions #addConditionButton", addRecRulePopup), activeRuleProcessTypeConstants.rec);
    for (var i = 0, max = recRuleData.cnds.length; i < max; i++) {
        addRecCondition(recConditionsTable, recRuleData.cnds[i]);
    }
    //
    var trnExceptionTable = $('#addRecRulePopupTrnExceptionConditions', addRecRulePopup).children().eq(1).children().first();
    trnExceptionTable.data('rules', []);
    initAddConditionButton($("#addRecRulePopupTrnExceptionConditions #addConditionButton", addRecRulePopup), activeRuleProcessTypeConstants.edc);
    for (var i = 0, max = recRuleData.trnExceptions.length; i < max; i++) {
        addCondition(trnExceptionTable, recRuleData.trnExceptions[i]);
    }
    //
    var evtExceptionTable = $('#addRecRulePopupEvtExceptionConditions', addRecRulePopup).children().eq(1).children().first();
    evtExceptionTable.data('rules', []);
    initAddConditionButton($("#addRecRulePopupEvtExceptionConditions #addConditionButton", addRecRulePopup), activeRuleProcessTypeConstants.edc);
    for (var i = 0, max = recRuleData.evtExceptions.length; i < max; i++) {
        addCondition(evtExceptionTable, recRuleData.evtExceptions[i]);
    }
    //
    addRecRulePopup.dialog("option", "title", popupTitle);
    addRecRulePopup.dialog('option', 'buttons', popupButtonsArray);
    addRecRulePopup.dialog('open');
    $('#recHistoryLinkContainer a', addRecRulePopup).toggle(ruleCreationStatus == ruleCreationStatusConstants.update).blur();
}


/**
 * Comment
 */
function rebuildEvtFieldSelector(evtFieldSelector, fieldData, rule, considerAvl) {
    var ruleData = rule.data('data');

    if (typeof evtFieldSelector.data("uiSelectmenu") !== 'undefined') {
        evtFieldSelector.selectmenu("destroy");
    }
    evtFieldSelector.html('');
    for (var i = 0; i < availableEvtFields.length; i++) {
        if (availableEvtFields[i].type !== fieldData.type || ((availableEvtFields[i].avl === 0 && considerAvl) && ruleData.rdo !== 1)) {
            continue;
        }
        var option = $('<option>' + availableEvtFields[i].lbl + '</option>');
        option.data('data', availableEvtFields[i]);
        evtFieldSelector.append(option);
    }

    evtFieldSelector.selectmenu({
        select: function (event, ui) {

        },
        open: function () {
            evtFieldSelector.selectmenu("refresh");
        }
    }).selectmenu("menuWidget").addClass("propertySelectorOverflow");
    if (typeof ruleData !== 'undefined') {
        $('option', evtFieldSelector).filter(function () {
            return $(this).data('data').id === ruleData.efid;
        }).attr('selected', true);
        if (ruleData.rdo === 1 || ruleData.rqr === 1) {
            evtFieldSelector.selectmenu('disable');
        }
    }
    evtFieldSelector.selectmenu("refresh");
}

function createAddRecRulePopupButtons() {
    addRecRulePopupSaveButtonData = {
        text: languageConstants.rec.addRecRulePopup.saveButtonLabel,
        click: function () {
            resetRuleValidationNotes();
            if (!checkAddRecRulePopupRequiredFields()) {
                $('#confirmActionPopupErrorPanel', addRecRulePopup).html(languageConstants.rec.addRecRulePopup.requiredFieldsNote);
                return;
            }
            if (!checkRuleFormat()) {
                $('#confirmActionPopupErrorPanel', addRecRulePopup).html(languageConstants.rec.addRecRulePopup.fieldsFormatNote);
                return;
            }
            openConfirmActionPopup(languageConstants.general.confirmationPopup.rec.saveNote, true, true, languageConstants.general.confirmationPopup.rec.emptyCommentNote, function () {
                saveRule(ruleTypeConstants.activeRule);
            });
        }
    };

    addRecRulePopupRemoveButtonData = {
        text: languageConstants.rec.addRecRulePopup.removeButtonLabel,
        click: function () {
            openConfirmActionPopup(languageConstants.general.confirmationPopup.rec.removeNote, true, true, languageConstants.general.confirmationPopup.rec.emptyCommentNote, function () {
                removeRule();
            });
        }
    };

    addRecRulePopupCancelButtonData = {
        text: languageConstants.rec.addRecRulePopup.cancelButtonLabel,
        click: function () {
            //$(this).dialog("close");
            openConfirmActionPopup(languageConstants.general.confirmationPopup.rec.cancelNote, false, false, "", function () {
                addRecRulePopup.dialog("close");
            });
        }
    };
}

/**
 * Comment
 */
function checkAddRecRulePopupRequiredFields() {
    return $('#recRuleNameInputContainer').find('input').val() !== '';
}