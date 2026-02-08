/**
 * Core type definitions for the Onboarding Manager Frontend
 * Mirrors backend types for type safety
 */

// ============================================================
// Field Configuration Types
// ============================================================

export type FieldType =
    | 'text'
    | 'email'
    | 'phone'
    | 'date'
    | 'select'
    | 'boolean'
    | 'number'
    | 'textarea';

export interface ValidationRule {
    type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
    value?: string | number | boolean;
    message: string;
}

export interface FieldOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FieldSchema {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    defaultValue?: string | number | boolean;
    required: boolean;
    validations: ValidationRule[];
    options?: FieldOption[];
    order: number;
    group?: string;
    visible?: boolean;
    disabled?: boolean;
    helpText?: string;
    isCore?: boolean; // Core fields cannot be deleted
}

export interface FieldGroup {
    id: string;
    name: string;
    description?: string;
    order: number;
}

export interface FormSchema {
    id: string;
    name: string;
    description: string;
    version: string;
    fields: FieldSchema[];
    groups?: FieldGroup[];
}

// ============================================================
// Employee Types
// ============================================================

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    joiningDate?: string;
    role?: string;
    managerName?: string;
    laptopRequired?: boolean;
    additionalFields?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    joiningDate?: string;
    role?: string;
    managerName?: string;
    laptopRequired?: boolean;
    additionalFields?: Record<string, unknown>;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
    id: string;
}

export type EmployeeFormData = Record<string, string | number | boolean | undefined>;

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    value?: unknown;
}

export interface ResponseMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ============================================================
// UI State Types
// ============================================================

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ModalState {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view' | 'delete';
    employeeId?: string;
}

export interface FilterState {
    search: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
