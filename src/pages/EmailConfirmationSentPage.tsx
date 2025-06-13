import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { showSuccess, showError } from '../lib/toast';

const EmailConfirmationSentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const email = searchParams.get('email') || '';
  const name = searchParams.get('name') || '';

  const handleResendConfirmation = async () => {
    if (!email) return;

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      // Resend the confirmation email through Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
        },
      });

      if (error) {
        if (error.message.includes('already_confirmed') || error.message.includes('Email already confirmed')) {
          setResendError('Diese E-Mail-Adresse wurde bereits bestätigt. Sie können sich jetzt anmelden.');
        } else {
          throw error;
        }
      } else {
        setResendSuccess(true);
        showSuccess('Bestätigungs-E-Mail wurde erneut gesendet! 📧');
      }
    } catch (err) {
      console.error('Error resending confirmation:', err);
      if (err instanceof Error) {
        setResendError(err.message);
        showError(`Fehler: ${err.message}`);
      } else {
        setResendError('Fehler beim erneuten Senden der Bestätigungs-E-Mail');
        showError('Fehler beim erneuten Senden der Bestätigungs-E-Mail');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            E-Mail-Bestätigung erforderlich
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Wir haben eine Bestätigungs-E-Mail an Ihre Adresse gesendet
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-blue-800">
                  Bestätigungs-E-Mail gesendet
                </h3>
              </div>
              <p className="text-blue-700 text-sm">
                Wir haben eine E-Mail an <strong className="font-semibold">{email}</strong> gesendet.
                {name && (
                  <span className="block mt-1">
                    Hallo {name}, bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink.
                  </span>
                )}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h4 className="text-sm font-medium text-yellow-800">E-Mail nicht erhalten?</h4>
              </div>
              <ul className="text-sm text-yellow-700 text-left space-y-1">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Überprüfen Sie Ihren Spam-Ordner
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Warten Sie einige Minuten (E-Mails können verzögert ankommen)
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Stellen Sie sicher, dass die E-Mail-Adresse korrekt ist
                </li>
              </ul>
            </div>

            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-700 font-medium">
                    Bestätigungs-E-Mail wurde erneut gesendet!
                  </p>
                </div>
              </div>
            )}

            {resendError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-700">{resendError}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={handleResendConfirmation}
                isLoading={isResending}
                disabled={isResending || !email}
                icon={<RefreshCw size={16} />}
                className="w-full"
              >
                {isResending ? 'Sende erneut...' : 'Bestätigungs-E-Mail erneut senden'}
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Zur Anmeldung
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Falsche E-Mail-Adresse?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="font-medium text-blue-600 hover:text-blue-500 underline"
                >
                  Neue Registrierung starten
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationSentPage;