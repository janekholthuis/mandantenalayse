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
        // First, check if there's a token in the URL
        const token = searchParams.get('token');
        
        if (token) {
          // If there's a token, verify it with Supabase
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });
          
          if (error) {
            console.error('Token verification error:', error);
            setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
          } else if (data.session) {
            // Token is valid and session is established
            setSessionReady(true);
          } else {
            setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
          }
        } else {
          // No token in URL, check if there's already an active session
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
          } else if (sessionData.session) {
            setSessionReady(true);
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