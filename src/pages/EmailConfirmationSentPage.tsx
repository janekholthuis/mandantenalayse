import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EmailService } from '../services/emailService';
import Button from '../components/ui/Button';

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
          emailRedirectTo: `${window.location.origin}/confirm-email`,
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
      }
    } catch (err) {
      console.error('Error resending confirmation:', err);
      if (err instanceof Error) {
        setResendError(err.message);
      } else {
        setResendError('Fehler beim erneuten Senden der Bestätigungs-E-Mail');
      }
    } finally {
      setIsResending(false);
    }
  };
        throw error;
      }

      setResendSuccess(true);
    } catch (err) {
      console.error('Error resending confirmation:', err);
      setResendError(err instanceof Error ? err.message : 'Fehler beim erneuten Senden der Bestätigungs-E-Mail');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Bestätigungs-E-Mail gesendet
              </h3>
              <p className="text-blue-700 text-sm">
                Wir haben eine E-Mail an <strong>{email}</strong> gesendet.
                {name && ` Hallo ${name},`} bitte überprüfen Sie Ihren Posteingang und klicken Sie auf den Bestätigungslink.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">📧 E-Mail nicht erhalten?</h4>
              <ul className="text-sm text-yellow-700 text-left space-y-1">
                <li>• Überprüfen Sie Ihren Spam-Ordner</li>
                <li>• Warten Sie einige Minuten (E-Mails können verzögert ankommen)</li>
                <li>• Stellen Sie sicher, dass die E-Mail-Adresse korrekt ist</li>
              </ul>
            </div>

            {resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700">
                  Bestätigungs-E-Mail wurde erneut gesendet!
                </p>
              </div>
            )}

            {resendError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{resendError}</p>
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
                className="w-full"
              >
                Zur Anmeldung
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Falsche E-Mail-Adresse?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="font-medium text-blue-600 hover:text-blue-500"
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