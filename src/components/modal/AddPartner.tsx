import React, { useEffect, useState } from 'react';
import { Space, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { CreatePartnerModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Partner } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { useQuery } from 'react-query';
import { getCities, getCountries } from '@app/services/locations';
import { validationInputNumber } from '../functions/ValidateInputNumber';
import { PHONE_NUMBER_CODE } from '@app/constants/appConstants';

export const AddPartner: React.FC<CreatePartnerModalProps> = ({ visible, onCancel, onCreatePartner, isLoading }) => {
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

  const onFinish = (PartnerInfo: Partner) => {
    PartnerInfo = Object.assign({}, PartnerInfo);
    onCreatePartner(PartnerInfo);
  };

  return (
    <Modal
      style={{ marginTop: '-6rem', height: '90vh', overflowY: 'scroll' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('partners.addPartnerModalTitle')}
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
              <P1>{t('partners.addPartnerModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="PartnerForm">
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
          style={{ marginTop: '-.5rem' }}
          rules={[{ required: true, message: t('common.requiredField') }]}
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
          name="emailAddress"
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
