/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */

var incidentTypeMenuItemClassNameConstants = {
    black: 'incidentTypeBlack',
    blue: 'incidentTypeBlue',
    grey: 'incidentTypeGrey',
    red: 'incidentTypeRed'
};
var addEdcRulePopup, incidentTypeMenu, ruleCreationStatus, currentActiveIncidentTypeId, addEdcRulePopupSaveButtonData, addEdcRulePopupSaveAsDraftButtonData, addEdcRulePopupRemoveButtonData, addEdcRulePopupCancelButtonData;

//pid = parentId
//lbl = label
//sts = status

var incidentTypeData = [];
var ruleCreationStatusConstants = {
    add: 'add',
    update: 'update',
    void: 'void'
};
var ruleTypeConstants = {activeRule: 1, draft: 2};

//itid = incidentTypeId
//lbl = label
//cnds = conditions
//fid = fieldId
//oid = operandId
//iv = inputValue
//ivid = inputValueId
//loid = logicalOperandId
//lbrl = leftBracketLabel
//rbrl = rightBracketLabel
//rdo = isReadOnly

var initialEdcRuleData = {
    itid: '', lbl: '', cnds: [
        {"fid": 1, "oid": 5, "iv": "123", "ivid": 1, "loid": 1, "lbrl": "", "rbrl": "", "rdo": 0, "rqr": 1},
        {"fid": 8, "oid": 5, "iv": "123", "ivid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rdo": 0, "rqr": 1}
    ]
};

var edcRulesData = [];


/**
 * Comment
 */
function initEdc() {
    initGeneralEdcInterface();
    initEdcRulesBlock();
    initIncidentTypeMenu();
    createAddEdcRulePopup();
    initConfirmActionPopup();
}

/**
 * Comment
 */
function initGeneralEdcInterface() {
    $("#addRuleButtonContainer").find("button").button({
        label: languageConstants.edc.addRuleButtonLabel,
        icons: {
            primary: "ui-icon-plus"
        }
    }).click(function (e) {
        ruleCreationStatus = ruleCreationStatusConstants.void;
        initAddEdcRulePopup();
    });
    $("#edcRulesBlock").find(".formBlockHeader").html(languageConstants.edc.rulesBlockLabel);
}

/**
 * Comment
 */
function initAddEdcRulePopup(incidentTypeData) {
    resetAddEdcRulePopup(3);
    var rulesTable = $('#rulesTable', addEdcRulePopup);
    rulesTable.data('rules', []);
    initAddConditionButton($("#addConditionButton", addEdcRulePopup), activeRuleProcessTypeConstants.edc);
    if (typeof incidentTypeData !== 'undefined') {
        updateRuleCreationStatus(incidentTypeData.sts);
        $('#incidentTypeSelector', addEdcRulePopup).html(incidentTypeData.lbl).data('data', incidentTypeData);
        var ruleData = getRuleDataByIncidentTypeId(incidentTypeData.id);
        var popupTitle = '';
        if (typeof ruleData !== 'undefined') {
            $('#ruleNameInputContainer').find('input').val(ruleData.lbl);
            popupTitle = languageConstants.edc.addEdcRulePopup.titleUpdate;
        } else {
            ruleData = initialEdcRuleData;
            popupTitle = languageConstants.edc.addEdcRulePopup.titleAdd;

        }
        addEdcRulePopup.dialog("option", "title", popupTitle);
        for (var i = 0, max = ruleData.cnds.length; i < max; i++) {
            addCondition(rulesTable, ruleData.cnds[i]);
        }
        var popupButtonsArray = [];
        switch (incidentTypeData.sts) {
            //available for active rule creation
            case 0:
                popupButtonsArray.push(addEdcRulePopupSaveButtonData, addEdcRulePopupSaveAsDraftButtonData, addEdcRulePopupCancelButtonData);
                break;
            //active rule
            case 1:
                popupButtonsArray.push(addEdcRulePopupSaveButtonData, addEdcRulePopupSaveAsDraftButtonData, addEdcRulePopupRemoveButtonData, addEdcRulePopupCancelButtonData);
                break;
            //active draft
            case 2:
                popupButtonsArray.push(addEdcRulePopupSaveButtonData, addEdcRulePopupSaveAsDraftButtonData, addEdcRulePopupRemoveButtonData, addEdcRulePopupCancelButtonData);
                break;
            //disabled - not available for active rule creation
            case 3:
                popupButtonsArray.push(addEdcRulePopupSaveAsDraftButtonData, addEdcRulePopupCancelButtonData);
                break;
            //disabled draft
            case 4:
                popupButtonsArray.push(addEdcRulePopupSaveAsDraftButtonData, addEdcRulePopupRemoveButtonData, addEdcRulePopupCancelButtonData);
                break;

        }
        $('#conditionsBlock', addEdcRulePopup).show();
        addEdcRulePopup.dialog('option', 'buttons', popupButtonsArray);
    } else {
        $('#incidentTypeSelector', addEdcRulePopup).html(languageConstants.edc.addEdcRulePopup.selectIncidentTypeLabel).removeData('data');
        $('#conditionsBlock', addEdcRulePopup).hide();
        addEdcRulePopup.dialog('option', 'buttons', [addEdcRulePopupCancelButtonData]);
    }
    addEdcRulePopup.dialog('open');
    $('#edcHistoryLinkContainer a', addEdcRulePopup).toggle(ruleCreationStatus == ruleCreationStatusConstants.update).blur();
}

/**
 * Comment
 */
function resetAddEdcRulePopup(resetLevel) {
    resetLevel = defaultFor(resetLevel, 1);
    if (resetLevel < 1) {
        return;
    }
    $('#confirmActionPopupErrorPanel', addEdcRulePopup).html('');
    if (resetLevel < 2) {
        return;
    }
    resetRulesTableLayout($('#rulesTable', addEdcRulePopup));
    if (resetLevel < 3) {
        return;
    }
    $('#ruleNameInputContainer').find('input').val('');
    $("#conditionsBlock", addEdcRulePopup).html($('#conditionsBlockTemplate').html());
}
/**
 * Comment
 */
//todo declare edcCondition, glaCondition, recCondition etc..
function resetRulesTableLayout(rulesTable) {
    $("#inputField input", rulesTable).each(function () {
        $(this).removeClass("invalidInput");
    });
}

/**
 * Comment
 */
function destroyIncidentTypeMenu() {
    incidentTypeMenu.menu('destroy');
    $('#incidentTypeMenuTemplate').html('');
}

/**
 * Comment
 */
//todo optimize
function initIncidentTypeMenu() {
    $('#incidentTypeMenuTemplate').append(createIncidentTypeTree('-1', 0).children());
    createIncidentTypeMenu();
}

/**
 * Comment
 */
//todo optimize
function createIncidentTypeMenu() {
    incidentTypeMenu = $('#incidentTypeMenuTemplate').menu({
        select: function (event, ui) {
            currentActiveIncidentTypeId = ui.item.data('data').id;
            if (ruleCreationStatus === ruleCreationStatusConstants.void) {
                initAndOpenRulePopup();
            } else {
                showMessage(languageConstants.edc.messagePopup.incidentTypeChangeAlert, true, true, initAndOpenRulePopup)
            }
        }
    }).hide();
}

/**
 * Comment
 */
function initAndOpenRulePopup() {
    var incidentTypeData = getIncidentTypeDataById(currentActiveIncidentTypeId);
    initAddEdcRulePopup(incidentTypeData);
    updateRuleCreationStatus(incidentTypeData.sts);
    addEdcRulePopup.dialog("option", "closeOnEscape", true);
}

/**
 * Comment
 */
function updateRuleCreationStatus(incidentTypeStatus) {
    switch (incidentTypeStatus) {
        //available for active rule creation
        case 0:
            ruleCreationStatus = ruleCreationStatusConstants.add;
            break;
        //active rule
        case 1:
            ruleCreationStatus = ruleCreationStatusConstants.update;
            break;
        //active draft
        case 2:
            ruleCreationStatus = ruleCreationStatusConstants.update;
            break;
        //disabled - not available for active rule creation
        case 3:
            ruleCreationStatus = ruleCreationStatusConstants.add;
            break;
        //disabled draft
        case 4:
            ruleCreationStatus = ruleCreationStatusConstants.update;
            break;

    }
}

/**
 * Comment
 */
function getRuleDataByIncidentTypeId(typeId) {
    var ruleData;
    var ruleSearchResult = $.grep(edcRulesData,
        function (element) {
            return element.itid === typeId;
        });
    if (ruleSearchResult.length > 0) {
        ruleData = ruleSearchResult[0];
    }
    return ruleData;
}

/**
 * Comment
 */
function getIncidentTypeDataById(typeId) {
    var typeData;
    var incidentTypeSearchResult = $.grep(incidentTypeData,
        function (element) {
            return element.id === typeId;
        });
    if (incidentTypeSearchResult.length > 0) {
        typeData = incidentTypeSearchResult[0];
    }
    return typeData;
}

/**
 * Comment
 */
function createIncidentTypeTree(parentId, depthLevel) {
    depthLevel++;
    var ulElement = $('<ul></ul>');
    var elements = $.grep(incidentTypeData,
        function (element) {
            return element.pid === parentId;
        }
    );
    if (elements.length > 0) {
        for (var i = 0, max = elements.length; i < max; i++) {
            var elementId = elements[i].id;
            var liElement = $('<li></li>');
            liElement.prop('class', getIncidentTypeNodeClassByStatus(elements[i].sts));
            liElement.html(elements[i].lbl);
            liElement.data('data', elements[i]);
            ulElement.append(liElement);
            var childUlElement = createIncidentTypeTree(elementId, depthLevel);
            if (childUlElement.children().length > 0) {
                liElement.append(childUlElement);
            }
            depthLevel--;
        }
    }
    return ulElement;
}


/**
 * Comment
 */
function getIncidentTypeNodeClassByStatus(status) {
    var className;
    switch (status) {
        case 0:
            className = incidentTypeMenuItemClassNameConstants.black;
            break;
        case 1:
            className = incidentTypeMenuItemClassNameConstants.blue;
            break;
        case 2:
            className = incidentTypeMenuItemClassNameConstants.red;
            break;
        case 3:
            className = incidentTypeMenuItemClassNameConstants.grey;
            break;
    }
    return className;
}


/**
 * Comment
 */
function initEdcRulesBlock() {
    for (var i = 0, max = edcRulesData.length; i < max; i++) {
        var div = $('<div></div>');
        div.prop('class', 'edcRulesBlockElement');
        div.data('incidentTypeId', edcRulesData[i].itid);
        div.click(function () {
            initAddEdcRulePopup(getIncidentTypeDataById($(this).data('incidentTypeId')));
        });
        var typeData = getIncidentTypeDataById(edcRulesData[i].itid);
        div.html(edcRulesData[i].lbl + ' [' + typeData.lbl + ']');
        $('#edcRulesBlock').find('#edcRulesContainer').append(div);
    }
}
/**
 * Comment
 */
function resetEdcRulesBlock() {
    $('#edcRulesBlock').find('#edcRulesContainer').html('');
}


function createAddEdcRulePopupButtons() {
    addEdcRulePopupSaveButtonData = {
        text: languageConstants.edc.addEdcRulePopup.saveButtonLabel,
        click: function () {
            resetRuleValidationNotes();
            if (!checkAddEdcRulePopupRequiredFields()) {
                $('#confirmActionPopupErrorPanel', addEdcRulePopup).html(languageConstants.edc.addEdcRulePopup.requiredFieldsNote);
                return;
            }
            if (!checkRuleFormat()) {
                $('#confirmActionPopupErrorPanel', addEdcRulePopup).html(languageConstants.edc.addEdcRulePopup.fieldsFormatNote);
                return;
            }
            openConfirmActionPopup(languageConstants.general.confirmationPopup.edc.saveNote, true, true, languageConstants.general.confirmationPopup.edc.emptyCommentNote, function () {
                saveRule(ruleTypeConstants.activeRule);
            });
        }
    };

    addEdcRulePopupSaveAsDraftButtonData = {
        text: languageConstants.edc.addEdcRulePopup.saveAsDraftButtonLabel,
        click: function () {
            resetRuleValidationNotes();
            if (!checkAddEdcRulePopupRequiredFields()) {
                $('#confirmActionPopupErrorPanel', addEdcRulePopup).html(languageConstants.edc.addEdcRulePopup.requiredFieldsNote);
                return;
            }
            if (!checkRuleFormat()) {
                $('#confirmActionPopupErrorPanel', addEdcRulePopup).html(languageConstants.edc.addEdcRulePopup.fieldsFormatNote);
                return;
            }
            openConfirmActionPopup(languageConstants.general.confirmationPopup.edc.saveAsDraftNote, true, true, languageConstants.general.confirmationPopup.edc.emptyCommentNote, function () {
                saveRule(ruleTypeConstants.draft);
            });
        }
    };

    addEdcRulePopupRemoveButtonData = {
        text: languageConstants.edc.addEdcRulePopup.removeButtonLabel,
        click: function () {
            openConfirmActionPopup(languageConstants.general.confirmationPopup.edc.removeNote, true, true, languageConstants.general.confirmationPopup.edc.emptyCommentNote, function () {
                removeRule();
            });
        }
    };

    addEdcRulePopupCancelButtonData = {
        text: languageConstants.edc.addEdcRulePopup.cancelButtonLabel,
        click: function () {
            //$(this).dialog("close");
            openConfirmActionPopup(languageConstants.general.confirmationPopup.edc.cancelNote, false, false, "", function () {
                addEdcRulePopup.dialog("close");
            });
        }
    };
}


/**
 * Comment
 */
function createAddEdcRulePopup() {
    createAddEdcRulePopupButtons();
    addEdcRulePopup = $("#addEdcRulePopup").dialog({
        autoOpen: false,
        modal: true,
        width: 850,
        title: languageConstants.edc.addEdcRulePopup.titleAdd
    });
    //necessary for the properties menu correct display
    addEdcRulePopup.dialog("widget").css({
        overflow: "visible"
    });
    $('#incidentTypeSelector', addEdcRulePopup).click(function () {
        //
        //TODO: optimize this (avoid menu recreation);
        //
        addEdcRulePopup.dialog("option", "closeOnEscape", false);
        incidentTypeMenu.menu('destroy');
        createIncidentTypeMenu();
        incidentTypeMenu.zIndex(addEdcRulePopup.zIndex() + 1);
        incidentTypeMenu.show().position({
            my: "left top",
            at: "left bottom",
            of: this
        });
        $(document).one("click", function () {
            incidentTypeMenu.hide();
            addEdcRulePopup.dialog("option", "closeOnEscape", true);
        });
        return false;
    });
    $('p', addEdcRulePopup).first().html(languageConstants.edc.addEdcRulePopup.header);
    $('#edcHistoryLinkContainer').find('a').html(languageConstants.edc.historyLinkLabel).click(function () {
        showRuleHistory();
    });
}


/**
 * Comment
 */
function checkAddEdcRulePopupRequiredFields() {
    return $('#edcRuleNameInputContainer').find('input').val() !== '';
}

/**
 * Generates parameters string for the backend 'remove_rule' method.
 */
function removeActiveEdcRule() {
    for (var i = 0, max = edcRulesData.length; i < max; i++) {
        if (edcRulesData[i].itid === $('#incidentTypeSelector', addEdcRulePopup).data('data').id) {
            edcRulesData.splice(i, 1);
            break;
        }
    }
}


/**
 * Generates parameters string for the backend 'remove_rule' method.
 */
function getRemoveRuleString() {
    return $('#incidentTypeSelector', addEdcRulePopup).data('data').id;
}


/**
 * Comment
 */
function initInputField(inputFieldContainer, fieldData, rule, useRuleValue) {
    useRuleValue = defaultFor(useRuleValue, true);
    var ruleData = rule.data('data');
    inputFieldContainer.html('');
    var inputField;
    switch (fieldData.type) {
        case inputFieldTypeConstants.text:
            inputField = $('<input type="text">');
            inputFieldContainer.append(inputField);
            if (typeof ruleData !== 'undefined' && useRuleValue) {
                inputField.val(ruleData.iv);
                if (ruleData.rdo === 1) {
                    inputField.prop('disabled', true);
                }
            }
            break;
        case inputFieldTypeConstants.number:
            inputField = $('<input type="text">');
            inputField.keydown(inputNumberFilter);
            inputFieldContainer.append(inputField);
            if (typeof ruleData !== 'undefined' && useRuleValue) {
                inputField.val(ruleData.iv);
                if (ruleData.rdo === 1) {
                    inputField.prop('disabled', true);
                }
            }
            break;
        case inputFieldTypeConstants.date:
            inputField = $('<input type="text" readonly="readonly">');
            inputFieldContainer.append(inputField);
            inputField.datepicker({
                constrainInput: true,
                dateFormat: "dd/mm/yy"
            });
            if (typeof ruleData !== 'undefined' && useRuleValue) {
                inputField.val(ruleData.iv);
                if (ruleData.rdo === 1) {
                    inputField.prop('disabled', true);
                }
            }
            break;
        case inputFieldTypeConstants.dropdown:
            inputField = $('<select></select>');
            inputFieldContainer.append(inputField);
            inputField.selectmenu({
                select: function (event, ui) {
                },
                open: function () {
                    inputField.selectmenu("refresh");
                }
            }).selectmenu("menuWidget").addClass("inputFieldOverflow");

            var dropdownElements = $.grep(dropdownListItems, function (element) {
                return element.lid === fieldData.lid;
            });
            for (var i = 0; i < dropdownElements.length; i++) {
                var option = $('<option>' + dropdownElements[i].lbl + '</option>');
                option.data('data', dropdownElements[i]);
                inputField.append(option);
            }

            if (typeof ruleData !== 'undefined' && useRuleValue) {
                if (typeof ruleData.ivid !== 'undefined') {
                    $('option', inputField).filter(function () {
                        return $(this).data('data').id === ruleData.ivid;
                    }).attr('selected', true);
                }
                if (ruleData.rdo === 1) {
                    inputField.selectmenu('disable');
                }
            }
            inputField.selectmenu('refresh');
            break;
        default :
            return;
    }
}