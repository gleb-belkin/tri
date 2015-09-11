/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */

/**
 * Comment
 */
//todo: fail callback
function loadIncidentTypeData(successCallback, failCallback) {
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.getIncidentTypeData, dt_suf: backendLogId, tr_instr: ''}
    })
        .done(function (loadIncidentTypeDataResponse) {
            var loadIncidentTypeDataResult = performBaseResponseProcessing(loadIncidentTypeDataResponse, backendMethodConstants.getIncidentTypeData);
            if (loadIncidentTypeDataResult == null) {
                return;
            }
            successCallback(loadIncidentTypeDataResult);
        })
        .fail(function () {
            failCallback();
        });
}

/**
 * Comment
 */
//todo: add fail callback
function loadRulesData(successCallback, failCallback) {
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.getInitData, dt_suf: backendLogId, tr_instr: ''}
    })
        .done(function (loadRulesDataResponse) {
            var loadRulesDataResult = performBaseResponseProcessing(loadRulesDataResponse, backendMethodConstants.getInitData);
            if (loadRulesDataResult == null) {
                return;
            }
            successCallback(loadRulesDataResult);
        })
        .fail(function () {
            failCallback();
        });
}


/**
 * Saves rule to server.
 * @param {object} ruleType - Rule type: rule or draft.
 */
//todo: add parameters and success callback
function saveRule(ruleType) {
    lockScreen();
    var ruleData = getRuleData(ruleType);
    var requestData = ruleData.requestData;
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {
            tr_method: backendMethodConstants.saveRule,
            dt_suf: backendLogId,
            rule_nm: requestData.name,
            rule_type: requestData.processType,
            evt_type_id: requestData.incidentTypeId,
            rule_txt: requestData.conditionsWeb,
            rule_sql: requestData.conditionsSql,
            rule_desc: requestData.conditionsText,
            comments: requestData.userComment,
            status: requestData.type
        }
    })
        .done(function (saveRuleResponse) {
            var saveRuleResult = performBaseResponseProcessing(saveRuleResponse, backendMethodConstants.saveRule);
            if (saveRuleResult == null) {
                return;
            }
            switch (activeRuleProcessType) {
                case activeRuleProcessTypeConstants.edc:
                    $.ajax({
                        type: "POST",
                        url: backendUrl,
                        data: {
                            tr_method: backendMethodConstants.getIncidentTypeData,
                            dt_suf: backendLogId,
                            tr_instr: ''
                        }
                    })
                        .done(function (getIncidentTypeDataResponse) {
                            var getIncidentTypeDataResult = performBaseResponseProcessing(getIncidentTypeDataResponse, backendMethodConstants.getIncidentTypeData);
                            if (getIncidentTypeDataResult === null) {
                                return;
                            }
                            incidentTypeData = getIncidentTypeDataResult.data;
                            destroyIncidentTypeMenu();
                            initIncidentTypeMenu();
                            switch (activeRuleProcessType) {
                                case activeRuleProcessTypeConstants.edc:
                                    switch (ruleCreationStatus) {
                                        case ruleCreationStatusConstants.add:
                                            edcRulesData.push(ruleData.data);
                                            break;
                                        case ruleCreationStatusConstants.update:
                                            for (var i = 0, max = edcRulesData.length; i < max; i++) {
                                                if (edcRulesData[i].itid === ruleData.data.itid) {
                                                    edcRulesData[i] = ruleData.data;
                                                    break;
                                                }
                                            }
                                            break;
                                    }
                                    resetEdcRulesBlock();
                                    initEdcRulesBlock();
                                    addEdcRulePopup.dialog("close");
                                    break;
                                case activeRuleProcessTypeConstants.gl1:
                                case activeRuleProcessTypeConstants.gl2:
                                case activeRuleProcessTypeConstants.gl3:
                                    break;
                            }
                            showMessage(languageConstants.general.messagePopup.saveRule.success);
                            unlockScreen();

                        })
                        .fail(function () {
                            showMessage(languageConstants.general.messagePopup.saveRule.fail);
                            unlockScreen();
                        });
                    break;
                case activeRuleProcessTypeConstants.gl1:
                case activeRuleProcessTypeConstants.gl2:
                case activeRuleProcessTypeConstants.gl3:
                    showMessage(languageConstants.general.messagePopup.saveRule.success);
                    unlockScreen();
                    break;
            }
        })
        .fail(function () {
            showMessage(languageConstants.general.messagePopup.saveRule.fail);
            unlockScreen();
        });
}

/**
 * Removes rule.
 */
//todo: add parameters and success callback
function removeRule() {
    lockScreen();
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.removeRule, dt_suf: backendLogId, tr_instr: getRemoveRuleString()}
    })
        .done(function (removeRuleResponse) {
            var removeRuleResult = performBaseResponseProcessing(removeRuleResponse, backendMethodConstants.removeRule);
            if (removeRuleResult === null) {
                return;
            }
            removeActiveEdcRule();
            resetEdcRulesBlock();
            initEdcRulesBlock();
            addEdcRulePopup.dialog("close");
            unlockScreen();
            showMessage(languageConstants.general.messagePopup.removeRule.success);
        })
        .fail(function () {
            showMessage(languageConstants.general.messagePopup.removeRule.fail);
            unlockScreen();
        });
}
/**
 * Logs user out.
 */
//todo: add success callback
function logout() {
    lockScreen();
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.logout, dt_suf: backendLogId, tr_instr: ''}
    })
        .done(function (logoutResponse) {
            var logoutResult = performBaseResponseProcessing(logoutResponse, backendMethodConstants.logout);
            if (logoutResult === null) {
                return;
            }
            hideGeneralLayout();
            unlockScreen();
            showMessage(languageConstants.general.messagePopup.logout.success);
        })
        .fail(function () {
            showMessage(getErrorMessageByBackendMethodName(backendMethodConstants.logout), true);
            unlockScreen();
        });
}
/**
 * Removes rule.
 */
//todo: add success callback
function getDropdownList(listId) {
    lockScreen();
    var result;
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.getDropdownList, dt_suf: backendLogId, tr_instr: listId}
    })
        .done(function (getDropdownListResponse) {
            var getDropdownListResult = performBaseResponseProcessing(getDropdownListResponse, backendMethodConstants.getDropdownList);
            if (getDropdownListResult === null) {
                return;
            }
//                var getDropdownListResult;
//                try {
//                    //var correctSyntaxResult = getDropdownListResponse.replace(new RegExp(RegExp.escape('\''), 'g'), '"');
//                    getDropdownListResult = JSON.parse(processBackendQuotes(getDropdownListResponse));
//                } catch (e) {
//                    showMessage(languageConstants.general.messagePopup.getDropdownList.fail, true);
//                    unlockScreen();
//                    return result;
//                } finally {
//                    //
//                }
//                if (typeof getDropdownListResult === 'undefined' || getDropdownListResult.status !== 'ok') {
//                    showMessage(languageConstants.general.messagePopup.getDropdownList.fail, true);
//                    unlockScreen();
//                    return result;
//                }
            result = getDropdownListResult.data;
            unlockScreen();
            //showMessage(languageConstants.general.messagePopup.getDropdownList.success);
            return result;
        })
        .fail(function () {
            showMessage(languageConstants.general.messagePopup.getDropdownList.fail);
            unlockScreen();
            return result;
        });
}

/**
 * Requests rule history from the backend and displays it in the rule history popup.
 */
//todo: add parameters and success callback
function showRuleHistory() {
    var incidentTypeId = -1;
    switch (activeRuleProcessType) {
        case activeRuleProcessTypeConstants.edc:
            incidentTypeId = $('#incidentTypeSelector', addEdcRulePopup).data('data').id;
            break;
        case activeRuleProcessTypeConstants.gl1:
            break;
        case activeRuleProcessTypeConstants.gl2:
            break;
        case activeRuleProcessTypeConstants.gl3:
            break;
    }
    lockScreen();
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {
            tr_method: backendMethodConstants.getRuleHistory,
            dt_suf: backendLogId,
            rule_type: activeRuleProcessType,
            evt_type_id: incidentTypeId
        }
    })
        .done(function (getRuleHistoryResponse) {
            var getRuleHistoryResult = performBaseResponseProcessing(getRuleHistoryResponse, backendMethodConstants.getRuleHistory);
            if (getRuleHistoryResult === null) {
                return;
            }
            initHistoryPopupElementsContainer(getRuleHistoryResult.data);
            unlockScreen();
            ruleHistoryPopup.dialog('open');
        })
        .fail(function () {
            showMessage(languageConstants.general.messagePopup.getRuleHistory.fail);
            unlockScreen();
        });
}