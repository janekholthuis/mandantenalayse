import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') || '/login?confirmed=true';

      if (!token_hash || !type) {
        setErrorMsg('Ungültiger Bestätigungslink.');
        setIsLoading(false);
        toast.error('🔗 Der Bestätigungslink ist ungültig.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) throw error;

        if (data?.user) {
          setIsConfirmed(true);
          toast.success('✅ E-Mail erfolgreich bestätigt!');
          setTimeout(() => {
            navigate(next);
          }, 2500);
        } else {
          throw new Error('Keine Benutzerdaten erhalten.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
        setErrorMsg(message);
        toast.error('❌ Bestätigung fehlgeschlagen: ' + message);
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">E-Mail wird bestätigt…</h2>
          <p className="text-sm text-gray-600">Bitte einen Moment Geduld.</p>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 shadow-lg text-center space-y-4">
          <div className="mx-auto rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-900">🎉 E-Mail bestätigt!</h2>
          <p className="text-sm text-gray-600">Du wirst weitergeleitet…</p>
          <Button
            variant="primary"
            onClick={() => navigate(next)}
          >
            Zur Anmeldung
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="rounded-xl bg-white p-8 shadow-lg text-center space-y-4">
        <div className="mx-auto rounded-full bg-red-100 p-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Bestätigung fehlgeschlagen</h2>
        <p className="text-sm text-gray-600">{errorMsg}</p>

        <div className="space-y-2">
          <Button variant="primary" onClick={() => navigate('/login')}>
            Zur Anmeldung
          </Button>
          <Button variant="secondary" onClick={() => navigate('/signup')}>
            Neu registrieren
          </Button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Hilfe? Kontakt: <a href="mailto:support@mandantenanalyse.com" className="text-blue-600">support@mandantenanalyse.com</a>
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
