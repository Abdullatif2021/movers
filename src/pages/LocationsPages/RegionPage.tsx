import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Region } from '@app/components/Admin/Locations/Regions';

const RegionPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Locations')}</PageTitle>
      <Region />
    </>
  );
};

export default RegionPage;
