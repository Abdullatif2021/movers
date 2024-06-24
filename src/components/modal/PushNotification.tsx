import React from 'react';
import { Space, Modal } from 'antd';
import { CreateNotificationModalProps } from './ModalProps';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { Button } from '../common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { P1 } from '../common/typography/P1/P1';
import { LableText, Text } from '@app/components/GeneralStyles';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { TextArea } from '../../components/GeneralStyles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { Notification } from '@app/components/Admin/Notifications';
import { LanguageType } from '@app/interfaces/interfaces';

export const PushNotification: React.FC<CreateNotificationModalProps> = ({
  visible,
  onCreateNotification,
  onCancel,
  isManager,
  isLoading,
}) => {
  const { isDesktop, isTablet } = useResponsive();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: Notification) => {
    let data = {
      destination: value.destination,
      translations: [
        {
          message: value.translations[0].message,
          language: 'en' as LanguageType,
        },
        {
          message: value.translations[1].message,
          language: 'ar' as LanguageType,
        },
      ],
    };
    data = user.userType === 1 ? { ...data } : data;
    onCreateNotification(data);
  };

  const buttonStyle = { height: 'auto' };
  return (
    <Modal
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>{t('notifications.send')}</div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button style={buttonStyle} key="cancel" type="ghost" onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button style={buttonStyle} loading={isLoading} key="save" type="primary" onClick={onOk}>
              <P1>{t('notifications.send')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="userForm">
        <BaseForm.Item
          style={{ marginTop: '-1rem' }}
          name={`destination`}
          label={<LableText>{t(`notifications.destination.destination`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select>
            <Option value={0}>
              <Text>{t('notifications.destination.all')}</Text>
            </Option>
            <Option value={1}>
              <Text>{t('notifications.destination.Users')}</Text>
            </Option>
            <Option value={2}>
              <Text>{t('notifications.destination.companies')}</Text>
            </Option>
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 0, 'message']}
          label={<LableText>{t(`notifications.englishMessage`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'message']}
          label={<LableText>{t(`notifications.arabicMessage`)}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl' }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
