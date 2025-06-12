import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Öffentliche Seiten */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
        <Route path="/confirm-email" element={<AuthLayout><ConfirmEmailPage /></AuthLayout>} />
        <Route path="/email-confirmation-sent" element={<AuthLayout><EmailConfirmationSentPage /></AuthLayout>} />

        {/* Geschützte Seiten mit Sidebar */}
        <Route path="/" element={<Navigate to="/clients" replace />} />
        <Route path="/clients" element={<AppLayout><ClientsPage /></AppLayout>} />
        <Route path="/clients/new" element={<AppLayout><NewClientPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/clients" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
