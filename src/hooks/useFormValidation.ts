/**
 * Form Validation Hook
 * Schema-driven form validation
 */

import { useState, useCallback } from 'react';
import { FieldSchema, ValidationRule, EmployeeFormData } from '../types';

interface ValidationErrors {
    [key: string]: string;
}

interface UseFormValidationReturn {
    errors: ValidationErrors;
    validateField: (field: FieldSchema, value: unknown) => string | null;
    validateForm: (fields: FieldSchema[], data: EmployeeFormData) => boolean;
    clearFieldError: (fieldName: string) => void;
    clearAllErrors: () => void;
    setFieldError: (fieldName: string, error: string) => void;
}

/**
 * Validate a single value against validation rules
 */
const validateValue = (value: unknown, rules: ValidationRule[]): string | null => {
    for (const rule of rules) {
        const stringValue = String(value ?? '').trim();

        switch (rule.type) {
            case 'required':
                if (!value || stringValue === '') {
                    return rule.message;
                }
                break;

            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (stringValue && !emailRegex.test(stringValue)) {
                    return rule.message;
                }
                break;
            }

            case 'phone': {
                const phoneRegex = /^[+]?[0-9]{10,15}$/;
                if (stringValue && !phoneRegex.test(stringValue.replace(/\s/g, ''))) {
                    return rule.message;
                }
                break;
            }

            case 'minLength':
                if (stringValue && stringValue.length < (rule.value as number)) {
                    return rule.message;
                }
                break;

            case 'maxLength':
                if (stringValue && stringValue.length > (rule.value as number)) {
                    return rule.message;
                }
                break;

            case 'pattern': {
                const regex = new RegExp(rule.value as string);
                if (stringValue && !regex.test(stringValue)) {
                    return rule.message;
                }
                break;
            }

            case 'min':
                if (typeof value === 'number' && value < (rule.value as number)) {
                    return rule.message;
                }
                break;

            case 'max':
                if (typeof value === 'number' && value > (rule.value as number)) {
                    return rule.message;
                }
                break;
        }
    }

    return null;
};

/**
 * Custom hook for form validation
 */
export const useFormValidation = (): UseFormValidationReturn => {
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateField = useCallback((field: FieldSchema, value: unknown): string | null => {
        // Check required first
        if (field.required && (!value || String(value).trim() === '')) {
            const requiredRule = field.validations.find((v) => v.type === 'required');
            return requiredRule?.message || `${field.label} is required`;
        }

        // Skip other validations if field is empty and not required
        if (!value || String(value).trim() === '') {
            return null;
        }

        // Run all validations
        return validateValue(value, field.validations);
    }, []);

    const validateForm = useCallback((fields: FieldSchema[], data: EmployeeFormData): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        for (const field of fields) {
            const value = data[field.name];
            const error = validateField(field, value);

            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    }, [validateField]);

    const clearFieldError = useCallback((fieldName: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    const setFieldError = useCallback((fieldName: string, error: string) => {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }, []);

    return {
        errors,
        validateField,
        validateForm,
        clearFieldError,
        clearAllErrors,
        setFieldError,
    };
};

export default useFormValidation;
