import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/layout/Sidebar';
import SettingsPage from './pages/SettingsPage';
import ClientsPage from './pages/ClientsPage';
import NewClientPage from './pages/NewClientPage';
import ChangeEmailDialog from './components/settings/ChangeEmailDialog';
import ConfirmEmailPage from './pages/ConfirmEmailPage';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/clients" replace />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<NewClientPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
