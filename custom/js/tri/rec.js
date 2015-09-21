/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */


//lbl = label
//lid = listId

var addRecRulePopup, addRecRulePopupSaveButtonData, addRecRulePopupRemoveButtonData, addRecRulePopupCancelButtonData, recRuleCreationStatus;

var recRulesData = [];

var availableEvtFields = [];

var initialRecRuleData = {
    "id": "-1",
    "lbl": '', "cnds": [
        {"tfid": 1, "oid": 5, "efid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rw": 50, "rdo": 0, "rqr": 0}
    ],
    "trnExceptions": {
        "end": 0, "cnds": [
            {"fid": 1, "oid": 5, "iv": "", "ivid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rdo": 0, "rqr": 0}
        ]
    },
    "evtExceptions": {
        "end": 0, "cnds": [
            {"fid": 1, "oid": 5, "iv": "", "ivid": 1, "loid": -1, "lbrl": "", "rbrl": "", "rdo": 0, "rqr": 0}
        ]
    },
    "etl_from": "10",
    "etl_to": "50"
};

var initialRecConditionData = {
    "tfid": -1,
    "oid": -1,
    "efid": -1,
    "rw": 0,
    "rdo": 0,
    "rqr": 0
};

var recModel = new RecModel();


/**
 * Comment
 */
function initRec() {
    initGeneralRecInterface();
    initRecRulesBlock(recRulesData);
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
        recRuleCreationStatus = recRuleCreationStatusConstants.add;
        initAddRecRulePopup();
    }).focus(function () {
        this.blur();
    });
    var recRulesSearchBlock = $("#recRulesSearchBlock");
    recRulesSearchBlock.prepend($("<div></div>").html(languageConstants.rec.rulesSearchBlockLabel));
    recRulesSearchBlock.find("input").autocomplete({
        source: function (request, response) {
            var matcher = new RegExp("" + $.ui.autocomplete.escapeRegex(request.term), "i");
            //RegExp, that matches only words, whith a specified beginnings
            //var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
            var result = $.grep(recRulesData, function (element) {
                return matcher.test(element.lbl);
            });
            initRecRulesBlock(result);
            response([]);
        },
        response: function (event, ui) {
            //
        },
        open: function (event, ui) {
            //
        },
        minLength: 0
    });
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
    //filter event field selector
    rebuildEvtFieldSelector(evtFieldSelector, $('option:selected', trnFieldSelector).data('data'), rule, considerAvl);
    //relative weight input field
    $('#relativeWeight input', rule).val(ruleData.rw);
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
function initRecRulesBlock(data) {
    $("#recRulesBlock").find("#recRulesContainer").html("");
    for (var i = 0, max = data.length; i < max; i++) {
        var div = $('<div></div>');
        div.prop('class', 'recRulesBlockElement');
        div.data('ruleId', data[i].id);
        div.click(function () {
            RecBackendService.showRecRule($(this).data('ruleId'),
                function (result) {
                    recRuleCreationStatus = recRuleCreationStatusConstants.update;
                    initAddRecRulePopup(result.data);
                },
                function () {
                    showMessage(languageConstants.general.messagePopup.getRecRuleData.fail);
                    unlockScreen();
                }
            );
        });
        div.html(data[i].lbl);
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
        RecBackendService.showRecRuleHistory(addRecRulePopup.data('ruleId'),
            function (result) {
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
    $("#addRecRulePopupRecConditions #addConditionButton", addRecRulePopup).button({
        label: languageConstants.templates.rulesTable.addConditionButtonLabel,
        icons: {
            primary: "ui-icon-plus"
        }
    }).click(function () {
        activeRuleProcessType = activeRuleProcessTypeConstants.rec;
        currentActiveAddRuleButton = $(this);
        var rulesTable = $("#rulesTable", currentActiveAddRuleButton.parent().parent());
        addRecCondition(rulesTable, initialRecConditionData);
        return false;
    });
    //
    var trnExceptionConditionsBlock = $("#addRecRulePopupTrnExceptionConditions", addRecRulePopup);
    trnExceptionConditionsBlock.parent().prepend($($("#controlCheckboxBlockTemplate").html()));
    initFieldToValueConditionsBlock(trnExceptionConditionsBlock, conditionsBlockConstants.trn);
    trnExceptionConditionsBlock.prev().children().eq(1).html(languageConstants.rec.addRecRulePopup.trnExceptionSectionHeader);
    initCheckbox(trnExceptionConditionsBlock.prev().find("input"), trnExceptionConditionsBlock);
    initAddConditionButton($("#addConditionButton", trnExceptionConditionsBlock), activeRuleProcessTypeConstants.rec);
    //
    var evtExceptionConditionsBlock = $("#addRecRulePopupEvtExceptionConditions", addRecRulePopup);
    evtExceptionConditionsBlock.parent().prepend($($("#controlCheckboxBlockTemplate").html()));
    initFieldToValueConditionsBlock(evtExceptionConditionsBlock, conditionsBlockConstants.evt);
    evtExceptionConditionsBlock.prev().children().eq(1).html(languageConstants.rec.addRecRulePopup.evtExceptionSectionHeader);
    initCheckbox(evtExceptionConditionsBlock.prev().find("input"), evtExceptionConditionsBlock);
    initAddConditionButton($("#addConditionButton", evtExceptionConditionsBlock), activeRuleProcessTypeConstants.rec);
    //
    var matchLevelSettingBlock = $("#addRecRulePopupMatchLevelSettingsBlock");
    matchLevelSettingBlock.children().first().children().first().html(languageConstants.rec.addRecRulePopup.matchLevelSettingsBlockEtlFromLabel);
    matchLevelSettingBlock.children().first().children().eq(2).html(languageConstants.rec.addRecRulePopup.matchLevelSettingsBlockEtlToLabel);
    var etlFromInput = $("input", matchLevelSettingBlock.children().first()).first();
    etlFromInput.prop('maxlength', 2);
    etlFromInput.keydown(inputNumberFilter);
    var etlToInput = $("input", matchLevelSettingBlock.children().first()).eq(1);
    etlToInput.prop('maxlength', 2);
    var fimFromInput = $("input", matchLevelSettingBlock.children().eq(1));
    etlToInput.keyup(function () {
        fimFromInput.val(etlToInput.val());
    }).keydown(inputNumberFilter).prop('maxlength', 2);
    matchLevelSettingBlock.children().eq(1).children().first().html(languageConstants.rec.addRecRulePopup.matchLevelSettingsBlockFimFromLabel);
    fimFromInput.prop('disabled', true);
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
    addRecRulePopup.data('ruleId', recRuleData.id);
    //
    var recConditionsTable = initRulesTable($('#addRecRulePopupRecConditions', addRecRulePopup).children().eq(1).children().first(), conditionTypeConstants.rec);
    for (var i = 0, max = recRuleData.cnds.length; i < max; i++) {
        addRecCondition(recConditionsTable, recRuleData.cnds[i]);
    }
    //
    var trnExceptionConditionsBlock = $("#addRecRulePopupTrnExceptionConditions", addRecRulePopup);
    var trnCheckbox = trnExceptionConditionsBlock.prev().find("input");
    trnCheckbox.prop('checked', recRuleData.trnExceptions.end === 1);
    trnCheckbox.trigger('change');
    var trnExceptionTable = initRulesTable(trnExceptionConditionsBlock.children().eq(1).children().first());
    for (var i = 0, max = recRuleData.trnExceptions.cnds.length; i < max; i++) {
        addCondition(trnExceptionTable, recRuleData.trnExceptions.cnds[i], conditionTypeConstants.trn, true);
    }
    //
    var evtExceptionConditionsBlock = $("#addRecRulePopupEvtExceptionConditions", addRecRulePopup);
    var evtCheckbox = evtExceptionConditionsBlock.prev().find("input");
    evtCheckbox.prop('checked', recRuleData.evtExceptions.end === 1);
    evtCheckbox.trigger('change');
    var evtExceptionTable = initRulesTable(evtExceptionConditionsBlock.children().eq(1).children().first(), conditionTypeConstants.evt);
    for (var i = 0, max = recRuleData.evtExceptions.cnds.length; i < max; i++) {
        addCondition(evtExceptionTable, recRuleData.evtExceptions.cnds[i], conditionTypeConstants.evt, true);
    }
    //
    var matchLevelSettingBlock = $("#addRecRulePopupMatchLevelSettingsBlock");
    matchLevelSettingBlock.children().first().children().first().html(languageConstants.rec.addRecRulePopup.matchLevelSettingsBlockEtlFromLabel);
    matchLevelSettingBlock.children().first().children().eq(2).html(languageConstants.rec.addRecRulePopup.matchLevelSettingsBlockEtlToLabel);
    //var etlToInput = $("input",matchLevelSettingBlock.children().first()).eq(1).css("border", "1px solid red");
    $("input", matchLevelSettingBlock.children().first()).first().val(recRuleData.etl_from);
    var etlToInput = $("input", matchLevelSettingBlock.children().first()).eq(1);
    etlToInput.val(recRuleData.etl_to);
    etlToInput.trigger('keyup');
    //
    addRecRulePopup.dialog("option", "title", popupTitle);
    addRecRulePopup.dialog('option', 'buttons', popupButtonsArray);
    addRecRulePopup.dialog('open');
    $('#recHistoryLinkContainer a', addRecRulePopup).toggle(recRuleCreationStatus == recRuleCreationStatusConstants.update).blur();
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
                var ruleData = recModel.getActiveRuleData();
                RecBackendService.saveRule(ruleData,
                    function (result) {
                        switch (recRuleCreationStatus) {
                            case recRuleCreationStatusConstants.add:
                                ruleData.data.id = result.data;
                                recRulesData.push(ruleData.data);
                                break;
                            case recRuleCreationStatusConstants.update:
                                for (var i = 0, max = recRulesData.length; i < max; i++) {
                                    if (recRulesData[i].id === ruleData.data.id) {
                                        recRulesData[i] = ruleData.data;
                                        break;
                                    }
                                }
                                break;
                        }
                        initRecRulesBlock(recRulesData);
                        addRecRulePopup.dialog("close");
                        showMessage(languageConstants.general.messagePopup.saveRecRule.success);
                        unlockScreen();

                    },
                    function () {
                        showMessage(languageConstants.general.messagePopup.saveRule.fail);
                        unlockScreen();
                    });
            });
        }
    };
    addRecRulePopupRemoveButtonData = {
        text: languageConstants.rec.addRecRulePopup.removeButtonLabel,
        click: function () {
            openConfirmActionPopup(languageConstants.general.confirmationPopup.rec.removeNote, true, true, languageConstants.general.confirmationPopup.rec.emptyCommentNote, function () {
                var ruleId = addRecRulePopup.data('ruleId');
                RecBackendService.removeRule(ruleId,
                    function () {
                        removeRecRuleFromList(ruleId);
                        initRecRulesBlock(recRulesData);
                        addRecRulePopup.dialog("close");
                        unlockScreen();
                        showMessage(languageConstants.general.messagePopup.removeRecRule.success);
                    },
                    function () {
                        showMessage(languageConstants.general.messagePopup.saveRule.fail);
                        unlockScreen();
                    });
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

function RecModel() {
    //
}

RecModel.prototype.getActiveRuleData = function () {
    var ruleId = addRecRulePopup.data('ruleId');
    var name = $("#recRuleNameInputContainer").find("input").val();
    var recConditionsData = getRecConditionsData($('#addRecRulePopupRecConditions #rulesTable', addRecRulePopup));
    var trnExceptionsEnabled = $("#addRecRulePopupTrnExceptionConditions", addRecRulePopup).prev().find("input").prop("checked") ? 1 : 0;
    var trnExceptionsConditionsData = getConditionsData($('#addRecRulePopupTrnExceptionConditions #rulesTable', addRecRulePopup));
    var evtExceptionsEnabled = $("#addRecRulePopupEvtExceptionConditions", addRecRulePopup).prev().find("input").prop("checked") ? 1 : 0;
    var evtExceptionsConditionsData = getConditionsData($('#addRecRulePopupEvtExceptionConditions #rulesTable', addRecRulePopup));
    var matchLevelSettingBlock = $("#addRecRulePopupMatchLevelSettingsBlock");
    var etlFrom = $("input", matchLevelSettingBlock.children().first()).first().val();
    var etlTo = $("input", matchLevelSettingBlock.children().first()).eq(1).val();
    var ruleData = $.extend(true, {}, initialRecRuleData);
    ruleData.id = ruleId;
    ruleData.lbl = name;
    ruleData.cnds = recConditionsData.list;
    ruleData.trnExceptions.end = trnExceptionsEnabled;
    ruleData.trnExceptions.cnds = trnExceptionsConditionsData.list;
    ruleData.evtExceptions.end = evtExceptionsEnabled;
    ruleData.evtExceptions.cnds = evtExceptionsConditionsData.list;
    ruleData.etl_from = etlFrom;
    ruleData.etl_to = etlTo;
    var userComment = $('textarea', confirmActionPopup).val();
    var requestData = {
        id: ruleId,
        name: name,
        recConditionsWeb: recConditionsData.web,
        trnExceptionsConditionsWeb: trnExceptionsConditionsData.web,
        evtExceptionsConditionsWeb: evtExceptionsConditionsData.web,
        recConditionsText: recConditionsData.text,
        trnExceptionsConditionsText: trnExceptionsConditionsData.text,
        evtExceptionsConditionsText: evtExceptionsConditionsData.text,
        recConditionsCode: recConditionsData.code,
        trnExceptionsConditionsSql: trnExceptionsConditionsData.sql,
        evtExceptionsConditionsSql: evtExceptionsConditionsData.sql,
        userComment: userComment,
        trnExceptionsEnabled: trnExceptionsEnabled,
        evtExceptionsEnabled: evtExceptionsEnabled,
        etlFrom: etlFrom,
        etlTo: etlTo
    };
    return {
        data: ruleData,
        requestData: requestData
    };
}
;