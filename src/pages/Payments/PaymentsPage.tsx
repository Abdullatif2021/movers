import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Payments } from '@app/components/Admin/Payments/Payments';

const PaymentsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Payments')}</PageTitle>
      <Payments />
    </>
  );
};

export default PaymentsPage;
