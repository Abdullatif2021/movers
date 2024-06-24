import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import ContactUs from '@app/components/Admin/ContactUs';

const ContactUsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.ContactUs')}</PageTitle>
      <ContactUs />
    </>
  );
};

export default ContactUsPage;
