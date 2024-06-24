import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Popconfirm, Col, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { AddManager } from '@app/components/modal/AddManager';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { EditManager } from '@app/components/modal/EditManager';
import { getAllUsers, Create, Update, Delete, Activate, DeActivate } from '@app/services/users';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { LableText } from '../../GeneralStyles';
import { defineColorBySeverity } from '@app/utils/utils';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { Header, CreateButtonText } from '../../GeneralStyles';
import { UserModel } from '@app/interfaces/interfaces';
import { Dates } from '@app/constants/Dates';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const Manager: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

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
  const [editmodaldata, setEditmodaldata] = useState<UserModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<UserModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);
  const [temp, setTemp] = useState<any>();
  const [temp1, setTemp1] = useState<any>();
  const [managerStatus, setManagerStatus] = useState<boolean | undefined>(undefined);
  const [managerType, setManagerType] = useState<number | string>('');
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    delete: false,
    activate: false,
    edit: false,
    add: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Pages.Users.Delete')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        delete: true,
      }));
    }

    if (userPermissions.includes('Pages.Users.Activation')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        activate: true,
      }));
    }

    if (userPermissions.includes('Pages.Users.Update')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        edit: true,
      }));
    }

    if (userPermissions.includes('Pages.Users.Create')) {
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
    ['Users', page, pageSize, refetchOnAddManager, isDelete, isEdit, isActivate, isDeActivate, isAdmin, isEmployee],
    () =>
      getAllUsers(page, pageSize, true, false, searchString, managerType, managerStatus)
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
    setRefetchOnAddManager(false);
    setIsActivate(false);
    setIsDeActivate(false);
    setIsAdmin(false);
    setIsEmployee(false);
  }, [
    isDelete,
    isEdit,
    refetchOnAddManager,
    isActivate,
    isDeActivate,
    isAdmin,
    isEmployee,
    managerStatus,
    managerType,
    page,
    pageSize,
    language,
    searchString,
    refetch,
    refetchData,
  ]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addManager = useMutation((data: UserModel) =>
    Create(data)
      .then((data) => {
        notificationController.success({ message: t('managers.addManagerSuccessMessage') });
        setRefetchOnAddManager(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addManager.isLoading }));
  }, [addManager.isLoading]);

  const deleteManager = useMutation((id: number) =>
    Delete(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('managers.deleteManagerSuccessMessage')} type={`success`} showIcon />,
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
      deleteManager.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteManager.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteManager.isLoading }));
  }, [deleteManager.isLoading]);

  const activateManager = useMutation((id: number) =>
    Activate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('managers.activateManagerSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateManager = useMutation((id: number) =>
    DeActivate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('managers.deactivateManagerSuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const editManager = useMutation((data: UserModel) => Update(data));

  const handleEdit = (data: UserModel, id: number) => {
    editManager
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`managers.editManagerSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editManager.isLoading }));
  }, [editManager.isLoading]);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('managers.managerFullName')}</Header>, dataIndex: 'fullName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('users.userName')}</Header>, dataIndex: 'userName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('roles.roleName')}</Header>, dataIndex: ['roleNames', 0] },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.emailAddress')}</Header>, dataIndex: 'emailAddress' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.creationTime')}</Header>,
      dataIndex: 'creationTime',
      render: (creationTime: string) => {
        return <>{Dates.format(creationTime, 'DD MMMM YYYY, h:mm a')}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('managers.type')}</Header>,
      dataIndex: 'type',
      render: (managerType: number) => {
        return <>{managerType === 1 ? t('managers.admin') : t('managers.employee')}</>;
      },
      filterDropdown: () => {
        const fontSize = isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs;
        return (
          <div style={{ padding: 8 }}>
            <RadioGroup
              size="small"
              onChange={(e: RadioChangeEvent) => {
                setTemp1(e.target.value);
              }}
              value={temp1}
            >
              <Radio style={{ display: 'block', fontSize }} value={1}>
                {t('managers.admin')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={4}>
                {t('managers.employee')}
              </Radio>
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  disabled={managerType === '' ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp1(undefined);
                    setManagerType('');
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
                  onClick={() => {
                    setManagerType(temp1 === 1 ? 1 : 4);
                  }}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('managers.managerStatus')}</Header>,
      dataIndex: 'isActive',
      render: (managerStatus: boolean) => {
        return <>{(managerStatus = managerStatus ? t('common.active') : t('common.inactive'))}</>;
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
              <Radio style={{ display: 'block', fontSize }} value={true}>
                {t('common.active')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={false}>
                {t('common.inactive')}
              </Radio>
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  disabled={managerStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined); //true or false
                    setManagerStatus(undefined); //Active or InActive
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
                  onClick={() => setManagerStatus(temp === false ? 'false' : temp)}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: UserModel) => {
        return (
          <Space>
            {hasPermissions.edit && (
              <Tooltip placement="top" title={t('common.edit')}>
                <TableButton
                  disabled={record.roleNames[0] == 'ADMIN'}
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

            {hasPermissions.delete && (
              <Tooltip placement="top" title={t('common.delete')}>
                <TableButton
                  disabled={record.roleNames[0] == 'ADMIN'}
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

            {hasPermissions.activate &&
              (record.isActive === true ? (
                <Tooltip placement="top" title={t('common.deactivate')}>
                  <Popconfirm
                    placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                    title={<LableText>{t('managers.deactivateManagerConfirm')}</LableText>}
                    okButtonProps={{
                      onMouseOver: () => {
                        setIsHover(true);
                      },
                      onMouseLeave: () => {
                        setIsHover(false);
                      },
                      loading: false,
                      style: {
                        color: `${defineColorBySeverity('info')}`,
                        background: isHover
                          ? 'var(--background-color)'
                          : `rgba(${defineColorBySeverity('info', true)}, 0.04)`,
                        borderColor: isHover
                          ? `${defineColorBySeverity('info')}`
                          : `rgba(${defineColorBySeverity('info', true)}, 0.9)`,
                      },
                    }}
                    okText={
                      <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
                        {deActivateManager.isLoading ? (
                          <>
                            {t(`common.deactivate`)} <LoadingOutlined />
                          </>
                        ) : (
                          t(`common.deactivate`)
                        )}
                      </div>
                    }
                    cancelText={
                      <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
                        {t(`common.cancel`)}
                      </div>
                    }
                    onConfirm={() => deActivateManager.mutateAsync(record.id)}
                  >
                    <Button
                      severity="info"
                      style={{ height: '2.4rem', width: '6.5rem' }}
                      disabled={record.roleNames[0] == 'ADMIN'}
                    >
                      <TableText>{t('common.deactivate')}</TableText>
                    </Button>
                  </Popconfirm>
                </Tooltip>
              ) : (
                <Tooltip placement="top" title={t('common.activate')}>
                  <Popconfirm
                    placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                    title={<LableText>{t('managers.activateManagerConfirm')}</LableText>}
                    okButtonProps={{
                      onMouseOver: () => {
                        setIsHover(true);
                      },
                      onMouseLeave: () => {
                        setIsHover(false);
                      },
                      loading: false,
                      style: {
                        color: `${defineColorBySeverity('info')}`,
                        background: isHover
                          ? 'var(--background-color)'
                          : `rgba(${defineColorBySeverity('info', true)}, 0.04)`,
                        borderColor: isHover
                          ? `${defineColorBySeverity('info')}`
                          : `rgba(${defineColorBySeverity('info', true)}, 0.9)`,
                      },
                    }}
                    okText={
                      <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
                        {activateManager.isLoading ? (
                          <>
                            {t(`common.activate`)} <LoadingOutlined />
                          </>
                        ) : (
                          t(`common.activate`)
                        )}
                      </div>
                    }
                    cancelText={
                      <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>
                        {t(`common.cancel`)}
                      </div>
                    }
                    onConfirm={() => activateManager.mutateAsync(record.id)}
                  >
                    <Button
                      severity="info"
                      style={{ height: '2.4rem', width: '6.5rem' }}
                      disabled={record.roleNames[0] == 'ADMIN'}
                    >
                      <TableText>{t('common.activate')}</TableText>
                    </Button>
                  </Popconfirm>
                </Tooltip>
              ))}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('managers.managersList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row gutter={[10, 10]} justify={'end'}>
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
              <CreateButtonText>{t('managers.addManager')}</CreateButtonText>
            </Button>
          )}
          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    ADD    */}
          {modalState.add && (
            <AddManager
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateManager={(managerInfo) => {
                addManager.mutateAsync(managerInfo);
              }}
              isLoading={addManager.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditManager
              manager_values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editManager.isLoading}
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
              title={t('managers.deleteManagerModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('managers.deleteManagerModalDescription')}
              isDanger={true}
              isLoading={deleteManager.isLoading}
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
