import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { showSuccess, showError } from '../lib/toast';

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token_hash = searchParams.get('token');
        const type = searchParams.get('type');
        const source = searchParams.get('source'); // e.g. 'signup'

        if (!token_hash || !type) {
          setError('Ungültiger Bestätigungslink.');
          setIsLoading(false);
          return;
        }

        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (verifyError) {
          console.error('Bestätigungsfehler:', verifyError);
          if (verifyError.message.includes('expired')) {
            setError('Der Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an.');
          } else if (verifyError.message.includes('already_confirmed')) {
            setError('Diese E-Mail wurde bereits bestätigt.');
          } else {
            setError('Bestätigung fehlgeschlagen.');
          }
        } else if (data?.user) {
          setIsConfirmed(true);

          // Display contextual success
          if (source === 'signup') {
            showSuccess('E-Mail bestätigt – willkommen bei Mandantenanalyse.com! 🎉');
            setTimeout(() => navigate('/clients'), 2000);
          } else {
            showSuccess('E-Mail erfolgreich bestätigt.');
            setTimeout(() => navigate('/login?confirmed=true'), 2000);
          }
        } else {
          setError('Unbekannter Fehler bei der Bestätigung.');
        }
      } catch (err) {
        console.error('Callback-Fehler:', err);
        setError('Ein unerwarteter Fehler ist aufgetreten.');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-600">Verarbeite Bestätigung...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
        {isConfirmed ? (
          <>
            <div className="mx-auto h-12 w-12 flex items-center justify-center bg-green-100 rounded-full mb-4">
              <CheckCircle className="text-green-600 h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">E-Mail bestätigt</h2>
            <p className="mt-2 text-sm text-gray-600">Sie werden automatisch weitergeleitet...</p>
          </>
        ) : (
          <>
            <div className="mx-auto h-12 w-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
              <AlertCircle className="text-red-600 h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Fehler bei der Bestätigung</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <div className="mt-6 space-y-2">
              <Button variant="primary" onClick={() => navigate('/login')} className="w-full">Zur Anmeldung</Button>
              <Button variant="secondary" onClick={() => navigate('/signup')} className="w-full">Neu registrieren</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
