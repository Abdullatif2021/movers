import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Space, Tooltip, Tag } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useQuery, useMutation } from 'react-query';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText, TableButton } from '../../GeneralStyles';
import { ApplicationsVersion, UserModel } from '@app/interfaces/interfaces';
import { AddApplicationVersion } from '@app/components/modal/AddApplicationVersion';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import {
  getAllApplicationsVersions,
  CreateApplicationVersion,
  UpdateApplicationVersion,
  ChangeOptionsForApplicationVersion,
} from '@app/services/applicationsVersions';
import { EditApplicationVersion } from '@app/components/modal/EditApplicationVersion';
import { DashOutlined, EditOutlined } from '@ant-design/icons';
import { ChangeNecessaryToUpdate } from '@app/components/modal/ChangeNecessaryToUpdate';

const { CheckableTag } = Tag;
const necessaryToUpdate = ['Optional', 'Mandatory', 'Nothing'];

export const ApplicationsVersions: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const { language } = useLanguage();
  const Navigate = useNavigate();

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    change: false,
    delete: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editmodaldata, setEditmodaldata] = useState<ApplicationsVersion | undefined>(undefined);
  const [changemodaldata, setChangemodaldata] = useState<ApplicationsVersion | undefined>(undefined);
  const [deletemodaldata, setDeletemodaldata] = useState<ApplicationsVersion | undefined>(undefined);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [refetchOnAdd, setRefetchOnAdd] = useState(false);
  const [refetchOnChangeOption, setRefetchOnChangeOption] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['ApplicationsVersion', page, pageSize, refetchOnAdd, refetchOnChangeOption, isDelete, isEdit, isChange],
    () =>
      getAllApplicationsVersions(page, pageSize, searchString)
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
    setIsChange(false);
    setIsDelete(false);
    setRefetchOnAdd(false);
    setRefetchOnChangeOption(false);
  }, [
    isDelete,
    isEdit,
    isChange,
    refetchOnAdd,
    refetchOnChangeOption,
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

  const addApplicationsVersions = useMutation((data: ApplicationsVersion) =>
    CreateApplicationVersion(data)
      .then((data) => {
        notificationController.success({ message: t('applicationsVersions.addApplicationsVersionsSuccessMessage') });
        setRefetchOnAdd(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, add: addApplicationsVersions.isLoading }));
  }, [addApplicationsVersions.isLoading]);

  const changeOptionApplicationsVersions = useMutation((data: ApplicationsVersion) =>
    ChangeOptionsForApplicationVersion(data),
  );

  const handleChange = (data: ApplicationsVersion, id: number) => {
    changeOptionApplicationsVersions
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsChange(data.data?.success);
        message.open({
          content: (
            <Alert
              message={t(`applicationsVersions.changeApplicationsVersionsSuccessMessage`)}
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
    setModalState((prevModalState) => ({ ...prevModalState, change: changeOptionApplicationsVersions.isLoading }));
  }, [changeOptionApplicationsVersions.isLoading]);

  const editApplicationsVersions = useMutation((data: ApplicationsVersion) => UpdateApplicationVersion(data));

  const handleEdit = (data: ApplicationsVersion, id: number) => {
    editApplicationsVersions
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: (
            <Alert
              message={t(`applicationsVersions.editApplicationsVersionsSuccessMessage`)}
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
    setModalState((prevModalState) => ({ ...prevModalState, edit: editApplicationsVersions.isLoading }));
  }, [editApplicationsVersions.isLoading]);

  const columns = [
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('applicationsVersions.appType')}</Header>,
      dataIndex: 'appType',
      render: (record: number) => {
        return <>{record === 1 ? t('applicationsVersions.Basic') : t('applicationsVersions.Partner')}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('applicationsVersions.systemType')}</Header>,
      dataIndex: 'systemType',
      render: (record: number) => {
        return <>{record === 1 ? t('applicationsVersions.Android') : t('applicationsVersions.IOS')}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('applicationsVersions.versionCode')}</Header>,
      dataIndex: 'versionCode',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('applicationsVersions.versionNumber')}</Header>,
      dataIndex: 'versionNumber',
    },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.description')}</Header>, dataIndex: 'description' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('applicationsVersions.necessaryToUpdate')}</Header>,
      dataIndex: 'updateOptions',
      render: (record: number) => {
        return (
          <Space>
            {record === 1 ? (
              <Tag color="#30af5b" style={{ padding: '4px' }}>
                {t('applicationsVersions.Optional')}
              </Tag>
            ) : record === 2 ? (
              <Tag color="#01509a" style={{ padding: '4px' }}>
                {t('applicationsVersions.Mandatory')}
              </Tag>
            ) : (
              <Tag color="#ff6b45" style={{ padding: '4px' }}>
                {t('applicationsVersions.Nothing')}
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: ApplicationsVersion) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('applicationsVersions.change')}>
              <TableButton
                severity="success"
                onClick={() => {
                  setChangemodaldata(record);
                  handleModalOpen('change');
                }}
              >
                <DashOutlined />
              </TableButton>
            </Tooltip>
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
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('applicationsVersions.ApplicationsVersionsList')}
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
            <CreateButtonText>{t('applicationsVersions.addApplicationsVersions')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Add    */}
          {modalState.add && (
            <AddApplicationVersion
              visible={modalState.add}
              onCancel={() => handleModalClose('add')}
              onCreate={(info) => {
                addApplicationsVersions.mutateAsync(info);
              }}
              isLoading={addApplicationsVersions.isLoading}
            />
          )}

          {/*    EDIT    */}
          {modalState.edit && (
            <EditApplicationVersion
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id)}
              isLoading={editApplicationsVersions.isLoading}
            />
          )}

          {/*    Change    */}
          {modalState.change && (
            <ChangeNecessaryToUpdate
              values={changemodaldata}
              visible={modalState.change}
              onCancel={() => handleModalClose('change')}
              onEdit={(data) => {
                changemodaldata !== undefined && handleChange(data, changemodaldata.id);
              }}
              isLoading={changeOptionApplicationsVersions.isLoading}
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
