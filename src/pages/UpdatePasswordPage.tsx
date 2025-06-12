import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm';

const UpdatePasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sessionReady, setSessionReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Check if there's already an active session (user clicked reset link)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
        } else if (sessionData.session) {
          // Session exists, user can update password
          setSessionReady(true);
        } else {
          // No session, check for token in URL and verify it
          const token_hash = searchParams.get('token_hash');
          const type = searchParams.get('type');
          
          if (token_hash && type) {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash,
              type: type as any
            });
            
            if (error) {
              console.error('Token verification error:', error);
              setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
            } else if (data.session) {
              setSessionReady(true);
            } else {
              setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
            }
          } else {
            setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
          }
        }
      } catch (err) {
        console.error('Password reset error:', err);
        setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
      } finally {
        setIsLoading(false);
      }
    };

    handlePasswordReset();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <UpdatePasswordForm sessionReady={sessionReady} errorMessage={errorMessage} />;
};

export default UpdatePasswordPage;