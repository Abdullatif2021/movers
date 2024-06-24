import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Manager } from '@app/components/Admin/Managers';

const ManagersPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Managers')}</PageTitle>
      <Manager />
    </>
  );
};

export default ManagersPage;
