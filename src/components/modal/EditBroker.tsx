import React, { useEffect, useState } from 'react';
import { InputNumber, Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditBrokerProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Broker } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { Select, Option } from '../common/selects/Select/Select';
import { getCities, getCountries } from '@app/services/locations';
import { useQuery } from 'react-query';
import { PHONE_NUMBER_CODE } from '@app/constants/appConstants';
import { validationInputNumber } from '../functions/ValidateInputNumber';

const generateRandomCode = () => {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const EditBroker: React.FC<EditBrokerProps> = ({ visible, onCancel, values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [code, setCode] = useState(generateRandomCode());
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState<string>(values?.city?.id);

  const GetAllCountries = useQuery('GetAllCountries', getCountries);
  const { data: citiesData, refetch: citiesRefetch } = useQuery('getCities', () => getCities(countryId), {
    enabled: countryId !== '0',
  });

  useEffect(() => {
    if (countryId !== '0') {
      citiesRefetch();
    }
  }, [countryId]);

  const ChangeCountryHandler = (e: any) => {
    setCountryId(e);
    form.setFieldValue('cityId', '');
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);
  };

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: Broker) => {
    const dialCode = { dialCode: '+971' };
    value = Object.assign({}, value, { cityId: cityId }, dialCode);
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem', height: '90vh', overflowY: 'scroll' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('brokers.editBrokerModalTitle')}
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
      <BaseForm form={form} onFinish={onFinish} name="BrokersForm" initialValues={values}>
        <BaseForm.Item
          name="firstName"
          label={<LableText>{t('common.firstName')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="lastName"
          label={<LableText>{t('common.lastName')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="mediatorPhoneNumber"
          label={<LableText>{t('common.phoneNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input
            addonBefore={PHONE_NUMBER_CODE}
            onChange={(e: any) => {
              if (validationInputNumber(e.target.value)) {
                form.setFieldValue('mediatorPhoneNumber', e.target.value);
              } else form.setFieldValue('mediatorPhoneNumber', '');
            }}
            maxLength={9}
            style={{ width: '100%' }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="companyName"
          label={<LableText>{t('brokers.companyName')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="companyPhoneNumber"
          label={<LableText>{t('brokers.companyPhoneNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input
            addonBefore={PHONE_NUMBER_CODE}
            onChange={(e: any) => {
              if (validationInputNumber(e.target.value)) {
                form.setFieldValue('companyPhoneNumber', e.target.value);
              } else form.setFieldValue('companyPhoneNumber', '');
            }}
            maxLength={9}
            style={{ width: '100%' }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="email"
          label={<LableText>{t('common.emailAddress')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          label={<LableText>{t('companies.country')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select onChange={ChangeCountryHandler} defaultValue={values?.city?.country?.name}>
            {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
              <Option key={country.id} value={country.id}>
                {country?.name}
              </Option>
            ))}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name="cityId"
          label={<LableText>{t('companies.city')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select defaultValue={values?.city?.name} value={cityId} onChange={ChangeCityHandler}>
            {citiesData?.data?.result?.items.map((city: any) => (
              <Select key={city.name} value={city.id}>
                {city?.name}
              </Select>
            ))}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name="mediatorCode"
          initialValue={code}
          label={<LableText>{t('brokers.code')}</LableText>}
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
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="commissionPercentage"
          label={<LableText>{t('brokers.commission')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <InputNumber defaultValue={0} min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
