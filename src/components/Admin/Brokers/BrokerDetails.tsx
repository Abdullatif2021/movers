import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Col, Row, Tree, Card, Image, Tag, Tooltip } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getBrokerById } from '@app/services/brokers';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined, TagOutlined } from '@ant-design/icons';
import { TableButton, TextBack } from '@app/components/GeneralStyles';
import { useAppSelector } from '@app/hooks/reduxHooks';

const { Meta } = Card;

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type companyData = {
  companyCode: string;
  id: number;
};

const BrokerDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { brokerId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [brokerData, setBrokerData] = useState<any>();
  const [hasPermissions, setHasPermissions] = useState({
    client: false,
    request: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Pages.Users.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        client: true,
      }));
    }

    if (userPermissions.includes('Request.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        request: true,
      }));
    }
  }, [userPermissions]);

  const { refetch, isRefetching } = useQuery(['getBrokerById'], () =>
    getBrokerById(brokerId)
      .then((data) => {
        const result = data.data?.result;
        setBrokerData(result);
        setLoading(!data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        setLoading(false);
      }),
  );

  const DetailsRow = styled.div`
    display: flex;
    justify-content: flex-start;
  `;

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
    margin-bottom: 1rem;
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

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [refetch, language]);

  return (
    <>
      <PageTitle>{t('brokers.brokerInfo')}</PageTitle>
      <Row justify={'end'}>
        <Btn
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
        </Btn>
      </Row>
      <Row>
        <Cardd
          title={t('brokers.brokerInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('brokers.brokerProfile')} :</h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.mediatorCode')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{brokerData?.mediatorCode}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.commission')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{brokerData?.commissionPercentage} %</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.mediatorPhoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {brokerData?.dialCode} {brokerData?.mediatorPhoneNumber}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.country')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{brokerData?.city?.country?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.city')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{brokerData?.city?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.mediatorProfit')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{brokerData?.mediatorProfit}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.moneyOwed')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{brokerData?.moneyOwed}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.firstName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {brokerData?.firstName == null || brokerData?.firstName == ' ' ? '___' : brokerData?.firstName}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.lastName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {brokerData?.lastName == null || brokerData?.lastName == ' ' ? '___' : brokerData?.lastName}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {brokerData?.email == null || brokerData?.email == ' ' ? '___' : brokerData?.email}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.companyName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {brokerData?.companyName == null || brokerData?.companyName == ' '
                      ? '___'
                      : brokerData?.companyName}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('brokers.companyPhoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {brokerData?.companyPhoneNumber == null || brokerData?.companyPhoneNumber == ' '
                      ? '___'
                      : brokerData?.dialCode + ' ' + brokerData?.companyPhoneNumber}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              {(hasPermissions.client || hasPermissions.request) && (
                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('brokers.achievement')} :
                </h3>
              )}

              {hasPermissions.client && (
                <>
                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('brokers.countRegisteredUsers')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{brokerData?.countRegisteredUsers}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsTitle
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      {t('brokers.user')}
                    </DetailsTitle>
                    <DetailsValue
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Tooltip placement={language == 'en' ? 'right' : 'left'} title={t('brokers.viewUser')}>
                        <TableButton
                          severity="success"
                          onClick={() => {
                            Navigate(`${brokerData?.mediatorCode}/clients/viaBroker`);
                          }}
                        >
                          <TagOutlined />
                        </TableButton>
                      </Tooltip>
                    </DetailsValue>
                  </DetailsRow>
                </>
              )}

              {hasPermissions.request && (
                <>
                  <DetailsRow>
                    <ColStyle>
                      <DetailsTitle>{t('brokers.numberServiceUsers')}</DetailsTitle>
                    </ColStyle>
                    <ColStyle>
                      <DetailsValue>{brokerData?.numberServiceUsers}</DetailsValue>
                    </ColStyle>
                  </DetailsRow>

                  <DetailsRow>
                    <DetailsTitle
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      {t('brokers.requestsViaBroker')}
                    </DetailsTitle>
                    <DetailsValue
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Tooltip
                        placement={language == 'en' ? 'right' : 'left'}
                        title={t('brokers.viewRequestsViaBroker')}
                      >
                        <TableButton
                          severity="success"
                          onClick={() => {
                            Navigate(`requests/viaBroker`);
                          }}
                        >
                          <TagOutlined />
                        </TableButton>
                      </Tooltip>
                    </DetailsValue>
                  </DetailsRow>
                </>
              )}
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default BrokerDetails;
