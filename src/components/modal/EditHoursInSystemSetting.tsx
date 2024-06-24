import React from 'react';
import { InputNumber, Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditHoursInSystemSettingProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { HoursConfig } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';

export const EditHoursInSystemSetting: React.FC<EditHoursInSystemSettingProps> = ({
  visible,
  onCancel,
  values,
  onEdit,
  isLoading,
}) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: HoursConfig) => {
    onEdit(value);
  };

  return (
    <Modal
      width={isDesktop ? '540px' : isTablet ? '500px' : '450px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('config.editHoursSetting')}
        </div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button type="ghost" style={{ height: 'auto' }} onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} onClick={onOk}>
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="EditHoursSettingForm">
        <BaseForm.Item
          name="hoursToWaitUser"
          label={t('config.hoursToWaitUser')}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              pattern: /^[0-9]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyNumbers')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber addonAfter={'Hour'} min={1} />
        </BaseForm.Item>

        <BaseForm.Item
          name="hoursToConvertRequestToOutOfPossible"
          label={t('config.hoursToConvertRequestToOutOfPossible')}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              pattern: /^[0-9]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyNumbers')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber addonAfter={'Hour'} min={1} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
