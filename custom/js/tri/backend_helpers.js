/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */


/**
 * Comment
 */
function performBaseResponseProcessing(response, backendMethodName) {
    var result;
    try {
        result = JSON.parse(processBackendQuotes(response));
    } catch (e) {
        showMessage(languageConstants.general.messagePopup.backendError.parseError, true);
        unlockScreen();
        return null;
    } finally {
        //
    }
    if (typeof result === 'undefined') {
        showMessage(getErrorMessageByBackendMethodName(backendMethodName), true);
        unlockScreen();
        return null;
    } else if (result.status !== 'ok') {
        if (result.status === 'error') {
            showMessage(getErrorMessageByErrorCode(result.code));
        } else {
        }
        showMessage(getErrorMessageByBackendMethodName(backendMethodName), true);
        unlockScreen();
        return null;
    }
    backendLogId = result.dt_suf;
    return result;
}

/**
 * Comment
 */
function getErrorMessageByBackendMethodName(backendMethodName) {
    switch (backendMethodName) {
        case backendMethodConstants.getIncidentTypeData:
            return languageConstants.general.messagePopup.loadIncidentTypeData.fail;
        case backendMethodConstants.getInitData:
            return languageConstants.general.messagePopup.loadRulesData.fail;
        case backendMethodConstants.getCorrData:
            return languageConstants.general.messagePopup.loadCorrData.fail;
        case backendMethodConstants.getDropdownList:
            return languageConstants.general.messagePopup.getDropdownList.fail;
        case backendMethodConstants.getRuleHistory:
            return languageConstants.general.messagePopup.getRuleHistory.fail;
        case backendMethodConstants.removeRule:
            return languageConstants.general.messagePopup.removeRule.fail;
        case backendMethodConstants.saveRule:
            return languageConstants.general.messagePopup.saveRule.fail;
        case backendMethodConstants.logout:
            return languageConstants.general.messagePopup.logout.fail;
        case backendMethodConstants.getRecRuleHistory:
            return languageConstants.general.messagePopup.getRecRuleHistory.fail;
        case backendMethodConstants.getRecRuleData:
            return languageConstants.general.messagePopup.getRecRuleData.fail;
        default :
            return languageConstants.general.messagePopup.backendError.generalError;
    }
}
/**
 * Comment
 */
function getErrorMessageByErrorCode(errorCode) {
    switch (errorCode) {
        case backendErrorCodeConstants.lockError:
            return languageConstants.general.messagePopup.backendError.lockError;
        default :
            return languageConstants.general.messagePopup.backendError.generalError;
    }
}



/**
 * Replaces single quote with double quote in the backend response.
 * @param {string} responseString - raw response string.
 */
function processBackendQuotes(responseString) {
    return responseString.replace(new RegExp(RegExp.escape('\''), 'g'), '"');
}

/**
 * Comment
 */
function checkRulesData() {
    var rule1IsOk = typeof glaRule1Data !== 'undefined'
        && typeof glaRule1Data.exbl !== 'undefined'
        && typeof glaRule1Data.stel !== 'undefined'
        && glaRule1Data.stel.length === glaRule1DataStationaryElementsCount;
    var rule2IsOk = typeof glaRule2Data !== 'undefined'
        && typeof glaRule2Data.exbl !== 'undefined';
    var rule3IsOk = typeof glaRule3Data !== 'undefined'
        && typeof glaRule3Data.amountLimit !== 'undefined';
    return rule1IsOk && rule2IsOk && rule3IsOk;
}