import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Branches } from '@app/components/Admin/Companies/Branches';

const Branchespage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.branches')}</PageTitle>
      <Branches />
    </>
  );
};

export default Branchespage;
