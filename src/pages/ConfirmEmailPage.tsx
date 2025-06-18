import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { showSuccess, showError } from '../lib/toast';
import { getEmailChangeSteps, updateEmailStep, clearEmailChangeSteps } from '../lib/emailFlow';

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionData?.session && !sessionError) {
          navigate('/clients');
          return;
        }

        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

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
          if (verifyError.message.includes('expired')) {
            setError('Der Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an.');
          } else if (verifyError.message.includes('already_confirmed')) {
            setError('Diese E-Mail-Adresse wurde bereits bestätigt. Sie können sich jetzt anmelden.');
          } else {
            setError('Bestätigung fehlgeschlagen. Der Link ist möglicherweise ungültig oder abgelaufen.');
          }
        } else if (data?.user) {
          const email = data.user.email;
          const steps = getEmailChangeSteps();

          if (steps.oldEmail === email) {
            updateEmailStep('old');
            if (steps.newConfirmed) {
              showSuccess('✅ Neue E-Mail erfolgreich bestätigt – alles abgeschlossen!');
              clearEmailChangeSteps();
            } else {
              showSuccess('Alte E-Mail bestätigt. Bitte jetzt auch die neue E-Mail bestätigen.');
            }
          } else if (steps.newEmail === email) {
            updateEmailStep('new');
            if (steps.oldConfirmed) {
              showSuccess('✅ Neue E-Mail erfolgreich bestätigt – alles abgeschlossen!');
              clearEmailChangeSteps();
            } else {
              showSuccess('Neue E-Mail bestätigt. Bitte jetzt auch die alte E-Mail bestätigen.');
            }
          } else {
            showSuccess('E-Mail erfolgreich bestätigt! 🎉');
          }

          setIsConfirmed(true);
          setTimeout(() => {
            navigate('/login?confirmed=true');
          }, 2500);
        } else {
          setError('Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        }
      } catch (err) {
        setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Verarbeite Anfrage...</h2>
          <p className="text-sm text-gray-600">Bitte einen Moment Geduld.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6">
      <div className="bg-white rounded-lg shadow p-8 text-center max-w-md w-full">
        {isConfirmed ? (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">E‑Mail bestätigt!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie werden zur Anmeldung weitergeleitet...
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/login?confirmed=true')}
              className="bg-green-600 hover:bg-green-700"
            >
              Jetzt anmelden
            </Button>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Bestätigung fehlgeschlagen</h2>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Zur Anmeldung
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/signup')}
                className="w-full"
              >
                Neu registrieren
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Hilfe benötigt? Kontakt: <a href="mailto:support@mandantenanalyse.com" className="text-blue-600">support@mandantenanalyse.com</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
