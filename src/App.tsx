import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PasswordResetPage from './pages/PasswordResetPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import DatenschutzPage from './pages/DatenschutzPage';
import AGBPage from './pages/AGBPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage';
import MainLayout from './components/layout/MainLayout';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import ClientDetailPage from './pages/ClientDetailPage';
import EmailTemplatesPage from './pages/EmailTemplatesPage';
import SettingsPage from './pages/SettingsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to app if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/clients" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><PasswordResetPage /></PublicRoute>} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="/agb" element={<AGBPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} /> {/* ✅ NEW */}

        {/* Protected Routes */}
        <Route path="/clients" element={
          <ProtectedRoute>
            <MainLayout>
              <ClientsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/clients/new" element={
          <ProtectedRoute>
            <MainLayout>
              <NewClientPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/clients/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <ClientDetailPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/email-templates" element={
          <ProtectedRoute>
            <MainLayout>
              <EmailTemplatesPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
