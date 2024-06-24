import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Role } from '@app/components/Admin/Roles';

const RolesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Roles')}</PageTitle>
      <Role />
    </>
  );
};

export default RolesPage;
