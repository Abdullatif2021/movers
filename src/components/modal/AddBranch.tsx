import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText, TextArea, TextBack, treeStyle } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BranchModel, CompanyModal, TimeworksProps } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BankOutlined, ClearOutlined, HomeOutlined, LeftOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Steps, Image, Tree, Radio, Alert, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { GetUAE, getCities, getCountries, getRegions } from '@app/services/locations';
import { useNavigate, useParams } from 'react-router-dom';
import { getServicesForCompany } from '@app/services/services';
import { createBranch } from '@app/services/branches';
import { Card } from '@app/components/common/Card/Card';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import type { DataNode } from 'antd/es/tree';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import CustomPasswordInput from '../common/inputs/InputPassword/CustomPasswordInput';
import ReloadBtn from '../Admin/ReusableComponents/ReloadBtn';
import { PHONE_NUMBER_CODE, PHONE_NUMBER_LENGTH } from '@app/constants/appConstants';
import { validationInputNumber } from '../functions/ValidateInputNumber';
import WorkTimes from '../common/WorkTimes';

const { Step } = Steps;
let requestServicesArray: any = [];
const requestServices: any = [];
const steps = [
  {
    title: 'branchInfo',
  },
  {
    title: 'companyUser',
  },
  {
    title: 'typeMove',
  },
  {
    title: 'services',
  },
];
let branchInfo: any = {
  translations: [
    {
      name: 'string',
      bio: 'string',
      address: 'string',
      language: 'en',
    },
  ],
  services: [
    {
      serviceId: 0,
      subServiceId: 0,
      toolId: 0,
    },
  ],
  regionId: '0',
  companyContact: {
    dialCode: 's7',
    phoneNumber: 'string',
    emailAddress: 'string',
    webSite: 'string',
    isForBranchCompany: false,
  },
  userDto: {
    dialCode: '963',
    phoneNumber: '0997829849',
    password: '865fghjk',
  },
};

export const AddBranch: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const [countryIdForCities, setCountryIdForCities] = useState<string>('0');
  const [selectedCityValues, setSelectedCityValues] = useState<number[]>([]);
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState<string>('0');
  const [regionId, setRegionId] = useState<string>('0');
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<CompanyModal>(branchInfo);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [valueRadio, setValueRadio] = useState(1);
  const [refetchData, setRefetchData] = useState<boolean>(false);

  const [selectedDays, setSelectedDays] = useState<Array<TimeworksProps>>([]);

  const GetAllServices = useQuery('getServicesForCompany', getServicesForCompany);

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    const serviceNode: DataNode = {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={27} height={27} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service${service?.id}`,
      children: [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
    if (service?.subServices?.length > 0) {
      serviceNode.children = service.subServices.map((subService: any) => {
        const subServiceNode = {
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={subService?.attachment?.url} width={27} height={27} />
              {subService?.name}
            </span>
          ),
          key:
            subService?.tools?.length > 0
              ? `service${service?.id} sub${subService?.id}`
              : `onlySub service${service?.id} sub${subService?.id}`,
          children: [],
        };
        if (subService?.tools?.length > 0) {
          subServiceNode.children = subService.tools.map((tool: any) => ({
            title: (
              <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                <Image src={tool?.attachment?.url} width={27} height={27} />
                {tool?.name}
              </span>
            ),
            key: `withTool service${service?.id} sub${subService?.id} tool${tool?.id}`,
          }));
        }
        return subServiceNode;
      });
    }
    return serviceNode;
  });

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  const GetAllCountries = useQuery('GetAllCountries', getCountries);
  const GetUAECountry = useQuery('GetUAECountry', GetUAE);
  const { data: availableCitiesData, refetch: availableCitiesRefetch } = useQuery(
    'getCities',
    () => getCities(countryIdForCities),
    {
      enabled: countryIdForCities !== '0',
    },
  );
  const { data: citiesData, refetch: citiesRefetch } = useQuery('getCities', () => getCities(countryId), {
    enabled: countryId !== '0',
  });
  const { data: RegionsData, refetch: RegionsRefetch } = useQuery('getRegions', () => getRegions(cityId), {
    enabled: cityId !== '0',
  });
  useEffect(() => {
    if (countryIdForCities !== '0') {
      availableCitiesRefetch();
    }
  }, [countryIdForCities, refetchData]);
  useEffect(() => {
    if (countryId !== '0') {
      citiesRefetch();
      RegionsRefetch();
    }
  }, [countryId]);
  useEffect(() => {
    if (cityId !== '0') {
      RegionsRefetch();
    }
  }, [cityId]);

  const SelectCountryForAvilableCities = (e: any) => {
    setCountryIdForCities(e);
  };

  const ChangeCountryHandler = (e: any) => {
    setCountryId(e);
    form.setFieldValue('cityId', '');
    form.setFieldValue('regionId', '');
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);
    form.setFieldValue('regionId', '');
  };

  const ChangeRegionHandler = (e: any) => {
    setRegionId(e);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const addBranch = useMutation((data: BranchModel) =>
    createBranch(data)
      .then((data: any) => {
        notificationController.success({ message: t('branch.addBranchSuccessMessage') });
        queryClient.invalidateQueries('getAllBranches');
        Navigate(`/companies/${companyId}/branches`);
        requestServicesArray = [];
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        requestServicesArray = [];
      }),
  );

  const onFinish = (values: any) => {
    function extractServicesIds(input: any) {
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'withTool') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: parseInt(parts[3].replace('tool', '')),
          };
          requestServices.push(result);
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          requestServices.push(result);
        }
        return result;
      });
    }
    extractServicesIds(requestServicesArray);
    const updatedFormData = { ...formData };
    branchInfo = {
      ...branchInfo,
      companyId: companyId,
      translations: [
        {
          name: form.getFieldValue(['translations', 0, 'name']),
          bio: form.getFieldValue(['translations', 0, 'bio']),
          address: form.getFieldValue(['translations', 0, 'address']),
          language: 'ar',
        },
        {
          name: form.getFieldValue(['translations', 1, 'name']),
          bio: form.getFieldValue(['translations', 1, 'bio']),
          address: form.getFieldValue(['translations', 1, 'address']),
          language: 'en',
        },
      ],
      companyContact: {
        dialCode: PHONE_NUMBER_CODE,
        phoneNumber: form.getFieldValue(['companyContact', 'phoneNumber']),
        emailAddress: form.getFieldValue(['companyContact', 'emailAddress']),
        webSite: form.getFieldValue(['companyContact', 'webSite']),
        isForBranchCompany: true,
      },
      userDto: {
        dialCode: PHONE_NUMBER_CODE,
        phoneNumber: form.getFieldValue(['userDto', 'phoneNumber']),
        emailAddress: form.getFieldValue(['userDto', 'emailAddress']),
        password: form.getFieldValue(['userDto', 'password']),
      },
      serviceType: valueRadio,
      services: requestServices,
      regionId: regionId,
      availableCitiesIds: selectedCityValues,
      timeworks: selectedDays,
      isWithCompany: true,
    };
    updatedFormData.translations = branchInfo.translations;
    if (requestServices.length == 0) {
      message.open({
        content: <Alert message={t('requests.atLeastOneService')} type={`error`} showIcon />,
      });
      return;
    }

    addBranch.mutate(branchInfo);
  };

  const selectCities = (cities: any) => {
    setSelectedCityValues(cities);
  };

  return (
    <Card title={t('branch.addBranch')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
        <Btn
          style={{
            margin: '0 .5rem .5rem 0',
            width: 'auto',
          }}
          type="ghost"
          onClick={() => Navigate(-1)}
          icon={<LeftOutlined />}
        >
          <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
        </Btn>
        <Row>
          {current > 0 && (
            <Button
              style={{
                margin: '0 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              onClick={() => prev()}
            >
              {t('common.prev')}
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              style={{
                margin: '0 0rem .5rem 0',
                width: 'auto',
                // height: 'auto',
              }}
              onClick={() => next()}
            >
              <CreateButtonText>{t('common.next')}</CreateButtonText>
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              style={{
                margin: '0 .5rem .5rem 0',
                width: 'auto',
                // height: 'auto',
              }}
              htmlType="submit"
              disabled={addBranch.isLoading}
              onClick={() => onFinish(form.getFieldsValue())}
            >
              {t('common.done')}
            </Button>
          )}
        </Row>
      </Row>
      <Steps current={current} style={{ margin: '10px 10px 30px 0', padding: '0px 40px' }}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={t(`companies.${step.title}`)}
            icon={
              index === 0 ? (
                <BankOutlined />
              ) : index === 1 ? (
                <UserAddOutlined />
              ) : index === 2 ? (
                <HomeOutlined />
              ) : index === 3 ? (
                <ClearOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <BaseForm
        form={form}
        onFinish={onFinish}
        name="AddBranchForm"
        style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
      >
        {current === 0 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('partners.generalInfo')}:</h4>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'name']}
                  label={<LableText>{t('common.name_ar')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
                    },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'name']}
                  label={<LableText>{t('common.name_en')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
                    },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'bio']}
                  label={<LableText>{t('common.bio_ar')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
                    },
                  ]}
                >
                  <TextArea />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'bio']}
                  label={<LableText>{t('common.bio_en')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
                    },
                  ]}
                >
                  <TextArea />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'address']}
                  label={<LableText>{t('address_ar')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
                    },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'address']}
                  label={<LableText>{t('address_en')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
                    },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
            </Row>

            <BaseForm.Item
              name="countryId"
              label={<LableText>{t('companies.country')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeCountryHandler}>
                {GetUAECountry?.data?.data?.result?.items.map((country: any) => (
                  <Option key={country.id} value={country.id}>
                    {country?.name}
                  </Option>
                ))}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item
              name="cityId"
              label={<LableText>{t('companies.city')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeCityHandler}>
                {citiesData?.data?.result?.items.map((city: any) => (
                  <Select key={city.name} value={city.id}>
                    {city?.name}
                  </Select>
                ))}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item
              name="regionId"
              label={<LableText>{t('companies.region')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeRegionHandler}>
                {RegionsData?.data?.result?.items.map((Region: any) => (
                  <Select key={Region?.name} value={Region?.id}>
                    {Region?.name}
                  </Select>
                ))}
              </Select>
            </BaseForm.Item>

            <h2
              style={{
                color: 'black',
                paddingTop: '7px',
                paddingBottom: '15px',
                fontSize: FONT_SIZE.xxl,
                fontWeight: 'Bold',
                margin: '3rem 5% 2rem',
              }}
            >
              {t('companies.companyContact')}
            </h2>

            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  label={<LableText>{t('common.emailAddress')}</LableText>}
                  name={['companyContact', 'emailAddress']}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                    {
                      type: 'email',
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.invalidEmail')}</p>,
                    },
                  ]}
                >
                  <Input value={branchInfo?.companyContact?.emailAddress} />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  label={<LableText>{t('companies.webSite')}</LableText>}
                  name={['companyContact', 'webSite']}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    {
                      pattern: /^[A-Za-z 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                      message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyEnglishCharacters')}</p>,
                    },
                  ]}
                >
                  <Input value={branchInfo?.companyContact?.webSite} />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row style={{ justifyContent: 'space-around' }}>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseButtonsForm.Item
                  key={current}
                  name={['companyContact', 'phoneNumber']}
                  $successText={t('auth.phoneNumberVerified')}
                  label={t('common.phoneNumber')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    () => ({
                      validator(_, value) {
                        if (!value || isValidPhoneNumber(value)) {
                          return Promise.resolve();
                        }
                        if (value.length > PHONE_NUMBER_LENGTH) {
                          return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                        } else if (value.length < PHONE_NUMBER_LENGTH) {
                          return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                        }
                      },
                    }),
                  ]}
                  style={{ margin: '2%', direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl' }}
                >
                  <Input
                    addonBefore={PHONE_NUMBER_CODE}
                    onChange={(e: any) => {
                      if (validationInputNumber(e.target.value)) {
                        form.setFieldValue(['companyContact', 'phoneNumber'], e.target.value);
                      } else form.setFieldValue(['companyContact', 'phoneNumber'], '');
                    }}
                    maxLength={9}
                    style={{ width: '100%' }}
                  />
                </BaseButtonsForm.Item>
              </Col>
            </Row>
            <h2
              style={{
                color: 'black',
                paddingTop: '7px',
                paddingBottom: '15px',
                fontSize: FONT_SIZE.xxl,
                fontWeight: 'Bold',
                margin: '3rem 5% 2rem',
              }}
            >
              {t('common.workTimes')}
            </h2>

            <BaseForm.Item>
              <WorkTimes selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
            </BaseForm.Item>
          </>
        )}
        {current === 1 && (
          <>
            <h2
              style={{
                color: 'black',
                paddingTop: '7px',
                paddingBottom: '15px',
                fontSize: FONT_SIZE.xxl,
                fontWeight: 'Bold',
                margin: '3rem 5% 2rem',
              }}
            >
              {t('companies.companyUser')}
            </h2>
            <BaseButtonsForm.Item
              key={current}
              name={['userDto', 'phoneNumber']}
              $successText={t('auth.phoneNumberVerified')}
              label={t('common.phoneNumber')}
              rules={[
                { required: true, message: t('common.requiredField') },
                () => ({
                  validator(_, value) {
                    if (!value || isValidPhoneNumber(value)) {
                      return Promise.resolve();
                    }
                    if (value.length > PHONE_NUMBER_LENGTH) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                    } else if (value.length < PHONE_NUMBER_LENGTH) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                    }
                  },
                }),
              ]}
              style={
                isDesktop || isTablet
                  ? {
                      width: '50%',
                      margin: 'auto',
                      direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl',
                    }
                  : {
                      width: '80%',
                      margin: '0 10%',
                      direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl',
                    }
              }
            >
              <Input
                addonBefore={PHONE_NUMBER_CODE}
                onChange={(e: any) => {
                  if (validationInputNumber(e.target.value)) {
                    form.setFieldValue(['userDto', 'phoneNumber'], e.target.value);
                  } else form.setFieldValue(['userDto', 'phoneNumber'], '');
                }}
                maxLength={9}
                style={{ width: '100%' }}
              />
            </BaseButtonsForm.Item>

            <BaseForm.Item
              label={<LableText>{t('common.emailAddress')}</LableText>}
              name={['userDto', 'emailAddress']}
              style={
                isDesktop || isTablet
                  ? {
                      width: '50%',
                      margin: 'auto',
                      direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl',
                    }
                  : {
                      width: '80%',
                      margin: '0 10%',
                      direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl',
                    }
              }
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                {
                  type: 'email',
                  message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.invalidEmail')}</p>,
                },
              ]}
            >
              <Input />
            </BaseForm.Item>

            <Auth.FormItem
              label={t('auth.password')}
              name={['userDto', 'password']}
              rules={[
                {
                  required: true,
                  message: t('common.requiredField'),
                },
              ]}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
            >
              <CustomPasswordInput placeholder={t('auth.password')} />
            </Auth.FormItem>
          </>
        )}
        {current === 2 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.typeMove')}:</h4>

            <BaseForm.Item key={10} name="serviceType">
              <Radio.Group
                style={{ display: 'flex', width: '100%' }}
                onChange={(event) => {
                  setValueRadio(event.target.value);
                }}
              >
                <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  {t('requests.Internal')}
                </Radio>
                <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  {t('requests.External')}
                </Radio>
                <Radio value={3} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  {t('requests.both')}
                </Radio>
              </Radio.Group>
            </BaseForm.Item>

            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('companies.availableCities')}:</h4>

            <BaseForm.Item
              name="availableCountriesIds"
              label={<LableText>{t('companies.country')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={SelectCountryForAvilableCities}>
                {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
                  <Option key={country.id} value={country.id}>
                    {country?.name}
                  </Option>
                ))}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item
              name="availableCitiesIds"
              label={<LableText>{t('companies.availableCities')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select mode="multiple" onChange={selectCities}>
                {availableCitiesData?.data?.result?.items.map((city: any) => (
                  <Select key={city.name} value={city.id}>
                    {city?.name}
                  </Select>
                ))}
              </Select>
            </BaseForm.Item>
          </>
        )}
        {current === 3 && (
          <>
            <BaseForm.Item key="100" name="services">
              {treeData?.map((serviceTreeData: any, serviceIndex: number) => {
                const serviceKeys = selectedServicesKeysMap[serviceIndex] || [];
                return (
                  <Tree
                    key={serviceIndex}
                    style={treeStyle}
                    checkable
                    defaultExpandAll={true}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={(checkedKeysValue: any) => {
                      for (const key of checkedKeysValue) {
                        if (!requestServicesArray.includes(key)) {
                          requestServicesArray.push(key);
                        }
                      }
                      setSelectedServicesKeysMap((prevSelectedKeysMap) => {
                        const updatedKeysMap = { ...prevSelectedKeysMap };
                        updatedKeysMap[serviceIndex] = checkedKeysValue;
                        return updatedKeysMap;
                      });
                    }}
                    defaultCheckedKeys={serviceKeys}
                    checkedKeys={serviceKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={[serviceTreeData]}
                  />
                );
              })}
            </BaseForm.Item>
          </>
        )}
      </BaseForm>
    </Card>
  );
};
