/**
 * App Header Component
 * Main navigation header
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Settings, RefreshCw, Home } from 'lucide-react';
import { Button } from '../components/ui';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchEmployees } from '../features';

export const AppHeader: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { status } = useAppSelector((state) => state.employees);

    const handleRefresh = () => {
        dispatch(fetchEmployees());
    };

    const isSettings = location.pathname === '/settings';

    return (
        <header className="app-header">
            <div className="header-left">
                <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="header-logo-icon">
                        <Users size={24} color="white" />
                    </div>
                    <div>
                        <h1 className="header-title">Onboarding Manager</h1>
                        <span className="header-subtitle">Startup Team Portal</span>
                    </div>
                </div>
            </div>

            <div className="header-actions">
                {isSettings && (
                    <Button
                        variant="ghost"
                        icon={<Home size={18} />}
                        onClick={() => navigate('/')}
                        aria-label="Go to Dashboard"
                    >
                        Dashboard
                    </Button>
                )}
                {!isSettings && (
                    <Button
                        variant="ghost"
                        icon={<RefreshCw size={18} className={status === 'loading' ? 'spinning' : ''} />}
                        onClick={handleRefresh}
                        disabled={status === 'loading'}
                        aria-label="Refresh data"
                    />
                )}
                <Button
                    variant={isSettings ? 'primary' : 'ghost'}
                    icon={<Settings size={18} />}
                    onClick={() => navigate('/settings')}
                    aria-label="Settings"
                />
            </div>

            <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </header>
    );
};

export default AppHeader;
