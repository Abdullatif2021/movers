import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { CompaniesAndBranchesThatBoughtInfo } from '@app/components/Admin/Companies/CompaniesThatBoughtInfo';

const CompaniesThatBoughtInfoPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.companies')}</PageTitle>
      <CompaniesAndBranchesThatBoughtInfo />
    </>
  );
};

export default CompaniesThatBoughtInfoPage;
