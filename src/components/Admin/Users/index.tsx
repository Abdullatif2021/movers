import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Popconfirm, Col, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { AuditOutlined, DeleteOutlined, LeftOutlined, LoadingOutlined, TagOutlined } from '@ant-design/icons';
import { getAllUsers, Delete, Activate, DeActivate } from '@app/services/users';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { LableText, TextBack } from '../../GeneralStyles';
import { defineColorBySeverity } from '@app/utils/utils';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { UserModel } from '@app/interfaces/interfaces';
import { Dates } from '@app/constants/Dates';
import { Header, TableButton } from '../../GeneralStyles';
import { Button } from '@app/components/common/buttons/Button/Button';
import { ActionModal } from '@app/components/modal/ActionModal';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const User: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { codeBroker } = useParams();
  const Navigate = useNavigate();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [page, setPage] = useState<number>(1);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deletemodaldata, setDeletemodaldata] = useState<UserModel | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [refetchOnAddUser, setRefetchOnAddUser] = useState(false);
  const [temp, setTemp] = useState<any>();
  const [userStatus, setUserStatus] = useState<boolean | undefined>(undefined);
  const [userType, setUserType] = useState<number | string>('');
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    delete: false,
    activate: false,
    hisRequests: false,
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

    if (userPermissions.includes('Request.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        hisRequests: true,
      }));
    }
  }, [userPermissions]);

  const { refetch, isRefetching } = useQuery(
    ['Users', page, pageSize, refetchOnAddUser, isDelete, isEdit, isActivate, isDeActivate],
    () =>
      getAllUsers(page, pageSize, false, true, searchString, userType, userStatus, codeBroker)
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
    setRefetchOnAddUser(false);
    setIsActivate(false);
    setIsDeActivate(false);
  }, [
    isDelete,
    isEdit,
    refetchOnAddUser,
    isActivate,
    isDeActivate,
    userType,
    userStatus,
    page,
    pageSize,
    searchString,
    language,
    refetch,
    refetchData,
  ]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const deleteUser = useMutation((id: number) =>
    Delete(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('users.deleteUserSuccessMessage')} type={`success`} showIcon />,
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
      deleteUser.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteUser.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteUser.isLoading);
  }, [deleteUser.isLoading]);

  const activateUser = useMutation((id: number) =>
    Activate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('users.activateUserSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateUser = useMutation((id: number) =>
    DeActivate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('users.deactivateUserSuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('users.userFullName')}</Header>,
      dataIndex: 'registrationFullName',
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('users.userName')}</Header>, dataIndex: 'userName' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.emailAddress')}</Header>, dataIndex: 'emailAddress' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.creationTime')}</Header>,
      dataIndex: 'creationTime',
      render: (creationTime: string) => {
        return <>{Dates.format(creationTime, 'DD MMMM YYYY, h:mm a')}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('users.userStatus')}</Header>,
      dataIndex: 'isActive',
      render: (userStatus: boolean) => {
        return <>{(userStatus = userStatus ? t('common.active') : t('common.inactive'))}</>;
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
                  disabled={userStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setUserStatus(undefined);
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
                  onClick={() => setUserStatus(temp === false ? 'false' : temp)}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    codeBroker === undefined && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('users.usertype')}</Header>,
      dataIndex: 'type',
      render: (userType: number) => {
        return (
          <>
            {userType === 2
              ? t('common.user')
              : userType === 3
              ? t('common.company')
              : userType === 5
              ? t('common.branch')
              : userType === 6
              ? t('common.broker')
              : ''}
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
              <Radio style={{ display: 'block', fontSize }} value={2}>
                {t('common.user')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={3}>
                {t('common.company')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={5}>
                {t('common.branch')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={6}>
                {t('common.broker')}
              </Radio>
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  // disabled={userType === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setUserType('');
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
                  onClick={() => setUserType(temp)}
                >
                  {t('common.apply')}
                </Button>
              </Col>
            </Row>
          </div>
        );
      },
    },
    codeBroker === undefined && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: UserModel) => {
        return (
          <Space>
            {hasPermissions.hisRequests && (
              <Tooltip placement="top" title={t('users.hisRequests')}>
                <TableButton
                  disabled={record.type !== 2 && record.type !== 6}
                  severity="success"
                  onClick={() => {
                    Navigate(`${record.id}/requests`, { state: record.name });
                  }}
                >
                  <AuditOutlined />
                </TableButton>
              </Tooltip>
            )}

            {hasPermissions.delete && (
              <Tooltip placement="top" title={t('common.delete')}>
                <TableButton
                  severity="error"
                  onClick={() => {
                    setDeletemodaldata(record);
                    setIsOpenDeleteModalForm(true);
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
                    title={<LableText>{t('users.deactivateUserConfirm')}</LableText>}
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
                        {deActivateUser.isLoading ? (
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
                    onConfirm={() => deActivateUser.mutateAsync(record.id)}
                  >
                    <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                      <TableText>{t('common.deactivate')}</TableText>
                    </Button>
                  </Popconfirm>
                </Tooltip>
              ) : (
                <Tooltip placement="top" title={t('common.activate')}>
                  <Popconfirm
                    placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                    title={<LableText>{t('users.activateUserConfirm')}</LableText>}
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
                        {activateUser.isLoading ? (
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
                    onConfirm={() => activateUser.mutateAsync(record.id)}
                  >
                    <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                      <TableText>{t('common.activate')}</TableText>
                    </Button>
                  </Popconfirm>
                </Tooltip>
              ))}
          </Space>
        );
      },
    },
  ].filter(Boolean);

  return (
    <>
      <Card
        title={t('users.usersList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
      >
        <Row align={'middle'} justify={'end'}>
          {codeBroker !== undefined && (
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
          )}

          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Delete    */}
          {isOpenDeleteModalForm && (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('users.deleteUserModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('users.deleteUserModalDescription')}
              isDanger={true}
              isLoading={deleteUser.isLoading}
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
