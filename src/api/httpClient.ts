/**
 * Axios HTTP Client Configuration
 * Centralized API client with interceptors
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config';

/**
 * Create Axios instance with base configuration
 */
const createHttpClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: config.api.baseUrl,
        timeout: config.api.timeout,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    client.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig) => {
            // Add timestamp to prevent caching issues
            if (requestConfig.method === 'get') {
                requestConfig.params = {
                    ...requestConfig.params,
                    _t: Date.now(),
                };
            }
            return requestConfig;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    client.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            // Handle network errors
            if (!error.response) {
                console.error('Network error:', error.message);
                return Promise.reject({
                    code: 'NETWORK_ERROR',
                    message: 'Unable to connect to server. Please check your internet connection.',
                });
            }

            // Handle API errors
            const apiError = error.response.data as { error?: { code: string; message: string } };
            if (apiError?.error) {
                return Promise.reject(apiError.error);
            }

            return Promise.reject(error);
        }
    );

    return client;
};

export const httpClient = createHttpClient();

export default httpClient;
