/**
 * Dynamic Field Component
 * Renders form fields based on schema configuration
 * 
 * THIS IS THE CORE OF EXTENSIBILITY
 * 
 * New field types can be added here and they will automatically
 * work with the schema-driven form rendering
 */

import React from 'react';
import { FieldSchema, EmployeeFormData } from '../../types';
import { Input, Select, Toggle } from '../ui';

interface DynamicFieldProps {
    field: FieldSchema;
    value: string | number | boolean | undefined;
    onChange: (name: string, value: string | number | boolean) => void;
    error?: string;
    disabled?: boolean;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    field,
    value,
    onChange,
    error,
    disabled,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(field.name, e.target.value);
    };

    const handleToggleChange = (checked: boolean) => {
        onChange(field.name, checked);
    };

    // Render based on field type
    switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
            return (
                <Input
                    type={field.type === 'phone' ? 'tel' : field.type}
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={(value as string) || ''}
                    onChange={handleChange}
                    error={error}
                    helpText={field.helpText}
                    required={field.required}
                    disabled={disabled || field.disabled}
                />
            );

        case 'date':
            return (
                <Input
                    type="date"
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={(value as string) || ''}
                    onChange={handleChange}
                    error={error}
                    helpText={field.helpText}
                    required={field.required}
                    disabled={disabled || field.disabled}
                />
            );

        case 'number':
            return (
                <Input
                    type="number"
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={(value as number) || ''}
                    onChange={handleChange}
                    error={error}
                    helpText={field.helpText}
                    required={field.required}
                    disabled={disabled || field.disabled}
                />
            );

        case 'textarea':
            return (
                <div className="form-group">
                    <label
                        htmlFor={field.name}
                        className={`form-label ${field.required ? 'form-label-required' : ''}`}
                    >
                        {field.label}
                    </label>
                    <textarea
                        id={field.name}
                        name={field.name}
                        className={`form-input ${error ? 'form-input-error' : ''}`}
                        placeholder={field.placeholder}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        disabled={disabled || field.disabled}
                        rows={4}
                    />
                    {error && <div className="form-error">{error}</div>}
                    {field.helpText && !error && <div className="form-help">{field.helpText}</div>}
                </div>
            );

        case 'select':
            return (
                <Select
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder || 'Select an option'}
                    options={field.options || []}
                    value={(value as string) || ''}
                    onChange={handleChange}
                    error={error}
                    helpText={field.helpText}
                    required={field.required}
                    disabled={disabled || field.disabled}
                />
            );

        case 'boolean':
            return (
                <Toggle
                    name={field.name}
                    label={field.label}
                    helpText={field.helpText}
                    checked={Boolean(value ?? field.defaultValue)}
                    onChange={handleToggleChange}
                    disabled={disabled || field.disabled}
                />
            );

        default:
            return (
                <Input
                    type="text"
                    name={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={(value as string) || ''}
                    onChange={handleChange}
                    error={error}
                    helpText={field.helpText}
                    required={field.required}
                    disabled={disabled || field.disabled}
                />
            );
    }
};

/**
 * Props for DynamicForm
 */
interface DynamicFormProps {
    fields: FieldSchema[];
    values: EmployeeFormData;
    errors: Record<string, string>;
    onChange: (name: string, value: string | number | boolean) => void;
    disabled?: boolean;
}

/**
 * Dynamic Form Component
 * Renders multiple fields based on schema
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    values,
    errors,
    onChange,
    disabled,
}) => {
    return (
        <div className="form-grid form-grid-2">
            {fields.map((field) => (
                <DynamicField
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    onChange={onChange}
                    error={errors[field.name]}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default DynamicField;
