import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* ✅ Navbar global sichtbar */}
        <Navbar />

        <div className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/clients" />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<NewClientPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/email-confirmation" element={<ConfirmEmailPage />} />
            <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />
          </Routes>
        </div>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default App;
