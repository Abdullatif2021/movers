import React, { useState } from 'react';
import { Space, Modal, Radio, RadioChangeEvent } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { CreateCountryModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CountryModel } from '@app/interfaces/interfaces';
import { LanguageType } from '@app/interfaces/interfaces';
import { LocationServicesType, LocationServicesValues } from '@app/constants/enums/locationServicesType';

export const AddCountry: React.FC<CreateCountryModalProps> = ({ visible, onCancel, onCreateCountry, isLoading }) => {
  const [type, setType] = useState<number>();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (countryInfo: CountryModel) => {
    countryInfo = Object.assign({}, countryInfo, {
      translations: [
        {
          name: countryInfo.translations[0].name,
          language: 'ar' as LanguageType,
        },
        {
          name: countryInfo.translations[1].name,
          language: 'en' as LanguageType,
        },
      ],
    });
    onCreateCountry(countryInfo);
  };

  const handleType = (e: RadioChangeEvent) => {
    setType(e.target.value);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('locations.addCountryModalTitle')}
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
              <P1>{t('locations.addCountryModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="CountriesForm">
        <BaseForm.Item
          name={['translations', 1, 'name']}
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
          name={['translations', 0, 'name']}
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
