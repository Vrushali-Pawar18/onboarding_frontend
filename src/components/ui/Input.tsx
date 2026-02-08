/**
 * Input Component
 * Reusable form input with label and error handling
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helpText,
    required,
    className,
    id,
    ...props
}) => {
    const inputId = id || props.name;

    return (
        <div className="form-group">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn('form-label', required && 'form-label-required')}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn('form-input', error && 'form-input-error', className)}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...props}
            />
            {error && (
                <div id={`${inputId}-error`} className="form-error" role="alert">
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

export default Input;
