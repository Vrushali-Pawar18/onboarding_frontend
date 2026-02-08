/**
 * Employee Redux Slice
 * Manages employee state with Redux Toolkit
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { employeeApi } from '../../api';
import {
    Employee,
    CreateEmployeeInput,
    UpdateEmployeeInput,
    LoadingState,
    FilterState,
    ResponseMeta
} from '../../types';

// ============================================================
// State Interface
// ============================================================

interface EmployeeState {
    employees: Employee[];
    selectedEmployee: Employee | null;
    meta: ResponseMeta;
    filters: FilterState;
    status: LoadingState;
    error: string | null;
    saveStatus: LoadingState;
    deleteStatus: LoadingState;
}

const initialState: EmployeeState = {
    employees: [],
    selectedEmployee: null,
    meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    filters: {
        search: '',
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc',
    },
    status: 'idle',
    error: null,
    saveStatus: 'idle',
    deleteStatus: 'idle',
};

// ============================================================
// Async Thunks
// ============================================================

export const fetchEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { employees: EmployeeState };
            const response = await employeeApi.getAll(state.employees.filters);
            return response;
        } catch (error) {
            const err = error as { message?: string };
            return rejectWithValue(err.message || 'Failed to fetch employees');
        }
    }
);

export const fetchEmployeeById = createAsyncThunk(
    'employees/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const employee = await employeeApi.getById(id);
            return employee;
        } catch (error) {
            const err = error as { message?: string };
            return rejectWithValue(err.message || 'Failed to fetch employee');
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/create',
    async (data: CreateEmployeeInput, { rejectWithValue }) => {
        try {
            const employee = await employeeApi.create(data);
            return employee;
        } catch (error) {
            const err = error as { message?: string };
            return rejectWithValue(err.message || 'Failed to create employee');
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/update',
    async ({ id, data }: { id: string; data: Partial<UpdateEmployeeInput> }, { rejectWithValue }) => {
        try {
            const employee = await employeeApi.update(id, data);
            return employee;
        } catch (error) {
            const err = error as { message?: string };
            return rejectWithValue(err.message || 'Failed to update employee');
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await employeeApi.delete(id);
            return id;
        } catch (error) {
            const err = error as { message?: string };
            return rejectWithValue(err.message || 'Failed to delete employee');
        }
    }
);

// ============================================================
// Slice
// ============================================================

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
            state.filters.page = 1; // Reset to first page on search
        },
        setSort: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
            state.filters.sortBy = action.payload.sortBy;
            state.filters.sortOrder = action.payload.sortOrder;
        },
        clearSelectedEmployee: (state) => {
            state.selectedEmployee = null;
        },
        resetSaveStatus: (state) => {
            state.saveStatus = 'idle';
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all employees
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.employees = action.payload.items;
                state.meta = action.payload.meta;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch single employee
        builder
            .addCase(fetchEmployeeById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEmployeeById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedEmployee = action.payload;
            })
            .addCase(fetchEmployeeById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Create employee
        builder
            .addCase(createEmployee.pending, (state) => {
                state.saveStatus = 'loading';
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.saveStatus = 'succeeded';
                state.employees.unshift(action.payload);
                state.meta.total += 1;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.saveStatus = 'failed';
                state.error = action.payload as string;
            });

        // Update employee
        builder
            .addCase(updateEmployee.pending, (state) => {
                state.saveStatus = 'loading';
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.saveStatus = 'succeeded';
                const index = state.employees.findIndex((e) => e.id === action.payload.id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
                state.selectedEmployee = action.payload;
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.saveStatus = 'failed';
                state.error = action.payload as string;
            });

        // Delete employee
        builder
            .addCase(deleteEmployee.pending, (state) => {
                state.deleteStatus = 'loading';
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.employees = state.employees.filter((e) => e.id !== action.payload);
                state.meta.total -= 1;
                if (state.selectedEmployee?.id === action.payload) {
                    state.selectedEmployee = null;
                }
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const {
    setFilters,
    setPage,
    setSearch,
    setSort,
    clearSelectedEmployee,
    resetSaveStatus,
    resetDeleteStatus,
    clearError,
} = employeeSlice.actions;

export default employeeSlice.reducer;
