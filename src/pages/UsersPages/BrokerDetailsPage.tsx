import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import BrokerDetails from '@app/components/Admin/Brokers/BrokerDetails';

const BrokerDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.BrokerDetails')}</PageTitle>
      <BrokerDetails />
    </>
  );
};

export default BrokerDetailsPage;
