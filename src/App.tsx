import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import PasswordResetPage from './pages/PasswordResetPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import Debug from './pages/Debug'
import EmailConfirmationSentPage from './pages/EmailConfirmationSentPage'
import ClientsPage from './pages/ClientsPage'
import NewClientPage from './pages/NewClientPage'
import ClientDetailPage from './pages/ClientDetailPage'
import SettingsPage from './pages/SettingsPage'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { Toaster } from 'react-hot-toast'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const loc = useLocation()
  const authPaths = ['/login', '/signup', '/debug', '/reset-password', '/new-password', '/confirm-email', '/email-confirmation-sent']
  const isAuth = authPaths.includes(loc.pathname)

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )

  return (
    <div className="h-screen flex flex-col">
      {!isAuth && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {!isAuth && user && <Sidebar />}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className={`max-w-7xl mx-auto px-4 lg:px-8 py-8 ${!isAuth ? 'pt-4' : ''}`}>
            <Routes>
              {/* Public/Auth */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
             <Route path="/debug" element={<Debug />} />
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              <Route path="/email-confirmation-sent" element={<EmailConfirmationSentPage />} />

              {/* Protected */}
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
