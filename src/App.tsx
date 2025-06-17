import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import PasswordResetPage from './pages/PasswordResetPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage'
import ClientsPage from './pages/ClientsPage'
import LandingPage from './pages/LandingPage'
import ClientAddPage from './pages/ClientAddPage'
import NewClientPage from './pages/NewClientPage'
import ClientUploadPage from './pages/ClientUploadPage'
import ClientDetailPage from './pages/ClientDetailPage'
import SettingsPage from './pages/SettingsPage'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { Toaster } from 'react-hot-toast'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const loc = useLocation()
  const authPaths = ['/login', '/signup', '/reset-password', '/confirm-email', '/auth-callback', '/email-confirmation-sent']
  const isAuth = authPaths.includes(loc.pathname)
  
  // Show navbar only when user is logged in AND not on auth pages
  const showNavbar = user && !isAuth

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )

  return (
    <div className="h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {showNavbar && <Sidebar />}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className={`max-w-7xl mx-auto px-4 lg:px-8 py-8 ${showNavbar ? 'pt-4' : ''}`}>
            <Routes>
              {/* Public/Auth */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              <Route path="/auth-callback" element={<ConfirmEmailPage />} />
              <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />
                      <Route path="/start" element={<LandingPage />} />

              {/* Protected */}
              {user ? (
                <>
                  <Route path="/" element={<Navigate to="/clients" replace />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/clients/add" element={<ClientAddPage />} />
                  <Route path="/clients/new" element={<NewClientPage />} />
                  <Route path="/clients/upload" element={<ClientUploadPage />} />
                  <Route path="/clients/:id" element={<ClientDetailPage />} />
                  <Route path="/clients/:id/transactions" element={<ClientDetailPage />} />
                  <Route path="/clients/:id/contracts" element={<ClientDetailPage />} />
                  <Route path="/clients/:id/optimizations" element={<ClientDetailPage />} />
                  <Route path="/clients/:id/settings" element={<ClientDetailPage />} />
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
      <Toaster position="top-right" />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}