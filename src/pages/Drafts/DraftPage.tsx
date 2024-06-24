import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Drafts } from '@app/components/Admin/Draft';

const DraftsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.Drafts')}</PageTitle>
      <Drafts />
    </>
  );
};

export default DraftsPage;
