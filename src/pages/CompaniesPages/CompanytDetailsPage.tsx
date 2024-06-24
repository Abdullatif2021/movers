import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import CompanyDetails from '@app/components/Admin/Companies/CompanyDetails';

const CompanytDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.CompanieDetails')}</PageTitle>
      <CompanyDetails />
    </>
  );
};

export default CompanytDetailsPage;
