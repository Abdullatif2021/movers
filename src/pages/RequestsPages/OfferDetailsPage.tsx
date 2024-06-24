import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import OfferDetails from '@app/components/Admin/Offers/OfferDetails';

const OfferDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.OfferDeails')}</PageTitle>
      <OfferDetails />
    </>
  );
};

export default OfferDetailsPage;
