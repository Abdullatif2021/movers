import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { SubServices } from '@app/components/Admin/Services/subServices';

const SubServicesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.SubServices')}</PageTitle>
      <SubServices />
    </>
  );
};

export default SubServicesPage;
