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
RecBackendService.removeRule = function (ruleId) {
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