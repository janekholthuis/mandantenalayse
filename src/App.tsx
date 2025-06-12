import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => (
  <Router>
    <Toaster position="top-right" />
    <Routes>
      {/* Öffentliche Routen */}
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><PasswordResetPage /></AuthLayout>} />
      <Route path="/confirm-email" element={<AuthLayout><ConfirmEmailPage /></AuthLayout>} />
      <Route path="/email-confirmation-sent" element={<AuthLayout><EmailConfirmationSentPage /></AuthLayout>} />

      {/* Geschützte App-Routen */}
      <Route path="/" element={<Navigate to="/clients" replace />} />
      <Route path="/clients" element={<AppLayout><ClientsPage /></AppLayout>} />
      <Route path="/clients/new" element={<AppLayout><NewClientPage /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/clients" replace />} />
    </Routes>
  </Router>
);

export default App;
