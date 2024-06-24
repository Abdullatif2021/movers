import React, { useEffect, useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditPartnerProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Partner } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { Select, Option } from '../common/selects/Select/Select';
import { useQuery } from 'react-query';
import { getCities, getCountries } from '@app/services/locations';
import { PHONE_NUMBER_CODE } from '@app/constants/appConstants';
import { validationInputNumber } from '../functions/ValidateInputNumber';

export const EditPartner: React.FC<EditPartnerProps> = ({ visible, onCancel, Partner_values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [countryId, setCountryId] = useState<string>('0');

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
    form.setFieldValue('cityId', []);
  };

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: Partner) => {
    value = Object.assign({}, value, { isActive: true });
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem', height: '90vh', overflowY: 'scroll' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('partners.editPartnerModalTitle')}
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
      <BaseForm form={form} initialValues={Partner_values} layout="vertical" onFinish={onFinish} name="userForm">
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
          name="companyName"
          label={<LableText>{t('brokers.companyName')}</LableText>}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="partnerPhoneNumber"
          label={<LableText>{t('common.phoneNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input
            addonBefore={PHONE_NUMBER_CODE}
            onChange={(e: any) => {
              if (validationInputNumber(e.target.value)) {
                form.setFieldValue('partnerPhoneNumber', e.target.value);
              } else form.setFieldValue('partnerPhoneNumber', '');
            }}
            maxLength={9}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="email"
          label={<LableText>{t('common.emailAddress')}</LableText>}
          style={{ marginTop: '-.5rem' }}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
            {
              type: 'email',
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.invalidEmail')}</p>,
            },
          ]}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          label={<LableText>{t('companies.country')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select onChange={ChangeCountryHandler}>
            {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
              <Option key={country.id} value={country.id}>
                {country?.name}
              </Option>
            ))}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name="citiesIds"
          label={<LableText>{t('companies.city')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select mode="multiple">
            {citiesData?.data?.result?.items.map((city: any) => (
              <Select key={city.name} value={city.id}>
                {city?.name}
              </Select>
            ))}
          </Select>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
