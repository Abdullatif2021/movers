import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Alert, Popconfirm, Row, Space, Tooltip, message } from 'antd';
import { Card } from 'components/common/Card/Card';
import { Header, LableText, TableButton } from '../../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Button } from '@app/components/common/buttons/Button/Button';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Table, CreateButtonText } from '../../GeneralStyles';
import { LanguageType, TermModal } from '@app/interfaces/interfaces';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { ActionModal } from '@app/components/modal/ActionModal';
import { Activation, DeActivate, DeleteTerm, UpdateTerm, createTerm, getAllTerm } from '@app/services/terms';
import { EditTerm } from '@app/components/modal/EditTerm';
import { AddTerm } from '@app/components/modal/AddTerm';
import { useSelector } from 'react-redux';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { defineColorBySeverity } from '@app/utils/utils';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';

export type Translation = {
  title: string;
  description: string;
  language: LanguageType;
};

export const Term: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [TermsData, setTermsData] = useState<TermModal[] | undefined>(undefined);
  const [isOpenPushModalForm, setIsOpenPushModalForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDeleteModalForm, setIsOpenDeleteModalForm] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<TermModal | undefined>(undefined);
  const [isOpenEditModalForm, setIsOpenEditModalForm] = useState(false);
  const [deletemodaldata, setDeletemodaldata] = useState<TermModal | undefined>(undefined);
  const [refetchOnAddTerm, setRefetchOnAddTerm] = useState(false);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [isActivate, setIsActivate] = useState(false);
  const [isDeActivate, setIsDeActivate] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const TableText = styled.div`
    font-size: ${isDesktop || isTablet ? FONT_SIZE.md : FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
  `;

  const { refetch, isRefetching } = useQuery(
    ['Terms', page, isDelete, pageSize, refetchOnAddTerm],
    () =>
      getAllTerm(page, pageSize, searchString)
        .then((data) => {
          const Terms = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          // Terms?.forEach((element: TermModal) => {
          //   const enTranslationIndex = element.translations?.findIndex(
          //     (translation: Translation) => translation.language === 'en',
          //   );
          //   if (enTranslationIndex > -1) {
          //     const enTranslation = element.translations.splice(enTranslationIndex, 1);
          //     element.translations.unshift(enTranslation[0]);
          //   }
          // });
          setTermsData(Terms);
          setIsLoading(!data.data?.success);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
          setIsLoading(false);
        }),
    {
      enabled: TermsData === undefined,
    },
  );

  useEffect(() => {
    setIsLoading(true);
    refetch();
    setIsDelete(false);
    setIsEdit(false);
    setRefetchOnAddTerm(false);
    setIsActivate(false);
    setIsDeActivate(false);
  }, [
    isDelete,
    isEdit,
    refetchOnAddTerm,
    page,
    pageSize,
    searchString,
    refetch,
    refetchData,
    isActivate,
    isDeActivate,
  ]);

  useEffect(() => {
    if (isRefetching) setIsLoading(true);
    else setIsLoading(false);
  }, [isRefetching]);

  const addTerm = useMutation((data: TermModal) =>
    createTerm(data)
      .then((data) => {
        notificationController.success({ message: t('terms.addTermSuccessMessage') });
        setRefetchOnAddTerm(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  useEffect(() => {
    setIsOpenPushModalForm(addTerm.isLoading);
  }, [addTerm.isLoading]);

  const deleteTerm = useMutation((id: number) =>
    DeleteTerm(id)
      .then((data: any) => {
        data.data?.success &&
          (setIsDelete(data.data?.success),
          message.open({
            content: <Alert message={t('terms.deleteTermsSuccessMessage')} type={`success`} showIcon />,
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
      deleteTerm.mutateAsync(id);
      setPage(page - 1);
    } else {
      deleteTerm.mutateAsync(id);
    }
  };

  useEffect(() => {
    setIsOpenDeleteModalForm(deleteTerm.isLoading);
  }, [deleteTerm.isLoading]);
  const editTerm = useMutation((data: TermModal) => UpdateTerm(data));

  const handleEdit = (data: TermModal, id: number) => {
    editTerm
      .mutateAsync({ ...data, id })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`terms.editTermSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setIsOpenEditModalForm(editTerm.isLoading);
  }, [editTerm.isLoading]);

  const activateTerm = useMutation((id: number) =>
    Activation(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('terms.activateTermSuccessMessage')} type="success" showIcon />,
        });
        setIsActivate(data.data?.success);
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const deActivateTerm = useMutation((id: number) =>
    DeActivate(id)
      .then((data) => {
        message.open({
          content: <Alert message={t('terms.deactivateTermSuccessMessage')} type="success" showIcon />,
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
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.title_en')}</Header>,
      dataIndex: ['translations', 0, 'title'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.title_ar')}</Header>,
      dataIndex: ['translations', 1, 'title'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description_en')}</Header>,
      dataIndex: ['translations', 0, 'description'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.description_ar')}</Header>,
      dataIndex: ['translations', 1, 'description'],
      render: (text: string) => {
        return <div style={{ fontFamily: 'Lato' }}>{text}</div>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('applicationsVersions.appType')}</Header>,
      dataIndex: 'app',
      render: (record: number) => {
        return (
          <>
            {record === 1
              ? t('applicationsVersions.Basic')
              : record === 2
              ? t('applicationsVersions.Partner')
              : record === 3
              ? t('requests.both')
              : ''}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: TermModal) => {
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
                  title={<LableText>{t('terms.deactivateTermConfirm')}</LableText>}
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
                      {deActivateTerm.isLoading ? (
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
                  onConfirm={() => record.id && deActivateTerm.mutateAsync(record.id)}
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
                  title={<LableText>{t('terms.activateTermConfirm')}</LableText>}
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
                      {activateTerm.isLoading ? (
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
                  onConfirm={() => record.id && activateTerm.mutateAsync(record.id)}
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
        title={t('terms.TermsList')}
        padding={
          TermsData?.length === 0 || TermsData === undefined || (page === 1 && totalCount <= pageSize)
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
            <CreateButtonText>{t('terms.addTerm')}</CreateButtonText>
          </Button>
          <ReloadBtn setRefetchData={setRefetchData} />
          {/*    Add    */}
          {isOpenPushModalForm && (
            <AddTerm
              visible={isOpenPushModalForm}
              onCancel={() => setIsOpenPushModalForm(false)}
              onCreateTerm={(data) => {
                addTerm.mutateAsync(data);
              }}
              isLoading={addTerm.isLoading}
            />
          )}

          {/*    EDIT    */}
          {isOpenEditModalForm && (
            <EditTerm
              values={editmodaldata}
              visible={isOpenEditModalForm}
              onCancel={() => setIsOpenEditModalForm(false)}
              onEdit={(data) => editmodaldata !== undefined && handleEdit(data, editmodaldata.id ?? 0)}
              isLoading={editTerm.isLoading}
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
              title={t('terms.deleteTermModalTitle')}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
              description={t('terms.deleteTermModalDescription')}
              isDanger={true}
              isLoading={deleteTerm.isLoading}
            />
          )}
        </Row>

        <Table
          dataSource={TermsData}
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
          columns={columns.map((col) => ({ ...col, width: 'auto' }))}
          loading={isLoading}
          scroll={{ x: isTablet ? 700 : isMobile ? 800 : 600 }}
        />
      </Card>
    </>
  );
};
