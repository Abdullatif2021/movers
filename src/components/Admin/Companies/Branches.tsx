import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Rate, Row, Space, Tag, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, TagOutlined, SnippetsOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { ChangeAcceptRequestOrPossibleRequestForBranch, DeleteBranch, getAllBranches } from '@app/services/branches';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { BranchModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';
import { ChangeAcceptRequestOrPotentialClient } from '@app/components/modal/ChangeAcceptRequestOrPotentialClient';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface CompanyRecord {
  id: number;
  isFeature: boolean;
}

export const Branches: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { language } = useLanguage();
  const Navigate = useNavigate();
  const { companyId } = useParams();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
    acceptRequestOrPotentialClient: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState<BranchModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deletemodaldata, setDeletemodaldata] = useState<BranchModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [acceptRequestOrPotentialClientmodaldata, setAcceptRequestOrPotentialClientmodaldata] = useState<any>();
  const [isChanged, setIsChanged] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    delete: false,
    ChangeStatues: false,
    edit: false,
    add: false,
    details: false,
    offer: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('CompanyBranch.Delete')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        delete: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.ChangeStatues')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        ChangeStatues: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.Update')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        edit: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.Create')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        add: true,
      }));
    }

    if (userPermissions.includes('CompanyBranch.Get')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        details: true,
      }));
    }

    if (userPermissions.includes('Offer.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        offer: true,
      }));
    }
  }, [userPermissions]);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['getAllBranches', page, pageSize, isDelete, isEdit, isChanged],
    () =>
      getAllBranches(companyId, page, pageSize, searchString)
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

  const deleteBranch = useMutation((id: number) =>
    DeleteBranch(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('locations.deleteCountrySuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (page > 1 && data?.length === 1) {
      deleteBranch.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteBranch.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteBranch.isLoading }));
  }, [deleteBranch.isLoading]);

  const acceptRequestOrPotentialClient = useMutation((data: any) =>
    ChangeAcceptRequestOrPossibleRequestForBranch(data)
      .then((data) => {
        data.data?.success &&
          (setIsChanged(data.data?.success),
          message.open({
            content: (
              <Alert message={t('companies.acceptRequestOrPotentialClientSuccessMessage')} type={`success`} showIcon />
            ),
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleAcceptRequestOrPotentialClient = (data: any, id: number) => {
    acceptRequestOrPotentialClient.mutateAsync({ ...data, id });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({
      ...prevModalState,
      acceptRequestOrPotentialClient: acceptRequestOrPotentialClient.isLoading,
    }));
  }, [acceptRequestOrPotentialClient.isLoading]);

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
    setIsDelete(false);
  }, [isDelete, isEdit, isChanged, page, pageSize, searchString, language, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && data?.length === 0) {
      setPage(1);
    }
  }, [page, data]);

  const columns = [
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
    { title: <Header style={{ wordBreak: 'normal' }}>{t('branch.region')}</Header>, dataIndex: ['region', 'name'] },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.commission')}</Header>,
      dataIndex: ['company', 'commissionGroup'],
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
    hasPermissions.offer && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('requests.offers')}</Header>,
      dataIndex: 'offers',
      render: (index: number, record: any) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                Navigate(`${record.id}/offers`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('requests.offers')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
        return (
          <Space>
            {hasPermissions.details && (
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
            )}

            {hasPermissions.ChangeStatues && (
              <Tooltip placement="top" title={t('branch.ChangeAcceptRequestOrPotentialClient')}>
                <TableButton
                  severity="info"
                  onClick={() => {
                    setAcceptRequestOrPotentialClientmodaldata(record);
                    handleModalOpen('acceptRequestOrPotentialClient');
                  }}
                >
                  <SnippetsOutlined />
                </TableButton>
              </Tooltip>
            )}

            {hasPermissions.edit && (
              <Tooltip placement="top" title={t('common.edit')}>
                <TableButton
                  severity="info"
                  onClick={() => {
                    Navigate(`/companies/${companyId}/branches/${record.id}/EditBranch`);
                  }}
                >
                  <EditOutlined />
                </TableButton>
              </Tooltip>
            )}

            {hasPermissions.delete && (
              <Tooltip placement="top" title={t('common.delete')}>
                <TableButton
                  severity="error"
                  onClick={() => {
                    setDeletemodaldata(record);
                    handleModalOpen('delete');
                  }}
                >
                  <DeleteOutlined />
                </TableButton>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('branch.branchesList')}
        padding={
          data === undefined || data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
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

          {hasPermissions.add && (
            <Btn
              type="primary"
              style={{
                margin: '0 0 .5rem 0',
                width: 'auto',
              }}
              onClick={() => Navigate(`/companies/${companyId}/addBranch`)}
            >
              <CreateButtonText>{t('branch.addBranch')}</CreateButtonText>
            </Btn>
          )}

          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Delete    */}
          {modalState.delete && (
            <ActionModal
              visible={modalState.delete}
              onCancel={() => handleModalClose('delete')}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('branch.deleteBranchModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('branch.deleteBranchModalDescription')}
              isDanger={true}
              isLoading={deleteBranch.isLoading}
            />
          )}

          {/*    Accept Request Or Potential Clients    */}
          {modalState.acceptRequestOrPotentialClient && (
            <ChangeAcceptRequestOrPotentialClient
              visible={modalState.acceptRequestOrPotentialClient}
              onCancel={() => handleModalClose('acceptRequestOrPotentialClient')}
              onEdit={(info) => {
                acceptRequestOrPotentialClientmodaldata != undefined &&
                  handleAcceptRequestOrPotentialClient(info, acceptRequestOrPotentialClientmodaldata.id);
              }}
              isLoading={acceptRequestOrPotentialClient.isLoading}
              values={acceptRequestOrPotentialClientmodaldata}
              title="branch"
            />
          )}
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
          rowKey={(record: CompanyRecord) => record.id.toString()}
        />
      </Card>
    </>
  );
};
