/**
 * Created by Gleb Belkin (gleb.belkin@outlook.com) on 29.07.2015.
 */


var languageConstants = {
    general: {
        pageTitle: 'AMA transaction rules interface',
        edcLabel: 'EDC',
        glaLabel: 'GLA',
        recLabel: 'Реконсиляция',
        logoutButtonLabel: 'Выйти',
        messagePopup: {
            okButtonLabel: 'Ok',
            cancelButtonLabel: 'Отмена',
            loadIncidentTypeData: {
                fail: 'Ошибка при загрузке типов инцидентов.'
            },
            loadRulesData: {
                fail: 'Ошибка при загрузке правил.'
            },
            saveRule: {
                success: 'Правило успешно сохранено.',
                fail: 'Ошибка при сохранении правила.'
            },
            removeRule: {
                success: 'Правило успешно удалено.',
                fail: 'Ошибка при удалении правила.'
            },
            loadCorrData: {
                success: 'Справочник корреспонденции успешно загружен.',
                fail: 'Ошибка при загрузке справочника корреспонденции.'
            },
            getRuleHistory: {
                success: 'История изменения правила успешно загружена.',
                fail: 'Ошибка при загрузке истории изменения правила.'
            },
            logout: {
                success: 'Выход произведен успешно, интерфейс разблокирован.',
                fail: 'Ошибка при выходе из приложения.'
            },
            getDropdownList: {
                success: 'Список значений успешно загружен.',
                fail: 'Ошибка при загрузке списка значений.'
            },
            getRecRuleHistory: {
                success: 'История изменения правила успешно загружена.',
                fail: 'Ошибка при загрузке истории изменения правила.'
            },
            getRecRuleData: {
                success: 'Правило успешно загружено.',
                fail: 'Ошибка при загрузке правила.'
            },
            backendError: {
                generalError: 'Ошибка при взаимодействии с сервером.',
                parseError: 'Ошибочный формат ответа сервера.',
                lockError: 'Интерфейс заблокирован другим пользователем.'
            }
        },
        ruleHistoryPopup: {
            title: 'История изменения правила',
            introText: 'Ниже приведена история изменения правила.',
            historyElementDateLabel: 'Дата и время:',
            historyElementUserLabel: 'Пользователь:',
            historyElementCommentLabel: 'Комментарий:',
            historyElementRuleDescriptionLabel: 'Редакция правила:',
            closeButtonLabel: 'Закрыть'
        },
        confirmationPopup: {
            general: {
                logoutNote: 'Интерфейс будет закрыт и разблокирован.'
            },
            edc: {
                title: 'Подтверждение',
                saveNote: 'Пожалуйста, укажите комментарий в поле ниже:',
                saveAsDraftNote: 'Пожалуйста, укажите комментарий в поле ниже:',
                removeNote: 'Пожалуйста, укажите комментарий в поле ниже:',
                cancelNote: 'Пожалуйста, подтвердите закрытие окна. Изменения не будут сохранены на сервере.',
                submitButtonLabel: 'Подтвердить',
                cancelButtonLabel: 'Отменить',
                emptyCommentNote: 'Пожалуйста, добавьте комментарий.'
            },
            gla: {
                saveNote: 'Пожалуйста, укажите комментарий в поле ниже:'
            },
            rec: {
                title: 'Подтверждение',
                saveNote: 'Пожалуйста, укажите комментарий в поле ниже:',
                removeNote: 'Пожалуйста, укажите комментарий в поле ниже:',
                cancelNote: 'Пожалуйста, подтвердите закрытие окна. Изменения не будут сохранены на сервере.',
                submitButtonLabel: 'Подтвердить',
                cancelButtonLabel: 'Отменить',
                emptyCommentNote: 'Пожалуйста, добавьте комментарий.'
            }
        }

    },
    edc: {
        addRuleButtonLabel: 'Добавить правило',
        rulesBlockLabel: 'Правила EDC',
        historyLinkLabel: 'История изменений',
        addEdcRulePopup: {
            header: 'Создайте правило, используя форму.',
            titleAdd: 'Создание правила',
            titleUpdate: 'Редактирование правила',
            selectIncidentTypeLabel: 'Выберите тип инцидента',
            saveButtonLabel: 'Сохранить',
            saveAsDraftButtonLabel: 'Сохранить как черновик',
            removeButtonLabel: 'Удалить',
            cancelButtonLabel: 'Отменить',
            requiredFieldsNote: 'Пожалуйста, заполните все обязательные поля.',
            fieldsFormatNote: 'Пожалуйста, проверьте формат ввода выделенных полей.'
        },
        messagePopup: {
            incidentTypeChangeAlert: 'При изменении типа инцидента несохраненные изменения будут потеряны.'
        }
    },
    gla: {
        rulesTypeSelectorLabel: 'Выберите тип правила',
        saveRuleButtonLabel: 'Сохранить',
        historyLinkLabel: 'История изменений',
        ruleTypeSelectorBlockHeader: 'Тип правила',
        ruleTypeSelectorInputLabel: 'Тип правила:',
        fieldsFormatNote: 'Пожалуйста, проверьте формат ввода выделенных полей.',
        rule1: {
            label: 'Проводки, несвойственные режиму счета',
            generalExceptionControlCheckboxLabel: 'Добавить общее исключение'
        },
        rule2: {
            label: 'Проводки с нестандартной корреспонденцией',
            addCorrButtonLabel: 'Добавить блок корреспонденции',
            removeCorrBlockButtonLabel: 'x',
            corrElementExceptionControlCheckboxLabel: 'Добавить исключение',
            generalExceptionControlCheckboxLabel: 'Добавить общее исключение',
            emptyCorrListNote: 'Справочник корреспонденции пуст. Для добавления блока, добавьте элементы в справочник корреспонденции.',
            selectCorrPopup: {
                title: 'Выбор корреспонденции',
                introText: 'Выберите корреспонденцию из списка ниже:'
            }
        },
        rule3: {
            label: 'Ручные проводки',
            inputFieldLabel: 'Сумма более (EUR)',
            amountLimitLabel: 'amountLimit'
        }
    },
    rec: {
        addRecRuleButtonLabel: 'Создать правило реконсиляции',
        rulesBlockLabel: 'Правила реконсиляции',
        historyLinkLabel: 'История изменений',
        addRecRulePopup: {
            header: 'Создайте правило, используя форму.',
            titleAdd: 'Создание правила',
            titleUpdate: 'Редактирование правила',
            recRulesSectionHeader: 'Условия реконсиляции',
            trnExceptionSectionHeader: 'Условия исключения проводок',
            evtExceptionSectionHeader: 'Условия исключения инцидентов',
            saveButtonLabel: 'Сохранить',
            removeButtonLabel: 'Удалить',
            cancelButtonLabel: 'Отменить',
            requiredFieldsNote: 'Пожалуйста, заполните все обязательные поля.',
            fieldsFormatNote: 'Пожалуйста, проверьте формат ввода выделенных полей.',
            matchLevelSettingsBlockEtlFromLabel: 'Предполагаемая связь: от',
            matchLevelSettingsBlockEtlToLabel: 'до',
            matchLevelSettingsBlockFimFromLabel: 'Финансовое последствие: от'
        }
    },
    templates: {
        rulesTable: {
            fieldSelectorHeader: 'Поле проводки',
            inputValueHeader: 'Значение',
            addConditionButtonLabel: 'Добавить условие',
            removeButtonLabel: 'x'
        }
    }
};

var backendMethodConstants = {
    getIncidentTypeData: 'get_incident_type_data',
    getInitData: 'get_init_data',
    saveRule: 'save_rule',
    removeRule: 'remove_rule',
    getCorrData: 'get_corr_data',
    getRuleHistory: 'get_history',
    getRecRuleHistory: 'get_rec_rule_history',
    getRecRuleData: 'get_rec_rule_data',
    logout: 'logout',
    getDropdownList: 'get_dropdown_list'
};

var backendErrorCodeConstants = {
    generalError: '0',
    lockError: '1'
};

var inputFieldTypeConstants = {
    text: 'text',
    number: 'number',
    date: 'date',
    dropdown: 'dropdown'
};


