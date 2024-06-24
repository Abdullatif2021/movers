import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { FrequentlyQuestions } from '@app/components/Admin/FrequentlyQuestions';

const FrequentlyQuestionsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('sidebarNavigation.FrequentlyQuestions')}</PageTitle>
      <FrequentlyQuestions />
    </>
  );
};

export default FrequentlyQuestionsPage;
