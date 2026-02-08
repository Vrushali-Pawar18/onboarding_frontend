/**
 * Settings Page Component
 * Form Builder - allows users to add/edit/delete custom form fields
 */

import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Plus,
    Edit2,
    Trash2,
    Lock,
    RefreshCw,
    GripVertical,
    AlertTriangle
} from 'lucide-react';
import {
    getAllFields,
    getCustomFields,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    resetToDefaults,
    MANDATORY_FIELDS,
    FIELD_GROUPS
} from '../config';
import { Button, Badge, Modal } from '../components/ui';
import { FieldBuilderModal } from '../components/form/FieldBuilderModal';
import { FieldSchema } from '../types';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
    const [fields, setFields] = useState<FieldSchema[]>([]);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [editingField, setEditingField] = useState<FieldSchema | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Load fields on mount
    useEffect(() => {
        refreshFields();
    }, []);

    const refreshFields = () => {
        setFields(getAllFields());
    };

    const handleAddField = () => {
        setEditingField(null);
        setIsBuilderOpen(true);
    };

    const handleEditField = (field: FieldSchema) => {
        if (field.isCore) {
            toast.error('Core fields cannot be edited');
            return;
        }
        setEditingField(field);
        setIsBuilderOpen(true);
    };

    const handleSaveField = (fieldData: Partial<FieldSchema>) => {
        try {
            if (editingField) {
                updateCustomField(editingField.name, fieldData);
                toast.success('Field updated successfully');
            } else {
                addCustomField(fieldData as FieldSchema);
                toast.success('Field added successfully');
            }
            refreshFields();
        } catch (error) {
            toast.error('Failed to save field');
        }
    };

    const handleDeleteField = (fieldName: string) => {
        const field = fields.find(f => f.name === fieldName);
        if (field?.isCore) {
            toast.error('Core fields cannot be deleted');
            return;
        }
        setShowDeleteConfirm(fieldName);
    };

    const confirmDelete = () => {
        if (showDeleteConfirm) {
            const success = deleteCustomField(showDeleteConfirm);
            if (success) {
                toast.success('Field deleted');
                refreshFields();
            } else {
                toast.error('Failed to delete field');
            }
        }
        setShowDeleteConfirm(null);
    };

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        resetToDefaults();
        refreshFields();
        toast.success('Form fields reset to defaults');
        setShowResetConfirm(false);
    };

    const getGroupName = (groupId: string) => {
        return FIELD_GROUPS.find(g => g.id === groupId)?.name || groupId;
    };

    const coreFields = fields.filter(f => f.isCore);
    const customFields = fields.filter(f => !f.isCore);

    return (
        <div className="settings-page">
            {/* Header */}
            <div className="page-header" style={{
                marginBottom: 'var(--spacing-6)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <div>
                    <h1 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-3)',
                        fontSize: 'var(--font-size-2xl)'
                    }}>
                        <SettingsIcon style={{ color: 'var(--color-primary)' }} />
                        Form Builder
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-2)' }}>
                        Customize the employee onboarding form by adding, editing, or removing fields
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <Button
                        variant="secondary"
                        icon={<RefreshCw size={16} />}
                        onClick={handleReset}
                    >
                        Reset to Defaults
                    </Button>
                    <Button
                        variant="primary"
                        icon={<Plus size={16} />}
                        onClick={handleAddField}
                    >
                        Add Field
                    </Button>
                </div>
            </div>

            {/* Core Fields Section */}
            <div className="card" style={{ padding: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-4)'
                }}>
                    <Lock size={18} style={{ color: 'var(--color-warning)' }} />
                    <h2 style={{ margin: 0 }}>Mandatory Fields</h2>
                    <Badge variant="warning">{coreFields.length} fixed</Badge>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                    These fields are required for every employee and cannot be removed or modified.
                </p>

                <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
                    {coreFields.map((field) => (
                        <div
                            key={field.name}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-4)',
                                background: 'var(--color-surface-2)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border-secondary)',
                                opacity: 0.8,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                <Lock size={14} style={{ color: 'var(--color-text-muted)' }} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{field.label}</div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                        {field.name} • {field.type} • {getGroupName(field.group || 'other')}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="error">Required</Badge>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Fields Section */}
            <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-4)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <h2 style={{ margin: 0 }}>Custom Fields</h2>
                        <Badge variant="primary">{customFields.length} fields</Badge>
                    </div>
                </div>

                {customFields.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-8)',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <p>No custom fields added yet.</p>
                        <Button
                            variant="primary"
                            icon={<Plus size={16} />}
                            onClick={handleAddField}
                            style={{ marginTop: 'var(--spacing-4)' }}
                        >
                            Add Your First Field
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
                        {customFields.map((field) => (
                            <div
                                key={field.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--spacing-4)',
                                    background: 'var(--color-surface-1)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--color-border-primary)',
                                    transition: 'all var(--transition-fast)',
                                }}
                                className="field-row"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                    <GripVertical size={16} style={{ color: 'var(--color-text-muted)', cursor: 'grab' }} />
                                    <div>
                                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                            {field.label}
                                            {field.required && <Badge variant="error">Required</Badge>}
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                            {field.name} • {field.type} • {getGroupName(field.group || 'other')}
                                            {field.helpText && ` • ${field.helpText}`}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Edit2 size={14} />}
                                        onClick={() => handleEditField(field)}
                                        aria-label="Edit field"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<Trash2 size={14} />}
                                        onClick={() => handleDeleteField(field.name)}
                                        aria-label="Delete field"
                                        style={{ color: 'var(--color-error)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div style={{
                marginTop: 'var(--spacing-6)',
                padding: 'var(--spacing-4)',
                background: 'var(--color-info-bg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-primary-700)',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                    <AlertTriangle size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <strong style={{ color: 'var(--color-primary-300)' }}>How it works</strong>
                        <ul style={{
                            margin: 'var(--spacing-2) 0 0',
                            paddingLeft: 'var(--spacing-4)',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-sm)'
                        }}>
                            <li>Custom fields are saved to your browser and persist across sessions</li>
                            <li>Fields marked as "Required" must be filled when adding employees</li>
                            <li>Custom field data is stored in the employee's additional fields</li>
                            <li>Click "Reset to Defaults" to restore the original form configuration</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Field Builder Modal */}
            <FieldBuilderModal
                isOpen={isBuilderOpen}
                onClose={() => {
                    setIsBuilderOpen(false);
                    setEditingField(null);
                }}
                onSave={handleSaveField}
                editingField={editingField}
                existingFieldCount={fields.length}
            />

            {/* Reset Confirmation Modal */}
            <Modal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                title="Reset Form Fields?"
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmReset}>
                            Reset to Defaults
                        </Button>
                    </>
                }
            >
                <p>This will remove all custom fields and restore the default form configuration. This action cannot be undone.</p>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(null)}
                title="Delete Field?"
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Delete Field
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this field? Existing employee data for this field will be preserved but no longer visible in the form.</p>
            </Modal>

            <style>{`
                .field-row:hover {
                    background: var(--color-surface-2) !important;
                    border-color: var(--color-border-focus) !important;
                }
            `}</style>
        </div>
    );
};

export default SettingsPage;
