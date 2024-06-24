import React from 'react';
import { Space, Modal, InputNumber, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateGroupModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const AddCommissionGroup: React.FC<CreateGroupModalProps> = ({ visible, onCancel, onCreate, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: any) => {
    const data = { name: value.name, isDefault: false };
    onCreate(data);
  };

  return (
    <Modal
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('groups.addGroupModalTitle')}
        </div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button key="cancel" style={{ height: 'auto' }} type="ghost" onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} key="add" onClick={onOk}>
              <P1>{t('groups.addGroupModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="AddGroupForm">
        <BaseForm.Item
          name={['name']}
          label={<LableText>{t(`common.title`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              pattern: /^[0-9]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyNumbers')}</p>,
            },
            {
              max: 3,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('groups.only3Number')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input addonAfter="%" defaultValue={0} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
