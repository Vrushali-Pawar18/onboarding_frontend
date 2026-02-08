/**
 * Application Configuration
 * Centralized configuration for the frontend
 */

export const config = {
    // API Configuration
    api: {
        baseUrl: import.meta.env.VITE_API_URL || '/api',
        timeout: 10000,
    },

    // App Configuration
    app: {
        name: import.meta.env.VITE_APP_NAME || 'Onboarding Manager',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },

    // Pagination defaults
    pagination: {
        defaultPage: 1,
        defaultLimit: 10,
        limitOptions: [5, 10, 20, 50],
    },

    // Toast duration
    toast: {
        duration: 3000,
        position: 'top-right' as const,
    },
} as const;

export default config;
