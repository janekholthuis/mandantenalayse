import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function confirmEmail() {
      const token_hash = params.get('token_hash');
      const type = params.get('type');
      if (!token_hash || !type) {
        setError('Ungültiger Bestätigungslink.');
        return setIsLoading(false);
      }
      const { data, error: err } = await supabase.auth.verifyOtp({ token_hash, type: type as any });
      if (err) {
        setError(err.message.includes('expired') ? 'Link abgelaufen.' : 'Bestätigung fehlgeschlagen.');
      } else if (data?.user) {
        setIsConfirmed(true);
        toast.success('E‑Mail erfolgreich bestätigt 🎉');
        setTimeout(() => navigate('/login?confirmed=true'), 2500);
      }
      setIsLoading(false);
    }
    confirmEmail();
  }, [params]);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center px-6">
      <div className="animate-spin h-12 w-12 mx-auto border-t-2 border-blue-500 rounded-full"></div>
      <p className="mt-4 text-center">E-Mail wird bestätigt...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center px-6">
      <div className="max-w-md mx-auto bg-white p-6 shadow rounded-lg text-center">
        {isConfirmed ? (
          <>
            <div className="bg-green-100 rounded-full p-4 inline-block mb-4"><CheckCircle size={32} className="text-green-600" /></div>
            <h2 className="text-xl font-medium">E‑Mail bestätigt!</h2>
            <p className="mt-2">Weiterleitung zur Anmeldung...</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/login?confirmed=true')}>Jetzt anmelden</Button>
          </>
        ) : (
          <>
            <div className="bg-red-100 rounded-full p-4 inline-block mb-4"><AlertCircle size={32} className="text-red-600" /></div>
            <h2 className="text-xl font-medium">Fehler bei Bestätigung</h2>
            <p className="mt-2">{error}</p>
            <div className="mt-4 space-y-2">
              <Button variant="primary" onClick={() => navigate('/login')}>Zur Anmeldung</Button>
              <Button variant="secondary" onClick={() => navigate('/signup')}>Neu registrieren</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
