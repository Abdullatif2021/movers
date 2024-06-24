import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Notifications } from '@app/components/Admin/Notifications';

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('notifications.Notifications')}</PageTitle>
      <Notifications />
    </>
  );
};

export default NotificationsPage;
