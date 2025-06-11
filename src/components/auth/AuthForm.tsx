import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { EmailService } from '../../services/emailService';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered')) {
      setSuccess('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse, um sich anmelden zu können.');
    }
    if (params.get('passwordUpdated')) {
      setSuccess('Passwort erfolgreich aktualisiert! Bitte melden Sie sich mit Ihrem neuen Passwort an.');
    }
    if (params.get('confirmed')) {
      setSuccess('E-Mail-Adresse erfolgreich bestätigt! Sie können sich jetzt anmelden.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (mode === 'signup') {
        const name = formData.get('name') as string;
        const company = formData.get('company') as string;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              company: company,
            },
            emailRedirectTo: `${window.location.origin}/confirm-email`,
          },
        });
        if (error) throw error;
        
        // Send custom welcome email (confirmation email is handled by Supabase)
        try {
          await EmailService.sendWelcomeEmail(email, name, company);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the registration if email fails
        }
        
        // Redirect to email confirmation sent page
        navigate(`/email-confirmation-sent?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('E-Mail-Adresse oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.');
          } else if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
            throw new Error('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink.');
          } else if (error.message.includes('email_not_confirmed')) {
            throw new Error('Ihre E-Mail-Adresse wurde noch nicht bestätigt. Bitte überprüfen Sie Ihren Posteingang.');
          }
          throw error;
        }
        navigate('/clients');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentifizierung fehlgeschlagen';
      setError(errorMessage);
      
      // Clear password field on error for security
      const passwordInput = e.currentTarget.querySelector('input[type="password"]') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.value = '';
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-blue-700">Mandantenanalyse.com</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'login' ? 'Willkommen zurück!' : 'Konto erstellen'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              Neu bei Mandantenanalyse.com?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Jetzt registrieren
              </Link>
            </>
          ) : (
            <>
              Bereits registriert?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Anmelden
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Max Mustermann"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Unternehmen
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Steuerberatung Mustermann GmbH"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail-Adresse
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="max@beispiel.de"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {mode === 'login' ? 'Anmelden' : 'Registrieren'}
              </Button>
            </div>

            {mode === 'login' && (
              <div className="text-sm text-center">
                <Link
                  to="/reset-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Passwort vergessen?
                </Link>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-sm text-center">
                <span className="text-gray-600">Noch kein Konto? </span>
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Jetzt registrieren
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;