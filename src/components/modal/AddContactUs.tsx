import React, { useState } from 'react';
import { Space, Modal, Radio, RadioChangeEvent, TimePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input, TextArea } from '../../components/GeneralStyles';
import { CreateContactModalProps, CreateCountryModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { ContactUsModel, CountryModel } from '@app/interfaces/interfaces';
import { LanguageType } from '@app/interfaces/interfaces';
import { LocationServicesType, LocationServicesValues } from '@app/constants/enums/locationServicesType';
import { Select, Option } from '../common/selects/Select/Select';
import { DAYS_OF_WEEK_NAME, PHONE_NUMBER_CODE, PHONE_NUMBER_LENGTH } from '@app/constants/appConstants';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { validationInputNumber } from '../functions/ValidateInputNumber';

export const AddContactUs: React.FC<CreateContactModalProps> = ({ visible, onCancel, onCreate, isLoading }) => {
  const [type, setType] = useState<number>();
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [timeRange, setTimeRange] = useState<string[]>([]);

  const getTime = (timeRange: string[]) => {
    setTimeRange(timeRange);
  };

  const onOk = () => {
    form.submit();
  };

  const onFinish = (contactInfo: ContactUsModel) => {
    contactInfo = Object.assign({}, contactInfo, {
      translations: [
        {
          name: contactInfo.translations[0].name,
          address: contactInfo.translations[0].address,
          description: contactInfo.translations[0].description,
          language: 'ar' as LanguageType,
        },
        {
          name: contactInfo.translations[1].name,
          address: contactInfo.translations[1].address,
          description: contactInfo.translations[1].description,
          language: 'en' as LanguageType,
        },
      ],
      startTime: timeRange[0],
      endTime: timeRange[1],
      phoneNumber: PHONE_NUMBER_CODE + contactInfo.phoneNumber,
      telephoneNumber: PHONE_NUMBER_CODE + contactInfo.telephoneNumber,
    });
    onCreate(contactInfo);
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
          name={['translations', 1, 'address']}
          label={<LableText>{t('common.address_en')}</LableText>}
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
          name={['translations', 0, 'address']}
          label={<LableText>{t('common.address_ar')}</LableText>}
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
          name={['translations', 1, 'description']}
          label={<LableText>{t('common.description_en')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea
            style={{
              textAlign: 'left',
              direction: 'ltr',
              fontFamily: FONT_FAMILY.en,
              height: '5.015rem',
            }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name={['translations', 0, 'description']}
          label={<LableText>{t('common.description_ar')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea
            style={{
              textAlign: 'right',
              direction: 'rtl',
              height: '5.015rem',
            }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="emailAddress"
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              type: 'email',
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.invalidEmail')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.emailAddress')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="phoneNumber"
          label={<LableText>{t('common.phoneNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input
            onChange={(e: any) => {
              if (validationInputNumber(e.target.value)) {
                form.setFieldValue('phoneNumber', e.target.value);
              } else form.setFieldValue('phoneNumber', '');
            }}
            maxLength={9}
            style={{ width: '100%' }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="telephoneNumber"
          label={<LableText>{t('common.telephoneNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input
            onChange={(e: any) => {
              if (validationInputNumber(e.target.value)) {
                form.setFieldValue('telephoneNumber', e.target.value);
              } else form.setFieldValue('telephoneNumber', '');
            }}
            style={{ width: '100%' }}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name="whatsNumber"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.whatsNumber')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="facebook"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.facebook')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="instgram"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.instgram')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name="twitter"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.twitter')}</LableText>}
        >
          <Input />
        </BaseForm.Item>

        <BaseForm.Item
          name={'startDay'}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.startDate')}</LableText>}
        >
          <Select>
            {DAYS_OF_WEEK_NAME.map((item: any) => {
              return (
                <Option key={item?.day} value={item?.day}>
                  {t(`contactUs.daysOfWeek.${item?.dayName}`)}
                </Option>
              );
            })}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name={'endDay'}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.endDate')}</LableText>}
        >
          <Select>
            {DAYS_OF_WEEK_NAME.map((item: any) => {
              return (
                <Option key={item?.day} value={item?.day}>
                  {t(`contactUs.daysOfWeek.${item?.dayName}`)}
                </Option>
              );
            })}
          </Select>
        </BaseForm.Item>

        <BaseForm.Item
          name="time"
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
          label={<LableText>{t('contactUs.workingTime')}</LableText>}
        >
          <TimePicker.RangePicker onChange={(date, dateString) => getTime(dateString)} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
