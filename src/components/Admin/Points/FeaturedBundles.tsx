import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Popconfirm, Row, Space, Tooltip } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, DeleteOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import {
  getAllFeaturedBundles,
  CreateFeaturedBundle,
  DeleteFeaturedBundle,
  UpdateFeaturedBundle,
  ActivateFeaturedBundle,
  DeActivateFeaturedBundle,
} from '@app/services/featuredBundles';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText, LableText } from '../../GeneralStyles';
import { Point } from '@app/interfaces/interfaces';
import { TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { AddFeaturedBundle } from '@app/components/modal/AddFeaturedBundle';
import { EditFeaturedBundle } from '@app/components/modal/EditFeaturedBundle';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { defineColorBySeverity } from '@app/utils/utils';
import styled from 'styled-components';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export const FeaturedBundles: React.FC = () => {
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
  const [dataSource, setDataSource] = useState<Point[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<Point | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<Point | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [temp, setTemp] = useState<any>();
  const [bundleStatus, setBundleStatus] = useState<boolean | undefined>(undefined);
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
    ['Points', page, pageSize, refetchOnAdd, isDelete, isEdit, bundleStatus],
    () =>
      getAllFeaturedBundles(page, pageSize, searchString, bundleStatus)
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
    bundleStatus,
    isActivate,
    isDeActivate,
    refetchData,
  ]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addPoint = useMutation((data: any) =>
    CreateFeaturedBundle(data)
      .then((data) => {
        notificationController.success({ message: t('points.addPointSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addPoint.isLoading }));
  }, [addPoint.isLoading]);

  const deletePoint = useMutation((id: number) =>
    DeleteFeaturedBundle(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('points.deletePointSuccessMessage')} type={`success`} showIcon />,
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
      deletePoint.mutateAsync(id);
      setPage(page - 1);
    } else {
      deletePoint.mutateAsync(id);
    }
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, delete: deletePoint.isLoading }));
  }, [deletePoint.isLoading]);

  const editPoint = useMutation((data: Point) => UpdateFeaturedBundle(data));

  const handleEdit = (data: Point, id: number) => {
    editPoint
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`points.editPointSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editPoint.isLoading }));
  }, [editPoint.isLoading]);

  const activateBundle = useMutation((id: number) =>
    ActivateFeaturedBundle(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('points.activatePartnerSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateBundle = useMutation((id: number) =>
    DeActivateFeaturedBundle(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('points.deactivatePartnerSuccessMessage')} type="success" showIcon />,
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>,
      dataIndex: 'name',
      render: (name: Point) => {
        return <>{name}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('points.numberInMonths')}</Header>,
      dataIndex: 'numberInMonths',
      render: (numberInMonths: Point) => {
        return <>{numberInMonths}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('points.price')}</Header>,
      dataIndex: 'price',
      render: (price: Point) => {
        return <>{price}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('points.bundleStatus')}</Header>,
      dataIndex: 'isActive',
      render: (bundleStatus: boolean) => {
        return <>{(bundleStatus = bundleStatus ? t('common.active') : t('common.inactive'))}</>;
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
                  disabled={bundleStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setBundleStatus(undefined);
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
                  onClick={() => setBundleStatus(temp === false ? 'false' : temp)}
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
                    title={<LableText>{t('points.deactivatePartnerConfirm')}</LableText>}
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
                    title={<LableText>{t('points.activatePartnerConfirm')}</LableText>}
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
        title={t('points.featuredList')}
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
            <CreateButtonText>{t('points.addPoint')}</CreateButtonText>
          </Button>
          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Add    */}
          {modalState.add && (
            <AddFeaturedBundle
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addPoint.mutateAsync(info);
              }}
              isLoading={addPoint.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditFeaturedBundle
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editPoint.isLoading}
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
              title={t('points.deletePointModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('points.deletePointModalDescription')}
              isDanger={true}
              isLoading={deletePoint.isLoading}
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
