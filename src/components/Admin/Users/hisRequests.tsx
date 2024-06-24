import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Radio, RadioChangeEvent, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery } from 'react-query';
import { TagOutlined, LeftOutlined } from '@ant-design/icons';
import { getAllRequests } from '@app/services/requests';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { notificationController } from '@app/controllers/notificationController';
import { Header, TextBack } from '../../GeneralStyles';
import { RequestModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { RadioGroup } from '@app/components/common/Radio/Radio';
import { REQUEST_STATUS } from '@app/constants/appConstants';
import Tag from 'antd/es/tag';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const HisRequests: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { type, brokerId, userId } = useParams();
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<RequestModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [requestStatus, setRequestStatus] = useState<any>();
  const [temp, setTemp] = useState<any>();
  const [hasPermissions, setHasPermissions] = useState({
    details: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Request.Get')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        details: true,
      }));
    }
  }, [userPermissions]);

  const { refetch, isRefetching } = useQuery(
    ['HisRequests', type, brokerId, page, pageSize],
    () =>
      getAllRequests(type, brokerId, page, pageSize, searchString, requestStatus, userId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSource(result);
          setTotalCount(data.data.result?.totalCount);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataSource === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, language, searchString, requestStatus, refetchData]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>,
      render: (record: RequestModel) => {
        return <>{record?.user?.registrationFullName}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.userName')}</Header>,
      render: (record: RequestModel) => {
        return <>{record?.user?.userName}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.sourceCity')}</Header>,
      dataIndex: 'sourceCity',
      render: (record: RequestModel) => {
        return <>{record?.name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.destinationCity')}</Header>,
      dataIndex: 'destinationCity',
      render: (record: RequestModel) => {
        return <>{record?.name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.serviceType')}</Header>,
      dataIndex: 'serviceType',
      render: (record: number) => {
        return (
          <>
            {record == 0
              ? '___'
              : record == 1
              ? t('requests.Internal')
              : record == 2
              ? t('requests.External')
              : `${t('requests.Internal')} & ${t('requests.External')}`}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.sourceType')}</Header>,
      dataIndex: 'sourceType',
      render: (record: any) => {
        return <>{record?.name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.status')}</Header>,
      dataIndex: 'status',
      render: (index: number, record: RequestModel) => {
        return (
          <>
            {record.statues === 1 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('requests.checking')}
              </Tag>
            )}
            {record.statues === 2 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('requests.approved')}
              </Tag>
            )}
            {record.statues === 3 && (
              <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
                {t('requests.rejected')}
              </Tag>
            )}
            {record.statues === 4 && (
              <Tag key={record?.id} color="#546E7A" style={{ padding: '4px' }}>
                {t('requests.possible')}
              </Tag>
            )}
            {record.statues === 5 && (
              <Tag key={record?.id} color="#f9a3a4" style={{ padding: '4px' }}>
                {t('requests.hasOffers')}
              </Tag>
            )}
            {record.statues === 6 && (
              <Tag key={record?.id} color="#2b908f" style={{ padding: '4px' }}>
                {t('requests.inProcess')}
              </Tag>
            )}
            {record.statues === 7 && (
              <Tag key={record?.id} color="#73d13d" style={{ padding: '4px' }}>
                {t('requests.FinishByCompany')}
              </Tag>
            )}
            {record.statues === 8 && (
              <Tag key={record?.id} color="#90ee7e" style={{ padding: '4px' }}>
                {t('requests.FinishByUser')}
              </Tag>
            )}
            {record.statues === 9 && (
              <Tag key={record?.id} color="#d4526e" style={{ padding: '4px' }}>
                {t('requests.NotFinishByUser')}
              </Tag>
            )}
            {record.statues === 10 && (
              <Tag key={record?.id} color="#33b2df" style={{ padding: '4px' }}>
                {t('requests.Finished')}
              </Tag>
            )}
            {record?.statues === 11 && (
              <Tag key={record?.id} color="#faad14" style={{ padding: '4px' }}>
                {t('requests.canceled')}
              </Tag>
            )}
            {record?.statues === 12 && (
              <Tag key={record?.id} color="#f48024" style={{ padding: '4px' }}>
                {t('requests.CanceledAfterRejectOffers')}
              </Tag>
            )}
            {record?.statues === 13 && (
              <Tag key={record?.id} color="#A5978B" style={{ padding: '4px' }}>
                {t('requests.OutOfPossible')}
              </Tag>
            )}
            {record?.statues === 14 && (
              <Tag key={record?.id} color="#ff00fa" style={{ padding: '4px' }}>
                {t('requests.CanceledAfterInProcess')}
              </Tag>
            )}
            {record?.statues === 15 && (
              <Tag key={record?.id} color="#ba4e63" style={{ padding: '4px' }}>
                {t('requests.RejectedNeedToEdit')}
              </Tag>
            )}
          </>
        );
      },
      filterDropdown: () => {
        const fontSize = isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs;
        return (
          <div style={{ padding: 8 }}>
            <RadioGroup
              size="small"
              onChange={(e: RadioChangeEvent) => {
                setTemp(e.target.value);
              }}
              value={temp}
            >
              {REQUEST_STATUS.map((item: any, index: number) => {
                return (
                  <Radio key={index} style={{ display: 'block', fontSize }} value={item.type}>
                    {t(`requests.${item.name}`)}
                  </Radio>
                );
              })}
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setRequestStatus(undefined);
                  }}
                >
                  {t('common.reset')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="primary"
                  style={{ fontSize, fontWeight: '400' }}
                  onClick={() => setRequestStatus(temp)}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    hasPermissions.details && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: RequestModel) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`${record.id}/details`, { state: record.name });
                }}
              >
                <TagOutlined />
              </TableButton>
            </Tooltip>
          </Space>
        );
      },
    },
  ].filter(Boolean);

  return (
    <>
      <Card
        title={t('requests.requestsList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
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
          <ReloadBtn setRefetchData={setRefetchData} />
        </Row>

        <Table
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            current: page,
            pageSize: pageSize,
            showQuickJumper: true,
            responsive: true,
            showTitle: false,
            showLessItems: true,
            total: totalCount || 0,
            hideOnSinglePage: false,
          }}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          loading={loading}
          dataSource={dataSource}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>
    </>
  );
};
