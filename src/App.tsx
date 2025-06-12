import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PasswordResetPage from './pages/PasswordResetPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import ClientDetailPage from './pages/ClientDetailPage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'react-hot-toast';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const authPaths = ['/login', '/signup', '/reset-password', '/update-password', '/confirm-email', '/email-confirmation-sent'];
  const isAuthPage = authPaths.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className="flex">
        {user && !isAuthPage && <Sidebar />}

        <main className="flex-1 min-h-screen bg-gray-50">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${!isAuthPage ? 'pt-4' : ''}`}>
            <Routes>
              {/* Public / Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />

              {/* Protected / App routes */}
              {user ? (
                <>
                  <Route path="/" element={<Navigate to="/clients" replace />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/clients/new" element={<NewClientPage />} />
                  <Route path="/clients/:id" element={<ClientDetailPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/clients" replace />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </div>
        </main>
      </div>

      {!isAuthPage && <Footer />}
      <Toaster position="top-right" />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
