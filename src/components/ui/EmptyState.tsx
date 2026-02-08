/**
 * Empty State Component
 * Displayed when there's no data
 */

import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                {icon || <FileX size={80} />}
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};

export default EmptyState;
