import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { PrivacyPolicy } from '@app/components/Admin/PrivacyPolicy';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.PrivacyPolicy')}</PageTitle>
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPolicyPage;
