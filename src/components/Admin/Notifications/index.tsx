import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  getAllPushNotification,
  DeletePushNotification,
  sendPushNotification,
  ResendPushNotification,
} from '@app/services/pushNotifications';
import { useMutation, useQuery } from 'react-query';
import { Alert, Row, Space, Tooltip, message } from 'antd';
import { Card } from 'components/common/Card/Card';
import { Header, TableButton } from '../../GeneralStyles';
import { PushNotification } from '@app/components/modal/PushNotification';
import { useResponsive } from '@app/hooks/useResponsive';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Button } from '@app/components/common/buttons/Button/Button';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Table, CreateButtonText } from '../../GeneralStyles';
import { LanguageType } from '@app/interfaces/interfaces';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';

export type Translation = {
  message: string;
  language: LanguageType;
};

export type Notification = {
  id?: number;
  destination: number;
  translations: Translation[];
};

export const Notifications: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [notificationsData, setNotificationsData] = useState<Notification[] | undefined>(undefined);
  const [isOpenPushModalForm, setIsOpenPushModalForm] = useState(false);
  const [isOpenResendModalForm, setIsOpenResendModalForm] = useState(false);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDelete, setIsDelete] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [refetchOnAddNotification, setRefetchOnAddNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletemodaldata, setDeletemodaldata] = useState<Notification | undefined>(undefined);
  const [resendmodaldata, setResendmodaldata] = useState<Notification | undefined>(undefined);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const { isTablet, isMobile, isDesktop } = useResponsive();

  const user = useAppSelector((state) => state.user.user);

  const { refetch, isRefetching } = useQuery(
    ['Notifications messages', page, isDelete, pageSize, refetchOnAddNotification],
    () =>
      getAllPushNotification(page, pageSize, searchString)
        .then((data) => {
          const notifications = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          notifications?.forEach((element: Notification) => {
            const enTranslationIndex = element.translations?.findIndex(
              (translation: Translation) => translation.language === 'en',
            );
            if (enTranslationIndex > -1) {
              const enTranslation = element.translations.splice(enTranslationIndex, 1);
              element.translations.unshift(enTranslation[0]);
            }
          });
          setNotificationsData(notifications);
          setIsLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setIsLoading(false);
        }),
    {
      enabled: notificationsData === undefined,
    },
  );

  useEffect(() => {
    setIsLoading(true);
    refetch();
    setIsDelete(false);
    setIsResend(false);
    setRefetchOnAddNotification(false);
  }, [isDelete, isResend, refetchOnAddNotification, page, pageSize, language, searchString, refetch, refetchData]);

  useEffect(() => {
    if (isRefetching) setIsLoading(true);
    else setIsLoading(false);
  }, [isRefetching]);

  const pushNotification = useMutation((data: Notification) =>
    sendPushNotification(data)
      .then((data) => {
        notificationController.success({ message: t('notifications.sendSuccessMessage') });
        setRefetchOnAddNotification(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenPushModalForm(pushNotification.isLoading);
  }, [pushNotification.isLoading]);

  const deleteNotification = useMutation((id: number) =>
    DeletePushNotification(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('notifications.deleteNotifactionsSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error: any) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleDelete = (id: any) => {
    if (page > 1) {
      deleteNotification.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteNotification.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteNotification.isLoading);
  }, [deleteNotification.isLoading]);

  const resendNotification = useMutation((id: number) =>
    ResendPushNotification(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('notifications.resendNotifactionsSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error: any) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleResend = (id: any) => {
    if (page > 1) {
      resendNotification.mutateAsync(id);
      setPage(page - 1);
    } else {
      resendNotification.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenResendModalForm(resendNotification.isLoading);
  }, [resendNotification.isLoading]);

  const notificationsColumns = [
    {
      title: (
        <Header>
          <Trans i18nKey={'common.id'} />
        </Header>
      ),
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.englishMessage'} />
        </Header>
      ),
      dataIndex: ['translations', 0, 'message'],
      width: '30%',
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.arabicMessage'} />
        </Header>
      ),
      dataIndex: ['translations', 1, 'message'],
      width: '30%',
      render: (text: string) => {
        return <div style={{ fontFamily: 'Cairo' }}>{text}</div>;
      },
    },
    {
      title: (
        <Header>
          <Trans i18nKey={'notifications.actions'} />
        </Header>
      ),
      dataIndex: 'actions',
      width: '30%',
      render: (index: number, Data: Notification) => {
        return (
          <Space>
            <Tooltip placement="top" title={t('common.delete')}>
              <TableButton
                severity="error"
                onClick={() => {
                  setDeletemodaldata(Data);
                  setIsOpenDeleteModalForm(true);
                }}
              >
                <DeleteOutlined />
              </TableButton>
            </Tooltip>

            <Tooltip placement="top" title={t('common.resend')}>
              <TableButton
                severity="warning"
                onClick={() => {
                  setResendmodaldata(Data);
                  setIsOpenResendModalForm(true);
                }}
              >
                <RedoOutlined />
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
        title={t('notifications.notificationsList')}
        padding={
          notificationsData?.length === 0 || notificationsData === undefined || (page === 1 && totalCount <= pageSize)
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
            onClick={() => setIsOpenPushModalForm(true)}
          >
            <CreateButtonText>{t('notifications.send')}</CreateButtonText>
          </Button>

          <ReloadBtn setRefetchData={setRefetchData} />

          {isOpenResendModalForm ? (
            <ActionModal
              visible={isOpenResendModalForm}
              onCancel={() => setIsOpenResendModalForm(false)}
              onOK={() => {
                resendmodaldata !== undefined && handleResend(resendmodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('notifications.resendNotficationModalTitle')}
              okText={t('common.resend')}
              cancelText={t('common.cancel')}
              description={t('notifications.resendNotifactionModalDescription')}
              isDanger={true}
              isLoading={resendNotification.isLoading}
            />
          ) : null}

          {isOpenPushModalForm ? (
            <PushNotification
              isManager={user.userType === 0 ? false : true}
              visible={isOpenPushModalForm}
              onCancel={() => setIsOpenPushModalForm(false)}
              onCreateNotification={(data) => {
                pushNotification.mutateAsync(data);
              }}
              isLoading={pushNotification.isLoading}
            />
          ) : null}

          {isOpenDeleteModalForm ? (
            <ActionModal
              visible={isOpenDeleteModalForm}
              onCancel={() => setIsOpenDeleteModalForm(false)}
              onOK={() => {
                deletemodaldata !== undefined && handleDelete(deletemodaldata.id);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('notifications.deleteNotficationModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('notifications.deleteNotifactionModalDescription')}
              isDanger={true}
              isLoading={deleteNotification.isLoading}
            />
          ) : null}
        </Row>

        <Table
          dataSource={notificationsData}
          pagination={{
            showSizeChanger: true,
            onChange: (page: number, pageSize: number) => {
              setPage(page);
              setPageSize(pageSize);
            },
            pageSize: pageSize,
            current: page,
            showQuickJumper: true,
            showTitle: false,
            total: totalCount || 0,
            hideOnSinglePage: false,
            responsive: true,
            showLessItems: true,
            pageSizeOptions: [5, 10, 15, 20],
          }}
          columns={notificationsColumns.map((col) => ({ ...col, width: 'auto' }))}
          loading={isLoading}
          scroll={{ x: isTablet ? 700 : isMobile ? 800 : 600 }}
        />
      </Card>
    </>
  );
};
