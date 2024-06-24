import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Tools } from '@app/components/Admin/Services/tools';

const ToolsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Tools')}</PageTitle>
      <Tools />
    </>
  );
};

export default ToolsPage;
