import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Space, Tooltip, message } from 'antd';
import { useResponsive } from '@app/hooks/useResponsive';
import { Card } from '@app/components/common/Card/Card';
import Button from 'antd/es/button/button';
import { useQuery, useMutation } from 'react-query';
import {
  getAllOffers,
  getrejectedOffers,
  returnOfferToProvider,
  sendForUser,
  updateOfferToProvider,
} from '@app/services/offers';
import { Table } from '@app/components/common/Table/Table';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { Header, CreateButtonText, TableButton } from '../../GeneralStyles';
import { RequestModel, offerModel } from '@app/interfaces/interfaces';
import { useLanguage } from '@app/hooks/useLanguage';
import Tag from 'antd/es/tag';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LeftOutlined,
  RetweetOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { TextBack } from '@app/components/GeneralStyles';
import ReloadBtn from '../ReusableComponents/ReloadBtn';
import { SendRejectReason } from '@app/components/modal/SendRejectReason';
import { EditOffer } from '@app/components/modal/EditOffer';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const Offers: React.FC = () => {
  const searchString = useSelector((state: any) => state.search);
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { language } = useLanguage();
  const { isTablet, isMobile, isDesktop, desktopOnly } = useResponsive();
  const { requestId, companyId, branchId, type, userId } = useParams();

  const [modalState, setModalState] = useState({
    edit: false,
    return: false,
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [dataSource, setDataSource] = useState<RequestModel[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [isReturned, setIsReturned] = useState(false);
  const [returnmodaldata, setReturnmodaldata] = useState<RequestModel | undefined>(undefined);
  const [isEdited, setIsEdited] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<offerModel | undefined>(undefined);
  const [hasPermissions, setHasPermissions] = useState({
    details: false,
    ChangeStatus: false,
    edit: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Offer.List')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        details: true,
      }));
    }

    if (userPermissions.includes('Offer.ChangeStatus')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        ChangeStatus: true,
      }));
    }

    if (userPermissions.includes('Offer.Update')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        edit: true,
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
    ['Offers', page, pageSize, isReturned, isEdited],
    () =>
      getAllOffers(
        page,
        pageSize,
        searchString,
        requestId != undefined ? requestId : '',
        companyId != undefined ? companyId : '',
        branchId != undefined ? branchId : '',
        requestId != undefined && type === 'offersThatHeHave'
          ? '2'
          : requestId != undefined && type !== 'offersThatHeHave'
          ? '1'
          : '',
      )
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
      enabled: (dataSource === undefined && type === undefined) || type === 'offersThatHeHave',
    },
  );

  const { refetch: refetchRejectedOffers, isRefetching: isRefetchingRejectedOffers } = useQuery(
    ['Offers', page, pageSize],
    () =>
      getrejectedOffers(page, pageSize, searchString, requestId)
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
      enabled: type === 'rejectedoffers',
    },
  );

  const editOffer = useMutation((data: any) =>
    updateOfferToProvider(data)
      .then((data) => {
        data.data?.success &&
          (setIsEdited(data.data?.success),
          message.open({
            content: <Alert message={t('offers.editOfferSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleEdit = (info: any) => {
    const data = {
      ...info,
      id: editmodaldata?.id,
      price: editmodaldata?.price,
      requestId: requestId,
      serviceValueForOffers: info.serviceValueForOffers,
    };
    editOffer.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editOffer.isLoading }));
  }, [editOffer.isLoading]);

  const returnOffer = useMutation((data: any) =>
    returnOfferToProvider(data)
      .then((data) => {
        data.data?.success &&
          (setIsReturned(data.data?.success),
          message.open({
            content: <Alert message={t('offers.returnOfferSuccessMessage')} type={`success`} showIcon />,
          }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      }),
  );

  const handleReturn = (info: any) => {
    const data = { offerId: returnmodaldata?.id, reasonRefuse: info.reasonRefuse };
    returnOffer.mutateAsync(data);
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, return: returnOffer.isLoading }));
  }, [returnOffer.isLoading]);

  useEffect(() => {
    if (isRefetching) setLoading(true);
    else setLoading(false);
  }, [isRefetching]);

  useEffect(() => {
    if (type === undefined) {
      setLoading(true);
      refetch();
    }
  }, [page, pageSize, language, searchString, refetch, refetchData, isReturned, isEdited]);

  useEffect(() => {
    if (type === 'rejectedoffers') {
      setLoading(true);
      refetchRejectedOffers();
    }
  }, [page, pageSize, language, searchString, refetchRejectedOffers, refetchData, isReturned, isEdited]);

  useEffect(() => {
    if (page > 1 && dataSource?.length === 0) {
      setPage(1);
    }
  }, [page, dataSource]);

  const sendForUserMutation = useMutation((data: string[]) =>
    sendForUser(data)
      .then((res) => {
        res.data?.success &&
          message.open({
            content: <Alert message={t('offers.sendToUserSuccessMessage')} type={`success`} showIcon />,
          });
        Navigate('/requests', { replace: false });
      })
      .catch((error) =>
        message.open({ content: <Alert message={error.message || error.error?.message} type={`error`} showIcon /> }),
      ),
  );

  const handleCheckboxChangeForSendToUser = (id: string) => {
    if (selectedOffers.includes(id)) {
      setSelectedOffers(selectedOffers.filter((item) => item !== id));
    } else {
      setSelectedOffers([...selectedOffers, id]);
    }
  };

  const columns = [
    requestId !== undefined &&
      type === undefined && {
        title: <Header style={{ wordBreak: 'normal' }}>{t('requests.selected')}</Header>,
        dataIndex: 'id',
        render: (id: any) => (
          <Checkbox onChange={() => handleCheckboxChangeForSendToUser(id)} checked={selectedOffers.includes(id)} />
        ),
      },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('common.id')}</Header>, dataIndex: 'id' },
    { title: <Header style={{ wordBreak: 'normal' }}>{t('offers.price')}</Header>, dataIndex: 'price' },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.provider')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.provider === 1 && (
              <Tag key={record?.id} color="#01509a" style={{ padding: '4px' }}>
                {t('offers.company')}
              </Tag>
            )}
            {record.provider === 2 && (
              <Tag key={record?.id} color="#30af5b" style={{ padding: '4px' }}>
                {t('offers.branch')}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.providerName')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.provider === 1 && record.selectedCompanies.company.name}
            {record.provider === 2 && record.selectedCompanies.companyBranch.name}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.providerPhoneNumber')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.provider === 1 &&
              record.selectedCompanies.company.companyContact?.dialCode +
                ' ' +
                record.selectedCompanies.company.companyContact?.phoneNumber}
            {record.provider === 2 &&
              record.selectedCompanies.companyBranch.companyContact?.dialCode +
                ' ' +
                record.selectedCompanies.companyBranch.companyContact?.phoneNumber}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.providerEmailAddress')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.provider === 1 && record.selectedCompanies.company.companyContact?.emailAddress}
            {record.provider === 2 && record.selectedCompanies.companyBranch.companyContact?.emailAddress}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.providerNumberOfTransfers')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.provider === 1 && record.selectedCompanies.company.numberOfTransfers}
            {record.provider === 2 && record.selectedCompanies.companyBranch.numberOfTransfers}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.isExtendStorage')}</Header>,
      dataIndex: 'provider',
      render: (index: number, record: any) => {
        return (
          <>
            {record.isExtendStorage === true && (
              <TableButton severity="success">
                <CheckOutlined />
              </TableButton>
            )}
            {record.isExtendStorage === false && (
              <TableButton severity="error">
                <CloseOutlined />
              </TableButton>
            )}
          </>
        );
      },
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('offers.priceForOnDayStorage')}</Header>,
      dataIndex: 'priceForOnDayStorage',
      render: (index: number, record: any) => {
        return <>{record.priceForOnDayStorage == null ? '___' : record.priceForOnDayStorage}</>;
      },
    },
    {
      title: <Header style={{ wordBreak: 'break-word' }}>{t('requests.comment')}</Header>,
      dataIndex: 'note',
    },
    {
      title: <Header style={{ wordBreak: 'normal' }}>{t('common.actions')}</Header>,
      dataIndex: 'actions',
      render: (index: number, record: any) => {
        return (
          <Space>
            {hasPermissions.details && (
              <Tooltip placement="top" title={t('common.details')}>
                <TableButton
                  severity="success"
                  onClick={() => {
                    Navigate(`${record.id}/details`, { state: record.name });
                  }}
                >
                  <TagOutlined />
                </TableButton>
              </Tooltip>
            )}

            {!userId && (
              <>
                {hasPermissions.ChangeStatus && (
                  <Tooltip placement="top" title={t('common.return')}>
                    <TableButton
                      disabled={record.statues !== 1}
                      severity="warning"
                      onClick={() => {
                        setReturnmodaldata(record);
                        handleModalOpen('return');
                      }}
                    >
                      <RetweetOutlined />
                    </TableButton>
                  </Tooltip>
                )}

                {hasPermissions.edit && (
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
                )}
              </>
            )}
          </Space>
        );
      },
    },
  ].filter(Boolean);

  return (
    <>
      <Card
        title={t('offers.offersList')}
        padding={
          dataSource === undefined || dataSource?.length === 0 || (page === 1 && totalCount <= pageSize)
            ? '1.25rem 1.25rem 1.25rem'
            : '1.25rem 1.25rem 0'
        }
        style={{ height: 'auto', marginBottom: '70px' }}
      >
        <Row justify={'end'} align={'middle'}>
          <Btn
            style={{
              margin: '0 .5rem .5rem 0',
              width: 'auto',
            }}
            type="ghost"
            onClick={() => Navigate(-1)}
            icon={<LeftOutlined />}
          >
            <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
          </Btn>

          <ReloadBtn setRefetchData={setRefetchData} />

          {/*    Return    */}
          {modalState.return && (
            <SendRejectReason
              visible={modalState.return}
              onCancel={() => handleModalClose('return')}
              onCreate={(info) => {
                handleReturn(info);
              }}
              isLoading={returnOffer.isLoading}
              type="returnOffer"
            />
          )}

          {/*    Edit    */}
          {modalState.edit && (
            <EditOffer
              values={editmodaldata}
              visible={modalState.edit}
              onCancel={() => handleModalClose('edit')}
              onEdit={(data) => {
                editmodaldata !== undefined && handleEdit(data);
              }}
              isLoading={editOffer.isLoading}
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

      {hasPermissions.ChangeStatus && requestId !== undefined && type === undefined && (
        <Button
          disabled={dataSource?.length == 0}
          type="primary"
          style={{
            marginBottom: '.5rem',
            width: 'auto',
            height: 'auto',
          }}
          onClick={() => sendForUserMutation.mutateAsync(selectedOffers)}
        >
          <CreateButtonText>{t('common.done')}</CreateButtonText>
        </Button>
      )}
    </>
  );
};
