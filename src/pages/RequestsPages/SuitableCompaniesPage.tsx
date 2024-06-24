import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { SuitableCompanies } from '@app/components/Admin/Requests/SuitableCompanies';

const SuitableCompaniesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.suitableCompanies&Branches')}</PageTitle>
      <SuitableCompanies />
    </>
  );
};

export default SuitableCompaniesPage;
