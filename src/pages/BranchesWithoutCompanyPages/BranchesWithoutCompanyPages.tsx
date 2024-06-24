import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BranchesWithoutCompany } from '@app/components/Admin/BranchesWithoutCompany';

const Branchespage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.branchesWithoutCompany')}</PageTitle>
      <BranchesWithoutCompany />
    </>
  );
};

export default Branchespage;
