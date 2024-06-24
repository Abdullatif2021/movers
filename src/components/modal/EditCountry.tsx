import React, { useEffect, useState } from 'react';
import { Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditCountryProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CountryModel, LanguageType } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';
import { AR } from '@app/constants/appConstants';
import { LocationServicesType, LocationServicesValues } from '@app/constants/enums/locationServicesType';

export const EditCountry: React.FC<EditCountryProps> = ({ visible, onCancel, country_values, onEdit, isLoading }) => {
  const [type, setType] = useState<number>();

  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  useEffect(() => {
    if (country_values) {
      const firstElement = country_values?.translations[0];
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
  }, [country_values]);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: CountryModel) => {
    value = Object.assign({}, value, {
      translations: [
        {
          name: value.translations[0].name,
          language: 'ar' as LanguageType,
        },
        {
          name: value.translations[1].name,
          language: 'en' as LanguageType,
        },
      ],
    });
    onEdit(value);
  };

  const handleType = (e: RadioChangeEvent) => {
    setType(e.target.value);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('locations.editCountryModalTitle')}
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
      <BaseForm form={form} initialValues={country_values} layout="vertical" onFinish={onFinish} name="CountriesForm">
        <BaseForm.Item
          name={['translations', lang.en, 'name']}
          label={<LableText>{t('common.name_en')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name={['translations', lang.ar, 'name']}
          label={<LableText>{t('common.name_ar')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="dialCode"
          label={<LableText>{t('locations.dialCode')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input maxLength={5} />
        </BaseForm.Item>

        <BaseForm.Item
          name="type"
          label={<LableText>{t('locations.type')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group value={type} onChange={handleType}>
            <Radio value={LocationServicesValues.Internal}>{t(`${LocationServicesType.Internal}`)}</Radio>
            <Radio value={LocationServicesValues.External}>{t(`${LocationServicesType.External}`)}</Radio>
          </Radio.Group>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
