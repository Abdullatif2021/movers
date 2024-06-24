import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ApplicationsVersions } from '@app/components/Admin/ApplicationsVersions/ApplicationsVersions';

const ApplicationsVersionsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.ApplicationsVersions')}</PageTitle>
      <ApplicationsVersions />
    </>
  );
};

export default ApplicationsVersionsPage;
