/**
 * Toggle Component
 * Boolean switch input with label
 */

import React from 'react';
import { cn } from '../../utils';

interface ToggleProps {
    label?: string;
    helpText?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    name?: string;
    id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
    label,
    helpText,
    checked = false,
    onChange,
    disabled = false,
    name,
    id,
}) => {
    const toggleId = id || name;

    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div className="form-group">
            <div className="form-checkbox-wrapper">
                <div
                    role="switch"
                    aria-checked={checked}
                    aria-labelledby={label ? `${toggleId}-label` : undefined}
                    tabIndex={disabled ? -1 : 0}
                    className={cn('form-toggle', checked && 'active')}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                />
                {label && (
                    <span id={`${toggleId}-label`} className="form-label" style={{ marginBottom: 0 }}>
                        {label}
                    </span>
                )}
            </div>
            {helpText && (
                <div className="form-help" style={{ marginLeft: 56 }}>{helpText}</div>
            )}
        </div>
    );
};

export default Toggle;
