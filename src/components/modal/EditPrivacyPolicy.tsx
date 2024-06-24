import React, { useEffect, useState } from 'react';
import { Space, Modal, Radio } from 'antd';
import { Editprivacyprops } from './ModalProps';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { Button } from '../common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { P1 } from '../common/typography/P1/P1';
import { LableText } from '@app/components/GeneralStyles';
import { TextArea } from '../../components/GeneralStyles';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { LanguageType, PrivacyPolicyModal } from '@app/interfaces/interfaces';
import { PrivacyPolicy } from '../Admin/PrivacyPolicy';
import { AR } from '@app/constants/appConstants';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';

export const EditPrivacyPolicy: React.FC<Editprivacyprops> = ({
  visible,
  onCancel,
  onEdit,
  values,
  isLoading,
  title,
}) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  useEffect(() => {
    if (values) {
      const firstElement = values?.translations[0];
      if (firstElement?.language === AR) {
        setLang({
          ar: INDEX_ONE,
          en: INDEX_TWO,
        });
      } else {
        setLang({
          ar: INDEX_TWO,
          en: INDEX_ONE,
        });
      }
    }
  }, [values]);

  useEffect(() => {
    isLoading ? '' : values !== undefined && form.setFieldsValue(values);
  }, [values, isLoading]);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: PrivacyPolicyModal) => {
    const edited_data = {
      app: info.app,
      id: values?.id,
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
    };
    onEdit(edited_data);
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
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} key="edit" onClick={onOk}>
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" initialValues={values} onFinish={onFinish} name="editPrivacyPolicyForm">
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
