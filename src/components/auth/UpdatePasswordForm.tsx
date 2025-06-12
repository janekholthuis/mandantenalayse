import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const UpdatePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { 0: params } = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Session wiederherstellen aus Fragment (falls vorhanden)
    supabase.auth.getSessionFromUrl({ storeSession: true }).catch(console.error);

    // Fokus auf Passwortfeld
    passwordRef.current?.focus();
  }, []);

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
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;

      toast.success('Passwort erfolgreich geändert ✅');
      setTimeout(() => navigate('/login?passwordUpdated=true'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Passwort konnte nicht aktualisiert werden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Neues Passwort festlegen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bitte geben Sie Ihr neues Passwort ein.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Neues Passwort</label>
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                className="block w-full pl-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Passwort bestätigen</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                className="block w-full pl-4 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Passwort aktualisieren
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
