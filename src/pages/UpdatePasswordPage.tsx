import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const UpdatePasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Ungültiger Reset-Link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }
    if (!token) return;
    const { error: err } = await supabase.auth.verifyOtp({
      token,
      type: 'recovery',
    });
    if (err) {
      setError(err.message);
      return;
    }
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    if (updateErr) {
      setError(updateErr.message);
      return;
    }
    toast.success('Passwort erfolgreich geändert 🔐');
    navigate('/login');
  };

  return (
    <div className="min-h-screen ...">
      <div className="...">
        <Lock className="mx-auto..." />
        <h2>Neues Passwort festlegen</h2>
      </div>
      <form onSubmit={handleSubmit} className="...">
        {error && <div className="text-red-600">{error}</div>}
        {/* password inputs */}
        <Button type="submit">Passwort aktualisieren</Button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;
