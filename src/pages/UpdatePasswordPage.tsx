import React from 'react';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm';
import { useSearchParams } from 'react-router-dom';

const UpdatePasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  const email = searchParams.get('email') || '';

  return <UpdatePasswordForm code={code} email={email} />;
};

export default UpdatePasswordPage;
