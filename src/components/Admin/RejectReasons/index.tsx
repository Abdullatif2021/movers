import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Popconfirm, Row, Space, Tag, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import {
  getAllRejectReasons,
  CreateRejectReason,
  DeleteRejectReason,
  UpdateRejectReason,
  ActivateRejectReason,
  DeActivateRejectReason,
} from '@app/services/rejectReason';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText, LableText } from '../../GeneralStyles';
import { RejectReason } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { AddRejectReason } from '@app/components/modal/AddRejectReason';
import { EditRejectReason } from '@app/components/modal/EditRejectReason';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { defineColorBySeverity } from '@app/utils/utils';
import styled from 'styled-components';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export const RejectReasons: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<RejectReason[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<RejectReason | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<RejectReason | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [temp, setTemp] = useState<any>();
  const [reasonRejectStatus, setRejectReasonStatus] = useState<boolean | undefined>(undefined);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['RejectReason', page, pageSize, refetchOnAdd, isDelete, isEdit, reasonRejectStatus],
    () =>
      getAllRejectReasons(page, pageSize, searchString, reasonRejectStatus)
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
    setIsEdit(false);
    setIsDelete(false);
    setRefetchOnAdd(false);
    setIsActivate(false);
    setIsDeActivate(false);
  }, [
    isDelete,
    refetchOnAdd,
    isEdit,
    page,
    pageSize,
    language,
    searchString,
    reasonRejectStatus,
    isActivate,
    isDeActivate,
    refetchData,
  ]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addRejectReason = useMutation((data: any) =>
    CreateRejectReason(data)
      .then((data) => {
        notificationController.success({ message: t('rejectReasons.addRejectReasonSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addRejectReason.isLoading }));
  }, [addRejectReason.isLoading]);

  const deleteRejectReason = useMutation((id: number) =>
    DeleteRejectReason(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('rejectReasons.deleteRejectReasonSuccessMessage')} type={`success`} showIcon />,
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
      deleteRejectReason.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteRejectReason.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteRejectReason.isLoading }));
  }, [deleteRejectReason.isLoading]);

  const editRejectReason = useMutation((data: RejectReason) => UpdateRejectReason(data));

  const handleEdit = (data: RejectReason, id: number) => {
    editRejectReason
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`rejectReasons.editRejectReasonSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editRejectReason.isLoading }));
  }, [editRejectReason.isLoading]);

  const activateBundle = useMutation((id: number) =>
    ActivateRejectReason(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('rejectReasons.activateRejectReasonSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateBundle = useMutation((id: number) =>
    DeActivateRejectReason(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('rejectReasons.deactivateRejectReasonSuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description')}</Header>,
      dataIndex: 'description',
      render: (description: RejectReason) => {
        return <>{description}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('rejectReasons.possibilityPotentialClient')}</Header>,
      dataIndex: 'possibilityPotentialClient',
      render: (record: number) => {
        return (
          <>
            {record == 1 ? (
              <Tag color="#30af5b" style={{ padding: '4px' }}>
                {t('rejectReasons.PotentialClient')}
              </Tag>
            ) : (
              <Tag color="#ff5252" style={{ padding: '4px' }}>
                {t('rejectReasons.NotPotentialClient')}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('rejectReasons.reasonRejectStatus')}</Header>,
      dataIndex: 'isActive',
      render: (reasonRejectStatus: boolean) => {
        return <>{(reasonRejectStatus = reasonRejectStatus ? t('common.active') : t('common.inactive'))}</>;
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
                  disabled={reasonRejectStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setRejectReasonStatus(undefined);
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
                  onClick={() => setRejectReasonStatus(temp === false ? 'false' : temp)}
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
      render: (index: number, record: any) => {
        return (
          <>
            <Space>
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

              {record.isActive === true ? (
                <Tooltip placement="top" title={t('common.deactivate')}>
                  <Popconfirm
                    placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                    title={<LableText>{t('rejectReasons.deactivateRejectReasonConfirm')}</LableText>}
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
                        {deActivateBundle.isLoading ? (
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
                    onConfirm={() => deActivateBundle.mutateAsync(record.id)}
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
                    title={<LableText>{t('rejectReasons.activateRejectReasonConfirm')}</LableText>}
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
                        {activateBundle.isLoading ? (
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
                    onConfirm={() => activateBundle.mutateAsync(record.id)}
                  >
                    <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                      <TableText>{t('common.activate')}</TableText>
                    </Button>
                  </Popconfirm>
                </Tooltip>
              )}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('rejectReasons.rejectReasonList')}
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
            <CreateButtonText>{t('rejectReasons.addRejectReason')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Add    */}
          {modalState.add && (
            <AddRejectReason
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addRejectReason.mutateAsync(info);
              }}
              isLoading={addRejectReason.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditRejectReason
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editRejectReason.isLoading}
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
              title={t('rejectReasons.deleteRejectReasonModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('rejectReasons.deleteRejectReasonModalDescription')}
              isDanger={true}
              isLoading={deleteRejectReason.isLoading}
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
