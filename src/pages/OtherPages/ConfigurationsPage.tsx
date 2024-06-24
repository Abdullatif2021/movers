import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Configurations } from '@app/components/Admin/Configurations';

const ConfigurationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Configurations')}</PageTitle>
      <Configurations />
    </>
  );
};

export default ConfigurationsPage;
