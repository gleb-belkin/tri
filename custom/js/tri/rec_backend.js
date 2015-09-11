/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 20.08.2015.
 */

function RecBackendService() {

}
/**
 * Saves rule to server.
 * @param {object} ruleType - Rule type: rule or draft.
 */
//todo: add parameters and success callback
RecBackendService.saveRule = function (ruleData, successCallback, failCallback) {
    lockScreen();
    //todo: concat all three descriptions
    //var ruleData = getRuleData(ruleType);
    var requestData = ruleData.requestData;
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {
            tr_method: backendMethodConstants.saveRecRule,
            dt_suf: backendLogId,
            rule_id: requestData.id,
            rule_nm: requestData.name,
            rec_cnd_web: requestData.recConditionsWeb,
            trn_ex_cnd_web: requestData.trnExceptionsConditionsWeb,
            evt_ex_cnd_web: requestData.evtExceptionsConditionsWeb,
            rec_cnd_desc: requestData.recConditionsText,
            trn_ex_cnd_desc: requestData.trnExceptionsConditionsText,
            evt_ex_cnd_desc: requestData.evtExceptionsConditionsText,
            rec_cnd_code: requestData.recConditionsCode,
            trn_ex_cnd_sql: requestData.trnExceptionsConditionsSql,
            evt_ex_cnd_sql: requestData.evtExceptionsConditionsSql,
            comment: requestData.userComment,
            trn_ex_end: requestData.trnExceptionsEnabled,
            evt_ex_end: requestData.evtExceptionsEnabled,
            etl_from: requestData.etlFrom,
            etl_to: requestData.etlTo
        }
    })
        .done(function (saveRuleResponse) {
            var saveRuleResult = performBaseResponseProcessing(saveRuleResponse, backendMethodConstants.saveRule);
            if (saveRuleResult == null) {
                return;
            }
            successCallback(saveRuleResult);
        })
        .fail(function () {
            failCallback();
        });
}

/**
 * Removes rule.
 */
//todo: add parameters and success callback
RecBackendService.removeRule = function (ruleId, successCallback, failCallback) {
    lockScreen();
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.removeRecRule, dt_suf: backendLogId, rule_id: ruleId}
    })
        .done(function (removeRuleResponse) {
            var removeRuleResult = performBaseResponseProcessing(removeRuleResponse, backendMethodConstants.removeRule);
            if (removeRuleResult === null) {
                return;
            }
            successCallback();
        })
        .fail(function () {
            failCallback();
        });
}

/**
 * Requests rule history from the backend and displays it in the rule history popup.
 */
RecBackendService.showRecRule = function(ruleId, successCallback, failCallback) {
    lockScreen();
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {tr_method: backendMethodConstants.getRecRuleData, dt_suf: backendLogId, rule_id:ruleId}
    })
        .done(function (getRecRuleDataResponse) {
            var getRecRuleDataResult = performBaseResponseProcessing(getRecRuleDataResponse, backendMethodConstants.getRecRuleData);
            if (getRecRuleDataResult === null) {
                return;
            }
            successCallback(getRecRuleDataResult);
            unlockScreen();
        })
        .fail(function () {
            failCallback();
        });
}

/**
 * Requests reconciliation rule history from the backend and displays it in the reconciliation rule history popup.
 */
RecBackendService.showRecRuleHistory = function(ruleId, successCallback) {
    lockScreen();
    $.ajax({
        type: "POST",
        url: backendUrl,
        data: {
            tr_method: backendMethodConstants.getRecRuleHistory,
            dt_suf: backendLogId,
            rule_id: ruleId
        }
    })
        .done(function (getRecRuleHistoryResponse) {
            var getRecRuleHistoryResult = performBaseResponseProcessing(getRecRuleHistoryResponse, backendMethodConstants.getRecRuleHistory);
            if (getRecRuleHistoryResult === null) {
                return;
            }
            successCallback(getRecRuleHistoryResult);
            unlockScreen();
        })
        .fail(function (msg) {
            showMessage(languageConstants.general.messagePopup.getRecRuleHistory.fail);
            unlockScreen();
            return;
        });
}