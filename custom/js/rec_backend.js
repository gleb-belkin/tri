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
RecBackendService.saveRule = function (ruleData) {
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