import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { RejectReasons } from '@app/components/Admin/RejectReasons';

const RejectReasonsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.RejectReason')}</PageTitle>
      <RejectReasons />
    </>
  );
};

export default RejectReasonsPage;
