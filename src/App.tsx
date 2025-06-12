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

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAppRoute = ['/clients', '/clients/new', '/clients/', '/settings', '/clients/'].some(path => location.pathname.startsWith(path));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        {user && isAppRoute && <Sidebar />}
        <main className="flex-1 min-h-screen bg-gray-50">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${user && isAppRoute ? '' : 'pt-4'}`}>
            <Routes>
              {/* Auth-Seiten */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />

              {/* App-Seiten */}
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
                // Nicht authentifizierte User auf geschützten Routen
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </div>
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
};

export default function RouterWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
