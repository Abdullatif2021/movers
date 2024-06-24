import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Space, Rate } from 'antd';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { GetReviewDetailsByCompanyId } from '@app/services/companies';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { Button } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';
import { GetReviewDetailsByBranchId } from '@app/services/branches';

const ReviewsDetails: React.FC = () => {
  const { t } = useTranslation();
  const { companyId, branchId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [companyReviewData, setCompanyReviewData] = useState<any>();
  const [branchReviewData, setBranchReviewData] = useState<any>();

  const { refetch: refetchReview, isRefetching: isRefetchingReview } = useQuery(
    ['GetReviewDetailsByCompanyId'],
    () =>
      GetReviewDetailsByCompanyId(companyId)
        .then((data) => {
          const result = data.data?.result;
          setCompanyReviewData(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    { enabled: branchId == undefined },
  );

  const { refetch, isRefetching } = useQuery(
    ['GetReviewDetailsByBranchId'],
    () =>
      GetReviewDetailsByBranchId(branchId)
        .then((data) => {
          const result = data.data?.result;
          setBranchReviewData(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    { enabled: branchId != undefined },
  );

  const DetailsTitle = styled.div`
    color: var(--text-light-color);
    font-size: ${FONT_SIZE.lg};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-right: 0.5rem;
    width: 100%;
  `;

  const DetailsValue = styled.div`
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
    // margin-bottom: 1rem;
    display: block;
  `;

  const ColStyle =
    isDesktop || isTablet
      ? styled.div`
          width: 46%;
          margin: 0 2%;
        `
      : styled.div`
          width: 80%;
          margin: 0 10%;
        `;

  const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin: 1.25rem 0.5rem;
  `;

  return (
    <>
      <Row justify={'end'}>
        <Button
          style={{
            margin: '1rem 1rem 1rem 0',
            width: 'auto',
            height: 'auto',
          }}
          type="ghost"
          onClick={() => Navigate(-1)}
          icon={<LeftOutlined />}
        >
          <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
        </Button>
      </Row>
      <Row>
        <Cardd
          title={branchReviewData == undefined ? t('companies.companyEvaluation') : t('branch.branchEvaluation')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              {((!loading && branchReviewData == undefined && companyReviewData.length == 0) ||
                (!loading && branchReviewData != undefined && branchReviewData.length == 0)) &&
                t('companies.noReviews')}

              {branchReviewData == undefined &&
                companyReviewData?.map((review: any) => (
                  <Row key={review.user?.id}>
                    <ColStyle style={{ borderBottom: '1px solid' }}>
                      <DetailsTitle>{review.user?.fullName} :</DetailsTitle>
                      <DetailsTitle style={{ wordBreak: 'break-all' }}>{review?.reviewDescription}</DetailsTitle>
                    </ColStyle>
                    <ColStyle style={{ display: 'flex', borderBottom: '1px solid' }}>
                      <Row>
                        <Space
                          key={review.user.id}
                          wrap
                          style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            marginBottom: '3rem',
                            flexWrap: 'nowrap',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <DetailsValue style={{ margin: '2px 0' }}>{t('companies.quality')} :</DetailsValue>
                          <DetailsValue style={{ margin: '2px 0' }}>{t('companies.overallRating')} :</DetailsValue>
                          <DetailsValue style={{ margin: '2px 0' }}>{t('companies.overallRating')} :</DetailsValue>
                          <DetailsValue style={{ margin: '2px 0' }}>
                            {t('companies.valueOfServiceForMoney')} :
                          </DetailsValue>
                        </Space>
                        <Space
                          key={review.user.id}
                          wrap
                          style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            marginBottom: '3rem',
                            flexWrap: 'nowrap',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.quality / 2} />
                          </DetailsValue>
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.overallRating / 2} />
                          </DetailsValue>
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.overallRating / 2} />
                          </DetailsValue>
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate
                              style={{ fontSize: '16px' }}
                              disabled
                              defaultValue={review?.valueOfServiceForMoney / 2}
                            />
                          </DetailsValue>
                        </Space>
                      </Row>
                    </ColStyle>
                  </Row>
                ))}

              {branchReviewData != undefined &&
                branchReviewData?.map((review: any) => (
                  <Row key={review.user?.id}>
                    <ColStyle style={{ borderBottom: '1px solid' }}>
                      <DetailsTitle>{review.user?.fullName} :</DetailsTitle>
                      <DetailsTitle>{review?.reviewDescription}</DetailsTitle>
                    </ColStyle>
                    <ColStyle style={{ display: 'flex', borderBottom: '1px solid' }}>
                      <Row>
                        <Space
                          key={review.user.id}
                          wrap
                          style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            marginBottom: '3rem',
                            flexWrap: 'nowrap',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <DetailsValue style={{ margin: '2px 0' }}>{t('companies.quality')} :</DetailsValue>
                          <DetailsValue style={{ margin: '2px 0' }}>{t('companies.overallRating')} :</DetailsValue>
                          <DetailsValue style={{ margin: '2px 0' }}>{t('companies.overallRating')} :</DetailsValue>
                          <DetailsValue style={{ margin: '2px 0' }}>
                            {t('companies.valueOfServiceForMoney')} :
                          </DetailsValue>
                        </Space>
                        <Space
                          key={review.user.id}
                          wrap
                          style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            marginBottom: '3rem',
                            flexWrap: 'nowrap',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.quality / 2} />
                          </DetailsValue>
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.overallRating / 2} />
                          </DetailsValue>
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.overallRating / 2} />
                          </DetailsValue>
                          <DetailsValue style={{ margin: '0 2rem' }}>
                            <Rate
                              style={{ fontSize: '16px' }}
                              disabled
                              defaultValue={review?.valueOfServiceForMoney / 2}
                            />
                          </DetailsValue>
                        </Space>
                      </Row>
                    </ColStyle>
                  </Row>
                ))}
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default ReviewsDetails;
