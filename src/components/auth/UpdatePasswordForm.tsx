import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const UpdatePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const pw = form.get('password') as string;
    const confirm = form.get('confirmPassword') as string;
    if (pw !== confirm) return setError('Die Passwörter stimmen nicht überein');
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (err) return setError(err.message);
    toast.success('Passwort erfolgreich geändert 🔐');
    navigate('/login?passwordUpdated=true');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6">
      <div className="max-w-md mx-auto bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Neues Passwort festlegen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Neues Passwort</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Lock className="absolute left-3 top-2 text-gray-400" /><input id="password" name="password" type="password" required minLength={8} placeholder="••••••••" className="pl-10 w-full border rounded-md focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Passwort bestätigen</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Lock className="absolute left-3 top-2 text-gray-400" /><input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} placeholder="••••••••" className="pl-10 w-full border rounded-md focus:ring-blue-500" />
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <Button type="submit" variant="primary" fullWidth isLoading={loading}>Passwort aktualisieren</Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
