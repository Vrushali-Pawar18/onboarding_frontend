/**
 * Employee API Service
 * Handles all API calls related to employees
 */

import { httpClient } from './httpClient';
import {
    Employee,
    CreateEmployeeInput,
    UpdateEmployeeInput,
    ApiResponse,
    ResponseMeta,
    FilterState
} from '../types';

/**
 * API response with employees list
 */
interface EmployeesListResponse {
    items: Employee[];
    meta: ResponseMeta;
}

/**
 * Employee API service
 */
export const employeeApi = {
    /**
     * Get all employees with pagination and filters
     */
    async getAll(filters: FilterState): Promise<EmployeesListResponse> {
        const params = {
            page: filters.page,
            limit: filters.limit,
            search: filters.search || undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        };

        const response = await httpClient.get<ApiResponse<Employee[]>>('/employees', { params });

        return {
            items: response.data.data || [],
            meta: response.data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
    },

    /**
     * Get employee by ID
     */
    async getById(id: string): Promise<Employee> {
        const response = await httpClient.get<ApiResponse<Employee>>(`/employees/${id}`);

        if (!response.data.data) {
            throw new Error('Employee not found');
        }

        return response.data.data;
    },

    /**
     * Create new employee
     */
    async create(data: CreateEmployeeInput): Promise<Employee> {
        const response = await httpClient.post<ApiResponse<Employee>>('/employees', data);

        if (!response.data.data) {
            throw new Error('Failed to create employee');
        }

        return response.data.data;
    },

    /**
     * Update employee
     */
    async update(id: string, data: Partial<UpdateEmployeeInput>): Promise<Employee> {
        const response = await httpClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);

        if (!response.data.data) {
            throw new Error('Failed to update employee');
        }

        return response.data.data;
    },

    /**
     * Delete employee
     */
    async delete(id: string): Promise<void> {
        await httpClient.delete(`/employees/${id}`);
    },

    /**
     * Check if email is available
     */
    async checkEmail(email: string, excludeId?: string): Promise<boolean> {
        const params = { email, excludeId };
        const response = await httpClient.get<ApiResponse<{ available: boolean }>>('/employees/check-email', { params });

        return response.data.data?.available ?? false;
    },

    /**
     * Get dashboard statistics
     */
    async getStats(): Promise<{
        totalEmployees: number;
        thisWeek: number;
        thisMonth: number;
        laptopsRequired: number;
    }> {
        const response = await httpClient.get<ApiResponse<{
            totalEmployees: number;
            thisWeek: number;
            thisMonth: number;
            laptopsRequired: number;
        }>>('/employees/stats');

        return response.data.data || {
            totalEmployees: 0,
            thisWeek: 0,
            thisMonth: 0,
            laptopsRequired: 0,
        };
    },
};

export default employeeApi;
