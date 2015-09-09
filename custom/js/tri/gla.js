/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */


var currentActiveRuleIndex = 0;

//id = custObj3Id
//lbl = label
//act = active

var corrList = [];

//id = custObj3Id
//end = enabled
//loid = logicalOperandId
//cnds = conditions

var initialCorrBlockElement = {id: -1, end: 0, "loid": 2, "cnds": []};
var glaRule1DataStationaryElementsCount = 6;

//lbl = label
//exbl = exceptionBlock
//stel = stationaryElements
//end = enabled
//loid = logicalOperandId
//cnds = conditions
//fid = fieldId
//oid = operandId
//iv = inputValue
//ivid = inputValueId
//loid = logicalOperandId
//lbrl = leftBracketLabel
//rbrl = rightBracketLabel
//rdo = isReadOnly
//laid = layoutId

var glaRule1Data = {};

//lbl = label
//exbl = exceptionBlock
//coel = corrElements
//end = enabled
//loid = logicalOperandId
//cnds = conditions
//fid = fieldId
//oid = operandId
//iv = inputValue
//ivid = inputValueId
//loid = logicalOperandId
//lbrl = leftBracketLabel
//rbrl = rightBracketLabel
//rdo = isReadOnly

var glaRule2Data = {};

var usedCorrElementsIds = [];
var availableCorrList = [];

//lbl = label
//cnds = conditions
//al = amountLimit

var glaRule3Data = {};

var ruleTypeMenu, selectCorrPopup;


/**
 * Comment
 */
function initGla() {
    if (!checkRulesData()) {
        alert('Some rule data is undefined');
        return;
    }
    initGeneralGlaInterface();
    initRule1Block();
    initRule2Block();
    initRule3Block();
    initSelectCorrPopup();
    initRuleTypeMenu();
}


/**
 * Initializes GLA rule type menu.
 */
function initRuleTypeMenu() {
    var ruleTypeMenuTemplate = $('#ruleTypeMenuTemplate');
    var glaRuleLabels = [languageConstants.gla.rule1.label, languageConstants.gla.rule2.label, languageConstants.gla.rule3.label];
    var glaRuleLayoutIds = [glaRule1Data.laid, glaRule2Data.laid, glaRule3Data.laid];
    for (var i = 0, max = glaRuleLabels.length; i < max; i++) {
        var element = $('<li></li>');
        element.prop('id', glaRuleLayoutIds[i]);
        element.html(glaRuleLabels[i]);
        ruleTypeMenuTemplate.append(element);
    }
    ruleTypeMenu = ruleTypeMenuTemplate.menu({
        select: function (event, ui) {
            $('#ruleTypeSelectorBlock').addClass('formBlock');
            hideRuleBocks();
            switch (ui.item.attr('id')) {
                case glaRule1Data.laid:
                    $("#ruleBlock1").show();
                    currentActiveRuleIndex = 1;
                    activeRuleProcessType = activeRuleProcessTypeConstants.gl1;
                    break;
                case glaRule2Data.laid:
                    $("#ruleBlock2").show();
                    currentActiveRuleIndex = 2;
                    activeRuleProcessType = activeRuleProcessTypeConstants.gl2;
                    break;
                case glaRule3Data.laid:
                    $("#ruleBlock3").show();
                    currentActiveRuleIndex = 3;
                    activeRuleProcessType = activeRuleProcessTypeConstants.gl3;
                    break;
                default :
                    break;
            }
            $('#ruleTypeSelector').html(ui.item.html()).data('type', activeRuleProcessType);
            $('#glaControlElements').show();
        }
    }).hide();
}
/**
 * Initializes GLA tab general interface.
 */
function initGeneralGlaInterface() {
    var ruleTypeSelector = $('#ruleTypeSelector');
    ruleTypeSelector.html(languageConstants.gla.rulesTypeSelectorLabel).click(function () {
        ruleTypeMenu.position({
            my: "left top",
            at: "left bottom",
            of: this,
            //By some means, 'using' is the only way found to place menu in correct position. Position of 'this' is calculated incorrectly.
            //note: probably, position increasing takes place on every outside click
            using: function () {
                ruleTypeMenu.css({
                    position: "absolute",
                    top: ruleTypeSelector.offset().top + ruleTypeSelector.height(),
                    left: ruleTypeSelector.offset().left
                });
            }
        }).show();
        $(document).one("click", function () {
            ruleTypeMenu.hide();
        });
        return false;
    });
    $('#glaActions').find('#save').button({
        label: languageConstants.gla.saveRuleButtonLabel
    }).click(function () {
        resetRuleValidationNotes();
        if (!checkRuleFormat()) {
            $('#glaRulesErrorPanel').html(languageConstants.gla.fieldsFormatNote);
            return;
        }
        openConfirmActionPopup(languageConstants.general.confirmationPopup.gla.saveNote, true, true, languageConstants.general.confirmationPopup.edc.emptyCommentNote, function () {
            saveRule(ruleTypeConstants.activeRule);
        });
        return false;
    });
    $('#glaHistoryLinkContainer').find('a').html(languageConstants.gla.historyLinkLabel).click(function () {
        showRuleHistory();
    });
    var ruleTypeSelectorBlock = $("#ruleTypeSelectorBlock");
    ruleTypeSelectorBlock.find(".formBlockHeader").html(languageConstants.gla.ruleTypeSelectorBlockHeader);
    ruleTypeSelectorBlock.find('.inputLabel').html(languageConstants.gla.ruleTypeSelectorInputLabel);
}


/**
 * Hides all GLA rules blocks.
 */
function hideRuleBocks() {
    $("#ruleBlock1").hide();
    $("#ruleBlock2").hide();
    $("#ruleBlock3").hide();
}


/**
 * Initializes GLA rule 1 block.
 */
function initRule1Block() {
    $('#ruleBlock1').find('.formBlockHeader').html(languageConstants.gla.rule1.label);
    initBlock1GeneralExceptionConditionsBlock(glaRule1Data.exbl);
    for (var i = 0, max = glaRule1Data.stel.length; i < max; i++) {
        addStationaryBlockToRule1Block(glaRule1Data.stel[i], i === glaRule1Data.stel.length - 1);
    }
}

/**
 * Initializes block1 exception conditions sub-block.
 * @param {object} blockData - All the data, including conditions array.
 */
function initBlock1GeneralExceptionConditionsBlock(blockData) {
    var exceptionBlock = $('#ruleBlock1GeneralExceptionConditionsBlock');
    initFieldToValueConditionsBlock(exceptionBlock,conditionsBlockConstants.trn);
    //exceptionBlock.html($('#conditionsBlockTemplate').html());
    var exceptionRulesTable = exceptionBlock.find('#rulesTable');
    exceptionRulesTable.data('rules', []);
    initAddConditionButton(exceptionBlock.find("#addConditionButton"), activeRuleProcessTypeConstants.gl1);
    exceptionBlock.find("#controlCheckboxLabel").html(languageConstants.gla.rule1.generalExceptionControlCheckboxLabel);
    var checkbox = $("#ruleBlock1GeneralExceptionCheckboxContainer").find("input");
    initCheckbox(checkbox, exceptionBlock);
    if (typeof blockData !== 'undefined') {
        checkbox.prop('checked', blockData.end === 1);
        checkbox.trigger('change');
        if (blockData.cnds.length !== 0) {
            for (var i = 0, max = blockData.cnds.length; i < max; i++) {
                addCondition(exceptionRulesTable, blockData.cnds[i]);
            }
        } else {
            addCondition(exceptionRulesTable);
        }
    }
}

/**
 * Adds stationary sub-block to the block1.
 * @param {object} blockData - All the data, including conditions array.
 * @param {object} isLastOne - Indicates, whether the block is the last one.
 */
function addStationaryBlockToRule1Block(blockData, isLastOne) {
    isLastOne = defaultFor(isLastOne, false);
    var div = $('<div></div>');
    div.prop('id', blockData.laid);
    div.html($('#rule1BlockStationaryElementTemplate').html());
    $("#controlCheckboxLabel", div).html(blockData.lbl);
    var ruleBlock1FormBlocks = $("#ruleBlock1FormBlocks");
    ruleBlock1FormBlocks.append(div);
    initFieldToValueConditionsBlock($("#conditionsBlock", div),conditionsBlockConstants.trn);
    //$("#conditionsBlock", div).html($('#conditionsBlockTemplate').html());
    var rulesTable = $('#rulesTable', div);
    rulesTable.data('rules', []);
    initAddConditionButton($("#addConditionButton", div), activeRuleProcessTypeConstants.gl1);
    initCheckbox($("#controlChecboxContainer input", div), $("#conditionsBlock", div));
    if (!isLastOne) {
        var div1 = $('<div></div>');
        div1.prop('class', 'rule1StationaryBlockLogicalOperandElement');
        div1.html('OR');
        ruleBlock1FormBlocks.append(div1);
    }
    if (typeof blockData !== 'undefined') {
        $("#controlChecboxContainer input", div).prop('checked', blockData.end === 1);
        $("#controlChecboxContainer input", div).trigger('change');
        if (blockData.cnds.length !== 0) {
            for (var i = 0, max = blockData.cnds.length; i < max; i++) {
                addCondition(rulesTable, blockData.cnds[i], true);
            }
        } else {
            addCondition(rulesTable);
        }
    }
}

/**
 * Initializes GLA rule 2 block.
 */
function initRule2Block() {
    $('#ruleBlock2').find('.formBlockHeader').html(languageConstants.gla.rule2.label);
    $('.corrElementBlock #controlCheckboxLabel').html(languageConstants.gla.rule2.corrElementExceptionControlCheckboxLabel);
    initBlock2GeneralExceptionConditionsBlock(glaRule2Data.exbl);
    $("#ruleBlock2FormBlocks").data('corrBlocks', []);
    for (var i = 0, max = glaRule2Data.coel.length; i < max; i++) {
        addRule2CorrBlock(glaRule2Data.coel[i], i === 0);
    }
    initAddCorrButon();
    updateRule2GeneralExceptionConditionsBlock();
}

/**
 * Initializes GLA rule 2 general exception block.
 * @param {object} blockData - GLA rule 2 exception block data, including conditions array.
 */
function initBlock2GeneralExceptionConditionsBlock(blockData) {
    var exceptionBlock = $("#ruleBlock2GeneralExceptionConditionsBlock");
    initFieldToValueConditionsBlock(exceptionBlock,conditionsBlockConstants.trn);
    //exceptionBlock.html($('#conditionsBlockTemplate').html());
    var exceptionRulesTable = exceptionBlock.find('#rulesTable');
    exceptionRulesTable.data('rules', []);
    initAddConditionButton(exceptionBlock.find("#addConditionButton"), activeRuleProcessTypeConstants.gl2);
    var ruleBlock2GeneralExceptionCheckboxContainer = $("#ruleBlock2GeneralExceptionCheckboxContainer");
    ruleBlock2GeneralExceptionCheckboxContainer.find("#controlCheckboxLabel").html(languageConstants.gla.rule2.generalExceptionControlCheckboxLabel);
    var checkbox = ruleBlock2GeneralExceptionCheckboxContainer.find("input");
    initCheckbox(checkbox, exceptionBlock);
    if (typeof blockData !== 'undefined') {
        checkbox.prop('checked', blockData.end === 1);
        checkbox.trigger('change');
        if (blockData.cnds.length !== 0) {
            for (var i = 0, max = blockData.cnds.length; i < max; i++) {
                addCondition(exceptionRulesTable, blockData.cnds[i]);
            }
        }
    } else {
        addCondition(exceptionRulesTable);
    }
}

/**
 * Updates GLA rule 2 general exception block state according to corr blocks presence.
 */
function updateRule2GeneralExceptionConditionsBlock() {
    var rule2GeneralExceptionIsEnabled = $("#ruleBlock2FormBlocks").data('corrBlocks').length !== 0;
    var checkbox = $("#ruleBlock2GeneralExceptionCheckboxContainer").find("input");
    if (!rule2GeneralExceptionIsEnabled) {
        checkbox.prop('checked', false);
        checkbox.trigger('change');
    }
    checkbox.prop("disabled", !rule2GeneralExceptionIsEnabled);
}

/**
 * Initializes add correspondence block button on the GLA rule 2 form.
 */
function initAddCorrButon() {
    $("#ruleBlock2").find("#addCorrButton").button({
        label: languageConstants.gla.rule2.addCorrButtonLabel,
        icons: {
            primary: "ui-icon-plus"
        }
    }).click(function (e) {
        e.preventDefault();
        if (corrList.length === 0) {
            showMessage(languageConstants.gla.rule2.emptyCorrListNote, true);
            return;
        }
        resetSelectCorrPopup();
        selectCorrPopup.dialog('open');
    });
}

/**
 * Resets correspondence selection popup making only unused items available for selection.
 */
function resetSelectCorrPopup() {
    availableCorrList = [];
    for (var i = 0; i < corrList.length; i++) {
        var corrItemIsUsed = usedCorrElementsIds.some(function (element, index) {
            return element === corrList[index].id;
        });
        if (!corrItemIsUsed) {
            availableCorrList.push(corrList[i]);
        }
    }
    initSelectCorrPopupObjectsContainer(availableCorrList);
}


/**
 * Initializes correspondence selection popup elements list.
 * @param data - correspondence elements list.
 * @param reset - pass true to reset elements list before initialization.
 */
function initSelectCorrPopupObjectsContainer(data, reset) {
    reset = defaultFor(reset, true);
    var corrContainer = $("#corrObjectsContainer", selectCorrPopup);
    if (reset) {
        corrContainer.html('');
    }
    for (var i = 0; i < data.length; i++) {
        var div = $('<div></div>');
        div.prop('class', 'corrObjectContainerElement');
        div.data('corrId', data[i].id);
        div.click(function () {
            selectCorrPopup.dialog('close');
            var newBlockData = initialCorrBlockElement;
            newBlockData.id = $(this).data('corrId');
            addRule2CorrBlock(newBlockData);
        });
        div.html(data[i].lbl);
        corrContainer.append(div);
    }
}

function addRule2CorrBlock(blockData, isFirstOne) {
    var formBlocks = $("#ruleBlock2FormBlocks");
    var corrBlocksArray = formBlocks.data('corrBlocks');
    isFirstOne = defaultFor(isFirstOne, corrBlocksArray.length === 0);
    var corrBlock = $('<div></div>');
    corrBlock.data('initialData', blockData);
    corrBlock.attr('id', 'corrBlock' + blockData.id);
    corrBlock.html($('#rule2BlockCorrElementTemplate').html());
    var corrData = $.grep(corrList,
        function (element) {
            return element.id === blockData.id;
        })[0];
    if (typeof corrData === 'undefined') {
        return;
    }
    corrBlocksArray.push(corrBlock);
    $("#corrBlockLabel", corrBlock).html(corrData.lbl);
    //$("#conditionsBlock", corrBlock).html($('#conditionsBlockTemplate').html());
    initFieldToValueConditionsBlock($("#conditionsBlock", corrBlock),conditionsBlockConstants.trn);
    var rulesTable = $('#rulesTable', corrBlock);
    rulesTable.data('rules', []);
    initAddConditionButton($("#addConditionButton", corrBlock), activeRuleProcessTypeConstants.gl2);
    initCheckbox($("#controlChecboxContainer input", corrBlock), $("#conditionsBlock", corrBlock));
    //remove button
    var removeButton = $('#removeCorrBlockButtonContainer button', corrBlock);
    removeButton.button({
        label: languageConstants.gla.rule2.removeCorrBlockButtonLabel,
        icons: {
            primary: "ui-icon-trash"
        },
        text: false
    });
    //remove button initialisation
    removeButton.click(function () {
        var blockArrayIndex = $.inArray(corrBlock, corrBlocksArray);
        var usedIdsArrayIndex = $.inArray(corrBlock.data('initialData').id, usedCorrElementsIds);
        if (blockArrayIndex !== -1 && usedIdsArrayIndex !== -1) {
            if (corrBlock.prev().prop('id') === 'logicalOperandNote') {
                corrBlock.prev().remove();
            }
            corrBlocksArray.splice(blockArrayIndex, 1);
            usedCorrElementsIds.splice(usedIdsArrayIndex, 1);
            corrBlock.remove();
            updateRule2GeneralExceptionConditionsBlock();
        }
    });
    if (!isFirstOne) {
        var div1 = $('<div></div>');
        div1.prop('id', 'logicalOperandNote');
        div1.prop('class', 'rule2CorrBlockLogicalOperandElement');
        div1.html('AND');
        formBlocks.append(div1);
    }
    formBlocks.append(corrBlock);
    if (typeof blockData !== 'undefined') {
        $("#controlChecboxContainer input", corrBlock).prop('checked', blockData.end === 1);
        $("#controlChecboxContainer input", corrBlock).trigger('change');
        if (blockData.cnds.length !== 0) {
            for (var i = 0, max = blockData.cnds.length; i < max; i++) {
                addCondition(rulesTable, blockData.cnds[i]);
            }
        } else {
            addCondition(rulesTable);
        }
    }
    usedCorrElementsIds.push(blockData.id);
    updateRule2GeneralExceptionConditionsBlock();
}

/**
 * Comment
 */
function initRule3Block() {
    $("#ruleBlock3").find(".formBlockHeader").html(languageConstants.gla.rule3.label);
    var ruleBlock3FormBlocks = $("#ruleBlock3FormBlocks");
    ruleBlock3FormBlocks.find("#inputFieldLabel").html(languageConstants.gla.rule3.inputFieldLabel);
    ruleBlock3FormBlocks.find("input").val(glaRule3Data.amountLimit);
}


/**
 * Comment
 */
function initSelectCorrPopup() {
    selectCorrPopup = $("#selectCorrPopup").dialog({
        title: languageConstants.gla.rule2.selectCorrPopup.title,
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 400,
        buttons: [
            {
                text: "Ok",
                click: function () {
                    $(this).dialog("close");
                }
            },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
    $('p', selectCorrPopup).html(languageConstants.gla.rule2.selectCorrPopup.introText);
    $("#corrSearch", selectCorrPopup).autocomplete({
        source: function (request, response) {
            var matcher = new RegExp("" + $.ui.autocomplete.escapeRegex(request.term), "i");
            //RegExp, that matches only words, whith a specified beginnings
            //var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
            var result = $.grep(availableCorrList, function (element) {
                return matcher.test(element.lbl);
            });
            initSelectCorrPopupObjectsContainer(result);
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
}


/**
 * Comment
 */
function getRuleFromBlock1() {
    glaRule1Data.exbl.end = $("#ruleBlock1GeneralExceptionCheckboxContainer").find("input").prop('checked') ? 1 : 0;
    var exceptionBlockConditionsData = getConditionsData($("#ruleBlock1GeneralExceptionBlock").find("#rulesTable"));
    glaRule1Data.exbl.cnds = exceptionBlockConditionsData.list;
    var rule1Text = '';
    var rule1Sql = '';
    for (var i = 0, max = glaRule1Data.stel.length; i < max; i++) {
        var elementIsEnabled = $('#ruleBlock1 #' + glaRule1Data.stel[i].laid + ' #controlChecboxContainer input').prop('checked') ? 1 : 0;
        glaRule1Data.stel[i].end = elementIsEnabled;
        var conditionsData = getConditionsData($('#ruleBlock1 #' + glaRule1Data.stel[i].laid + ' #rulesTable'));
        glaRule1Data.stel[i].cnds = conditionsData.list;
        if (elementIsEnabled !== 1) {
            continue;
        }
        if (i !== 0 && rule1Text.length !== 0 && rule1Sql.length !== 0) {
            rule1Text += ' OR ';
            rule1Sql += ' OR ';
        }
        rule1Text += '(' + conditionsData.text + ')';
        rule1Sql += '(' + conditionsData.sql + ')';
    }
    if (glaRule1Data.exbl.end && rule1Text.length !== 0 && rule1Sql.length !== 0) {
        rule1Text = '(' + exceptionBlockConditionsData.text + ') AND (' + rule1Text + ')';
        rule1Sql = '(' + exceptionBlockConditionsData.sql + ') AND (' + rule1Sql + ')';
    }
    return {web: JSON.stringify(glaRule1Data), text: rule1Text, sql: rule1Sql};
}
/**
 * Comment
 */
function getRuleFromBlock2() {
    glaRule2Data.exbl.end = $("#ruleBlock2GeneralExceptionCheckboxContainer").find("input").prop('checked') ? 1 : 0;
    var exceptionBlockConditionsData = getConditionsData($("#ruleBlock2GeneralExceptionBlock").find("#rulesTable"));
    glaRule2Data.exbl.cnds = exceptionBlockConditionsData.list;
    var rule2Text = '';
    var rule2Sql = '';
    glaRule2Data.coel = [];
    var corrBlocksArray = $("#ruleBlock2FormBlocks").data('corrBlocks');
    for (var i = 0, max = corrBlocksArray.length; i < max; i++) {
        var initialBlockData = corrBlocksArray[i].data('initialData');
        var blockData = initialBlockData;
        var localExceptionIsEnabled = $('#ruleBlock2 #' + corrBlocksArray[i].prop('id') + ' #controlChecboxContainer input').prop('checked') ? 1 : 0;
        blockData.end = localExceptionIsEnabled;
        var conditionsData = getConditionsData($('#ruleBlock2 #' + corrBlocksArray[i].prop('id') + ' #rulesTable'));
        blockData.cnds = conditionsData.list;
        glaRule2Data.coel.push(blockData);
        if (i !== 0) {
            rule2Text += ' AND ';
            rule2Sql += ' AND ';
        }
        rule2Text += '(corrId != ' + initialBlockData.id;
        rule2Sql += '(corrId <> ' + initialBlockData.id;
        if (localExceptionIsEnabled === 1) {
            rule2Text += ' OR (' + conditionsData.text + ')';
            rule2Sql += ' OR (' + conditionsData.sql + ')';
        }
        rule2Text += ')';
        rule2Sql += ')';
    }
    if (glaRule2Data.exbl.end && corrBlocksArray.length > 0) {
        rule2Text = '(' + exceptionBlockConditionsData.text + ') AND (' + rule2Text + ')';
        rule2Sql = '(' + exceptionBlockConditionsData.sql + ') AND (' + rule2Sql + ')';
    }
    return {web: JSON.stringify(glaRule2Data), text: rule2Text, sql: rule2Sql};
}
/**
 * Comment
 */
function getRuleFromBlock3() {
    var amountLimit = $("#ruleBlock3FormBlocks").find("input").val();
    glaRule3Data.amountLimit = amountLimit;
    var conditionsText = languageConstants.gla.rule3.amountLimitLabel + ' = ' + amountLimit;
    var conditionsSql = languageConstants.gla.rule3.amountLimitLabel + ' = ' + amountLimit;
    return {web: JSON.stringify(glaRule3Data), text: conditionsText, sql: conditionsSql};
}

