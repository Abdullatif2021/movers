import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PotentialClients } from '@app/components/Admin/Companies/PotentialClients';

const PotentialClientsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.potentialClients')}</PageTitle>
      <PotentialClients />
    </>
  );
};

export default PotentialClientsPage;
