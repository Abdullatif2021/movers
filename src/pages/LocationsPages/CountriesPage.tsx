import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Country } from '@app/components/Admin/Locations/Countries';

const CountriesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Locations')}</PageTitle>
      <Country />
    </>
  );
};

export default CountriesPage;
