import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Requests } from '@app/components/Admin/Requests/index';

const RequestsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Requests')}</PageTitle>
      <Requests />
    </>
  );
};

export default RequestsPage;
