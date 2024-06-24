import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AddBranch } from '@app/components/modal/AddBranch';

const AddBranchPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.AddBranch')}</PageTitle>
      <AddBranch />
    </>
  );
};

export default AddBranchPage;
