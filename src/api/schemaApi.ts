/**
 * Schema API Service
 * Fetches form schema from backend
 */

import { httpClient } from './httpClient';
import { ApiResponse, FormSchema, FieldSchema } from '../types';

/**
 * Schema API service
 */
export const schemaApi = {
    /**
     * Get complete form schema
     */
    async getFormSchema(): Promise<FormSchema> {
        const response = await httpClient.get<ApiResponse<FormSchema>>('/schema');

        if (!response.data.data) {
            throw new Error('Failed to fetch form schema');
        }

        return response.data.data;
    },

    /**
     * Get visible fields only
     */
    async getFields(): Promise<FieldSchema[]> {
        const response = await httpClient.get<ApiResponse<FieldSchema[]>>('/schema/fields');

        return response.data.data || [];
    },

    /**
     * Get fields by group
     */
    async getFieldsByGroup(groupId: string): Promise<FieldSchema[]> {
        const response = await httpClient.get<ApiResponse<FieldSchema[]>>(`/schema/groups/${groupId}`);

        return response.data.data || [];
    },
};

export default schemaApi;
