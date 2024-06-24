import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import DragAndDropBoard from '@app/components/Admin/CommissionGroups';

const CommissionGroupsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.CommissionGroups')}</PageTitle>
      <DragAndDropBoard />
    </>
  );
};

export default CommissionGroupsPage;
