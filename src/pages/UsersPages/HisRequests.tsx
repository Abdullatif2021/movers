import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { HisRequests } from '@app/components/Admin/Users/hisRequests';

const HisRequestsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Requests')}</PageTitle>
      <HisRequests />
    </>
  );
};

export default HisRequestsPage;
