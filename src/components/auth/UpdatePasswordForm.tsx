// src/components/auth/UpdatePasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { showSuccess, showError } from '../../lib/toast';

interface Props {
  code: string;
}

const UpdatePasswordForm: React.FC<Props> = ({ code }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!code) {
      setError('Kein Reset-Code gefunden in der URL.');
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // 1. Token überprüfen
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      type: 'password',
      token: code,
    });
    if (verifyError || !verifyData) {
      setError(verifyError?.message || 'Token ungültig oder abgelaufen.');
      setIsLoading(false);
      return;
    }

    // 2. Passwort aktualisieren
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    showSuccess('🔐 Passwort erfolgreich geändert');
    navigate('/login?passwordUpdated=true');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Neues Passwort</h2>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Neues Passwort"
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Passwort bestätigen"
            minLength={8}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Passwort aktualisieren
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
