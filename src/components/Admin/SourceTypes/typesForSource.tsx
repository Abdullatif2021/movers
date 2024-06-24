import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Popconfirm, Row, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  getAllAttributeForSourceTypes,
  createAttributeForSourceType,
  DeleteAttributeForSourceType,
  UpdateAttributeForSourceType,
  ActivateAttributeForSourceType,
  DeActivateAttributeForSourceType,
} from '@app/services/sourceTypes';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, SourceTypeModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined, LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddAttributeForSourceType } from '@app/components/modal/AddAttributeForSourceType';
import { EditAttributeForSourceType } from '@app/components/modal/EditAttributeForSourceType';
import { TableButton, Header, TextBack, CreateButtonText, LableText } from '../../GeneralStyles';
import { useNavigate, useParams } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import styled from 'styled-components';
import { defineColorBySeverity } from '@app/utils/utils';
import { useAppSelector } from '@app/hooks/reduxHooks';

export type sourceTypes = {
  id: number;
  title: string;
  description: string;
  icon?: Attachment;
};

export const TypesForSource: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { sourceTypeId } = useParams();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<sourceTypes[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [hasPermissions, setHasPermissions] = useState({
    AttributeChoice: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('AttributeChoice.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        AttributeChoice: true,
      }));
    }
  }, [userPermissions]);

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
    ['AttributeForSourceTypes', page, pageSize],
    () =>
      getAllAttributeForSourceTypes(sourceTypeId, page, pageSize, searchString)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setData(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setLoading(false);
        }),
    {
      enabled: Data === undefined,
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
  }, [isDelete, isEdit, isActivate, isDeActivate, refetchOnAdd, page, pageSize, searchString, refetch, refetchData]);

  const addAttributeForSourceType = useMutation((data: SourceTypeModel) =>
    createAttributeForSourceType(data)
      .then((data) => {
        notificationController.success({
          message: t('attributeForSourceTypes.addAttributeForSourceTypeSuccessMessage'),
        });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addAttributeForSourceType.isLoading }));
  }, [addAttributeForSourceType.isLoading]);

  const deleteAttributeForSourceType = useMutation((id: number) =>
    DeleteAttributeForSourceType(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: (
              <Alert
                message={t('attributeForSourceTypes.deleteAttributeForSourceTypeSuccessMessage')}
                type={`success`}
                showIcon
              />
            ),
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (page > 1 && Data?.length === 1) {
      deleteAttributeForSourceType.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteAttributeForSourceType.mutateAsync(id);
    }
  };

  useEffect(() => {
    if (page > 1 && Data?.length === 0) setPage(1);
  }, [page, Data]);

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteAttributeForSourceType.isLoading }));
  }, [deleteAttributeForSourceType.isLoading]);

  const editAttributeForSourceType = useMutation((data: SourceTypeModel) => UpdateAttributeForSourceType(data));

  const handleEdit = (data: SourceTypeModel, id: number, sourceTypeIds: any) => {
    editAttributeForSourceType
      .mutateAsync({ ...data, id, sourceTypeIds })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: (
            <Alert
              message={t(`attributeForSourceTypes.editAttributeForSourceTypeSuccessMessage`)}
              type={`success`}
              showIcon
            />
          ),
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editAttributeForSourceType.isLoading }));
  }, [editAttributeForSourceType.isLoading]);

  const activate = useMutation((id: number) =>
    ActivateAttributeForSourceType(id)
      .then((data) => {
        message.open({
          content: (
            <Alert message={t('attributeForSourceTypes.activateSourceTypesSuccessMessage')} type="success" showIcon />
          ),
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivate = useMutation((id: number) =>
    DeActivateAttributeForSourceType(id)
      .then((data) => {
        message.open({
          content: (
            <Alert message={t('attributeForSourceTypes.deactivateSourceTypesSuccessMessage')} type="success" showIcon />
          ),
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [page, pageSize, language, refetch, refetchData]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    hasPermissions.AttributeChoice && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('attributeForSourceTypes.attributeChoice')}</Header>,
      dataIndex: 'attributeChoice',
      render: (index: number, record: sourceTypes) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/attributes`, { state: record.title });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('attributeForSourceTypes.attributeChoice')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: SourceTypeModel) => {
        return (
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
                  title={<LableText>{t('attributeForSourceTypes.deactivateSourceTypesConfirm')}</LableText>}
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
                      {deActivate.isLoading ? (
                        <>
                          {t(`common.deactivate`)} <LoadingOutlined />
                        </>
                      ) : (
                        t(`common.deactivate`)
                      )}
                    </div>
                  }
                  cancelText={
                    <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>{t(`common.cancel`)}</div>
                  }
                  onConfirm={() => deActivate.mutateAsync(record.id)}
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
                  title={<LableText>{t('attributeForSourceTypes.activateSourceTypesConfirm')}</LableText>}
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
                      {activate.isLoading ? (
                        <>
                          {t(`common.activate`)} <LoadingOutlined />
                        </>
                      ) : (
                        t(`common.activate`)
                      )}
                    </div>
                  }
                  cancelText={
                    <div style={{ fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.regular }}>{t(`common.cancel`)}</div>
                  }
                  onConfirm={() => activate.mutateAsync(record.id)}
                >
                  <Button severity="info" style={{ height: '2.4rem', width: '6.5rem' }}>
                    <TableText>{t('common.activate')}</TableText>
                  </Button>
                </Popconfirm>
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
        id="types"
        title={t('attributeForSourceTypes.attributeForSourceTypesList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'} align={'middle'}>
          {/*    ADD    */}
          {modalState.add && (
            <AddAttributeForSourceType
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                const values = { ...info, sourceTypeIds: [sourceTypeId] };
                addAttributeForSourceType.mutateAsync(values);
              }}
              isLoading={addAttributeForSourceType.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditAttributeForSourceType
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id, [sourceTypeId])}
              isLoading={editAttributeForSourceType.isLoading}
              iconId={editmodaldata?.icon !== undefined ? editmodaldata?.icon.id : 0}
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
              title={t('attributeForSourceTypes.deleteAttributeForSourceTypeModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('attributeForSourceTypes.deleteAttributeForSourceTypeModalDescription')}
              isDanger={true}
              isLoading={deleteAttributeForSourceType.isLoading}
            />
          )}

          <Button
            style={{
              margin: '0 .5rem .5rem 0',
              width: 'auto',
            }}
            type="ghost"
            onClick={() => navigate(-1)}
            icon={<LeftOutlined />}
          >
            <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
          </Button>
          <Button
            type="primary"
            style={{
              margin: '0 0 .5rem 0',
              width: 'auto',
            }}
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('attributeForSourceTypes.addAttributeForSourceType')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />
        </Row>
        <Table
          dataSource={Data}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            responsive: true,
            current: page,
            pageSize: pageSize,
            showTitle: false,
            showLessItems: true,
            showQuickJumper: true,
            total: totalCount || 0,
            pageSizeOptions: [5, 10, 15, 20],
            hideOnSinglePage: false,
          }}
          loading={loading}
          scroll={{ x: isTablet || isMobile ? 850 : '' }}
        />
      </Card>
    </>
  );
};
