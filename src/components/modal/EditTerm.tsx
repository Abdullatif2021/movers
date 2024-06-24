import React, { useEffect, useState } from 'react';
import { Space, Modal, Radio } from 'antd';
import { EditTermprops } from './ModalProps';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '../common/forms/BaseForm/BaseForm';
import { Button } from '../common/buttons/Button/Button';
import { useResponsive } from '@app/hooks/useResponsive';
import { P1 } from '../common/typography/P1/P1';
import { LableText } from '@app/components/GeneralStyles';
import { TextArea } from '../../components/GeneralStyles';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { LanguageType, TermModal } from '@app/interfaces/interfaces';
import { AR } from '@app/constants/appConstants';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';

export const EditTerm: React.FC<EditTermprops> = ({ visible, onCancel, onEdit, values, isLoading }) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();
  const { isDesktop, isTablet } = useResponsive();

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

  const onFinish = (data: TermModal) => {
    const edited_data = {
      app: data.app,
      id: data.id,
      translations: data.translations.map((_, i) => ({
        ...data.translations[i],
        language: i === 0 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
    };
    onEdit(edited_data);
  };

  const buttonStyle = { height: 'auto' };

  return (
    <Modal
      style={{ marginTop: '-2rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('terms.editTermModalTitle')}
        </div>
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
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} layout="vertical" onFinish={onFinish} name="editTermForm">
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
          name={['translations', lang.en, 'title']}
          label={<LableText>{t(`notifications.englishtitle`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', lang.en, 'description']}
          label={<LableText>{t(`notifications.englishdescription`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr', fontFamily: FONT_FAMILY.en }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', lang.ar, 'title']}
          label={<LableText>{t(`notifications.arabictitle`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl' }} />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', lang.ar, 'description']}
          label={<LableText>{t(`notifications.arabicdiscription`)}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0' }}
        >
          <TextArea style={{ textAlign: 'right', direction: 'rtl' }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
