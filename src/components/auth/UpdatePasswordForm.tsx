import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showError, showSuccess } from '../../lib/toast';

const UpdatePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
   const restoreSession = async () => {
   const { error } = await supabase.auth.getSessionFromUrl();
     if (error) {
             showError('Link abgelaufen oder ungültig. Bitte erneut anfordern.');
             navigate('/reset-password');
         } else {
      setVerifying(false);
    }
  };
     restoreSession();
}, [navigate]);


    if (token) {
      supabase.auth.verifyOtp({ token, type })
        .then(({ error }) => {
          if (error) throw error;
        })
        .catch((err) => {
          showError('Verifizierung fehlgeschlagen. Bitte fordere einen neuen Link an.');
          navigate('/login');
        })
        .finally(() => {
          setVerifying(false);
        });
    } else {
      showError('Kein gültiger Token vorhanden');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Die Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      showSuccess('Passwort erfolgreich geändert 🔐');
      navigate('/login?passwordUpdated=true');
    } catch (err: any) {
      showError(err.message || 'Passwortänderung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-b-2 mb-4 mx-auto" />
          Verifiziere Link...
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
          <p className="mt-2 text-sm text-gray-600">
            Bitte geben Sie Ihr neues Passwort ein.
          </p>
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
                type="password"
                required
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Passwort bestätigen
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
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
