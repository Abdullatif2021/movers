import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditRequest } from '@app/components/modal/EditRequest';

const EditRequestPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.editRequest')}</PageTitle>
      <EditRequest />
    </>
  );
};

export default EditRequestPage;
