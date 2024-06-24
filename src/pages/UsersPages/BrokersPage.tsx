import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Brokers } from '@app/components/Admin/Brokers';

const Brokerspage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Brokers')}</PageTitle>
      <Brokers />
    </>
  );
};

export default Brokerspage;
