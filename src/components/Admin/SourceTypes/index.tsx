import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Popconfirm, Row, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  getAllSourceTypes,
  createSourceType,
  DeleteSourceType,
  UpdateSourceType,
  ActivateSourceType,
  DeActivateSourceType,
} from '@app/services/sourceTypes';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, SourceTypeModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  LoadingOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddSourceType } from '@app/components/modal/AddSourceType';
import { EditSourceType } from '@app/components/modal/EditSourceType';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { useNavigate } from 'react-router-dom';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Header, TableButton, Modal, Image, CreateButtonText, LableText } from '../../GeneralStyles';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { defineColorBySeverity } from '@app/utils/utils';
import styled from 'styled-components';
import { useAppSelector } from '@app/hooks/reduxHooks';

export type sourceTypes = {
  id: number;
  title: string;
  description: string;
  icon?: Attachment;
};

export const SourceType: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { mobileOnly, isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [attachmentData, setAttachmentData] = useState<sourceTypes>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<sourceTypes[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [dataSource, setDataSource] = useState<SourceTypeModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<SourceTypeModel | undefined>(undefined);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [hasPermissions, setHasPermissions] = useState({
    AttributeForSourceType: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('AttributeForSourceType.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        AttributeForSourceType: true,
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
    ['SourceTypes', page, pageSize],
    () =>
      getAllSourceTypes(page, pageSize, searchString)
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

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addSourceType = useMutation((data: SourceTypeModel) =>
    createSourceType(data)
      .then((data) => {
        notificationController.success({ message: t('sourceTypes.addSourceTypeSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addSourceType.isLoading }));
  }, [addSourceType.isLoading]);

  const deleteSourceType = useMutation((id: number) =>
    DeleteSourceType(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('sourceTypes.deleteSourceTypeSuccessMessage')} type={`success`} showIcon />,
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
      deleteSourceType.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteSourceType.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteSourceType.isLoading }));
  }, [deleteSourceType.isLoading]);

  const editSourceType = useMutation((data: SourceTypeModel) => UpdateSourceType(data));

  const handleEdit = (data: SourceTypeModel, id: number) => {
    editSourceType
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`sourceTypes.editSourceTypeSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editSourceType.isLoading }));
  }, [editSourceType.isLoading]);

  const activate = useMutation((id: number) =>
    ActivateSourceType(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('sourceTypes.activateSourceTypesSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivate = useMutation((id: number) =>
    DeActivateSourceType(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('sourceTypes.deactivateSourceTypesSuccessMessage')} type="success" showIcon />,
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
  }, [page, pageSize, language, refetch]);

  useEffect(() => {
    if (page > 1 && Data?.length === 0) setPage(1);
  }, [page, Data]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.icon')}</Header>,
      dataIndex: ['icon', 'url'],
      render: (url: string, record: sourceTypes) => {
        return (
          <>
            <Image
              src={url}
              onClick={() => {
                setIsOpenSliderImage(true);
                setAttachmentData(record);
              }}
            />
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('sourceTypes.pointsToGiftToCompany')}</Header>,
      dataIndex: 'pointsToGiftToCompany',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('sourceTypes.pointsToBuyRequest')}</Header>,
      dataIndex: 'pointsToBuyRequest',
    },
    hasPermissions.AttributeForSourceType && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('sourceTypes.attributeForSource')}</Header>,
      dataIndex: 'attributeForSource',
      render: (index: number, record: sourceTypes) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/attributeForSource`, { state: record.title });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('sourceTypes.attributeForSource')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('sourceTypes.isMainForPoints')}</Header>,
      dataIndex: 'isMainForPoints',
      render: (record: boolean) => {
        return (
          <Space>
            {record ? (
              <TableButton severity="success">
                <CheckOutlined />
              </TableButton>
            ) : (
              <TableButton severity="error">
                <CloseOutlined />
              </TableButton>
            )}
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
                  title={<LableText>{t('sourceTypes.deactivateSourceTypesConfirm')}</LableText>}
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
                  title={<LableText>{t('sourceTypes.activateSourceTypesConfirm')}</LableText>}
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
        id="sourceTypes"
        title={t('sourceTypes.sourceTypesList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
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
            <CreateButtonText>{t('sourceTypes.addSourceType')}</CreateButtonText>
          </Button>
          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    ADD    */}
          {modalState.add && (
            <AddSourceType
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addSourceType.mutateAsync(info);
              }}
              isLoading={addSourceType.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditSourceType
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editSourceType.isLoading}
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
              title={t('sourceTypes.deleteSourceTypeModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('sourceTypes.deleteSourceTypeModalDescription')}
              isDanger={true}
              isLoading={deleteSourceType.isLoading}
            />
          )}

          {/* Image */}
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
                src={attachmentData?.icon !== undefined ? attachmentData?.icon.url : ''}
                size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
              />
            </Modal>
          ) : null}
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
