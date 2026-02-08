/**
 * Avatar Component
 * Displays user initials with gradient background
 */

import React from 'react';
import { cn, getInitials } from '../../utils';

interface AvatarProps {
    firstName: string;
    lastName: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    firstName,
    lastName,
    size = 'md',
    className,
}) => {
    const initials = getInitials(firstName, lastName);

    const sizeClasses = {
        sm: 'avatar-sm',
        md: '',
        lg: 'avatar-lg',
    };

    return (
        <div
            className={cn('avatar', sizeClasses[size], className)}
            aria-label={`${firstName} ${lastName}`}
        >
            {initials}
        </div>
    );
};

export default Avatar;
