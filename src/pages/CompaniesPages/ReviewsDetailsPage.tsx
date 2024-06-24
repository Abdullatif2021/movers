import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReviewsDetails from '@app/components/Admin/Companies/ReviewsDetails';

const ReviewsDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('sidebarNavigation.ReviewsDetails')}</PageTitle>
      <ReviewsDetails />
    </>
  );
};

export default ReviewsDetailsPage;
