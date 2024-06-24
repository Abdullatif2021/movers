import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { SourceType } from '@app/components/Admin/SourceTypes';

const SourceTypePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.SourceType')}</PageTitle>
      <SourceType />
    </>
  );
};

export default SourceTypePage;
