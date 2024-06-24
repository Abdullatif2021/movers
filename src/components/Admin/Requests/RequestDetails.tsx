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
import { getRequestById } from '@app/services/requests';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { TableButton } from '@app/components/GeneralStyles';
import { DataNode } from 'antd/es/tree';
import { BankOutlined, CheckOutlined, CloseOutlined, StopOutlined, TagOutlined } from '@ant-design/icons';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';
import moment from 'moment';
import { DATE_TIME } from '@app/constants/appConstants';
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

const treeStyle = {
  width: '96%',
  margin: '0 2%',
  padding: '0.5rem',
  borderRadius: '0.25rem',
  border: '1px solid #d9d9d9',
  backgroundColor: '#fff',
};

let treeData: DataNode[] = [];
let attributeChoiceAndAttachmentsData: any[] = [];
const attributeChoiceAttachments: any[] = [];

const RequestDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { requestId, possibleClientId, brokerId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [hasPermissions, setHasPermissions] = useState({
    offers: false,
    suitable: false,
    company: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Offer.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        offers: true,
      }));
    }

    if (userPermissions.includes('Company.List') || userPermissions.includes('CompanyBranch.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        suitable: true,
      }));
    }

    if (userPermissions.includes('Company.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        company: true,
      }));
    }
  }, [userPermissions]);

  const { refetch, isRefetching } = useQuery(['getRequestById'], () =>
    getRequestById(requestId ? requestId : possibleClientId)
      .then((data) => {
        const result = data.data?.result;
        setRequestData(result);
        setLoading(!data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        setLoading(false);
      }),
  );

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  if (requestData && requestData?.services) {
    treeData = requestData?.services.map((service: any) => ({
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={27} height={27} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service ${service?.id}`,

      children: service?.subServices.map((subService: any) => ({
        title: (
          <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <Image src={subService?.attachment?.url} width={27} height={27} />
            {subService?.name}
          </span>
        ),
        key: `subService ${subService?.id}`,
        children: subService?.tools.map((tool: any) => ({
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={tool?.attachment?.url} width={27} height={27} />
              {tool?.name}
            </span>
          ),
          key: `tool ${tool?.id}`,
        })),
      })),
    }));
  }

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
    // refetchOffers();
  }, [refetch, language]);

  if (requestData && requestData?.attributeChoiceAndAttachments) {
    attributeChoiceAndAttachmentsData = requestData?.attributeChoiceAndAttachments.map(
      (attributeChoiceAndAttachmentsValue: any) => {
        attributeChoiceAndAttachmentsValue?.attachments.map((attachment: any) => {
          if (!attributeChoiceAttachments.includes(attachment)) {
            attributeChoiceAttachments.push(attachment);
          }
        });
      },
    );
  }

  return (
    <>
      {requestId && <PageTitle>{t('requests.requestInfo')}</PageTitle>}
      {possibleClientId && <PageTitle>{t('companies.possibleClientsInfo')}</PageTitle>}
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
          title={requestId ? t('requests.requestInfo') : t('companies.possibleClientsInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Row style={{ margin: '2rem 0' }}>
              <ColStyle>
                <h3> {t('requests.source')} :</h3>
              </ColStyle>
              <ColStyle>
                <h3> {t('requests.destination')} :</h3>
              </ColStyle>
            </Row>

            <Details>
              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.name')}</DetailsTitle>
                          <DetailsValue>{request?.fullName}</DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.name')}</DetailsTitle>
                          <DetailsValue>{request?.fullName}</DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>
              <DetailsRow>
                {requestData?.requestForQuotationContacts.map((request: any) => {
                  return (
                    <>
                      {request?.requestForQuotationContactType == '1' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                          <DetailsValue>{request?.dailCode + '  ' + request?.phoneNumber}</DetailsValue>
                        </ColStyle>
                      )}
                      {request?.requestForQuotationContactType == '2' && (
                        <ColStyle>
                          <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                          <DetailsValue>{request?.dailCode + '  ' + request?.phoneNumber}</DetailsValue>
                        </ColStyle>
                      )}
                    </>
                  );
                })}
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.country')} </DetailsTitle>
                  <DetailsValue>{requestData?.sourceCity?.country?.name}</DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.country')} </DetailsTitle>
                  <DetailsValue>{requestData?.destinationCity?.country?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.city')} </DetailsTitle>
                  <DetailsValue>{requestData?.sourceCity?.name}</DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.city')} </DetailsTitle>
                  <DetailsValue>{requestData?.destinationCity?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.address')} </DetailsTitle>
                  <DetailsValue>{requestData?.sourceAddress}</DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.address')} </DetailsTitle>
                  <DetailsValue>{requestData?.destinationAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle> {t('requests.moveAtUtc')} </DetailsTitle>
                  <DetailsValue>{requestData?.moveAtUtc} </DetailsValue>
                </ColStyle>
                <ColStyle>
                  <DetailsTitle> {t('requests.arrivalAtUtc')} </DetailsTitle>
                  <DetailsValue>{requestData?.arrivalAtUtc}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              {treeData.length > 0 ? (
                <>
                  <DetailsTitle style={{ margin: '0 2%' }}>{t('requests.services')}</DetailsTitle>
                  <Tree
                    className="specialTree"
                    key={100}
                    style={treeStyle}
                    defaultExpandAll
                    defaultExpandParent
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onExpand={onExpand}
                    treeData={treeData as DataNode[]}
                  />
                </>
              ) : (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {t('requests.services')}
                  </DetailsTitle>
                  <DetailsValue
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    ___
                  </DetailsValue>
                </DetailsRow>
              )}
              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.companyUser')} :
              </h3>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.fullName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{requestData?.user?.registrationFullName ?? '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{requestData?.user?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{requestData?.user?.phoneNumber ?? '___'}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.userName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{requestData?.user?.userName}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.creationTime')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{moment(requestData?.user?.creationTime).format(DATE_TIME)}</DetailsValue>
                </ColStyle>
              </DetailsRow>
              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('requests.additionalInfo')} :
              </h3>
              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.comment')}
                </DetailsTitle>
                <DetailsValue
                  style={
                    isDesktop || isTablet
                      ? { width: '46%', margin: '0 2%', wordBreak: 'break-word' }
                      : { width: '80%', margin: '0 10%', wordBreak: 'break-word' }
                  }
                >
                  {requestData?.comment ?? t('requests.nocomment')}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.creationTime')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {moment(requestData?.creationTime).format(DATE_TIME)}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.lastModificationTime')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.lastModificationTime == null ? '___' : requestData?.lastModificationTime}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.userCreator')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.user?.fullName == ' ' ? '___' : requestData?.user?.fullName}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.userType')}
                </DetailsTitle>

                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.user?.type === 1
                    ? 'Admin'
                    : requestData?.user?.type === 2
                    ? 'BasicUser'
                    : requestData?.user?.type === 3
                    ? 'CompanyUser'
                    : requestData?.user?.type === 4
                    ? 'CustomerService'
                    : 'CompanyBranchUser'}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('requests.statues')}
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {requestData?.statues === 1 && (
                    <Tag key={requestData?.id} color="#30af5b" style={{ padding: '4px' }}>
                      {t('requests.checking')}
                    </Tag>
                  )}
                  {requestData?.statues === 2 && (
                    <Tag key={requestData?.id} color="#01509a" style={{ padding: '4px' }}>
                      {t('requests.approved')}
                    </Tag>
                  )}
                  {requestData?.statues === 3 && (
                    <Tag key={requestData?.id} color="#ff5252" style={{ padding: '4px' }}>
                      {t('requests.rejected')}
                    </Tag>
                  )}
                  {requestData?.statues === 4 && (
                    <Tag key={requestData?.id} color="#546E7A" style={{ padding: '4px' }}>
                      {t('requests.possible')}
                    </Tag>
                  )}
                  {requestData?.statues === 5 && (
                    <Tag key={requestData?.id} color="#f9a3a4" style={{ padding: '4px' }}>
                      {t('requests.hasOffers')}
                    </Tag>
                  )}
                  {requestData?.statues === 6 && (
                    <Tag key={requestData?.id} color="#2b908f" style={{ padding: '4px' }}>
                      {t('requests.inProcess')}
                    </Tag>
                  )}
                  {requestData?.statues === 7 && (
                    <Tag key={requestData?.id} color="#73d13d" style={{ padding: '4px' }}>
                      {t('requests.FinishByCompany')}
                    </Tag>
                  )}
                  {requestData?.statues === 8 && (
                    <Tag key={requestData?.id} color="#90ee7e" style={{ padding: '4px' }}>
                      {t('requests.FinishByUser')}
                    </Tag>
                  )}
                  {requestData?.statues === 9 && (
                    <Tag key={requestData?.id} color="#d4526e" style={{ padding: '4px' }}>
                      {t('requests.NotFinishByUser')}
                    </Tag>
                  )}
                  {requestData?.statues === 10 && (
                    <Tag key={requestData?.id} color="#33b2df" style={{ padding: '4px' }}>
                      {t('requests.Finished')}
                    </Tag>
                  )}
                  {requestData?.statues === 11 && (
                    <Tag key={requestData?.id} color="#faad14" style={{ padding: '4px' }}>
                      {t('requests.canceled')}
                    </Tag>
                  )}
                  {requestData?.statues === 12 && (
                    <Tag key={requestData?.id} color="#f48024" style={{ padding: '4px' }}>
                      {t('requests.CanceledAfterRejectOffers')}
                    </Tag>
                  )}
                  {requestData?.statues === 13 && (
                    <Tag key={requestData?.id} color="#A5978B" style={{ padding: '4px' }}>
                      {t('requests.OutOfPossible')}
                    </Tag>
                  )}
                </DetailsValue>
              </DetailsRow>

              {/* companiesThatBoughtInfo */}
              {hasPermissions.company && (requestData?.statues === 4 || requestData?.statues === 13) && (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {t('requests.companiesWitchBoughtInfo')}
                  </DetailsTitle>

                  <DetailsValue
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <Tooltip
                      placement={language == 'en' ? 'right' : 'left'}
                      title={t('requests.companiesWitchBoughtInfo')}
                    >
                      <TableButton
                        severity="success"
                        onClick={() => {
                          Navigate(`companiesThatBoughtInfo`);
                        }}
                      >
                        <BankOutlined />
                      </TableButton>
                    </Tooltip>
                  </DetailsValue>
                </DetailsRow>
              )}

              {/* suitableCompanies&Branches */}
              {hasPermissions.suitable &&
                requestData?.statues != 1 &&
                requestData?.statues != 3 &&
                requestData?.statues != 11 &&
                !possibleClientId &&
                !brokerId && (
                  <DetailsRow>
                    <DetailsTitle
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      {t('requests.suitableCompanies&Branches')}
                    </DetailsTitle>

                    <DetailsValue
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Tooltip
                        placement={language == 'en' ? 'right' : 'left'}
                        title={t('requests.suitableCompanies&Branches')}
                      >
                        <TableButton
                          severity="success"
                          onClick={() => {
                            Navigate(`wasSent/2`);
                          }}
                        >
                          <BankOutlined />
                        </TableButton>
                      </Tooltip>
                    </DetailsValue>
                  </DetailsRow>
                )}

              {/* reasonRefuse */}
              {requestData?.statues == 3 && requestData?.reasonRefuse && (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {t('requests.reasonRefuseRequest')}
                  </DetailsTitle>

                  <DetailsValue
                    style={
                      isDesktop || isTablet
                        ? { width: '46%', margin: '0 2%', color: '#ff5252' }
                        : { width: '80%', margin: '0 10%', color: '#ff5252' }
                    }
                  >
                    {requestData?.reasonRefuse}
                  </DetailsValue>
                </DetailsRow>
              )}

              {/* offers */}
              {hasPermissions.offers && requestData?.statues == 5 && !possibleClientId && (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {t('requests.offersThatHeHad')}
                  </DetailsTitle>
                  <DetailsValue
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <Tooltip placement={language == 'en' ? 'right' : 'left'} title={t('requests.offerDetails')}>
                      <TableButton
                        severity="success"
                        onClick={() => {
                          Navigate(`offers/offersThatHeHave`);
                        }}
                      >
                        <TagOutlined />
                      </TableButton>
                    </Tooltip>
                  </DetailsValue>
                </DetailsRow>
              )}

              {/* offers */}
              {(requestData?.statues == 6 ||
                requestData?.statues == 7 ||
                requestData?.statues == 8 ||
                requestData?.statues == 9 ||
                requestData?.statues == 10) &&
                requestData?.selectedOfferId &&
                !possibleClientId &&
                !brokerId &&
                hasPermissions.offers && (
                  <DetailsRow>
                    <DetailsTitle
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      {t('requests.acceptedOffer')}
                    </DetailsTitle>
                    <DetailsValue
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Tooltip placement={language == 'en' ? 'right' : 'left'} title={t('requests.offerDetails')}>
                        <TableButton
                          severity="success"
                          onClick={() => {
                            Navigate(`${requestData?.selectedOfferId}/details`);
                          }}
                        >
                          <TagOutlined />
                        </TableButton>
                      </Tooltip>
                    </DetailsValue>
                  </DetailsRow>
                )}

              {/* Rejected offers  */}
              {(requestData?.statues == 4 ||
                requestData?.statues == 6 ||
                requestData?.statues == 7 ||
                requestData?.statues == 8 ||
                requestData?.statues == 9 ||
                requestData?.statues == 10 ||
                requestData?.statues == 12 ||
                requestData?.statues == 13) &&
                !possibleClientId &&
                !brokerId &&
                hasPermissions.offers && (
                  <DetailsRow>
                    <DetailsTitle
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      {t('requests.rejectedoffers')}
                    </DetailsTitle>

                    <DetailsValue
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Tooltip placement={language == 'en' ? 'right' : 'left'} title={t('requests.rejectedoffers')}>
                        <TableButton
                          severity="error"
                          onClick={() => {
                            Navigate(`offers/rejectedoffers`);
                          }}
                        >
                          <StopOutlined />
                        </TableButton>
                      </Tooltip>
                    </DetailsValue>
                  </DetailsRow>
                )}

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('requests.sourceType')} :
              </h3>
              <Card style={{ width: '100%', margin: '1rem 0' }}>
                <Meta
                  avatar={<Image src={requestData?.sourceType?.attachment?.url} />}
                  title={requestData?.sourceType?.name}
                  description={requestData?.attributeForSourceTypeValues.map((attributeForSourceTypeValue: any) => (
                    <Col
                      key={attributeForSourceTypeValue?.attributeForSourcType?.id}
                      style={
                        isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <h6>{attributeForSourceTypeValue?.attributeForSourcType?.name}</h6>
                      <p>{attributeForSourceTypeValue?.attributeChoice?.name}</p>
                    </Col>
                  ))}
                />
              </Card>
              {requestData?.attributeChoiceAndAttachments.length > 0 && (
                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('requests.attachments')} :
                </h3>
              )}
              {requestData?.attributeChoiceAndAttachments.map((attributeChoiceAndAttachmentsValue: any) => (
                <Col key={attributeChoiceAndAttachmentsValue?.attributeChoice?.id}>
                  <Card style={{ width: '100%', margin: '1rem 0', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <h4 style={{ margin: '2% 1rem' }}>{attributeChoiceAndAttachmentsValue?.attributeChoice?.name} :</h4>
                    {attributeChoiceAndAttachmentsValue?.attachments.length == 0 ? (
                      <h5 style={{ margin: '0 2% 1rem', color: '#ff5252' }}>{t('requests.noAttachments')}</h5>
                    ) : (
                      attributeChoiceAndAttachmentsValue?.attachments.map((attachment: any) => (
                        <Image key={attachment?.id} src={attachment?.url} style={{ width: '150px' }} />
                      ))
                    )}
                  </Card>
                </Col>
              ))}
              {requestData?.attachments.length > 0 && (
                <>
                  <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('requests.additionalAttachments')} :</h3>
                  <Card style={{ width: '100%', margin: '1rem 0', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <Row>
                      {requestData?.attachments.map((attachment: any) => (
                        <Col span={6} key={attachment?.id}>
                          <Image src={attachment?.url} style={{ width: '150px' }} />
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </>
              )}
              {requestData?.finishedRequestAttachmentByCompany.length > 0 && (
                <>
                  <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('requests.attachmentsFromCompany')} :</h3>
                  <Card style={{ width: '100%', margin: '1rem 0', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <Row>
                      {requestData?.finishedRequestAttachmentByCompany.map((attachmentByCompany: any) => (
                        <Col span={6} key={attachmentByCompany?.id}>
                          <Image src={attachmentByCompany?.url} style={{ width: '150px' }} />
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </>
              )}
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default RequestDetails;
