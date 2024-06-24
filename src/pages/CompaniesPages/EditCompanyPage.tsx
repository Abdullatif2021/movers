import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EditCompany } from '@app/components/modal/EditCompany';

const EditCompanyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.EditCompany')}</PageTitle>
      <EditCompany />
    </>
  );
};

export default EditCompanyPage;
