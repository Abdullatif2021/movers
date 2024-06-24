import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EditBranch } from '@app/components/modal/EditBranch';

const EditBranchPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.EditBranch')}</PageTitle>
      <EditBranch />
    </>
  );
};

export default EditBranchPage;
