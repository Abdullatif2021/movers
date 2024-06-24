import React, { useEffect, useState } from 'react';
import { Space, Modal, InputNumber, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { CreateApplicationsVersionsModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { ApplicationsVersion } from '@app/interfaces/interfaces';

export const AddApplicationVersion: React.FC<CreateApplicationsVersionsModalProps> = ({
  visible,
  onCancel,
  onCreate,
  isLoading,
}) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: ApplicationsVersion) => {
    onCreate(info);
  };

  return (
    <Modal
      style={{ marginTop: '-6rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('applicationsVersions.addApplicationsVersionsModalTitle')}
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
              <P1>{t('applicationsVersions.addApplicationsVersionsModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="addApplicationsVersionsForm">
        <BaseForm.Item
          name="appType"
          label={<LableText>{t(`applicationsVersions.appType`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group style={{ display: 'flex', width: '100%' }}>
            <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.Basic')}
            </Radio>
            <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.Partner')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>

        <BaseForm.Item
          name="systemType"
          label={<LableText>{t(`applicationsVersions.systemType`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group style={{ display: 'flex', width: '100%' }}>
            <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.Android')}
            </Radio>
            <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('applicationsVersions.IOS')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>
        <BaseForm.Item
          name="versionNumber"
          label={<LableText>{t('applicationsVersions.versionNumber')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="versionCode"
          label={<LableText>{t('applicationsVersions.versionCode')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber />
        </BaseForm.Item>
        <BaseForm.Item
          name="description"
          label={<LableText>{t('common.description')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
