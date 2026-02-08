/**
 * Config Barrel Export
 */

export { config } from './app.config';
export {
    employeeFormSchema,
    getVisibleFields,
    getFieldsByGroup,
    getRequiredFieldNames,
    getMandatoryFields
} from './formSchema';

export {
    MANDATORY_FIELDS,
    DEFAULT_OPTIONAL_FIELDS,
    FIELD_GROUPS,
    FIELD_TYPES,
    getCustomFields,
    saveCustomFields,
    getAllFields,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    resetToDefaults
} from './customFieldsStore';
