import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Companies } from '@app/components/Admin/Companies';

const CompaniesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.companies')}</PageTitle>
      <Companies />
    </>
  );
};

export default CompaniesPage;
