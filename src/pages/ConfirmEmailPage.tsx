import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || !type) {
        setError('Ungültiger Bestätigungslink. Bitte überprüfen Sie den Link aus Ihrer E-Mail.');
        setIsLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        });

        if (error) {
          throw error;
        }

        setIsConfirmed(true);
      } catch (err) {
        console.error('Email confirmation error:', err);
        if (err instanceof Error) {
          if (err.message.includes('expired')) {
            setError('Der Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen Link an.');
          } else if (err.message.includes('invalid')) {
            setError('Ungültiger Bestätigungslink. Bitte überprüfen Sie den Link aus Ihrer E-Mail.');
          } else {
            setError('Fehler bei der E-Mail-Bestätigung. Bitte versuchen Sie es erneut.');
          }
        } else {
          setError('Ein unbekannter Fehler ist aufgetreten.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-medium text-gray-900">E-Mail wird bestätigt...</h2>
              <p className="mt-2 text-sm text-gray-600">
                Bitte warten Sie, während wir Ihre E-Mail-Adresse bestätigen.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-xl font-medium text-gray-900">E-Mail erfolgreich bestätigt!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können sich jetzt anmelden.
              </p>
              <Button
                variant="primary"
                className="mt-6 w-full"
                onClick={() => navigate('/login?confirmed=true')}
              >
                Zur Anmeldung
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-medium text-gray-900">Bestätigung fehlgeschlagen</h2>
            <p className="mt-2 text-sm text-gray-600 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Zur Anmeldung
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/signup')}
              >
                Neue Registrierung
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;