import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { FeaturedBundles } from '@app/components/Admin/Points/FeaturedBundles';

const FeaturedBundlesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.FeaturedBundles')}</PageTitle>
      <FeaturedBundles />
    </>
  );
};

export default FeaturedBundlesPage;
