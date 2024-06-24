import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { User } from '@app/components/Admin/Users';

const UsersPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Users')}</PageTitle>
      <User />
    </>
  );
};

export default UsersPage;
