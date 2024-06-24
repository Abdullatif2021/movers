import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image, Tag, Space, Progress, Avatar, Segmented, Tooltip, Col } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getCompanyById } from '@app/services/companies';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { DataNode } from 'antd/es/tree';
import { Button } from '@app/components/common/buttons/Button/Button';
import {
  CheckOutlined,
  CloseOutlined,
  CommentOutlined,
  DollarOutlined,
  DropboxOutlined,
  GiftOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { TableButton, TextBack } from '@app/components/GeneralStyles';
import moment from 'moment';
import { DATE_TIME } from '@app/constants/appConstants';
import { DaysOfWeek } from '@app/constants/enums/dayOfWeek';
import { getDayName } from '@app/components/functions/GetDayName';

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

const CompanyDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { companyId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { refetch, isRefetching } = useQuery(['getCompanyById'], () =>
    getCompanyById(companyId)
      .then((data) => {
        const result = data.data?.result;
        setCompanyData(result);
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

  if (companyData && companyData?.services) {
    treeData = companyData?.services.map((service: any) => ({
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

  const conicPinkColors = { '0%': '#ffba6f', '50%': '#ff6f61', '100%': '#ff4369' };
  const conicGreenColors = { '0%': '#f6ff00', '50%': '#b3ff00', '100%': '#73d13d' };
  const conicBlueColors = { '0%': '#a6dcef', '50%': '#2e93e5', '100%': '#0050b3' };
  const conicRedColors = { '0%': '#ffbb96', '50%': '#ff6b45', '100%': '#e62b1d' };

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
      <PageTitle>{t('companies.companyInfo')}</PageTitle>
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
          title={t('companies.companyInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('companies.companyProfile')} :</h3>

              <DetailsTitle style={{ textAlign: 'center' }}>{t('companies.logo')}</DetailsTitle>
              <Row style={{ margin: 'auto' }}>
                <Image
                  key={companyData?.companyProfile?.id}
                  src={companyData?.companyProfile?.url}
                  style={{ width: '150px', height: '140px' }}
                />
              </Row>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.name')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.address')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.address}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.bio')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.bio}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.country')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.region?.city?.country?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.city')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.region?.city?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.region')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.region?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.availableCities')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {companyData?.availableCities.length > 0
                    ? companyData?.availableCities.map((city: any) => (
                        <DetailsValue key={city?.id}>{city?.name + ' / ' + city?.country?.name}</DetailsValue>
                      ))
                    : '___'}
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.companyBranches')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {companyData?.companyBranches.length > 0
                    ? companyData?.companyBranches.map((branch: any, index: number) => (
                        <DetailsValue key={branch?.id}>
                          {index + 1}-{branch?.name}
                        </DetailsValue>
                      ))
                    : '___'}
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.numberOfTransfers')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.numberOfTransfers}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.acceptRequests')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {companyData?.acceptRequests == true ? (
                      <TableButton severity="success">
                        <CheckOutlined />
                      </TableButton>
                    ) : (
                      <TableButton severity="error">
                        <CloseOutlined />
                      </TableButton>
                    )}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.acceptPossibleRequests')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {companyData?.acceptPossibleRequests == true ? (
                      <TableButton severity="success">
                        <CheckOutlined />
                      </TableButton>
                    ) : (
                      <TableButton severity="error">
                        <CloseOutlined />
                      </TableButton>
                    )}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              {/* reasonRefuse */}
              {(companyData?.statues == 3 || companyData?.statues == 4) && companyData?.reasonRefuse && (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {companyData?.statues == 3 ? t('companies.reasonRejectCompany') : t('requests.reasonReturnCompany')}
                  </DetailsTitle>

                  <DetailsValue
                    style={
                      isDesktop || isTablet
                        ? { width: '46%', margin: '0 2%', color: '#ff5252' }
                        : { width: '80%', margin: '0 10%', color: '#ff5252' }
                    }
                  >
                    {companyData?.reasonRefuse}
                  </DetailsValue>
                </DetailsRow>
              )}

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.timeOfWorks')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {companyData?.timeOfWorks?.map((item: any, index: number) => {
                    return (
                      <DetailsValue key={index}>
                        <Tag key={item.id} style={{ minWidth: '180px' }}>
                          <Row justify={'space-between'}>
                            <Col span={14}>{getDayName(item.day, t)}</Col>
                            <Col span={10}>
                              {item.startDate} - {item.endDate}
                            </Col>
                          </Row>
                        </Tag>
                      </DetailsValue>
                    );
                  })}
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.status')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {companyData?.statues === 1 ? (
                      <Tag color="#30af5b" style={{ padding: '4px' }}>
                        {t('companies.checking')}
                      </Tag>
                    ) : companyData?.statues === 2 ? (
                      <Tag color="#01509a" style={{ padding: '4px' }}>
                        {t('companies.approved')}
                      </Tag>
                    ) : companyData?.statues === 3 ? (
                      <Tag color="#ff5252" style={{ padding: '4px' }}>
                        {t('companies.rejected')}
                      </Tag>
                    ) : (
                      '_'
                    )}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.points')} :
              </h3>

              <Space
                direction="vertical"
                style={{ display: 'flex', gap: '8px', flexDirection: 'row', justifyContent: 'space-around' }}
              >
                <Segmented
                  className="Segmented"
                  options={[
                    {
                      label: (
                        <div style={{ padding: 4, height: 'fit-content' }}>
                          <Avatar style={{ backgroundColor: '#01509a' }} icon={<DollarOutlined />} />
                          <p> {t('companies.numberOfPaidPoints')} </p>
                          <p> {companyData?.numberOfPaidPoints} </p>
                        </div>
                      ),
                      value: 'user1',
                    },
                    {
                      label: (
                        <div style={{ padding: 4, height: 'fit-content' }}>
                          <Avatar style={{ backgroundColor: '#f56a00' }} icon={<GiftOutlined />} />
                          <p> {t('companies.numberOfGiftedPoints')} </p>
                          <p> {companyData?.numberOfGiftedPoints} </p>
                        </div>
                      ),
                      value: 'user2',
                    },
                    {
                      label: (
                        <div style={{ padding: 4, height: 'fit-content' }}>
                          <Avatar style={{ backgroundColor: '#30af5b' }} icon={<DropboxOutlined />} />
                          <p> {t('companies.totalPoints')} </p>
                          <p> {companyData?.totalPoints} </p>
                        </div>
                      ),
                      value: 'user3',
                    },
                  ]}
                />
              </Space>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.evaluation')} :
              </h3>

              <ColStyle>
                <DetailsTitle>{t('companies.generalRating')} :</DetailsTitle>
              </ColStyle>
              <Space wrap style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: '3rem' }}>
                <Progress
                  type="circle"
                  percent={companyData?.generalRating?.quality * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.quality')} </h6>
                    </p>
                  )}
                  strokeColor={conicBlueColors}
                />
                <Progress
                  type="circle"
                  percent={companyData?.generalRating?.overallRating * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.overallRating')} </h6>
                    </p>
                  )}
                  strokeColor={conicPinkColors}
                />

                <Progress
                  type="circle"
                  percent={companyData?.generalRating?.customerService * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.customerService')} </h6>
                    </p>
                  )}
                  strokeColor={conicGreenColors}
                />
                <Progress
                  type="circle"
                  percent={companyData?.generalRating?.valueOfServiceForMoney * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.valueOfServiceForMoney')} </h6>
                    </p>
                  )}
                  strokeColor={conicRedColors}
                />
              </Space>

              <DetailsRow>
                <DetailsTitle
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  {t('companies.reviewsDetails')} :
                </DetailsTitle>
                <DetailsValue
                  style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                >
                  <Tooltip placement={language == 'en' ? 'right' : 'left'} title={t('companies.reviewsDetails')}>
                    <TableButton
                      severity="success"
                      onClick={() => {
                        Navigate(`reviewsDetails`);
                      }}
                    >
                      <CommentOutlined />
                    </TableButton>
                  </Tooltip>
                </DetailsValue>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.companyContact')} :
              </h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {companyData?.companyContact?.dialCode + ' ' + companyData?.companyContact?.phoneNumber}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.companyContact?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.webSite')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.companyContact?.webSite}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.companyUser')} :
              </h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.fullName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {companyData?.user?.registrationFullName == ' ' ? '___' : companyData?.user?.registrationFullName}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.user?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.user?.phoneNumber}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.userName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{companyData?.user?.userName}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.creationTime')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{moment(companyData?.user?.creationTime).format(DATE_TIME)}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.services')} :
              </h3>

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

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('requests.comment')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue style={{ wordBreak: 'break-word' }}>
                    {companyData?.comment ?? t('requests.nocomment')}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                {t('companies.attachments')} :
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ColStyle>
                  <DetailsTitle style={{ textAlign: 'center', marginTop: '2rem' }}>
                    {t('companies.companyOwnerIdentity')}
                  </DetailsTitle>
                </ColStyle>
                <Row>
                  {companyData?.companyOwnerIdentity.map((attachment: any) => (
                    <div key={attachment?.id}>
                      {attachment.url.includes('.pdf') ? (
                        <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                          <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                        </a>
                      ) : (
                        <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                      )}
                    </div>
                  ))}
                </Row>

                <ColStyle>
                  <DetailsTitle style={{ textAlign: 'center', marginTop: '2rem' }}>
                    {t('companies.companyCommercialRegister')}
                  </DetailsTitle>
                </ColStyle>
                <Row>
                  {companyData?.companyCommercialRegister.map((attachment: any) => (
                    <div key={attachment?.id}>
                      {attachment.url.includes('.pdf') ? (
                        <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                          <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                        </a>
                      ) : (
                        <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                      )}
                    </div>
                  ))}
                </Row>

                {companyData?.additionalAttachment.length > 0 && (
                  <>
                    <ColStyle>
                      <DetailsTitle style={{ textAlign: 'center', marginTop: '2rem' }}>
                        {t('companies.additionalAttachment')}
                      </DetailsTitle>
                    </ColStyle>
                    <Row>
                      {companyData?.additionalAttachment.map((attachment: any) => (
                        <div key={attachment?.id}>
                          {attachment.url.includes('.pdf') ? (
                            <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                              <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                            </a>
                          ) : (
                            <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                          )}
                        </div>
                      ))}
                    </Row>
                  </>
                )}
              </div>
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default CompanyDetails;
