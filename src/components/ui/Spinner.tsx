/**
 * Loading Spinner Component
 */

import React from 'react';
import { cn } from '../../utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    className,
}) => {
    const sizeClasses = {
        sm: 'spinner-sm',
        md: '',
        lg: 'spinner-lg',
    };

    return (
        <div
            className={cn('spinner', sizeClasses[size], className)}
            role="status"
            aria-label="Loading"
        />
    );
};

export default Spinner;
