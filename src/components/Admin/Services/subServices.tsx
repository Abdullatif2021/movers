import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Row, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { getAllSubServices, createSubService, DeleteSubService, UpdateSubService } from '@app/services/services';
import { useNavigate, useParams } from 'react-router-dom';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { Attachment, ServiceModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddSubService } from '@app/components/modal/AddSubService';
import { EditOutlined, DeleteOutlined, LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { Modal, Image, CreateButtonText } from '../../GeneralStyles';
import { Image as AntdImage } from '@app/components/common/Image/Image';
import { EditSubService } from '@app/components/modal/EditSubService';
import { TextBack, Header, TableButton } from '../../GeneralStyles';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export type services = {
  id: number;
  title: string;
  description: string;
  attachment?: Attachment;
};

export const SubServices: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { serviceId } = useParams();
  const { desktopOnly, mobileOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [attachmentData, setAttachmentData] = useState<services>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<services[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refetchOnAddService, setRefetchOnAddService] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<ServiceModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<ServiceModel | undefined>(undefined);
  const [isOpenSliderImage, setIsOpenSliderImage] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    Tool: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Tool.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        Tool: true,
      }));
    }
  }, [userPermissions]);

  const navigateBack = () => {
    navigate(-1);
  };

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['Services', page, pageSize],
    () =>
      getAllSubServices(serviceId, page, pageSize, searchString)
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
    setRefetchOnAddService(false);
  }, [isDelete, isEdit, refetchOnAddService, page, pageSize, searchString, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && Data?.length === 0) {
      setPage(1);
    }
  }, [page, Data]);

  const addService = useMutation((data: ServiceModel) =>
    createSubService(data)
      .then((data) => {
        notificationController.success({ message: t('subServices.addSubServiceSuccessMessage') });
        setRefetchOnAddService(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addService.isLoading }));
  }, [addService.isLoading]);

  const deleteService = useMutation((id: number) =>
    DeleteSubService(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('subServices.deleteSubServiceSuccessMessage')} type={`success`} showIcon />,
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
      deleteService.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteService.mutateAsync(id);
    }
  };

  const editService = useMutation((data: ServiceModel) => UpdateSubService(data));

  const handleEdit = (data: ServiceModel, id: number, serviceId: any) => {
    editService
      .mutateAsync({ ...data, id, serviceId })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`services.editServiceSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editService.isLoading }));
  }, [editService.isLoading]);

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deleteService.isLoading }));
  }, [deleteService.isLoading]);

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
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.image')}</Header>,
      dataIndex: ['attachment', 'url'],
      render: (url: string, record: services) => {
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
    hasPermissions.Tool && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('subServices.tools')}</Header>,
      dataIndex: 'tools',
      render: (index: number, record: services) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/tools`, { state: record.title });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('subServices.tools')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: ServiceModel) => {
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
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        id="subservices"
        title={t('subServices.subServicesList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'} align={'middle'}>
          {/*    ADD    */}
          {modalState.add && (
            <AddSubService
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreateService={(info) => {
                const values = { ...info, serviceId };
                addService.mutateAsync(values);
              }}
              isLoading={addService.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditSubService
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id, serviceId)}
              isLoading={editService.isLoading}
              AttachmentId={editmodaldata?.attachment !== undefined ? editmodaldata?.attachment?.id : 0}
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
              title={t('subServices.deleteSubServiceModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('subServices.deleteSubServiceModalDescription')}
              isDanger={true}
              isLoading={deleteService.isLoading}
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
                src={attachmentData?.attachment !== undefined ? attachmentData?.attachment.url : ''}
                size={isDesktop || isTablet ? 'small' : isMobile ? 'x_small' : mobileOnly ? 'xx_small' : 'x_small'}
              />
            </Modal>
          ) : null}

          <Button
            style={{
              margin: '0rem .5rem .5rem 0',
              width: 'auto',
            }}
            type="ghost"
            onClick={navigateBack}
            icon={<LeftOutlined />}
          >
            <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
          </Button>
          <Button
            type="primary"
            style={{
              margin: '0rem 0rem .5rem 0',
            }}
            onClick={() => handleModalOpen('add')}
          >
            <CreateButtonText>{t('subServices.addSubService')}</CreateButtonText>
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
