/**
 * Employee Form Schema Configuration
 * 
 * This now uses the customFieldsStore for dynamic field management
 * Mandatory fields are fixed, custom fields can be added/removed via UI
 */

import { FormSchema, FieldSchema } from '../types';
import { getAllFields, MANDATORY_FIELDS } from './customFieldsStore';

/**
 * Field groups for UI organization
 */
const fieldGroups = [
    { id: 'personal', name: 'Personal Information', description: 'Basic personal details', order: 1 },
    { id: 'contact', name: 'Contact Details', description: 'Contact information', order: 2 },
    { id: 'employment', name: 'Employment Details', description: 'Job-related information', order: 3 },
    { id: 'equipment', name: 'Equipment & Assets', description: 'Required equipment', order: 4 },
    { id: 'other', name: 'Other Information', description: 'Additional information', order: 5 },
];

/**
 * Complete employee form schema
 */
export const employeeFormSchema: FormSchema = {
    id: 'employee-onboarding-form',
    name: 'Employee Onboarding Form',
    description: 'Form for onboarding new employees to the organization',
    version: '2.0.0',
    fields: getAllFields(),
    groups: fieldGroups,
};

/**
 * Get visible fields only (uses dynamic fields from store)
 */
export const getVisibleFields = (): FieldSchema[] => {
    return getAllFields().filter((field) => field.visible !== false).sort((a, b) => a.order - b.order);
};

/**
 * Get fields by group
 */
export const getFieldsByGroup = (groupId: string): FieldSchema[] => {
    return getAllFields()
        .filter((field) => field.group === groupId)
        .sort((a, b) => a.order - b.order);
};

/**
 * Get required field names
 */
export const getRequiredFieldNames = (): string[] => {
    return getAllFields().filter((field) => field.required).map((field) => field.name);
};

/**
 * Get mandatory fields (core fields that cannot be removed)
 */
export const getMandatoryFields = (): FieldSchema[] => {
    return MANDATORY_FIELDS;
};

export default employeeFormSchema;
