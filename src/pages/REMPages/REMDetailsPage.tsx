import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import REMDetails from '@app/components/Admin/RealEstateManagement/REMDetails';

const REMDetailsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.PartnersDetails')}</PageTitle>
      <REMDetails />
    </>
  );
};

export default REMDetailsPage;
