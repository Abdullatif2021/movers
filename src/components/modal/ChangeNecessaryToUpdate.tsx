import React, { useState } from 'react';
import { Modal, Radio, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { ChangeNecessaryToUpdateProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { ApplicationsVersion, CityModel, LanguageType } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';

export const ChangeNecessaryToUpdate: React.FC<ChangeNecessaryToUpdateProps> = ({
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

  const onFinish = (info: ApplicationsVersion) => {
    onEdit(info);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('applicationsVersions.ChangeNecessaryToUpdateModalTitle')}
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
        name="ChangeNecessaryToUpdatePropsForm"
      >
        <BaseForm.Item
          name="updateOptions"
          label={<LableText>{t(`applicationsVersions.updateOptions`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group style={{ display: 'flex', width: '100%' }} defaultValue={values?.updateOptions}>
            <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.Optional')}
            </Radio>
            <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.Mandatory')}
            </Radio>
            <Radio value={3} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.Nothing')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
