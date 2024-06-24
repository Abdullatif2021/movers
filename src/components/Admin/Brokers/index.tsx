import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { Broker, UserModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { EditBroker } from '@app/components/modal/EditBroker';
import { AddBrokr } from '@app/components/modal/AddBroker';
import { CreateBroker, DeleteBroker, UpdateBroker, getAllBrokers } from '../../../services/brokers';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export const Brokers: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const { language } = useLanguage();
  const Navigate = useNavigate();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<Broker | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<Broker | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Brokers', page, pageSize, refetchOnAdd, isDelete, isEdit],
    () =>
      getAllBrokers(page, pageSize, searchString)
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
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setIsEdit(false);
    setIsDelete(false);
    setRefetchOnAdd(false);
  }, [isDelete, isEdit, refetchOnAdd, page, pageSize, language, searchString, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addBroker = useMutation((data: Broker) =>
    CreateBroker(data)
      .then((data) => {
        notificationController.success({ message: t('brokers.addBrokerSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addBroker.isLoading }));
  }, [addBroker.isLoading]);

  const deleteBroker = useMutation((id: number) =>
    DeleteBroker(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('brokers.deleteBrokerSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (page > 1 && dataSource?.length === 1) {
      deleteBroker.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteBroker.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteBroker.isLoading }));
  }, [deleteBroker.isLoading]);

  const editBroker = useMutation((data: Broker) => UpdateBroker(data));

  const handleEdit = (data: Broker, id: number) => {
    editBroker
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`brokers.editBrokerSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editBroker.isLoading }));
  }, [editBroker.isLoading]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.firstName')}</Header>, dataIndex: 'firstName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.lastName')}</Header>, dataIndex: 'lastName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.companyName')}</Header>, dataIndex: 'companyName' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.phoneNumber')}</Header>,
      render: (record: any) => {
        return <Space>{record?.dialCode + ' ' + record?.mediatorPhoneNumber}</Space>;
      },
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.emailAddress')}</Header>, dataIndex: 'email' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('companies.city')}</Header>,
      dataIndex: 'city',
      render: (record: any) => {
        return <Space>{record?.name}</Space>;
      },
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.code')}</Header>, dataIndex: 'mediatorCode' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.commission')}</Header>,
      render: (index: number, record: Broker) => {
        return <>{record.commissionPercentage} %</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.moneyOwed')}</Header>,
      render: (index: number, record: Broker) => {
        return <>{record.moneyOwed} </>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.numberServiceUsers')}</Header>,
      dataIndex: 'numberServiceUsers',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: Broker) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.details')}>
              <TableButton
                severity="success"
                onClick={() => {
                  Navigate(`${record.id}/details`);
                }}
              >
                <TagOutlined />
              </TableButton>
            </Tooltip>

            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setEditmodaldata(record);
                  handleModalOpen('edit');
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip>

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
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('brokers.BrokersList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
          <Button
            type="primary"
            style={{
              marginBottom: '.5rem',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('brokers.addBroker')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Add    */}
          {modalState.add && (
            <AddBrokr
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateBroker={(BrokerInfo) => {
                addBroker.mutateAsync(BrokerInfo);
              }}
              isLoading={addBroker.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditBroker
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editBroker.isLoading}
            />
          )}

          {/*    Delete    */}
          {modalState.delete && (
            <ActionModal
              visible={modalState.delete}
              onCancel={() => handleModalClose('delete')}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('brokers.deleteBrokerModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('brokers.deleteBrokerModalDescription')}
              isDanger={true}
              isLoading={deleteBroker.isLoading}
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
          dataSource={dataSource}
          scroll={{ x: isTablet || isMobile ? 950 : 800 }}
        />
      </Card>
    </>
  );
};
