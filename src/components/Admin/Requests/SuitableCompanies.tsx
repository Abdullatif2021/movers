import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Badge, Rate, Row, Space, Tooltip, message } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { notificationController } from '@app/controllers/notificationController';
import { RequestModel } from '@app/interfaces/interfaces';
import { CreateButtonText, Header, Image, Modal, TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllSuitableCompanies, getSuitableCompanies } from '@app/services/companies';
import { getAllSuitableBranches, getSuitableBranches } from '@app/services/branches';
import { suitableForRequest } from '@app/services/requests';
import { Checkbox } from '@app/components/common/Checkbox/Checkbox';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import Button from 'antd/es/button/button';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined, ReloadOutlined, TagOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';
import { FONT_WEIGHT } from '@app/styles/themes/constants';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface ForRequest {
  id: string | undefined;
  request: {
    companyIds: number[];
    companyBranchIds: number[];
  };
}

interface CompanyRecord {
  id: number;
  isFeature: boolean;
  compatibilityRate: number;
}

export const SuitableCompanies: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, mobileOnly, desktopOnly } = useResponsive();
  const { requestId, type } = useParams();
  const Navigate = useNavigate();

  const [pageCompany, setPageCompany] = useState<number>(1);
  const [pageBranch, setPageBranch] = useState<number>(1);
  const [pageSizeCompany, setPageSizeCompany] = useState<number>(DEFAULT_PAGE_SIZE);
  const [pageSizeBranch, setPageSizeBranch] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataCompany, setDataCompany] = useState<RequestModel[] | undefined>(undefined);
  const [dataBranch, setDataBranch] = useState<RequestModel[] | undefined>(undefined);
  const [totalCountCompany, setTotalCountCompany] = useState<number>(0);
  const [totalCountBranch, setTotalCountBranch] = useState<number>(0);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingBranch, setLoadingBranch] = useState(true);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);
  const [attachmentData, setAttachmentData] = useState<any>();
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    company: false,
    branch: false,
    changeStauts: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
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

    if (userPermissions.includes('Request.ChangeStatus')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        changeStauts: true,
      }));
    }
  }, [userPermissions]);

  const companies = useQuery(['AllSuitableCompanies'], () =>
    getAllSuitableCompanies(type, requestId)
      .then((data) => {
        const result = data.data?.result?.items;

        const defaultSelectedCompanies = result
          ?.filter((record: CompanyRecord) => record.isFeature)
          .map((record: CompanyRecord) => record.id);
        setSelectedCompanies(defaultSelectedCompanies);
      })
      .catch((err) => {
        setLoadingCompany(false);
        notificationController.error({ message: err?.message || err.error?.message });
      }),
  );

  const { refetch: refetchCompanies, isRefetching: isRefetchingCompanies } = useQuery(
    ['SuitableCompanies', pageCompany, pageSizeCompany],
    () =>
      getSuitableCompanies(type, pageCompany, pageSizeCompany, searchString, requestId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataCompany(result);
          setTotalCountCompany(data.data.result?.totalCount);
          setLoadingCompany(!data.data?.success);
        })
        .catch((err) => {
          setLoadingCompany(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataCompany === undefined,
    },
  );

  const branches = useQuery(
    ['AllSuitableBranches'],
    () =>
      getAllSuitableBranches(type, requestId)
        .then((data) => {
          const result = data.data?.result?.items;

          const defaultSelectedCompanies = result
            ?.filter((record: CompanyRecord) => record.isFeature)
            .map((record: CompanyRecord) => record.id);
          setSelectedBranches(defaultSelectedCompanies);
        })
        .catch((err) => {
          setLoadingBranch(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataBranch === undefined,
    },
  );

  const { refetch: reetchBranch, isRefetching: isRefetchingBranch } = useQuery(
    ['SuitableBranches', pageBranch, pageSizeBranch],
    () =>
      getSuitableBranches(type, pageBranch, pageSizeBranch, searchString, requestId)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataBranch(result);
          setTotalCountBranch(data.data.result?.totalCount);
          setLoadingBranch(!data.data?.success);
        })
        .catch((err) => {
          setLoadingBranch(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataBranch === undefined,
    },
  );

  useEffect(() => {
    if (isRefetchingCompanies) setLoadingCompany(true);
    else setLoadingCompany(false);
  }, [isRefetchingCompanies]);

  useEffect(() => {
    if (isRefetchingBranch) setLoadingBranch(true);
    else setLoadingBranch(false);
  }, [isRefetchingBranch]);

  useEffect(() => {
    setLoadingCompany(true);
    refetchCompanies();
  }, [pageCompany, pageSizeCompany, language, searchString, refetchCompanies, refetchData]);

  useEffect(() => {
    setLoadingBranch(true);
    reetchBranch();
  }, [pageBranch, pageSizeBranch, language, searchString, reetchBranch, refetchData]);

  useEffect(() => {
    if (pageCompany > 1 && dataCompany?.length === 0) {
      setPageCompany(1);
    }
  }, [pageCompany, dataCompany]);

  useEffect(() => {
    if (pageBranch > 1 && dataBranch?.length === 0) {
      setPageBranch(1);
    }
  }, [pageBranch, dataBranch]);

  const suitableForRequestMutation = useMutation((data: ForRequest) =>
    suitableForRequest(data)
      .then((res) => {
        res.data?.success &&
          message.open({
            content: <Alert message={t('requests.confirmSuitableSuccessMessage')} type={`success`} showIcon />,
          });
        Navigate('/requests', { replace: false });
      })
      .catch((error) =>
        message.open({ content: <Alert message={error.message || error.error?.message} type={`error`} showIcon /> }),
      ),
  );

  const handleCheckboxChangeForCompanies = (id: number) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter((item) => item !== id));
    } else {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const handleCheckboxChangeForBranches = (id: number) => {
    if (selectedBranches.includes(id)) {
      setSelectedBranches(selectedBranches.filter((item) => item !== id));
    } else {
      setSelectedBranches([...selectedBranches, id]);
    }
  };

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
    type == '1' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.selected')}</Header>,
      render: (record: any) =>
        record && (
          <Checkbox
            onChange={() => handleCheckboxChangeForCompanies(record.id)}
            checked={selectedCompanies.includes(record.id)}
          />
        ),
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.image')}</Header>,
      dataIndex: ['companyProfile', 'url'],
      render: (url: string, record: any) => {
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
    type == '1' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.compatibilityRate')}</Header>,
      dataIndex: 'compatibilityRate',
      render: (record: any) => <>{record}%</>,
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.address')}</Header>, dataIndex: 'address' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.bio')}</Header>, dataIndex: 'bio' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('branch.region')}</Header>, dataIndex: ['region', 'name'] },
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
    type == '2' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.isThisCompanyProvideOffer')}</Header>,
      dataIndex: 'isThisCompanyProvideOffer',
      render: (record: any) => (
        <Space style={{ display: 'grid' }}>
          {record ? (
            <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
              {t('requests.true')}
            </Tag>
          ) : (
            <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
              {t('requests.false')}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: any, record: any) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`/companies/${record?.id}/details`, { state: record.name });
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
        record.isFeature && <Rate disabled defaultValue={1} count={1} style={{ fontSize: '15px' }} />,
    },
    type == '1' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.selected')}</Header>,
      render: (record: any) => (
        <Checkbox
          onChange={() => handleCheckboxChangeForBranches(record.id)}
          checked={selectedBranches.includes(record.id)}
        />
      ),
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    type == '1' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.compatibilityRate')}</Header>,
      dataIndex: 'compatibilityRate',
      render: (record: any) => <>{record}%</>,
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.address')}</Header>, dataIndex: 'address' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.bio')}</Header>, dataIndex: 'bio' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.numberOfTransfers')}</Header>,
      dataIndex: 'numberOfTransfers',
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('branch.region')}</Header>, dataIndex: ['region', 'name'] },
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
    type == '2' && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.isThisBranchProvideOffer')}</Header>,
      dataIndex: 'isThisCompanyProvideOffer',
      render: (record: any) => (
        <Space style={{ display: 'grid' }}>
          {record ? (
            <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
              {t('requests.true')}
            </Tag>
          ) : (
            <Tag key={record?.id} color="#ff5252" style={{ padding: '4px' }}>
              {t('requests.false')}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: any, record: any) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`/companies/${record?.company?.id}/branches/${record?.id}/details`, { state: record.name });
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
          title={t('requests.suitableCompanies')}
          padding={
            dataCompany === undefined ||
            dataCompany?.length === 0 ||
            (pageCompany === 1 && totalCountCompany <= pageSizeCompany)
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
                  src={attachmentData !== undefined ? attachmentData?.url : ''}
                  size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
                />
              </Modal>
            ) : null}
          </Row>

          <Table
            pagination={{
              showSizeChanger: true,
              onChange: (pageCompany: number, pageSizeCompany: number) => {
                setPageCompany(pageCompany);
                setPageSizeCompany(pageSizeCompany);
              },
              current: pageCompany,
              pageSize: pageSizeCompany,
              showQuickJumper: true,
              responsive: true,
              showTitle: false,
              showLessItems: true,
              total: totalCountCompany || 0,
              hideOnSinglePage: false,
            }}
            columns={columnsCompany.map((col) => ({ ...col, width: 'auto' }))}
            loading={loadingCompany}
            dataSource={dataCompany}
            scroll={{ x: isTablet || isMobile ? 950 : 800 }}
            rowKey={(record: CompanyRecord) => record.id.toString()}
            rowClassName={(record: CompanyRecord) => (record.compatibilityRate == 100 ? 'feature-row' : '')}
          />
        </Card>
      )}

      {hasPermissions.branch && (
        <Card
          title={t('requests.suitableBranches')}
          padding={
            dataBranch === undefined ||
            dataBranch?.length === 0 ||
            (pageBranch === 1 && totalCountBranch <= pageSizeBranch)
              ? '1.25rem 1.25rem 1.25rem'
              : '1.25rem 1.25rem 0'
          }
          style={{ height: 'auto', marginBottom: '70px' }}
        >
          <Table
            pagination={{
              showSizeChanger: true,
              onChange: (pageBranch: number, pageSizeBranch: number) => {
                setPageBranch(pageBranch);
                setPageSizeBranch(pageSizeBranch);
              },
              current: pageBranch,
              pageSize: pageSizeBranch,
              showQuickJumper: true,
              responsive: true,
              showTitle: false,
              showLessItems: true,
              total: totalCountBranch || 0,
              hideOnSinglePage: false,
            }}
            columns={columnsBranch.map((col) => ({ ...col, width: 'auto' }))}
            loading={loadingBranch}
            dataSource={dataBranch}
            scroll={{ x: isTablet || isMobile ? 950 : 800 }}
            rowKey={(record: CompanyRecord) => record.id.toString()}
            rowClassName={(record: CompanyRecord) => (record.compatibilityRate == 100 ? 'feature-row' : '')}
          />
        </Card>
      )}

      {type == '1' && hasPermissions.changeStauts && (
        <Button
          disabled={
            (dataCompany?.length == 0 && dataBranch?.length == 0) ||
            (selectedCompanies?.length == 0 && selectedBranches?.length == 0)
          }
          type="primary"
          style={{
            marginBottom: '.5rem',
            width: 'auto',
            height: 'auto',
          }}
          onClick={() =>
            suitableForRequestMutation.mutateAsync({
              id: requestId,
              request: {
                companyIds: hasPermissions.company ? selectedCompanies : [],
                companyBranchIds: hasPermissions.branch ? selectedBranches : [],
              },
            })
          }
        >
          <CreateButtonText>{t('common.done')}</CreateButtonText>
        </Button>
      )}
    </>
  );
};
