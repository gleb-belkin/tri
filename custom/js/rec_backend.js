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
            rule_txt: requestData.conditionsWeb,
            rule_sql: requestData.conditionsSql,
            rule_desc: requestData.conditionsText,
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