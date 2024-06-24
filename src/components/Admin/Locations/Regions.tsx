import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Col, Popconfirm, Row, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  getAllRegions,
  createRegion,
  UpdateRegion,
  DeleteRegion,
  ActivationRegion,
  DeActivateRegion,
} from '@app/services/locations';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, TableButton } from '../../GeneralStyles';
import { currentGamesPageAtom, gameStatusAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { RegionModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined, LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddRegion } from '@app/components/modal/AddRegion';
import { EditRegion } from '@app/components/modal/EditRegion';
import { TextBack, CreateButtonText } from '../../GeneralStyles';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { defineColorBySeverity } from '@app/utils/utils';
import { LableText } from '@app/components/GeneralStyles';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export type regions = {
  id: number;
  title: string;
  description: string;
  regionStatus: number;
};

export const Region: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cityId } = useParams();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<regions[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [regionStatus, setRegionStatus] = useAtom(gameStatusAtom);
  const [isOpenAddModalForm, setIsOpenAddModalForm] = useState(false);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [temp, setTemp] = useState<any>();
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [dataSource, setDataSource] = useState<RegionModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<RegionModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<RegionModel | undefined>(undefined);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const { refetch, isRefetching } = useQuery(
    ['RegionsById', page, pageSize],
    () =>
      getAllRegions(cityId, page, pageSize, searchString)
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
    setIsActivate(false);
    setIsDeActivate(false);
  }, [
    isDelete,
    isEdit,
    refetchOnAdd,
    isActivate,
    isDeActivate,
    regionStatus,
    page,
    pageSize,
    searchString,
    refetch,
    refetchData,
  ]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const addRegion = useMutation((data: RegionModel) =>
    createRegion(data)
      .then((data) => {
        notificationController.success({ message: t('locations.addRegionSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenAddModalForm(addRegion.isLoading);
  }, [addRegion.isLoading]);

  const deleteRegion = useMutation((id: number) =>
    DeleteRegion(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('locations.deleteRegionSuccessMessage')} type={`success`} showIcon />,
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
      deleteRegion.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteRegion.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteRegion.isLoading);
  }, [deleteRegion.isLoading]);

  const activate = useMutation((id: number) =>
    ActivationRegion(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('locations.activateRegionSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivate = useMutation((id: number) =>
    DeActivateRegion(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('locations.deactivateRegionSuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const editRegion = useMutation((data: RegionModel) => UpdateRegion(data));

  const handleEdit = (data: RegionModel, id: number) => {
    editRegion
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`locations.editRegionSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editRegion.isLoading);
  }, [editRegion.isLoading]);

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [regionStatus, page, pageSize, language, refetch, refetchData]);

  useEffect(() => {
    if (page > 1 && Data?.length === 0) setPage(1);
  }, [page, Data]);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const navigateBack = () => {
    navigate(-1);
  };

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.name')}</Header>, dataIndex: 'name' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('locations.regionStatus')}</Header>,
      dataIndex: 'isActive',
      render: (regionStatus: boolean) => {
        return <>{(regionStatus = regionStatus ? t('common.active') : t('common.inactive'))}</>;
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
                  disabled={regionStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined); //true or false
                    setRegionStatus(undefined); //Active or InActive
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
                  onClick={() => setRegionStatus(temp === false ? 'false' : temp)}
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
      render: (index: number, record: RegionModel) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setEditmodaldata(record);
                  setIsOpenEditModalForm(true);
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
                  setIsOpenDeleteModalForm(true);
                }}
              >
                <DeleteOutlined />
              </TableButton>
            </Tooltip>

            {record.isActive === true ? (
              <Tooltip placement="top" title={t('common.deactivate')}>
                <Popconfirm
                  placement={desktopOnly ? 'top' : isTablet || isMobile ? 'topLeft' : 'top'}
                  title={<LableText>{t('locations.deactivateRegionConfirm')}</LableText>}
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
                  title={<LableText>{t('locations.activateRegionConfirm')}</LableText>}
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
        id="regions"
        title={t('locations.regionsList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'} align={'middle'}>
          {/*    ADD    */}
          {isOpenAddModalForm && (
            <AddRegion
              visible={isOpenAddModalForm}
              onCancel={() => setIsOpenAddModalForm(false)}
              onCreate={(info) => {
                const values = { ...info, cityId };
                addRegion.mutateAsync(values);
              }}
              isLoading={addRegion.isLoading}
            />
          )}

          {/*    EDIT    */}
          {isOpenEditModalForm && (
            <EditRegion
              values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data: any) => {
                const values = { ...data, cityId };
                editmodaldata !== undefined && handleEdit(values, editmodaldata.id);
              }}
              isLoading={editRegion.isLoading}
            />
          )}

          {/*    Delete    */}
          {isOpenDeleteModalForm && (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('locations.deleteRegionModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('locations.deleteRegionModalDescription')}
              isDanger={true}
              isLoading={deleteRegion.isLoading}
            />
          )}

          <Button
            style={{
              margin: '0 .5rem .5rem 0',
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
              margin: '0 0 .5rem 0',
              width: 'auto',
            }}
            onClick={() => setIsOpenAddModalForm(true)}
          >
            <CreateButtonText>{t('locations.addRegion')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />
        </Row>
        <Table
          dataSource={Data}
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          // columns={columns}
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
