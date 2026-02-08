/**
 * Custom Fields Store
 * Manages custom form fields with localStorage persistence
 * Works independently of backend for offline-first functionality
 */

import { FieldSchema } from '../types';

const STORAGE_KEY = 'onboarding_custom_fields';

/**
 * Core mandatory fields that cannot be removed
 */
export const MANDATORY_FIELDS: FieldSchema[] = [
    {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
        required: true,
        order: 1,
        group: 'personal',
        isCore: true,
        validations: [
            { type: 'required', message: 'First name is required' },
            { type: 'minLength', value: 2, message: 'First name must be at least 2 characters' },
        ],
    },
    {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
        required: true,
        order: 2,
        group: 'personal',
        isCore: true,
        validations: [
            { type: 'required', message: 'Last name is required' },
            { type: 'minLength', value: 2, message: 'Last name must be at least 2 characters' },
        ],
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter email address',
        required: true,
        order: 3,
        group: 'contact',
        isCore: true,
        validations: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' },
        ],
    },
    {
        name: 'phone',
        label: 'Phone Number',
        type: 'phone',
        placeholder: 'Enter phone number',
        required: true,
        order: 4,
        group: 'contact',
        isCore: true,
        validations: [
            { type: 'required', message: 'Phone number is required' },
            { type: 'pattern', value: '^[+]?[0-9]{10,15}$', message: 'Phone must be 10-15 digits' },
        ],
    },
];

/**
 * Default optional fields (can be removed by user)
 */
export const DEFAULT_OPTIONAL_FIELDS: FieldSchema[] = [
    {
        name: 'joiningDate',
        label: 'Joining Date',
        type: 'date',
        placeholder: 'Select joining date',
        required: false,
        order: 5,
        group: 'employment',
        isCore: false,
        validations: [],
        helpText: 'Expected date of joining',
    },
    {
        name: 'role',
        label: 'Role',
        type: 'select',
        placeholder: 'Select role',
        required: false,
        order: 6,
        group: 'employment',
        isCore: false,
        options: [
            { value: 'engineer', label: 'Software Engineer' },
            { value: 'designer', label: 'UI/UX Designer' },
            { value: 'manager', label: 'Project Manager' },
            { value: 'analyst', label: 'Business Analyst' },
            { value: 'hr', label: 'HR Executive' },
            { value: 'marketing', label: 'Marketing Specialist' },
            { value: 'sales', label: 'Sales Representative' },
            { value: 'other', label: 'Other' },
        ],
        validations: [],
    },
    {
        name: 'managerName',
        label: 'Manager Name',
        type: 'text',
        placeholder: 'Enter reporting manager name',
        required: false,
        order: 7,
        group: 'employment',
        isCore: false,
        validations: [],
    },
    {
        name: 'laptopRequired',
        label: 'Laptop Required',
        type: 'boolean',
        defaultValue: true,
        required: false,
        order: 8,
        group: 'equipment',
        isCore: false,
        validations: [],
        helpText: 'Does the employee need a laptop?',
    },
];

/**
 * Get custom fields from localStorage
 */
export const getCustomFields = (): FieldSchema[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with default optional fields
        saveCustomFields(DEFAULT_OPTIONAL_FIELDS);
        return DEFAULT_OPTIONAL_FIELDS;
    } catch {
        return DEFAULT_OPTIONAL_FIELDS;
    }
};

/**
 * Save custom fields to localStorage
 */
export const saveCustomFields = (fields: FieldSchema[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch (error) {
        console.error('Failed to save custom fields:', error);
    }
};

/**
 * Get all fields (mandatory + custom)
 */
export const getAllFields = (): FieldSchema[] => {
    const customFields = getCustomFields();
    return [...MANDATORY_FIELDS, ...customFields].sort((a, b) => a.order - b.order);
};

/**
 * Add a new custom field
 */
export const addCustomField = (field: Omit<FieldSchema, 'id'>): FieldSchema => {
    const customFields = getCustomFields();
    const newField: FieldSchema = {
        ...field,
        name: field.name || `custom_${Date.now()}`,
        isCore: false,
    };

    // Ensure unique name
    if (customFields.some(f => f.name === newField.name) ||
        MANDATORY_FIELDS.some(f => f.name === newField.name)) {
        newField.name = `${newField.name}_${Date.now()}`;
    }

    customFields.push(newField);
    saveCustomFields(customFields);
    return newField;
};

/**
 * Update a custom field
 */
export const updateCustomField = (name: string, updates: Partial<FieldSchema>): FieldSchema | null => {
    const customFields = getCustomFields();
    const index = customFields.findIndex(f => f.name === name);

    if (index === -1) return null;

    customFields[index] = { ...customFields[index], ...updates };
    saveCustomFields(customFields);
    return customFields[index];
};

/**
 * Delete a custom field
 */
export const deleteCustomField = (name: string): boolean => {
    const customFields = getCustomFields();
    const filtered = customFields.filter(f => f.name !== name);

    if (filtered.length === customFields.length) return false;

    saveCustomFields(filtered);
    return true;
};

/**
 * Reset to default fields
 */
export const resetToDefaults = (): void => {
    saveCustomFields(DEFAULT_OPTIONAL_FIELDS);
};

/**
 * Field groups available
 */
export const FIELD_GROUPS = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'contact', name: 'Contact Details' },
    { id: 'employment', name: 'Employment Details' },
    { id: 'equipment', name: 'Equipment & Assets' },
    { id: 'other', name: 'Other Information' },
];

/**
 * Available field types
 */
export const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Multi-line Text' },
    { value: 'boolean', label: 'Yes/No Toggle' },
];
