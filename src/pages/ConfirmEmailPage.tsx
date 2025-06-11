import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
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
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') || '/login?confirmed=true';

      // Check if we have the required parameters
      if (!token_hash || !type) {
        setError('Ungültiger Bestätigungslink. Bitte überprüfen Sie den Link aus Ihrer E-Mail.');
        setIsLoading(false);
        return;
      }

      try {
        // Verify the OTP token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token_hash,
          type: type as any,
        });

        if (error) {
          console.error('Supabase verification error:', error);
          throw error;
        }

        // Check if verification was successful
        if (data?.user) {
          setIsConfirmed(true);
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            navigate('/login?confirmed=true');
          }, 3000);
        } else {
          throw new Error('Bestätigung fehlgeschlagen - kein Benutzer zurückgegeben');
        }
      } catch (err) {
        console.error('Email confirmation error:', err);
        
        if (err instanceof Error) {
          // Handle specific error types
          if (err.message.includes('expired') || err.message.includes('Token has expired')) {
            setError('Der Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen Link an.');
          } else if (err.message.includes('invalid') || err.message.includes('Invalid token')) {
            setError('Ungültiger Bestätigungslink. Bitte überprüfen Sie den Link aus Ihrer E-Mail.');
          } else if (err.message.includes('already_confirmed') || err.message.includes('Email already confirmed')) {
            setError('Diese E-Mail-Adresse wurde bereits bestätigt. Sie können sich jetzt anmelden.');
          } else {
            setError(`Fehler bei der E-Mail-Bestätigung: ${err.message}`);
          }
        } else {
          setError('Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">E-Mail wird bestätigt...</h2>
              <p className="text-sm text-gray-600">
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
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                🎉 E-Mail erfolgreich bestätigt!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie werden automatisch zur Anmeldung weitergeleitet.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-green-800 mb-2">✅ Konto aktiviert</h3>
                <p className="text-sm text-green-700">
                  Ihr Konto ist jetzt vollständig aktiviert und Sie können sich anmelden.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/login?confirmed=true')}
                >
                  Jetzt anmelden
                </Button>
                <p className="text-xs text-gray-500">
                  Sie werden in wenigen Sekunden automatisch weitergeleitet...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Bestätigung fehlgeschlagen
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {error}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Was können Sie tun?</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Überprüfen Sie, ob der Link vollständig kopiert wurde</li>
                <li>• Fordern Sie einen neuen Bestätigungslink an</li>
                <li>• Kontaktieren Sie den Support bei weiteren Problemen</li>
              </ul>
            </div>
            
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
              <button
                onClick={() => navigate('/email-confirmation-sent')}
                className="w-full text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Neuen Bestätigungslink anfordern
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Bei Problemen kontaktieren Sie uns unter{' '}
                <a href="mailto:support@mandantenanalyse.com" className="text-blue-600 hover:text-blue-500">
                  support@mandantenanalyse.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;