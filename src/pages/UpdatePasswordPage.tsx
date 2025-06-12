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
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
        } else if (data.session) {
          setSessionReady(true);
        } else {
          setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
        }
      } catch (err) {
        setErrorMessage('Der Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Passwort-Reset an.');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

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