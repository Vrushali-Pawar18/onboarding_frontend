/**
 * Employee Table Component
 * Displays list of employees with actions
 */

import React from 'react';
import { Edit2, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { Avatar, Badge, Button, Spinner, EmptyState } from '../ui';
import { Employee } from '../../types';
import { formatDate, getFullName, getRoleDisplayName, formatPhone } from '../../utils';

interface EmployeeTableProps {
    employees: Employee[];
    loading: boolean;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
    onView: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
    employees,
    loading,
    onEdit,
    onDelete,
    onView,
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-6" style={{ minHeight: 300 }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <EmptyState
                title="No employees found"
                description="Get started by adding your first team member to the onboarding system."
            />
        );
    }

    return (
        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border-secondary)' }}>
                        <th style={thStyle}>Employee</th>
                        <th style={thStyle}>Contact</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Joining Date</th>
                        <th style={thStyle}>Manager</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr
                            key={employee.id}
                            style={{
                                borderBottom: '1px solid var(--color-border-secondary)',
                                transition: 'background var(--transition-fast)',
                            }}
                            className="table-row-hover"
                        >
                            <td style={tdStyle}>
                                <div className="flex items-center gap-4">
                                    <Avatar firstName={employee.firstName} lastName={employee.lastName} />
                                    <div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                            {getFullName(employee.firstName, employee.lastName)}
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                            Added {formatDate(employee.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td style={tdStyle}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                                        <Mail size={14} />
                                        <span style={{ fontSize: 'var(--font-size-sm)' }}>{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                                        <Phone size={14} />
                                        <span style={{ fontSize: 'var(--font-size-sm)' }}>{formatPhone(employee.phone)}</span>
                                    </div>
                                </div>
                            </td>
                            <td style={tdStyle}>
                                {employee.role ? (
                                    <Badge variant="primary">{getRoleDisplayName(employee.role)}</Badge>
                                ) : (
                                    <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                                )}
                            </td>
                            <td style={tdStyle}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>
                                    {formatDate(employee.joiningDate)}
                                </span>
                            </td>
                            <td style={tdStyle}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>
                                    {employee.managerName || '-'}
                                </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Eye size={16} />}
                                        onClick={() => onView(employee)}
                                        aria-label={`View ${employee.firstName}`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Edit2 size={16} />}
                                        onClick={() => onEdit(employee)}
                                        aria-label={`Edit ${employee.firstName}`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash2 size={16} />}
                                        onClick={() => onDelete(employee)}
                                        aria-label={`Delete ${employee.firstName}`}
                                        style={{ color: 'var(--color-error)' }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
        .table-row-hover:hover {
          background: var(--color-surface-2);
        }
      `}</style>
        </div>
    );
};

const thStyle: React.CSSProperties = {
    padding: 'var(--spacing-4) var(--spacing-6)',
    textAlign: 'left',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const tdStyle: React.CSSProperties = {
    padding: 'var(--spacing-4) var(--spacing-6)',
};

export default EmployeeTable;
