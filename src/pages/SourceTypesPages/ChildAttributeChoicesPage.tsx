import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ChildAttributeChoices } from '@app/components/Admin/SourceTypes/childAttributeChoices';

const ChildAttributeChoicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.AttributeChoices')}</PageTitle>
      <ChildAttributeChoices />
    </>
  );
};

export default ChildAttributeChoicesPage;
