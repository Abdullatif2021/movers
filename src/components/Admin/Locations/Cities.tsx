import React, { useState, useEffect } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { Alert, Col, Popconfirm, Row, Space, Tooltip, message } from 'antd';
import { Table } from 'components/common/Table/Table';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import {
  getAllCities,
  createCity,
  UpdateCity,
  DeleteCity,
  ActivationCity,
  DeActivateCity,
} from '@app/services/locations';
import { useNavigate, useParams } from 'react-router-dom';
import { currentGamesPageAtom, gameStatusAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useAtom } from 'jotai';
import { Button } from '@app/components/common/buttons/Button/Button';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { useResponsive } from '@app/hooks/useResponsive';
import { notificationController } from '@app/controllers/notificationController';
import { CityModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import { EditOutlined, DeleteOutlined, LeftOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ActionModal } from '@app/components/modal/ActionModal';
import { AddCity } from '@app/components/modal/AddCity';
import { EditCity } from '@app/components/modal/EditCity';
import { LableText, Header, CreateButtonText, TableButton, TextBack } from '../../GeneralStyles';
import { Radio, RadioChangeEvent, RadioGroup } from '@app/components/common/Radio/Radio';
import { defineColorBySeverity } from '@app/utils/utils';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

export type cities = {
  id: number;
  name: string;
  description: string;
  cityStatus: number;
};

export const City: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { countryId } = useParams();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<cities[] | undefined>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [cityStatus, setCityStatus] = useAtom(gameStatusAtom);
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
  const [dataSource, setDataSource] = useState<CityModel[] | undefined>(undefined);
  const [editmodaldata, setEditmodaldata] = useState<CityModel | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<CityModel | undefined>(undefined);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    region: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Region.FullControl')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        region: true,
      }));
    }
  }, [userPermissions]);

  const { refetch, isRefetching } = useQuery(
    ['CitiesById', page, pageSize],
    () =>
      getAllCities(countryId, page, pageSize, searchString)
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
    cityStatus,
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

  const addCity = useMutation((data: CityModel) =>
    createCity(data)
      .then((data) => {
        notificationController.success({ message: t('locations.addCitySuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenAddModalForm(addCity.isLoading);
  }, [addCity.isLoading]);

  const deleteCity = useMutation((id: number) =>
    DeleteCity(id)
      .then((data) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('locations.deleteCitySuccessMessage')} type={`success`} showIcon />,
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
      deleteCity.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteCity.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteCity.isLoading);
  }, [deleteCity.isLoading]);

  const activateCity = useMutation((id: number) =>
    ActivationCity(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('locations.activateCitySuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateCity = useMutation((id: number) =>
    DeActivateCity(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('locations.deactivateCitySuccessMessage')} type="success" showIcon />,
        });
        setIsDeActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const editCity = useMutation((data: CityModel) => UpdateCity(data));

  const handleEdit = (data: CityModel, id: number) => {
    editCity
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`locations.editCitySuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editCity.isLoading);
  }, [editCity.isLoading]);

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [cityStatus, page, pageSize, language, refetch, refetchData]);

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
    hasPermissions.region && {
      title: <Header style={{ wordBreak: 'normal' }}>{t('locations.regions')}</Header>,
      dataIndex: 'regions',
      render: (index: number, record: cities) => {
        return (
          <Space>
            <Button
              style={{ height: '2.4rem', width: language === 'ar' ? '7.85rem' : '' }}
              severity="info"
              onClick={() => {
                navigate(`${record.id}/regions`, { state: record.name });
              }}
            >
              <div
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs,
                  fontWeight: FONT_WEIGHT.regular,
                  width: 'auto',
                }}
              >
                {t('locations.regions')}
              </div>
            </Button>
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('locations.cityStatus')}</Header>,
      dataIndex: 'isActive',
      render: (cityStatus: boolean) => {
        return <>{(cityStatus = cityStatus ? t('common.active') : t('common.inactive'))}</>;
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
                  disabled={cityStatus === undefined ? true : false}
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined); //true or false
                    setCityStatus(undefined); //Active or InActive
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
                  onClick={() => setCityStatus(temp === false ? 'false' : temp)}
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
      render: (index: number, record: CityModel) => {
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
                  title={<LableText>{t('locations.deactivateCityConfirm')}</LableText>}
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
                      {deActivateCity.isLoading ? (
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
                  onConfirm={() => deActivateCity.mutateAsync(record.id)}
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
                  title={<LableText>{t('locations.activateCityConfirm')}</LableText>}
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
                      {activateCity.isLoading ? (
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
                  onConfirm={() => activateCity.mutateAsync(record.id)}
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
        id="cities"
        title={t('locations.citiesList')}
        padding={
          Data === undefined || Data?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'} align={'middle'}>
          {/*    ADD    */}
          {isOpenAddModalForm && (
            <AddCity
              visible={isOpenAddModalForm}
              onCancel={() => setIsOpenAddModalForm(false)}
              onCreateCity={(cityInfo) => {
                const values = { ...cityInfo, countryId };
                addCity.mutateAsync(values);
              }}
              isLoading={addCity.isLoading}
            />
          )}

          {/*    EDIT    */}
          {isOpenEditModalForm && (
            <EditCity
              city_values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data: any) => {
                const values = { ...data, countryId };
                editmodaldata !== undefined && handleEdit(values, editmodaldata.id);
              }}
              isLoading={editCity.isLoading}
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
              title={t('locations.deleteCityModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('locations.deleteCityModalDescription')}
              isDanger={true}
              isLoading={deleteCity.isLoading}
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
              margin: '0 0 0.5rem 0',
              width: 'auto',
            }}
            onClick={() => setIsOpenAddModalForm(true)}
          >
            <CreateButtonText>{t('locations.addCity')}</CreateButtonText>
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
