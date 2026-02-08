/**
 * Employee View Modal Component
 * Modal for viewing employee details including custom fields
 */

import React from 'react';
import { Mail, Phone, Calendar, User, Laptop, Clock, FileText } from 'lucide-react';
import { Modal, Button, Avatar, Badge } from '../ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { closeModal, clearSelectedEmployee } from '../../features';
import { formatDate, getFullName, getRoleDisplayName, formatPhone } from '../../utils';
import { getCustomFields } from '../../config';

export const EmployeeViewModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { modal } = useAppSelector((state) => state.ui);
    const { selectedEmployee } = useAppSelector((state) => state.employees);

    const handleClose = () => {
        dispatch(closeModal());
        dispatch(clearSelectedEmployee());
    };

    if (!selectedEmployee) return null;

    // Get custom fields to display additional data
    const customFields = getCustomFields();
    const additionalData = selectedEmployee.additionalFields || {};

    return (
        <Modal
            isOpen={modal.isOpen && modal.mode === 'view'}
            onClose={handleClose}
            title="Employee Details"
            size="md"
            footer={
                <>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </>
            }
        >
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-4)' }}>
                    <Avatar
                        firstName={selectedEmployee.firstName}
                        lastName={selectedEmployee.lastName}
                        size="lg"
                    />
                </div>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>
                    {getFullName(selectedEmployee.firstName, selectedEmployee.lastName)}
                </h3>
                {selectedEmployee.role && (
                    <Badge variant="primary">{getRoleDisplayName(selectedEmployee.role)}</Badge>
                )}
            </div>

            <div
                style={{
                    display: 'grid',
                    gap: 'var(--spacing-4)',
                    background: 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-5)',
                }}
            >
                <DetailRow icon={<Mail size={18} />} label="Email" value={selectedEmployee.email} />
                <DetailRow icon={<Phone size={18} />} label="Phone" value={formatPhone(selectedEmployee.phone)} />
                <DetailRow
                    icon={<Calendar size={18} />}
                    label="Joining Date"
                    value={formatDate(selectedEmployee.joiningDate)}
                />
                <DetailRow icon={<User size={18} />} label="Manager" value={selectedEmployee.managerName || '-'} />
                <DetailRow
                    icon={<Laptop size={18} />}
                    label="Laptop Required"
                    value={selectedEmployee.laptopRequired ? 'Yes' : 'No'}
                />
                <DetailRow
                    icon={<Clock size={18} />}
                    label="Added On"
                    value={formatDate(selectedEmployee.createdAt)}
                />

                {/* Display custom field values */}
                {customFields.map((field) => {
                    const value = additionalData[field.name];
                    if (value === undefined || value === null || value === '') return null;

                    let displayValue = String(value);
                    if (field.type === 'boolean') {
                        displayValue = value ? 'Yes' : 'No';
                    } else if (field.type === 'date' && value) {
                        displayValue = formatDate(String(value));
                    } else if (field.type === 'select' && field.options) {
                        const option = field.options.find(o => o.value === value);
                        displayValue = option?.label || String(value);
                    }

                    return (
                        <DetailRow
                            key={field.name}
                            icon={<FileText size={18} />}
                            label={field.label}
                            value={displayValue}
                        />
                    );
                })}
            </div>
        </Modal>
    );
};

interface DetailRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div
            style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface-3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-muted)',
            }}
        >
            {icon}
        </div>
        <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{label}</div>
            <div style={{ color: 'var(--color-text-primary)' }}>{value}</div>
        </div>
    </div>
);

export default EmployeeViewModal;
