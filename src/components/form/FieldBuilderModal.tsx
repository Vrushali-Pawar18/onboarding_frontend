/**
 * Field Builder Modal Component
 * Modal for adding/editing custom form fields
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal, Button, Input, Toggle } from '../ui';
import { FieldSchema, FieldOption } from '../../types';
import { FIELD_GROUPS, FIELD_TYPES } from '../../config';

interface FieldBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (field: Partial<FieldSchema>) => void;
    editingField?: FieldSchema | null;
    existingFieldCount: number;
}

export const FieldBuilderModal: React.FC<FieldBuilderModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingField,
    existingFieldCount,
}) => {
    const [fieldName, setFieldName] = useState('');
    const [fieldLabel, setFieldLabel] = useState('');
    const [fieldType, setFieldType] = useState<string>('text');
    const [placeholder, setPlaceholder] = useState('');
    const [helpText, setHelpText] = useState('');
    const [group, setGroup] = useState('other');
    const [required, setRequired] = useState(false);
    const [options, setOptions] = useState<FieldOption[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or editingField changes
    useEffect(() => {
        if (isOpen) {
            if (editingField) {
                setFieldName(editingField.name);
                setFieldLabel(editingField.label);
                setFieldType(editingField.type);
                setPlaceholder(editingField.placeholder || '');
                setHelpText(editingField.helpText || '');
                setGroup(editingField.group || 'other');
                setRequired(editingField.required);
                setOptions(editingField.options || []);
            } else {
                // New field defaults
                setFieldName('');
                setFieldLabel('');
                setFieldType('text');
                setPlaceholder('');
                setHelpText('');
                setGroup('other');
                setRequired(false);
                setOptions([]);
            }
            setErrors({});
        }
    }, [isOpen, editingField]);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const label = e.target.value;
        setFieldLabel(label);
        // Auto-generate name from label if not editing
        if (!editingField) {
            const name = label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '');
            setFieldName(name);
        }
    };

    const handleAddOption = () => {
        setOptions([...options, { value: '', label: '' }]);
    };

    const handleOptionChange = (index: number, field: 'value' | 'label', value: string) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        // Auto-generate value from label
        if (field === 'label') {
            newOptions[index].value = value.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        }
        setOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!fieldLabel.trim()) {
            newErrors.label = 'Field label is required';
        }

        if (!fieldName.trim()) {
            newErrors.name = 'Field name is required';
        } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldName)) {
            newErrors.name = 'Name must start with a letter and contain only letters, numbers, and underscores';
        }

        if (fieldType === 'select' && options.length < 2) {
            newErrors.options = 'Dropdown fields need at least 2 options';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const field: Partial<FieldSchema> = {
            name: fieldName,
            label: fieldLabel,
            type: fieldType as FieldSchema['type'],
            placeholder: placeholder || `Enter ${fieldLabel.toLowerCase()}`,
            helpText: helpText || undefined,
            group,
            required,
            order: editingField?.order || existingFieldCount + 1,
            validations: required ? [{ type: 'required', message: `${fieldLabel} is required` }] : [],
            isCore: false,
        };

        if (fieldType === 'select') {
            field.options = options.filter(o => o.value && o.label);
        }

        if (fieldType === 'boolean') {
            field.defaultValue = false;
        }

        onSave(field);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingField ? 'Edit Field' : 'Add New Field'}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editingField ? 'Save Changes' : 'Add Field'}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {/* Field Label */}
                <Input
                    label="Field Label"
                    placeholder="e.g., Date of Birth"
                    value={fieldLabel}
                    onChange={handleLabelChange}
                    error={errors.label}
                    required
                    helpText="The label shown to users"
                />

                {/* Field Name (auto-generated) */}
                <Input
                    label="Field Name (ID)"
                    placeholder="e.g., date_of_birth"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    error={errors.name}
                    required
                    disabled={!!editingField}
                    helpText="Unique identifier for the field"
                />

                {/* Field Type */}
                <div className="form-group">
                    <label className="form-label form-label-required">Field Type</label>
                    <select
                        className="form-input form-select"
                        value={fieldType}
                        onChange={(e) => setFieldType(e.target.value)}
                        disabled={!!editingField}
                    >
                        {FIELD_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Options for Select type */}
                {fieldType === 'select' && (
                    <div className="form-group">
                        <label className="form-label">Dropdown Options</label>
                        {errors.options && <div className="form-error">{errors.options}</div>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                            {options.map((option, index) => (
                                <div key={index} style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Option label"
                                        value={option.label}
                                        onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(index)}
                                        style={{
                                            background: 'var(--color-error-bg)',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            padding: 'var(--spacing-2)',
                                            cursor: 'pointer',
                                            color: 'var(--color-error)',
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<Plus size={14} />}
                                onClick={handleAddOption}
                            >
                                Add Option
                            </Button>
                        </div>
                    </div>
                )}

                {/* Placeholder (for non-boolean types) */}
                {fieldType !== 'boolean' && (
                    <Input
                        label="Placeholder Text"
                        placeholder="e.g., Enter your date of birth"
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                    />
                )}

                {/* Help Text */}
                <Input
                    label="Help Text"
                    placeholder="Optional helper text shown below the field"
                    value={helpText}
                    onChange={(e) => setHelpText(e.target.value)}
                />

                {/* Group */}
                <div className="form-group">
                    <label className="form-label">Field Group</label>
                    <select
                        className="form-input form-select"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    >
                        {FIELD_GROUPS.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Required Toggle */}
                <Toggle
                    name="required"
                    label="Required Field"
                    helpText="Make this field mandatory for form submission"
                    checked={required}
                    onChange={setRequired}
                />
            </div>
        </Modal>
    );
};

export default FieldBuilderModal;
