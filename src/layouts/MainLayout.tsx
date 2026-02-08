/**
 * Main Layout Component
 * Wraps all pages with header and common layout
 */

import React from 'react';
import { AppHeader } from './AppHeader';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="app-layout">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AppHeader />
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
};

export default MainLayout;
