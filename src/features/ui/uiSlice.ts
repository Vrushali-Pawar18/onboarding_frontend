/**
 * UI Redux Slice
 * Manages UI state like modals, themes, etc.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState } from '../../types';

// ============================================================
// State Interface
// ============================================================

interface UIState {
    modal: ModalState;
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    isLoading: boolean;
}

const initialState: UIState = {
    modal: {
        isOpen: false,
        mode: 'create',
        employeeId: undefined,
    },
    sidebarOpen: false,
    theme: 'dark',
    isLoading: false,
};

// ============================================================
// Slice
// ============================================================

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<Omit<ModalState, 'isOpen'>>) => {
            state.modal = {
                isOpen: true,
                mode: action.payload.mode,
                employeeId: action.payload.employeeId,
            };
        },
        closeModal: (state) => {
            state.modal = {
                isOpen: false,
                mode: 'create',
                employeeId: undefined,
            };
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    openModal,
    closeModal,
    toggleSidebar,
    setSidebarOpen,
    toggleTheme,
    setTheme,
    setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
