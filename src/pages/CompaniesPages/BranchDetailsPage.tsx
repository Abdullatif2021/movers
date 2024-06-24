import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import BranchDetails from '@app/components/Admin/Companies/BranchDetails';

const BranchDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.branchDetails')}</PageTitle>
      <BranchDetails />
    </>
  );
};

export default BranchDetailsPage;
