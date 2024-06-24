import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Button, InputNumber, Modal, Space } from 'antd';
import React from 'react';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { P1 } from '../common/typography/P1/P1';
import { useTranslation } from 'react-i18next';
import { EditCommissionSettingProps } from './ModalProps';
import { useForm } from 'antd/lib/form/Form';
import { LableText } from '../GeneralStyles';
import { CommiossionSettingConfig } from '@app/interfaces/interfaces';

const EditCommissionSetting: React.FC<EditCommissionSettingProps> = ({
  visible,
  onEdit,
  values,
  onCancel,
  isLoading,
}) => {
  const { isDesktop, isTablet } = useResponsive();
  const { t } = useTranslation();
  const [form] = useForm();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: CommiossionSettingConfig) => {
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('config.editCommissionSetting')}
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
      <BaseForm
        form={form}
        initialValues={values}
        layout="vertical"
        onFinish={onFinish}
        name="EditCommissionForBranchesWithOutCompanySettingForm"
      >
        <BaseForm.Item
          name="commissionForBranchesWithOutCompany"
          label={<LableText>{t('config.commissionForBranchesWithOutCompany')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber addonAfter={'%'} min={0} max={100} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};

export default EditCommissionSetting;
