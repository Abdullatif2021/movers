import React from 'react';
import { LoginForm } from '@app/components/auth/LoginForm/LoginForm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useTranslation } from 'react-i18next';
const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('auth.logIn')}</PageTitle>
      <LoginForm />
    </>
  );
};

export default LoginPage;
