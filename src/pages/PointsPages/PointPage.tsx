import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Points } from '@app/components/Admin/Points';

const PpointPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Points')}</PageTitle>
      <Points />
    </>
  );
};

export default PpointPage;
