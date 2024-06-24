import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { TypesForSource } from '@app/components/Admin/SourceTypes/typesForSource';

const TypesForSourcePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.TypesForSourceType')}</PageTitle>
      <TypesForSource />
    </>
  );
};

export default TypesForSourcePage;
