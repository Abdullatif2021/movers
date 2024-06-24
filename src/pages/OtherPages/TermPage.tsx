import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Services } from '@app/components/Admin/Services';
import { Term } from '@app/components/Admin/Terms';

const TermPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.Terms')}</PageTitle>
      <Term />
    </>
  );
};

export default TermPage;
