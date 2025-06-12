// src/pages/UpdatePasswordPage.tsx
import React from 'react';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm';
import { useSearchParams } from 'react-router-dom';

const UpdatePasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  return <UpdatePasswordForm code={code} />;
};

export default UpdatePasswordPage;
