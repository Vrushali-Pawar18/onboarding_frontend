/**
 * Select Component
 * Reusable dropdown select with label and error handling
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils';
import { FieldOption } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helpText?: string;
    options: FieldOption[];
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helpText,
    options,
    placeholder,
    required,
    className,
    id,
    ...props
}) => {
    const selectId = id || props.name;

    return (
        <div className="form-group">
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn('form-label', required && 'form-label-required')}
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={cn('form-input form-select', error && 'form-input-error', className)}
                aria-invalid={!!error}
                aria-describedby={error ? `${selectId}-error` : undefined}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <div id={`${selectId}-error`} className="form-error" role="alert">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}
            {helpText && !error && (
                <div className="form-help">{helpText}</div>
            )}
        </div>
    );
};

export default Select;
