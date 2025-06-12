import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get('confirmed') === 'true') {
      toast.success('E-Mail erfolgreich bestätigt 🎉');
    }

    if (params.get('passwordUpdated') === 'true') {
      toast.success('Passwort erfolgreich geändert 🔐');
    }
  }, [params]);

  return <AuthForm />;
};

export default LoginPage;
