/**
 * Delete Confirmation Modal Component
 */

import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button } from '../ui';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteEmployee, resetDeleteStatus, closeModal, fetchEmployees } from '../../features';

export const DeleteConfirmModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { modal } = useAppSelector((state) => state.ui);
    const { selectedEmployee, deleteStatus, error } = useAppSelector((state) => state.employees);

    // Handle delete success/error
    useEffect(() => {
        if (deleteStatus === 'succeeded') {
            toast.success('Employee deleted successfully!');
            dispatch(closeModal());
            dispatch(resetDeleteStatus());
            dispatch(fetchEmployees());
        } else if (deleteStatus === 'failed' && error) {
            toast.error(error);
            dispatch(resetDeleteStatus());
        }
    }, [deleteStatus, error, dispatch]);

    const handleDelete = () => {
        if (selectedEmployee) {
            dispatch(deleteEmployee(selectedEmployee.id));
        }
    };

    const handleClose = () => {
        dispatch(closeModal());
    };

    const isLoading = deleteStatus === 'loading';

    return (
        <Modal
            isOpen={modal.isOpen && modal.mode === 'delete'}
            onClose={handleClose}
            size="sm"
        >
            <div className="confirm-delete">
                <div className="confirm-delete-icon">
                    <Trash2 size={32} />
                </div>
                <h3 className="confirm-delete-title">Delete Employee</h3>
                <p className="confirm-delete-message">
                    Are you sure you want to delete{' '}
                    <span className="confirm-delete-name">
                        {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                    </span>
                    ? This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} loading={isLoading}>
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
