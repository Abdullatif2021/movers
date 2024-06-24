import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image, Space, Progress, Avatar, Segmented, Tooltip, Tag, Col } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { getBranch } from '@app/services/branches';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { DataNode } from 'antd/es/tree';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
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
import { getDayName } from '@app/components/functions/GetDayName';
import { DATE_TIME } from '@app/constants/appConstants';
import moment from 'moment';

export type specifierType = {
  name: string;
  value: number | undefined;
};

export type branchData = {
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

const BranchDetails: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { branchId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const { refetch, isRefetching } = useQuery(['getBranch'], () =>
    getBranch(branchId)
      .then((data) => {
        const result = data.data?.result;
        setBranchData(result);
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

  if (branchData && branchData?.services) {
    treeData = branchData?.services.map((service: any) => ({
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
  }, [refetch, language, refetchData]);

  return (
    <>
      <PageTitle>{t('branch.branchInfo')}</PageTitle>
      <Row justify={'end'} align={'middle'}>
        <Btn
          style={{
            margin: '0 .5rem .5rem 0',
            width: 'auto',
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
          title={t('branch.branchInfo')}
          padding="0 1.25rem 1rem 1.25rem"
          style={{ width: '100%', height: 'auto' }}
        >
          <Spinner spinning={loading}>
            <Details>
              <h3 style={{ paddingTop: '2rem', margin: '0 2% 1rem' }}>{t('branch.branchProfile')} :</h3>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.name')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.address')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.address}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.bio')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.bio}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.country')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.region?.city?.country?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.city')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.region?.city?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.region')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.region?.name}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.availableCities')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {branchData?.availableCities.length > 0
                    ? branchData?.availableCities.map((city: any) => (
                        <DetailsValue key={city?.id}>{city?.name + ' / ' + city?.country?.name}</DetailsValue>
                      ))
                    : '___'}
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.numberOfTransfers')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.numberOfTransfers}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.acceptRequests')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>
                    {branchData?.acceptRequests == true ? (
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
                    {branchData?.acceptPossibleRequests == true ? (
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
              {(branchData?.statues == 3 || branchData?.statues == 4) && branchData?.reasonRefuse && (
                <DetailsRow>
                  <DetailsTitle
                    style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}
                  >
                    {branchData?.statues == 3 ? t('branch.reasonRejectBranch') : t('branch.reasonReturnBranch')}
                  </DetailsTitle>

                  <DetailsValue
                    style={
                      isDesktop || isTablet
                        ? { width: '46%', margin: '0 2%', color: '#ff5252' }
                        : { width: '80%', margin: '0 10%', color: '#ff5252' }
                    }
                  >
                    {branchData?.reasonRefuse}
                  </DetailsValue>
                </DetailsRow>
              )}

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.timeOfWorks')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  {branchData?.timeOfWorks?.map((item: any, index: number) => {
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
                          <p> {branchData?.numberOfPaidPoints} </p>
                        </div>
                      ),
                      value: 'user1',
                    },
                    {
                      label: (
                        <div style={{ padding: 4, height: 'fit-content' }}>
                          <Avatar style={{ backgroundColor: '#f56a00' }} icon={<GiftOutlined />} />
                          <p> {t('companies.numberOfGiftedPoints')} </p>
                          <p> {branchData?.numberOfGiftedPoints} </p>
                        </div>
                      ),
                      value: 'user2',
                    },
                    {
                      label: (
                        <div style={{ padding: 4, height: 'fit-content' }}>
                          <Avatar style={{ backgroundColor: '#30af5b' }} icon={<DropboxOutlined />} />
                          <p> {t('companies.totalPoints')} </p>
                          <p> {branchData?.totalPoints} </p>
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
                  percent={branchData?.generalRating?.quality * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.quality')} </h6>
                    </p>
                  )}
                  strokeColor={conicBlueColors}
                />
                <Progress
                  type="circle"
                  percent={branchData?.generalRating?.overallRating * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.overallRating')} </h6>
                    </p>
                  )}
                  strokeColor={conicPinkColors}
                />
                <Progress
                  type="circle"
                  percent={branchData?.generalRating?.customerService * 10}
                  format={(percent) => (
                    <p>
                      {percent?.toFixed(0)} <h6> {t('companies.customerService')} </h6>
                    </p>
                  )}
                  strokeColor={conicGreenColors}
                />
                <Progress
                  type="circle"
                  percent={branchData?.generalRating?.valueOfServiceForMoney * 10}
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
                    {branchData?.companyContact?.dialCode + ' ' + branchData?.companyContact?.phoneNumber}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.companyContact?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.webSite')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.companyContact?.webSite}</DetailsValue>
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
                    {branchData?.user?.registrationFullName == ' ' ? '___' : branchData?.user?.registrationFullName}
                  </DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.emailAddress')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.emailAddress}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('common.phoneNumber')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.phoneNumber}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.userName')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{branchData?.user?.userName}</DetailsValue>
                </ColStyle>
              </DetailsRow>

              <DetailsRow>
                <ColStyle>
                  <DetailsTitle>{t('companies.creationTime')}</DetailsTitle>
                </ColStyle>
                <ColStyle>
                  <DetailsValue>{moment(branchData?.user?.creationTime).format(DATE_TIME)}</DetailsValue>
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
            </Details>
          </Spinner>
        </Cardd>
      </Row>
    </>
  );
};

export default BranchDetails;
