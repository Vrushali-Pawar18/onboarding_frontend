/**
 * Main App Component
 * Root component with providers and routing
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { MainLayout } from './layouts';
import { DashboardPage, SettingsPage } from './pages';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/employees" element={<DashboardPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </MainLayout>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: 'var(--color-bg-elevated)',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border-primary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-4)',
                            boxShadow: 'var(--shadow-lg)',
                        },
                        success: {
                            iconTheme: {
                                primary: 'var(--color-success)',
                                secondary: 'white',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: 'var(--color-error)',
                                secondary: 'white',
                            },
                        },
                    }}
                />
            </BrowserRouter>
        </Provider>
    );
};

export default App;
