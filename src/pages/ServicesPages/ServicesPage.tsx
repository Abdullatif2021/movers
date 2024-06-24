import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Services } from '@app/components/Admin/Services';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Services')}</PageTitle>
      <Services />
    </>
  );
};

export default ServicesPage;
