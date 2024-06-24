import React from 'react';
import { Space, Modal, Radio } from 'antd';
import { CreateprivacyModalProps } from './ModalProps';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { Button } from '../common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { P1 } from '../common/typography/P1/P1';
import { LableText } from '@app/components/GeneralStyles';
import { TextArea } from '../../components/GeneralStyles';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { LanguageType, PrivacyPolicyModal } from '@app/interfaces/interfaces';

export const AddPrivacyPolicy: React.FC<CreateprivacyModalProps> = ({
  visible,
  onCreateprivacy,
  onCancel,
  isLoading,
  title,
}) => {
  const { isDesktop, isTablet } = useResponsive();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: PrivacyPolicyModal) => {
    info = Object.assign({}, info, {
      app: info.app,
      isActive: true,
      translations: [
        {
          title: info.translations[0].title,
          description: info.translations[0].description,
          language: 'en' as LanguageType,
        },
        {
          title: info.translations[1].title,
          description: info.translations[1].description,
          language: 'ar' as LanguageType,
        },
      ],
    });

    onCreateprivacy(info);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={<div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>{t(`${title}`)}</div>}
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button key="cancel" style={{ height: 'auto' }} type="ghost" onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} key="add" onClick={onOk}>
              <P1>{t('privacyPolicy.addPrivacyModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="addPrivacyPolicyForm">
        <BaseForm.Item
          name="app"
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
            <Radio value={3} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('requests.both')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'title']}
          label={<LableText>{t(`common.title_en`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr' }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t(`common.description_en`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr' }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'title']}
          label={<LableText>{t(`common.title_ar`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl' }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', 1, 'description']}
          label={<LableText>{t(`common.description_ar`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'ltr' }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
