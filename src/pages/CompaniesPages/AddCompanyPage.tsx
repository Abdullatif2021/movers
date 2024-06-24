import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AddCompany } from '@app/components/modal/AddCompany';

const AddCompanyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.addcompany')}</PageTitle>
      <AddCompany />
    </>
  );
};

export default AddCompanyPage;
