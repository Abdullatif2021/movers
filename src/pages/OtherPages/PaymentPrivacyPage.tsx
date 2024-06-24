import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import PaymentPolicy from '@app/components/Admin/PaymentPrivacy';

const PaymentPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.PaymentPrivacy')}</PageTitle>
      <PaymentPolicy />
    </>
  );
};

export default PaymentPolicyPage;
