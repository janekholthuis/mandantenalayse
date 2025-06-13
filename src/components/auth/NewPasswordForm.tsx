import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showError, showSuccess } from '../../lib/toast';

const NewPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;

    // Fehler aus URL-Hash prüfen
    if (hash.includes('error=access_denied')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const errorCode = params.get('error_code');
      const errorDescription = params.get('error_description');

      if (errorCode === 'otp_expired') {
        setError('Der Link ist abgelaufen oder wurde bereits verwendet.');
      } else {
        setError(errorDescription || 'Ungültiger oder abgelaufener Link.');
      }

      setVerifying(false);
      return;
    }

    // Session aus URL wiederherstellen
    const restoreSession = async () => {
      const { error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        setError('Link ungültig oder Sitzung konnte nicht wiederhergestellt werden.');
        navigate('/reset-password');
      } else {
        setVerifying(false);
      }
    };

    restoreSession();
  }, [navigate]);

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
      navigate('/settings?toast=passwordUpdated');
    } catch (err: any) {
      showError(err.message || 'Fehler beim Zurücksetzen des Passworts');
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl text-red-600 font-semibold mb-4">Passwort-Link ungültig</h2>
          <p className="text-gray-700">{error}</p>
          <Button className="mt-6" onClick={() => navigate('/reset-password')} variant="secondary">
            Neuen Link anfordern
          </Button>
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
                minLength={8}
                value={password}
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

export default NewPasswordForm;
