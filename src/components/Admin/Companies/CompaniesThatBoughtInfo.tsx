import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Rate, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { useQuery } from 'react-query';
import { TagOutlined, LeftOutlined } from '@ant-design/icons';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { notificationController } from '@app/controllers/notificationController';
import { BranchModel, CompanyModal, CompanyProfile } from '@app/interfaces/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllCompanies } from '@app/services/companies';
import { getAllBranchesThatBoughtInfo } from '@app/services/branches';
import { FONT_WEIGHT } from '@app/styles/themes/constants';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { TableButton, Header, Modal, Image, TextBack } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface CompanyRecord {
  id: number;
  isFeature: boolean;
}

export const CompaniesAndBranchesThatBoughtInfo: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { desktopOnly, isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();
  const { type, requestId } = useParams();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSourceCompanies, setDataSourceCompanies] = useState<CompanyModal[] | undefined>(undefined);
  const [dataSourceBranches, setDataSourceBranches] = useState<CompanyModal[] | undefined>(undefined);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [totalCountCompanies, setTotalCountCompanies] = useState<number>(0);
  const [totalCountBranches, setTotalCountBranches] = useState<number>(0);
  const [attachmentData, setAttachmentData] = useState<CompanyProfile>();
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    detailsCompany: false,
    detailsBranch: false,
    company: false,
    branch: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Company.Get')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        detailsCompany: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.Get')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        detailsBranch: true,
      }));
    }

    if (userPermissions.includes('Company.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        company: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        branch: true,
      }));
    }
  }, [userPermissions]);

  const { refetch: refetchCompaniesThatBoughtInfo, isRefetching: isRefetchingCompaniesThatBoughtInfo } = useQuery(
    ['AllCompaniesThatBoughtInfo', page, pageSize],
    () =>
      getAllCompanies(page, pageSize, searchString, type, requestId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSourceCompanies(result);
          setTotalCountCompanies(data.data.result?.totalCountCompanies);
          setLoadingCompanies(!data.data?.success);
        })
        .catch((err) => {
          setLoadingCompanies(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: type !== undefined && requestId !== undefined,
    },
  );

  const { refetch: refetchBranchesThatBoughtInfo, isRefetching: isRefetchingBranchesThatBoughtInfo } = useQuery(
    ['AllBranchesThatBoughtInfo', page, pageSize],
    () =>
      getAllBranchesThatBoughtInfo(page, pageSize, searchString, type, requestId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSourceBranches(result);
          setTotalCountBranches(data.data.result?.totalCountBranches);
          setLoadingBranches(!data.data?.success);
        })
        .catch((err) => {
          setLoadingBranches(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: type !== undefined && requestId !== undefined,
    },
  );

  useEffect(() => {
    if (isRefetchingCompaniesThatBoughtInfo) {
      setLoadingCompanies(true);
    } else setLoadingCompanies(false);
  }, [
    isRefetchingCompaniesThatBoughtInfo,
    isRefetchingCompaniesThatBoughtInfo,
    refetchCompaniesThatBoughtInfo,
    refetchCompaniesThatBoughtInfo,
  ]);

  useEffect(() => {
    if (isRefetchingBranchesThatBoughtInfo) {
      setLoadingBranches(true);
    } else setLoadingBranches(false);
  }, [
    isRefetchingBranchesThatBoughtInfo,
    isRefetchingBranchesThatBoughtInfo,
    refetchBranchesThatBoughtInfo,
    refetchBranchesThatBoughtInfo,
  ]);

  useEffect(() => {
    setLoadingCompanies(true);
    type !== 'companiesThatBoughtInfo' && requestId === undefined && refetchCompaniesThatBoughtInfo();
    type !== undefined && requestId !== undefined && refetchCompaniesThatBoughtInfo();
  }, [page, pageSize, language, searchString, refetchData]);

  useEffect(() => {
    setLoadingBranches(true);
    type !== 'companiesThatBoughtInfo' && requestId === undefined && refetchBranchesThatBoughtInfo();
    type !== undefined && requestId !== undefined && refetchBranchesThatBoughtInfo();
  }, [page, pageSize, language, searchString, refetchData]);

  useEffect(() => {
    if (page > 1 && dataSourceCompanies?.length === 0) {
      setPage(1);
    }
  }, [page, dataSourceCompanies]);

  useEffect(() => {
    if (page > 1 && dataSourceBranches?.length === 0) {
      setPage(1);
    }
  }, [page, dataSourceBranches]);

  const columnsCompany = [
    {
      rowScope: 'row',
      render: (record: any) =>
        record.isFeature && (
          <Tooltip placement="top" title={t('requests.featured')}>
            <Rate disabled defaultValue={1} count={1} style={{ fontSize: '15px' }} />
          </Tooltip>
        ),
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.image')}</Header>,
      dataIndex: ['companyProfile', 'url'],
      render: (url: string, record: CompanyModal) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record?.companyProfile);
              }}
            />
          </>
        );
      },
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.userName')}</Header>, dataIndex: ['user', 'userName'] },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.region')}</Header>,
      dataIndex: ['region', 'name'],
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.commission')}</Header>,
      dataIndex: 'commissionGroup',
      render: (record: CompanyModal) => {
        return <> {record || record == 0 ? record + '%' : ''}</>;
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    hasPermissions.detailsCompany && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
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

  const columnsBranch = [
    {
      rowScope: 'row',
      render: (record: any) =>
        record.isFeature && (
          <Tooltip placement="top" title={t('requests.featured')}>
            <Rate disabled defaultValue={1} count={1} style={{ fontSize: '15px' }} />
          </Tooltip>
        ),
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.userName')}</Header>, dataIndex: ['user', 'userName'] },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.region')}</Header>,
      dataIndex: ['region', 'name'],
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.commission')}</Header>,
      dataIndex: 'commissionForBranchWithOutCompany',
      render: (record: BranchModel) => {
        return <> {record || record == 0 ? record + '%' : ''}</>;
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    hasPermissions.detailsBranch && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`${record?.company?.id}/branches/${record?.id}/details`, { state: record.name });
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
      {hasPermissions.company && (
        <Card
          title={t('companies.companiesList')}
          padding={
            dataSourceCompanies === undefined ||
            dataSourceCompanies?.length === 0 ||
            (page === 1 && totalCountCompanies <= pageSize)
              ? '1.25rem 1.25rem 1.25rem'
              : '1.25rem 1.25rem 0'
          }
          style={{ height: 'auto', marginBottom: '70px' }}
        >
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

            <ReloadBtn setRefetchData={setRefetchData} />

            {/*    Image    */}
            {isOpenSliderImage ? (
              <Modal
                size={isDesktop || isTablet ? 'medium' : 'small'}
                open={isOpenSliderImage}
                onCancel={() => setIsOpenSliderImage(false)}
                footer={null}
                closable={false}
                destroyOnClose
              >
                <AntdImage
                  preview={false}
                  style={{ borderRadius: '.3rem' }}
                  src={attachmentData !== undefined ? attachmentData.url : ''}
                  size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
                />
              </Modal>
            ) : null}
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
              total: totalCountCompanies || 0,
              hideOnSinglePage: false,
            }}
            columns={columnsCompany.map((col) => ({ ...col, width: 'auto' }))}
            loading={loadingCompanies}
            dataSource={dataSourceCompanies}
            scroll={{ x: isTablet || isMobile ? 950 : 800 }}
            rowKey={(record: CompanyRecord) => record.id.toString()}
          />
        </Card>
      )}

      {hasPermissions.branch && (
        <Card
          title={t('branch.branchesList')}
          padding={
            dataSourceBranches === undefined ||
            dataSourceBranches?.length === 0 ||
            (page === 1 && totalCountBranches <= pageSize)
              ? '1.25rem 1.25rem 1.25rem'
              : '1.25rem 1.25rem 0'
          }
          style={{ height: 'auto', marginBottom: '70px' }}
        >
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
              total: totalCountBranches || 0,
              hideOnSinglePage: false,
            }}
            columns={columnsBranch.map((col) => ({ ...col, width: 'auto' }))}
            loading={loadingBranches}
            dataSource={dataSourceBranches}
            scroll={{ x: isTablet || isMobile ? 950 : 800 }}
            rowKey={(record: CompanyRecord) => record.id.toString()}
          />
        </Card>
      )}
    </>
  );
};
