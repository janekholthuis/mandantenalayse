import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AuthFormProps { mode: 'login' | 'signup'; }

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered')) setSuccess('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.');
    if (params.get('passwordUpdated')) {
      toast.success('Passwort erfolgreich geändert 🔐');
      setSuccess('Passwort erfolgreich aktualisiert! Sie können sich jetzt anmelden.');
    }
    if (params.get('confirmed')) {
      toast.success('E‑Mail erfolgreich bestätigt 🎉');
      setSuccess('E‑Mail-Adresse erfolgreich bestätigt! Sie können sich jetzt anmelden.');
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
        const { error: signError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, company },
            emailRedirectTo: `${window.location.origin}/confirm-email`,
          },
        });
        if (signError) throw signError;
        toast('📧 Bestätigungs-E-Mail gesendet');
        navigate(`/email-confirmation-sent?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          const msg = loginError.message.includes('email_not_confirmed')
            ? 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.'
            : loginError.message;
          throw new Error(msg);
        }
        toast.success('Willkommen zurück 👋');
        navigate('/clients');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentifizierung fehlgeschlagen';
      setError(message);
      e.currentTarget.querySelector('input[type="password"]')?.setAttribute('value', '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/">
          <span className="text-3xl font-bold text-blue-700">Mandantenanalyse.com</span>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {mode === 'login' ? 'Willkommen zurück!' : 'Konto erstellen'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'login' ? (
            <>Neu bei uns? <Link to="/signup" className="font-medium text-blue-600">Jetzt registrieren</Link></>
          ) : (
            <>Schon registriert? <Link to="/login" className="font-medium text-blue-600">Anmelden</Link></>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {success && <div className="rounded-md bg-green-50 p-4 mb-6"><div className="text-green-700">{success}</div></div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><User className="text-gray-400" /></div>
                  <input id="name" name="name" type="text" required placeholder="Max Mustermann" className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Unternehmen</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Building2 className="text-gray-400" /></div>
                  <input id="company" name="company" type="text" required placeholder="Steuerberatung GmbH" className="block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500" />
                </div>
              </div>
            </>
          )}
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Mail className="text-gray-400" /></div>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="max@beispiel.de" className="block w-full pl-10 sm:text-sm border rounded-md focus:ring-blue-500" />
            </div>
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwort</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Lock className="text-gray-400" /></div>
              <input id="password" name="password" type="password" required placeholder="••••••••" minLength={8} className="block w-full pl-10 sm:text-sm border rounded-md focus:ring-blue-500" />
            </div>
          </div>
          {/* Error */}
          {error && <div className="rounded-md bg-red-50 p-4"><div className="text-red-700">{error}</div></div>}
          {/* Submit */}
          <div>
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>{mode === 'login' ? 'Anmelden' : 'Registrieren'}</Button>
          </div>
          {/* Links */}
          {mode === 'login' && (
            <div className="text-center text-sm space-y-1">
              <Link to="/reset-password" className="font-medium text-blue-600">Passwort vergessen?</Link><br/>
              <span>Noch kein Konto? </span><Link to="/signup" className="font-medium text-blue-600">Jetzt registrieren</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
