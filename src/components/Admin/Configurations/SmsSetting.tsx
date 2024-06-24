import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Row, Tooltip } from 'antd';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { SmsConfig } from '@app/interfaces/interfaces';
import { Details, DetailsRow, DetailsTitle, DetailsValue, TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetSmsSetting, UpdateSmsSetting } from '@app/services/configurations';
import { EditSmsSetting } from '@app/components/modal/EditSmsSetting';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const SmsSetting: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [SmsData, setSmsData] = useState<SmsConfig | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<SmsConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState({
    SetSmsSetting: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('SetSmsSetting')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        SetSmsSetting: true,
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
    ['GetSmsSetting'],
    () =>
      GetSmsSetting()
        .then((data) => {
          const result = data.data?.result;
          setSmsData(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: SmsData === undefined,
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

  const editSmsSetting = useMutation((data: SmsConfig) => UpdateSmsSetting(data));

  const handleEdit = (data: SmsConfig) => {
    editSmsSetting
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`config.editSmsSettingSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editSmsSetting.isLoading }));
  }, [editSmsSetting.isLoading]);

  return (
    <>
      <Row justify={'end'}>
        {/*    EDIT    */}
        {modalState.edit && (
          <EditSmsSetting
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data)}
            isLoading={editSmsSetting.isLoading}
          />
        )}
      </Row>

      <Card
        title={t('config.SmsSetting')}
        bordered={false}
        extra={
          hasPermissions.SetSmsSetting && (
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setModalState;
                  setEditmodaldata(SmsData);
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
            <DetailsTitle>{t('config.smsUserName')}</DetailsTitle>
            <DetailsValue>{SmsData?.smsUserName}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={2}>
            <DetailsTitle> {t('config.smsPassword')} </DetailsTitle>
            <DetailsValue>{SmsData?.smsPassword}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={3}>
            <DetailsTitle> {t('config.serviceAccountSID')} </DetailsTitle>
            <DetailsValue>{SmsData?.serviceAccountSID}</DetailsValue>
          </DetailsRow>
        </Details>
      </Card>
    </>
  );
};
