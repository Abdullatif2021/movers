import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { City } from '@app/components/Admin/Locations/Cities';

const CitiesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Locations')}</PageTitle>
      <City />
    </>
  );
};

export default CitiesPage;
