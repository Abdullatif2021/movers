import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Offers } from '@app/components/Admin/Offers/Offers';

const OffersPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.offers')}</PageTitle>
      <Offers />
    </>
  );
};

export default OffersPage;
