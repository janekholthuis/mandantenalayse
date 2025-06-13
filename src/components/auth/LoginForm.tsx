import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check for success messages from URL params
    if (searchParams.get('confirmed')) {
      setSuccess('E-Mail-Adresse erfolgreich bestätigt! Sie können sich jetzt anmelden.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('email_not_confirmed')) {
          showError('Bitte bestätigen Sie Ihre E‑Mail-Adresse. Überprüfen Sie Ihren Posteingang.');
        } else if (error.message === 'Invalid login credentials') {
          showError('E-Mail-Adresse oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.');
        } else {
          showError(error.message);
        }
        // Clear password field on error for security
        const passwordInput = e.currentTarget.querySelector('input[type="password"]') as HTMLInputElement;
        if (passwordInput) {
          passwordInput.value = '';
        }
        return;
      }
      showSuccess('Willkommen zurück! 👋');
      navigate('/clients');
    } catch (err) {
      showError('Login fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6 lg:p-8">
      <div className="self-center text-center mb-8">
        <Link to="/" className="text-3xl font-bold text-blue-700">
          Mandantenanalyse.com
        </Link>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Willkommen zurück!</h2>
        <p className="text-sm mt-2 text-gray-600">
          Kein Konto? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-500">Jetzt registrieren</Link>
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full self-center">
        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E‑Mail-Adresse
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email"
                required 
                placeholder="max@beispiel.de"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password"
                required 
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                minLength={8}
              />
            </div>
          </div>
          
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700">
            Anmelden
          </Button>
          
          <div className="flex justify-between text-sm">
            <Link to="/reset-password" className="text-blue-600 hover:text-blue-500">
              Passwort vergessen?
            </Link>
            <Link to="/signup" className="text-blue-600 hover:text-blue-500">
              Jetzt registrieren
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;