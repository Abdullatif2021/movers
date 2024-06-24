import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Row, Tooltip } from 'antd';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { HoursInSystemConfig } from '@app/interfaces/interfaces';
import { Details, DetailsRow, DetailsTitle, DetailsValue, TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetHoursInSystemSetting, UpdateHoursInSystemSetting } from '@app/services/configurations';
import { EditHoursInSystemSetting } from '@app/components/modal/EditHoursInSystemSetting';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const HoursInSystemSetting: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [hoursInSystemData, setHoursInSystemData] = useState<HoursInSystemConfig | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<HoursInSystemConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState({
    SetHoursInSystem: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('SetHoursInSystem')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        SetHoursInSystem: true,
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
    ['GetHoursInSystemSetting'],
    () =>
      GetHoursInSystemSetting()
        .then((data) => {
          const result = data.data?.result;
          setHoursInSystemData(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: hoursInSystemData === undefined,
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

  const editHoursInSystemSetting = useMutation((data: HoursInSystemConfig) => UpdateHoursInSystemSetting(data));

  const handleEdit = (data: HoursInSystemConfig) => {
    editHoursInSystemSetting
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`config.editHoursInSystemSettingSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editHoursInSystemSetting.isLoading }));
  }, [editHoursInSystemSetting.isLoading]);

  return (
    <>
      <Row justify={'end'}>
        {/*    EDIT    */}
        {modalState.edit && (
          <EditHoursInSystemSetting
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data)}
            isLoading={editHoursInSystemSetting.isLoading}
          />
        )}
      </Row>

      <Card
        title={t('config.HoursInSystemSetting')}
        bordered={false}
        extra={
          hasPermissions.SetHoursInSystem && (
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setModalState;
                  setEditmodaldata(hoursInSystemData);
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
            <DetailsTitle style={{ width: '95%', marginRight: '0' }}>{t('config.hoursToWaitUser')}</DetailsTitle>
            <DetailsValue>{hoursInSystemData?.hoursToWaitUser}</DetailsValue>
          </DetailsRow>

          <DetailsRow key={1}>
            <DetailsTitle style={{ width: '95%', marginRight: '0' }}>
              {t('config.hoursToConvertRequestToOutOfPossible')}
            </DetailsTitle>
            <DetailsValue>{hoursInSystemData?.hoursToConvertRequestToOutOfPossible}</DetailsValue>
          </DetailsRow>
        </Details>
      </Card>
    </>
  );
};
