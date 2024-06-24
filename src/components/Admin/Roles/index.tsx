import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { AddRole } from '@app/components/modal/AddRole';
import { EditRole } from '@app/components/modal/EditRole';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { getAllRoles, createRole, DeleteRole, UpdateRole } from '@app/services/role';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { RoleModel } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const Role: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { isTablet, isMobile, isDesktop } = useResponsive();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<RoleModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<RoleModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<RoleModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    delete: false,
    edit: false,
    add: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Pages.Roles.Delete')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        delete: true,
      }));
    }

    if (userPermissions.includes('Pages.Roles.Update')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        edit: true,
      }));
    }

    if (userPermissions.includes('Pages.Roles.Create')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        add: true,
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
    ['Users', page, pageSize, refetchOnAdd, isDelete, isEdit],
    () =>
      getAllRoles(page, pageSize, searchString)
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

  const addRole = useMutation((data: RoleModel) =>
    createRole(data)
      .then((data) => {
        notificationController.success({ message: t('roles.addRoleSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addRole.isLoading }));
  }, [addRole.isLoading]);

  const deleteRole = useMutation((id: number) =>
    DeleteRole(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('roles.deleteRoleSuccessMessage')} type={`success`} showIcon />,
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
      deleteRole.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteRole.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteRole.isLoading }));
  }, [deleteRole.isLoading]);

  const editRole = useMutation((data: RoleModel) => UpdateRole(data));

  const handleEdit = (data: RoleModel, id: number) => {
    editRole
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`roles.editRoleSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editRole.isLoading }));
  }, [editRole.isLoading]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('roles.Name')}</Header>, dataIndex: 'name' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('roles.NormalizedName')}</Header>,
      dataIndex: 'normalizedName',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: RoleModel) => {
        return (
          <Space>
            {hasPermissions.edit &&
              record.name != 'Admin' &&
              record.name != 'BasicUser' &&
              record.name != 'CompanyBranchUser' &&
              record.name != 'CompanyUser' && (
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
              )}

            {hasPermissions.delete &&
              record.name != 'Admin' &&
              record.name != 'BasicUser' &&
              record.name != 'CompanyBranchUser' &&
              record.name != 'CompanyUser' && (
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
        title={t('roles.rolesList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row justify={'end'}>
          {hasPermissions.add && (
            <Button
              type="primary"
              style={{
                marginBottom: '.5rem',
                width: 'auto',
                height: 'auto',
              }}
              onClick={() => handleModalOpen('add')}
            >
              <CreateButtonText>{t('roles.addRole')}</CreateButtonText>
            </Button>
          )}
          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    ADD    */}
          {modalState.add && (
            <AddRole
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                const displayName = info.name;
                const values = { ...info, displayName };
                addRole.mutateAsync(values);
              }}
              isLoading={addRole.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditRole
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(info) => {
                const displayName = info.name;
                const values = { ...info, displayName };
                editmodaldata !== undefined && handleEdit(values, editmodaldata.id);
              }}
              isLoading={editRole.isLoading}
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
              title={t('roles.deleteRoleModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('roles.deleteRoleModalDescription')}
              isDanger={true}
              isLoading={deleteRole.isLoading}
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
