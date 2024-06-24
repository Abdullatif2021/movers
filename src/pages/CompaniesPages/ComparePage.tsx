import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import ComparisonCompany from '@app/components/Admin/Companies/ComparisonCompany';

const ComparisonPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.ComparePage')}</PageTitle>
      <ComparisonCompany />
    </>
  );
};

export default ComparisonPage;
