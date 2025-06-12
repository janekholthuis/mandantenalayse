import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('Auth error:', error);
        navigate('/login');
      } else {
        navigate('/clients');
      }
    };

    completeAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Anmeldung wird verarbeitet...
    </div>
  );
};

export default AuthCallbackPage;
