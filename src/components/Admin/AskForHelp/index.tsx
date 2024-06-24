import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Card } from 'components/common/Card/Card';
import { Header, TableButton } from '../../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { notificationController } from '@app/controllers/notificationController';
import { Table } from '../../GeneralStyles';
import { getAllAsks, confirmAsks } from '../../../services/asks';
import { useLanguage } from '@app/hooks/useLanguage';
import { useSelector } from 'react-redux';
import { Alert, Button, Col, Radio, RadioChangeEvent, Row, Space, Tag, Tooltip, message } from 'antd';
import { AuditOutlined, CheckOutlined } from '@ant-design/icons';
import { RadioGroup } from '@app/components/common/Radio/Radio';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { ActionModal } from '@app/components/modal/ActionModal';
import { useNavigate } from 'react-router-dom';
import { checkPIN } from '@app/services/drafts';
import { CheckPINForUser } from '@app/components/modal/CheckPINForUser';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { useAppSelector } from '@app/hooks/reduxHooks';

type User = {
  id: number;
  statues: number;
  message: string;
  user: {
    id: number;
    fullName: string;
    registrationFullName: string;
    phoneNumber: string;
    emailAddress: string;
    creationTime: string;
    type: number;
  };
};

export const AskForHelp: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop } = useResponsive();
  const Navigate = useNavigate();

  const [modalState, setModalState] = useState({
    checkPINForUser: false,
  });
  const [asksData, setAsksData] = useState<Notification[] | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [temp, setTemp] = useState<any>();
  const [statusType, setStatusType] = useState<number | string>('');
  const [confirmAskId, setConfirmAskId] = useState<any>(undefined);
  const [modalStatus, setModalStatus] = useState<boolean>();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string>('0');
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    add: false,
    confirm: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Request.Create')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        add: true,
      }));
    }

    if (userPermissions.includes('Request.ChangeStatus')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        confirm: true,
      }));
    }
  }, [userPermissions]);

  const handleModalOpen = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: true }));
  };

  const handleModalClose = (modalType: any) => {
    setModalState((prevModalState) => ({ ...prevModalState, [modalType]: false }));
  };

  const { refetch, isRefetching } = useQuery(
    ['getAllAsks'],
    () =>
      getAllAsks(statusType)
        .then((data) => {
          setAsksData(data.data?.result);
          setTotalCount(data.data?.result?.totalCount);
          setIsLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setIsLoading(false);
        }),
    {
      enabled: asksData === undefined,
    },
  );

  const handleConfirm = (id: any) => {
    confirmRequestHelp.mutateAsync(id);
  };

  const confirmRequestHelp = useMutation((data: any) =>
    confirmAsks(data)
      .then((data) => {
        data.data?.success &&
          message.open({
            content: <Alert message={t('asks.confirmAskSuccessMessage')} type={`success`} showIcon />,
          });
        setIsConfirmed(data.data?.success);
        setModalStatus(false);
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  useEffect(() => {
    if (isRefetching) setIsLoading(true);
    else setIsLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    setIsLoading(true);
    refetch();
  }, [isConfirmed, statusType, page, pageSize, language, searchString, refetch, refetchData]);

  const confirm = useMutation((data) =>
    checkPIN(data)
      .then((data) => {
        if (data.data?.success && data.data?.result?.isOwner) {
          message.open({
            content: <Alert message={t('requests.truePIN')} type={`success`} showIcon />,
          });
          Navigate(`/${userId}/drafts`);
        } else if (data.data?.success && !data.data?.result?.isOwner) {
          message.open({
            content: <Alert message={t('requests.falsePIN')} type={`error`} showIcon />,
          });
        }
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const columns = [
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>,
      dataIndex: 'id',
      width: '5%',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('asks.fullName')}</Header>,
      dataIndex: 'user',
      render: (record: User['user']) => (
        <div
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            textAlign: 'center',
          }}
        >
          {record?.registrationFullName === ' ' ? '___' : record?.registrationFullName}
        </div>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('asks.phoneNumber')}</Header>,
      dataIndex: 'user',
      render: (record: User['user']) => (
        <div
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            textAlign: 'center',
          }}
        >
          {record?.phoneNumber}
        </div>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('asks.emailAddress')}</Header>,
      dataIndex: 'user',
      render: (record: User['user']) => (
        <div
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            textAlign: 'center',
          }}
        >
          {record?.emailAddress}
        </div>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('asks.creationTime')}</Header>,
      dataIndex: 'user',
      render: (record: User['user']) => (
        <div
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            textAlign: 'center',
          }}
        >
          {record?.creationTime}
        </div>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('asks.message')}</Header>,
      dataIndex: 'message',
      render: (record: User) => (
        <div
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'break-spaces',
            textAlign: 'center',
          }}
        >
          {record === null ? '___' : record}
        </div>
      ),
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('asks.status')}</Header>,
      dataIndex: 'statues',
      render: (status: User['statues']) => {
        return (
          <>
            {status === 1 && (
              <Tag color="#30af5b" style={{ padding: '4px' }}>
                {t('asks.waiting')}
              </Tag>
            )}
            {status === 2 && (
              <Tag color="#01509a" style={{ padding: '4px' }}>
                {t('asks.followed')}
              </Tag>
            )}
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
              <Radio style={{ display: 'block', fontSize }} value={1}>
                {t('asks.waiting')}
              </Radio>
              <Radio style={{ display: 'block', fontSize }} value={2}>
                {t('asks.followed')}
              </Radio>
            </RadioGroup>
            <Row gutter={[5, 5]} style={{ marginTop: '.35rem' }}>
              <Col>
                <Button
                  style={{ fontSize, fontWeight: '400' }}
                  size="small"
                  onClick={() => {
                    setTemp(undefined);
                    setStatusType('');
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
                  onClick={() => setStatusType(temp === 1 ? 1 : 2)}
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
      render: (record: User) => {
        return (
          <>
            {record?.statues == 1 && (
              <Space>
                {hasPermissions.confirm && (
                  <Tooltip placement="top" title={t('asks.confirmHelpRequest')}>
                    <TableButton
                      severity="info"
                      onClick={() => {
                        setConfirmAskId(record?.id);
                        setModalStatus(true);
                      }}
                    >
                      <CheckOutlined />
                    </TableButton>
                  </Tooltip>
                )}

                {hasPermissions.add && (
                  <Tooltip placement="top" title={t('requests.addRequest')}>
                    <TableButton
                      severity="success"
                      onClick={() => {
                        setUserName(record?.user?.phoneNumber);
                        setUserId(record?.user?.id);
                        handleModalOpen('checkPINForUser');
                      }}
                    >
                      <AuditOutlined />
                    </TableButton>
                  </Tooltip>
                )}
              </Space>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t('asks.asksList')}
        padding={
          asksData?.length === 0 || asksData === undefined || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0rem'
        }
      >
        <Row justify={'end'}>
          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Check PIN For User    */}
          {modalState.checkPINForUser && (
            <CheckPINForUser
              visible={modalState.checkPINForUser}
              onCancel={() => handleModalClose('checkPINForUser')}
              onCreate={(info) => {
                const values = { ...info, phoneNumber: userName };
                confirm.mutateAsync(values);
              }}
              isLoading={confirm.isLoading}
            />
          )}

          {modalStatus && (
            <ActionModal
              visible={modalStatus}
              onCancel={() => setModalStatus(false)}
              onOK={() => {
                confirmAskId !== undefined && handleConfirm(confirmAskId);
              }}
              width={isDesktop || isTablet ? '450px' : '350px'}
              title={t('asks.confirmAskModalTitle')}
              okText={t('common.confrim')}
              cancelText={t('common.cancel')}
              description={t('asks.confirmAskModalDescription')}
              isLoading={confirmRequestHelp.isLoading}
            />
          )}
        </Row>

        <Table
          dataSource={asksData}
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
          columns={columns}
          loading={isLoading}
          scroll={{ x: isTablet ? 700 : isMobile ? 800 : 600 }}
        />
      </Card>
    </>
  );
};
