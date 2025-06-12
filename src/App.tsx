import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar'; // optional
import Sidebar from './components/layout/Sidebar';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* 🌟 Sidebar immer sichtbar auf Desktop */}
        <Sidebar />

        {/* Inhalt + Navbar */}
        <div className="flex-1 flex flex-col">
          {/* Optional: Globale Navbar über dem Content */}
          {/* <Navbar /> */}

          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/clients" replace />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/new" element={<NewClientPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />
              <Route path="*" element={<Navigate to="/clients" replace />} />
            </Routes>
          </main>
        </div>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default App;
