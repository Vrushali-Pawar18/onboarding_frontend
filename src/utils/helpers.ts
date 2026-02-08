/**
 * Utility Functions
 * Common helper functions used across the application
 */

/**
 * Format date to display string
 */
export const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string | undefined | null): string => {
    if (!phone) return '-';

    // Format Indian phone number
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
};

/**
 * Get employee full name
 */
export const getFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim();
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string | undefined): string => {
    if (!role) return '-';

    const roleMap: Record<string, string> = {
        engineer: 'Software Engineer',
        designer: 'UI/UX Designer',
        manager: 'Project Manager',
        analyst: 'Business Analyst',
        hr: 'HR Executive',
        marketing: 'Marketing Specialist',
        sales: 'Sales Representative',
        other: 'Other',
    };

    return roleMap[role] || role;
};

/**
 * Classname concatenation helper
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(' ');
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};
