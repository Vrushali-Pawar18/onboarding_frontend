/**
 * Redux Store Configuration
 * Centralized store setup with all reducers
 */

import { configureStore } from '@reduxjs/toolkit';
import { employeeReducer, uiReducer } from '../features';

/**
 * Configure Redux store
 */
export const store = configureStore({
    reducer: {
        employees: employeeReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check
                ignoredActions: ['employees/fetchAll/fulfilled'],
            },
        }),
    devTools: import.meta.env.DEV,
});

// Type definitions for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
