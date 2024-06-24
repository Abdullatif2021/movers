import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import RequestDetails from '@app/components/Admin/Requests/RequestDetails';

const RequestDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.RequestDetails')}</PageTitle>
      <RequestDetails />
    </>
  );
};

export default RequestDetailsPage;
