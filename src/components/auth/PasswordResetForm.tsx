import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`,
      });

      if (error) throw error;

      showSuccess('📧 Bestätigungs-E-Mail gesendet');
      navigate('/email-confirmation-sent');
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : 'Passwort-Reset fehlgeschlagen'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Passwort zurücksetzen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines Passworts zu erhalten.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="max@beispiel.de"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Link senden
            </Button>

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Zurück zur Anmeldung
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
