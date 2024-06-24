import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ParentAttributeChoices } from '@app/components/Admin/SourceTypes/parentAttributeChoices';

const ParentAttributeChoicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.AttributeChoices')}</PageTitle>
      <ParentAttributeChoices />
    </>
  );
};

export default ParentAttributeChoicesPage;
