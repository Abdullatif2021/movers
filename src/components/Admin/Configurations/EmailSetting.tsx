import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, message, Row, Tooltip } from 'antd';
import { Card } from '@app/components/common/Card/Card';
import { useQuery, useMutation } from 'react-query';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert } from '@app/components/common/Alert/Alert';
import { notificationController } from '@app/controllers/notificationController';
import { EmailConfig } from '@app/interfaces/interfaces';
import { Details, DetailsRow, DetailsTitle, DetailsValue, TableButton } from '../../GeneralStyles';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetEmailSetting, UpdateEmailSetting } from '@app/services/configurations';
import { EditEmailSetting } from '@app/components/modal/EditEmailSetting';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const EmailSetting: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [modalState, setModalState] = useState({
    edit: false,
  });
  const [emailData, setEmailData] = useState<EmailConfig | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);
  const [editmodaldata, setEditmodaldata] = useState<EmailConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState({
    SetEmailSetting: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('SetEmailSetting')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        SetEmailSetting: true,
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
    ['GetEmailSetting'],
    () =>
      GetEmailSetting()
        .then((data) => {
          const result = data.data?.result;
          setEmailData(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: emailData === undefined,
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

  const editEmailSetting = useMutation((data: EmailConfig) => UpdateEmailSetting(data));

  const handleEdit = (data: EmailConfig) => {
    editEmailSetting
      .mutateAsync({ ...data })
      .then((data) => {
        setIsEdit(data.data?.success);
        message.open({
          content: <Alert message={t(`config.editEmailSettingSuccessMessage`)} type={`success`} showIcon />,
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={`error`} showIcon /> });
      });
  };

  useEffect(() => {
    setModalState((prevModalState) => ({ ...prevModalState, edit: editEmailSetting.isLoading }));
  }, [editEmailSetting.isLoading]);

  return (
    <>
      <Row justify={'end'}>
        {/*    EDIT    */}
        {modalState.edit && (
          <EditEmailSetting
            values={editmodaldata}
            visible={modalState.edit}
            onCancel={() => handleModalClose('edit')}
            onEdit={(data: any) => editmodaldata !== undefined && handleEdit(data)}
            isLoading={editEmailSetting.isLoading}
          />
        )}
      </Row>

      <Card
        title={t('config.EmailSetting')}
        bordered={false}
        extra={
          hasPermissions.SetEmailSetting && (
            <Tooltip placement="top" title={t('common.edit')}>
              <TableButton
                severity="info"
                onClick={() => {
                  setModalState;
                  setEditmodaldata(emailData);
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
            <DetailsTitle>{t('config.message')}</DetailsTitle>
            <DetailsValue>{emailData?.message}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={2}>
            <DetailsTitle> {t('config.messageForResetPassword')} </DetailsTitle>
            <DetailsValue>{emailData?.messageForResetPassword}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={3}>
            <DetailsTitle> {t('config.senderEmail')} </DetailsTitle>
            <DetailsValue>{emailData?.senderEmail}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={4}>
            <DetailsTitle> {t('config.senderPassword')} </DetailsTitle>
            <DetailsValue>{emailData?.senderPassword}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={5}>
            <DetailsTitle> {t('config.senderEnableSsl')} </DetailsTitle>
            <DetailsValue>
              {emailData?.senderEnableSsl == true ? (
                <TableButton severity="success">
                  <CheckOutlined />
                </TableButton>
              ) : (
                <TableButton severity="error">
                  <CloseOutlined />
                </TableButton>
              )}
            </DetailsValue>
          </DetailsRow>
          <DetailsRow key={6}>
            <DetailsTitle> {t('config.senderHost')} </DetailsTitle>
            <DetailsValue>{emailData?.senderHost}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={7}>
            <DetailsTitle> {t('config.senderPort')} </DetailsTitle>
            <DetailsValue>{emailData?.senderPort}</DetailsValue>
          </DetailsRow>
          <DetailsRow key={8}>
            <DetailsTitle> {t('config.senderUseDefaultCredentials')} </DetailsTitle>
            <DetailsValue>
              {emailData?.senderUseDefaultCredentials == true ? (
                <TableButton severity="info">
                  <CheckOutlined />
                </TableButton>
              ) : (
                <TableButton severity="error">
                  <CloseOutlined />
                </TableButton>
              )}
            </DetailsValue>
          </DetailsRow>
        </Details>
      </Card>
    </>
  );
};
