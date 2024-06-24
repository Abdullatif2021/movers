import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Space, Tag, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { useQuery } from 'react-query';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { notificationController } from '@app/controllers/notificationController';
import { Header, TableButton } from '../../GeneralStyles';
import { BranchModel, RequestModel } from '@app/interfaces/interfaces';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined, TagOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';
import { getPossibleClients } from '@app/services/requests';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const PotentialClients: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { language } = useLanguage();
  const Navigate = useNavigate();
  const { companyId } = useParams();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState<BranchModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [refetchData, setRefetchData] = useState<boolean>(false);
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
    ['getPossibleClients', page, pageSize],
    () =>
      getPossibleClients(companyId, page, pageSize, searchString)
        .then((data) => {
          const result = data.data?.result?.items;
          setData(result);
          setTotalCount(data.data.result?.totalCount);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: data === undefined,
    },
  );

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, searchString, language, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && data?.length === 0) {
      setPage(1);
    }
  }, [page, data]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.services')}</Header>,
      dataIndex: 'services',
      render: (record: any) => (
        <Space style={{ display: 'grid' }}>
          {record?.map((service: any) => (
            <Tag key={service?.id}>{service?.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.sourceType')}</Header>,
      dataIndex: 'sourceType',
      render: (record: any) => {
        return <>{record?.name}</>;
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
  ];

  return (
    <>
      <Card
        title={t('companies.possibleClientsList')}
        padding={
          data === undefined || data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'} align={'middle'}>
          <Btn
            style={{
              marginBottom: '.5rem',
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
          dataSource={data}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>
    </>
  );
};
