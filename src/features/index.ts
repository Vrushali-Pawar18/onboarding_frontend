/**
 * Features Barrel Export
 */

// Employee slice exports
export {
    default as employeeReducer,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setFilters,
    setPage,
    setSearch,
    setSort,
    clearSelectedEmployee,
    resetSaveStatus,
    resetDeleteStatus,
    clearError,
} from './employees/employeeSlice';

// UI slice exports
export {
    default as uiReducer,
    openModal,
    closeModal,
    toggleSidebar,
    setSidebarOpen,
    toggleTheme,
    setTheme,
    setLoading,
} from './ui/uiSlice';
