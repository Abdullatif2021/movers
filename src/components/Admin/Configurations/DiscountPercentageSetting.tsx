import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Row, Tooltip } from 'antd';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { DiscountPercentageConfig } from '@app/interfaces/interfaces';
import { Details, DetailsRow, DetailsTitle, DetailsValue, TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetDiscountPercentageSetting, UpdateDiscountPercentageSetting } from '@app/services/configurations';
import { EditDiscountPercentageSetting } from '@app/components/modal/EditDiscountPercentageSetting';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const DiscountPercentageSetting: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [discountPercentageData, setDiscountPercentageData] = useState<DiscountPercentageConfig | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<DiscountPercentageConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState({
    SetDiscountPercentage: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('SetDiscountPercentage')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        SetDiscountPercentage: true,
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
    ['GetDiscountPercentageSetting'],
    () =>
      GetDiscountPercentageSetting()
        .then((data) => {
          const result = data.data?.result;
          setDiscountPercentageData(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: discountPercentageData === undefined,
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
  }, [isEdit, refetch, language]);

  const editDiscountPercentageSetting = useMutation((data: DiscountPercentageConfig) =>
    UpdateDiscountPercentageSetting(data),
  );

  const handleEdit = (data: DiscountPercentageConfig) => {
    editDiscountPercentageSetting
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: (
            <Alert message={t(`config.editDiscountPercentageSettingSuccessMessage`)} type={`success`} showIcon />
          ),
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editDiscountPercentageSetting.isLoading }));
  }, [editDiscountPercentageSetting.isLoading]);

  return (
    <>
      <Row justify={'end'}>
        {/*    EDIT    */}
        {modalState.edit && (
          <EditDiscountPercentageSetting
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data)}
            isLoading={editDiscountPercentageSetting.isLoading}
          />
        )}
      </Row>

      <Card
        title={t('config.DiscountPercentageSetting')}
        bordered={false}
        extra={
          hasPermissions.SetDiscountPercentage && (
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setModalState;
                  setEditmodaldata(discountPercentageData);
                  handleModalOpen('edit');
                }}
              >
                <EditOutlined />
              </TableButton>
            </Tooltip>
          )
        }
        loading={loading}
      >
        <Details>
          <DetailsRow key={1}>
            <DetailsTitle style={{ width: '95%', marginRight: '0' }}>
              {t('config.discountPercentageIfUserCancelHisRequest')}
            </DetailsTitle>
            <DetailsValue>{discountPercentageData?.discountPercentageIfUserCancelHisRequest}</DetailsValue>
          </DetailsRow>
        </Details>
      </Card>
    </>
  );
};
