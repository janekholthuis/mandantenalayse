import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

interface Props {
  code: string;
  email: string;
}

const UpdatePasswordForm: React.FC<Props> = ({ code, email }) => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!code || !email) {
        setError('Ungültiger oder unvollständiger Link.');
        return;
      }

      try {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token_hash: code,
          email: email,
        });

        if (verifyError) {
          setError('Verifizierung fehlgeschlagen. Bitte überprüfen Sie den Link oder fordern Sie einen neuen Passwort-Reset an.');
        } else if (data?.user) {
          setVerified(true);
        }
      } catch (err) {
        setError('Verifizierung fehlgeschlagen. Bitte überprüfen Sie den Link oder fordern Sie einen neuen Passwort-Reset an.');
      }
    };

    verify();
  }, [code, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) throw updateError;

      showSuccess('Passwort erfolgreich geändert 🔐');
      navigate('/login?passwordUpdated=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passwort konnte nicht aktualisiert werden');
    } finally {
      setIsLoading(false);
    }
  };

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold text-red-600">Verifizierung fehlgeschlagen</h2>
          <p className="text-sm text-gray-600 mt-2">
            {error || 'Bitte überprüfen Sie den Link oder fordern Sie einen neuen Passwort-Reset an.'}
          </p>
          <div className="mt-4 space-y-2">
            <Button variant="primary" onClick={() => navigate('/reset-password')}>
              Neuen Reset-Link anfordern
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Zur Anmeldung
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Neues Passwort festlegen
          </h2>
          <p className="mt-2 text-sm text-gray-600">Bitte geben Sie Ihr neues Passwort ein.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Neues Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Passwort bestätigen
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Passwort aktualisieren
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;