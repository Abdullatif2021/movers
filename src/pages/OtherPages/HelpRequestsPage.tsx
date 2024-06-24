import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { AskForHelp } from '@app/components/Admin/AskForHelp';

const AskForHelpPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.AskForHelp')}</PageTitle>
      <AskForHelp />
    </>
  );
};

export default AskForHelpPage;
