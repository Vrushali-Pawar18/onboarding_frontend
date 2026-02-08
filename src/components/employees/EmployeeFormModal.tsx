/**
 * Employee Form Modal Component
 * Modal for creating and editing employees
 * Uses dynamic fields from the customFieldsStore
 */

import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button } from '../ui';
import { DynamicForm } from '../form';
import { useAppDispatch, useAppSelector, useFormValidation } from '../../hooks';
import {
    createEmployee,
    updateEmployee,
    resetSaveStatus,
    closeModal
} from '../../features';
import { getAllFields } from '../../config';
import { EmployeeFormData, FieldSchema } from '../../types';
import { formatDateForInput } from '../../utils';

export const EmployeeFormModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { modal } = useAppSelector((state) => state.ui);
    const { selectedEmployee, saveStatus, error } = useAppSelector((state) => state.employees);
    const { errors, validateForm, clearAllErrors } = useFormValidation();

    const isEdit = modal.mode === 'edit';

    // Track previous modal state to detect when it opens
    const prevModalOpen = useRef(false);

    // Get fields dynamically each time modal opens
    const [fields, setFields] = useState<FieldSchema[]>([]);

    // Initialize form data
    const getInitialValues = (currentFields: FieldSchema[]): EmployeeFormData => {
        if (isEdit && selectedEmployee) {
            // Start with existing employee data
            const values: EmployeeFormData = {
                firstName: selectedEmployee.firstName,
                lastName: selectedEmployee.lastName,
                email: selectedEmployee.email,
                phone: selectedEmployee.phone,
                joiningDate: formatDateForInput(selectedEmployee.joiningDate),
                role: selectedEmployee.role || '',
                managerName: selectedEmployee.managerName || '',
                laptopRequired: selectedEmployee.laptopRequired ?? true,
            };

            // Add any additional fields from the employee
            if (selectedEmployee.additionalFields) {
                Object.entries(selectedEmployee.additionalFields).forEach(([key, value]) => {
                    values[key] = value as string | number | boolean;
                });
            }

            return values;
        }

        // Default values from schema
        const defaults: EmployeeFormData = {};
        currentFields.forEach((field) => {
            if (field.defaultValue !== undefined) {
                defaults[field.name] = field.defaultValue;
            } else if (field.type === 'boolean') {
                defaults[field.name] = true;
            } else {
                defaults[field.name] = '';
            }
        });
        return defaults;
    };

    const [formData, setFormData] = useState<EmployeeFormData>({});

    // Refresh fields and reset form when modal opens
    useEffect(() => {
        if (modal.isOpen && !prevModalOpen.current) {
            // Modal just opened - get fresh fields
            const currentFields = getAllFields();
            setFields(currentFields);
            setFormData(getInitialValues(currentFields));
            clearAllErrors();
        }
        prevModalOpen.current = modal.isOpen;
    }, [modal.isOpen, modal.mode, selectedEmployee]);

    // Handle save success/error
    useEffect(() => {
        if (saveStatus === 'succeeded') {
            toast.success(isEdit ? 'Employee updated successfully!' : 'Employee created successfully!');
            dispatch(closeModal());
            dispatch(resetSaveStatus());
        } else if (saveStatus === 'failed' && error) {
            toast.error(error);
            dispatch(resetSaveStatus());
        }
    }, [saveStatus, error, isEdit, dispatch]);

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            clearAllErrors();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const isValid = validateForm(fields, formData);
        if (!isValid) {
            toast.error('Please fix the validation errors');
            return;
        }

        // Known field names that map to dedicated columns
        const knownFieldNames = ['firstName', 'lastName', 'email', 'phone', 'joiningDate', 'role', 'managerName', 'laptopRequired'];

        // Collect additional custom fields
        const additionalFields: Record<string, unknown> = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!knownFieldNames.includes(key) && value !== undefined && value !== '') {
                additionalFields[key] = value;
            }
        });

        // Build employee data with core fields
        const employeeData = {
            firstName: formData.firstName as string,
            lastName: formData.lastName as string,
            email: formData.email as string,
            phone: formData.phone as string,
            joiningDate: formData.joiningDate ? String(formData.joiningDate) : undefined,
            role: formData.role ? String(formData.role) : undefined,
            managerName: formData.managerName ? String(formData.managerName) : undefined,
            laptopRequired: Boolean(formData.laptopRequired),
            additionalFields: Object.keys(additionalFields).length > 0 ? additionalFields : undefined,
        };

        if (isEdit && selectedEmployee) {
            dispatch(updateEmployee({ id: selectedEmployee.id, data: employeeData }));
        } else {
            dispatch(createEmployee(employeeData));
        }
    };

    const handleClose = () => {
        dispatch(closeModal());
    };

    const isLoading = saveStatus === 'loading';

    return (
        <Modal
            isOpen={modal.isOpen && (modal.mode === 'create' || modal.mode === 'edit')}
            onClose={handleClose}
            title={isEdit ? 'Edit Employee' : 'Add New Employee'}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={isLoading}
                    >
                        {isEdit ? 'Save Changes' : 'Add Employee'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                <DynamicForm
                    fields={fields}
                    values={formData}
                    errors={errors}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </form>
        </Modal>
    );
};

export default EmployeeFormModal;
