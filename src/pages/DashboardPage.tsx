/**
 * Dashboard Page
 * Main page showing employee list and stats
 * Stats are fetched from API (not calculated from filtered data)
 */

import React, { useEffect, useCallback, useState } from 'react';
import { Search, Plus, Users, UserPlus, Calendar, Laptop } from 'lucide-react';
import { Button } from '../components/ui';
import {
    EmployeeTable,
    EmployeeFormModal,
    DeleteConfirmModal,
    EmployeeViewModal,
    Pagination,
} from '../components/employees';
import { useAppDispatch, useAppSelector, useDebounce } from '../hooks';
import {
    fetchEmployees,
    fetchEmployeeById,
    setSearch,
    setPage,
    openModal,
} from '../features';
import { Employee } from '../types';
import { employeeApi } from '../api';

interface DashboardStats {
    totalEmployees: number;
    thisWeek: number;
    thisMonth: number;
    laptopsRequired: number;
}

export const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { employees, meta, filters, status, saveStatus } = useAppSelector((state) => state.employees);

    const debouncedSearch = useDebounce(filters.search, 300);

    // Stats from API (not affected by search/filters)
    const [stats, setStats] = useState<DashboardStats>({
        totalEmployees: 0,
        thisWeek: 0,
        thisMonth: 0,
        laptopsRequired: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch stats from API
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const data = await employeeApi.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // Fetch stats on mount and when employees change (after create/update/delete)
    useEffect(() => {
        fetchStats();
    }, [fetchStats, saveStatus]);

    // Fetch employees on mount and when filters change
    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch, debouncedSearch, filters.page, filters.sortBy, filters.sortOrder]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(e.target.value));
    };

    const handlePageChange = (page: number) => {
        dispatch(setPage(page));
    };

    const handleAddEmployee = () => {
        dispatch(openModal({ mode: 'create' }));
    };

    const handleEditEmployee = useCallback(
        async (employee: Employee) => {
            await dispatch(fetchEmployeeById(employee.id));
            dispatch(openModal({ mode: 'edit', employeeId: employee.id }));
        },
        [dispatch]
    );

    const handleDeleteEmployee = useCallback(
        async (employee: Employee) => {
            await dispatch(fetchEmployeeById(employee.id));
            dispatch(openModal({ mode: 'delete', employeeId: employee.id }));
        },
        [dispatch]
    );

    const handleViewEmployee = useCallback(
        async (employee: Employee) => {
            await dispatch(fetchEmployeeById(employee.id));
            dispatch(openModal({ mode: 'view', employeeId: employee.id }));
        },
        [dispatch]
    );

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Team Onboarding</h1>
                <p className="page-description">
                    Manage new hires and their onboarding journey before they join
                </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    icon={<Users size={24} />}
                    iconBg="primary"
                    value={stats.totalEmployees}
                    label="Total Employees"
                    loading={statsLoading}
                />
                <StatCard
                    icon={<UserPlus size={24} />}
                    iconBg="success"
                    value={stats.thisWeek}
                    label="Added This Week"
                    loading={statsLoading}
                />
                <StatCard
                    icon={<Calendar size={24} />}
                    iconBg="warning"
                    value={stats.thisMonth}
                    label="Added This Month"
                    loading={statsLoading}
                />
                <StatCard
                    icon={<Laptop size={24} />}
                    iconBg="primary"
                    value={stats.laptopsRequired}
                    label="Laptops Needed"
                    loading={statsLoading}
                />
            </div>

            {/* Table Container */}
            <div className="table-container">
                <div className="table-header">
                    <div className="table-search">
                        <Search size={18} className="table-search-icon" />
                        <input
                            type="text"
                            className="table-search-input"
                            placeholder="Search employees..."
                            value={filters.search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="table-actions">
                        <Button
                            variant="primary"
                            icon={<Plus size={18} />}
                            onClick={handleAddEmployee}
                        >
                            Add Employee
                        </Button>
                    </div>
                </div>

                <EmployeeTable
                    employees={employees}
                    loading={status === 'loading'}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                    onView={handleViewEmployee}
                />

                <Pagination meta={meta} onPageChange={handlePageChange} />
            </div>

            {/* Modals */}
            <EmployeeFormModal />
            <DeleteConfirmModal />
            <EmployeeViewModal />
        </>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: 'primary' | 'success' | 'warning';
    value: number;
    label: string;
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, value, label, loading }) => (
    <div className="stat-card">
        <div className={`stat-card-icon ${iconBg}`}>{icon}</div>
        <div className="stat-card-value">
            {loading ? (
                <span style={{
                    display: 'inline-block',
                    width: 40,
                    height: 28,
                    background: 'var(--color-surface-3)',
                    borderRadius: 'var(--radius-md)',
                    animation: 'pulse 1.5s infinite'
                }} />
            ) : (
                value
            )}
        </div>
        <div className="stat-card-label">{label}</div>
    </div>
);

export default DashboardPage;
