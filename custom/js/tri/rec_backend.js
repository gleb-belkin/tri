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
            rec_conditions_web: requestData.recConditionsWeb,
            trn_exceptions_conditions_web: requestData.trnExceptionsConditionsWeb,
            evt_exceptions_conditions_web: requestData.evtExceptionsConditionsWeb,
            rec_conditions_text: requestData.recConditionsText,
            trn_exceptions_conditions_text: requestData.trnExceptionsConditionsText,
            evt_exceptions_conditions_text: requestData.evtExceptionsConditionsText,
            rec_conditions_sql: requestData.recConditionsSql,
            trn_exceptions_conditions_sql: requestData.trnExceptionsConditionsSql,
            evt_exceptions_conditions_sql: requestData.evtExceptionsConditionsSql,
            comment: requestData.userComment,
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
            showMessage(languageConstants.general.messagePopup.removeRecRule.fail);
            unlockScreen();
        });
}