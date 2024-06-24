import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { CompleteDraft } from '@app/components/modal/CompleteDraft';

const CompleteDraftsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.CompleteDraft')}</PageTitle>
      <CompleteDraft />
    </>
  );
};

export default CompleteDraftsPage;
