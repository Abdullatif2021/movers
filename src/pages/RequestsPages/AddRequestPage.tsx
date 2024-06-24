import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { AddRequest } from '@app/components/modal/AddRequest';

const AddRequestPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.addRequest')}</PageTitle>
      <AddRequest />
    </>
  );
};

export default AddRequestPage;
