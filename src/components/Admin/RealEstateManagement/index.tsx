import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, TagOutlined, CodeOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { Code, Partner, UserModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { CreateCode, CreatePartner, DeletePartner, UpdatePartner, getAllPartner } from '../../../services/partners';
import { AddPartner } from '@app/components/modal/AddPartner';
import { EditPartner } from '@app/components/modal/EditPartner';
import { AddCodesForREM } from '@app/components/modal/AddCodesForREM';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export const Partners: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const Navigate = useNavigate();

  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const [modalState, setModalState] = useState({
    add: false,
    addCode: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [codemodaldata, setCodemodaldata] = useState<any>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<Partner | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<Partner | undefined>(undefined);
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
    ['Partner', page, pageSize, refetchOnAdd, isDelete, isEdit],
    () =>
      getAllPartner(page, pageSize, searchString)
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
  }, [isDelete, isEdit, refetchOnAdd, page, pageSize, searchString, language, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addPartner = useMutation((data: Partner) =>
    CreatePartner(data)
      .then((data) => {
        notificationController.success({ message: t('partners.addPartnerSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addPartner.isLoading }));
  }, [addPartner.isLoading]);

  const addCode = useMutation((data: any) =>
    CreateCode(data)
      .then((data) => {
        notificationController.success({ message: t('partners.addCodeSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error?.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, addCode: addCode.isLoading }));
  }, [addCode.isLoading]);

  const deletePartner = useMutation((id: number) =>
    DeletePartner(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('partners.deletePartnerSuccessMessage')} type={`success`} showIcon />,
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
      deletePartner.mutateAsync(id);
      setPage(page - 1);
    } else {
      deletePartner.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deletePartner.isLoading }));
  }, [deletePartner.isLoading]);

  const editPartner = useMutation((data: Partner) => UpdatePartner(data));

  const handleEdit = (data: Partner, id: number) => {
    editPartner
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`partners.editPartnerSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editPartner.isLoading }));
  }, [editPartner.isLoading]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.firstName')}</Header>, dataIndex: 'firstName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.lastName')}</Header>, dataIndex: 'lastName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('brokers.companyName')}</Header>, dataIndex: 'companyName' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.phoneNumber')}</Header>,
      dataIndex: 'partnerPhoneNumber',
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.emailAddress')}</Header>, dataIndex: 'email' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
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

            <Tooltip placement="top" title={t('partners.addCode')}>
              <TableButton
                severity="warning"
                onClick={() => {
                  setCodemodaldata(record);
                  handleModalOpen('addCode');
                }}
              >
                <CodeOutlined />
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
        title={t('partners.PartnersList')}
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
            <CreateButtonText>{t('partners.addPartner')}</CreateButtonText>
          </Button>
          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Add    */}
          {modalState.add && (
            <AddPartner
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreatePartner={(PartnerInfo) => {
                addPartner.mutateAsync(PartnerInfo);
              }}
              isLoading={addPartner.isLoading}
            />
          )}

          {/*    AddCode    */}
          {modalState.addCode && (
            <AddCodesForREM
              visible={modalState.addCode}
              onCancel={() => handleModalClose('addCode')}
              onCreateCode={(info: Code) => {
                const codeInfo = {
                  createCode: info,
                  id: codemodaldata?.id,
                };
                addCode.mutateAsync(codeInfo);
              }}
              isLoading={addCode.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditPartner
              Partner_values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editPartner.isLoading}
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
              title={t('partners.deletePartnerModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('partners.deletePartnerModalDescription')}
              isDanger={true}
              isLoading={deletePartner.isLoading}
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
