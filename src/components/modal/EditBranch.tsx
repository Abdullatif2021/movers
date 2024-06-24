import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText, TextBack, treeStyle } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BranchModel, TimeworksProps } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BankOutlined, ClearOutlined, HomeOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Steps, Image, Tree, Radio, Spin, message, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { GetUAE, getCities, getCountries, getRegions } from '@app/services/locations';
import { useNavigate, useParams } from 'react-router-dom';
import { getServicesForCompany } from '@app/services/services';
import { getBranch, UpdateBranch } from '@app/services/branches';
import { Card } from '@app/components/common/Card/Card';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { TextArea } from '../../components/GeneralStyles';
import { PHONE_NUMBER_CODE, PHONE_NUMBER_LENGTH } from '@app/constants/appConstants';
import { validationInputNumber } from '../functions/ValidateInputNumber';
import WorkTimes from '../common/WorkTimes';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';
import { AR } from '@app/constants/appConstants';

const { Step } = Steps;
let requestServicesArray: any = [];
let requestServices: any[] = [];
const steps = [
  {
    title: 'BranchInformation',
  },
  {
    title: 'typeMove',
  },
  {
    title: 'Services',
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
    dialCode: '0',
    phoneNumber: '0',
    emailAddress: 'string',
    webSite: 'string',
    isForBranchCompany: false,
  },
  availableCitiesIds: [],
  companyId: 0,
};

export const EditBranch: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { companyId, branchId } = useParams();
  const queryClient = useQueryClient();

  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState<string>('0');
  const [regionId, setRegionId] = useState<string>('0');
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<BranchModel>(branchInfo);
  const [branchData, setbranchData] = useState<BranchModel>(branchInfo);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [GetBranch, setGetBranch] = useState<boolean>(true);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [valueRadio, setValueRadio] = useState(0);
  const [selectedCityValues, setSelectedCityValues] = useState<number[]>([]);
  const [countryIdForAvailableCities, setCountryIdForAvailableCities] = useState<string>('0');
  const [enableEdit, setEnableEdit] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Array<TimeworksProps>>([]);
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  const { data, status, refetch, isRefetching, isLoading } = useQuery(
    ['GetBranchById'],
    () =>
      getBranch(branchId)
        .then((data) => {
          const result = data.data?.result;
          setbranchData(result);
          setGetBranch(false);
          setSelectedDays(result?.timeOfWorks);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: GetBranch,
    },
  );

  useEffect(() => {
    if (branchData) {
      const firstElement = branchData?.translations[0];
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
  }, [branchData]);

  const GetAllServices = useQuery('getServicesForCompany', getServicesForCompany);

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    return {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service${service?.id}`,
      serviceId: `${service?.id}`,
      children:
        service?.subServices?.length > 0
          ? service?.subServices?.map((subService: any) => {
              return {
                title: (
                  <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                    <Image src={service?.attachment?.url} width={16} height={16} />
                    <span style={{ fontWeight: 'bold' }}>{subService?.name}</span>
                  </span>
                ),
                key:
                  subService?.tools?.length > 0
                    ? `sub${subService?.id}`
                    : `onlySub service${service?.id} sub${subService?.id}`,
                serviceId: `${service?.id}`,
                subServiceId: `${subService?.id}`,
                children:
                  subService?.tools?.length > 0
                    ? subService?.tools?.map((tool: any) => {
                        return {
                          title: (
                            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                              <Image src={tool?.attachment?.url} width={16} height={16} />
                              <span style={{ fontWeight: 'bold' }}>{tool?.name}</span>
                            </span>
                          ),
                          key: `withTool service${service?.id} sub${subService?.id} tool${tool?.id}`,
                          serviceId: `${service?.id}`,
                          subServiceId: `${subService?.id}`,
                          toolId: `${tool?.id}`,
                        };
                      })
                    : [],
                disabled: service?.subServices?.length > 0 ? false : true,
              };
            })
          : [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
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
  const {
    data: availableCitiesData,
    refetch: availableCitiesRefetch,
    isFetching: isLoadingAvailableCities,
  } = useQuery('getCitiesForAvailabel', () => getCities(countryIdForAvailableCities), {
    enabled: countryIdForAvailableCities !== '0' && countryIdForAvailableCities != undefined,
  });

  useEffect(() => {
    if (countryIdForAvailableCities !== '0' && countryIdForAvailableCities != undefined) {
      availableCitiesRefetch();
    }
  }, [countryIdForAvailableCities]);
  useEffect(() => {
    if (branchData?.availableCities) {
      setCountryIdForAvailableCities(branchData?.availableCities[0]?.countryId);
    }
  }, [branchData?.availableCities]);

  const { data: citiesData, refetch: citiesRefetch } = useQuery(
    'getCities',
    () => getCities(countryId != '0' ? countryId : branchData?.region?.city?.country?.id),
    {
      enabled: countryId != '0' || branchData?.region?.city?.country?.id != undefined,
    },
  );
  const { data: RegionsData, refetch: RegionsRefetch } = useQuery(
    'getRegions',
    () => getRegions(cityId != '0' ? cityId : branchData?.region?.city?.id),
    {
      enabled: cityId !== '0' || branchData?.region?.city?.id != undefined,
    },
  );
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

  const ChangeCountryHandler = (e: any) => {
    setCountryId(e);
    form.setFieldValue('cityId', '');
    form.setFieldValue('regions', '');
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);
    form.setFieldValue('regions', '');
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

  const editBranch = useMutation((data: BranchModel) =>
    UpdateBranch(data)
      .then((data: any) => {
        notificationController.success({ message: t('branch.editBranchSuccessMessage') });
        queryClient.invalidateQueries('getAllBranches');
        companyId !== undefined ? Navigate(`/companies/${companyId}/branches`) : Navigate(`/branchesWithoutCompany`);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  const onFinish = (values: any) => {
    function extractServicesIds(input: any) {
      requestServices = [];
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'withTool') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: parseInt(parts[3].replace('tool', '')),
          };
          if (!requestServices.includes(result)) {
            requestServices.push(result);
          }
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          if (!requestServices.includes(result)) {
            requestServices.push(result);
          }
        }
        return result;
      });
    }
    extractServicesIds(requestServices.length == 0 ? selectedServices : requestServicesArray);

    const updatedFormData = { ...formData };
    branchInfo = {
      id: branchId,
      companyId: companyId == undefined ? 0 : companyId,
      translations: [
        {
          name: form.getFieldValue(['translations', lang.ar, 'name']),
          bio: form.getFieldValue(['translations', lang.ar, 'bio']),
          address: form.getFieldValue(['translations', lang.ar, 'address']),
          language: 'ar',
        },
        {
          name: form.getFieldValue(['translations', lang.en, 'name']),
          bio: form.getFieldValue(['translations', lang.en, 'bio']),
          address: form.getFieldValue(['translations', lang.en, 'address']),
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
      services: requestServices,
      serviceType: valueRadio == 0 ? branchData?.serviceType : valueRadio,
      availableCitiesIds:
        selectedCityValues.length == 0 ? branchData?.availableCities.map((city: any) => city?.id) : selectedCityValues,
      regionId: regionId != '0' ? regionId : branchData?.region?.id,
      timeworks: selectedDays,
      isWithCompany: companyId == undefined ? false : true,
    };
    setEnableEdit(true);
  };

  useEffect(() => {
    const updateFormValues = async () => {
      const checkedKeysById: any[] = [];
      branchData?.services?.map((service: any) => {
        service.subServices?.map((subService: any) => {
          if (subService?.tools?.length === 0) {
            checkedKeysById.push(`onlySub service${service?.id} sub${subService?.id}`);
          } else
            subService.tools.map((tool: any) => {
              checkedKeysById.push(`withTool service${service?.id} sub${subService?.id} tool${tool?.id}`);
            });
        });
      });
      setSelectedServices(checkedKeysById);
      await form.setFieldsValue(branchData);
    };
    updateFormValues();
  }, [branchData, form]);

  useEffect(() => {
    if (enableEdit) {
      const showError = (messageText: string) => {
        message.open({
          content: <Alert message={messageText} type={`error`} showIcon />,
        });
      };
      if (requestServices.length === 0 && selectedServices.length === 0) {
        showError(t('requests.atLeastOneService'));
      } else {
        editBranch.mutateAsync(branchInfo);
        setEnableEdit(false);
      }
    }
  }, [enableEdit]);

  return (
    <Card title={t('branch.editBranch')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
        <Btn
          style={{
            margin: '1rem 1rem 1rem 0',
            width: 'auto',
            height: 'auto',
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
                margin: '1rem 1rem 1rem 0',
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
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
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
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              htmlType="submit"
              disabled={editBranch.isLoading}
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
            title={t(`branch.${step.title}`)}
            icon={
              index === 0 ? (
                <BankOutlined />
              ) : index === 1 ? (
                <HomeOutlined />
              ) : index === 2 ? (
                <ClearOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <Spin spinning={isLoading}>
        {status === 'success' && branchData && (
          <BaseForm
            form={form}
            onFinish={onFinish}
            name="EditBranchForm"
            style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
            initialValues={{
              ...branchData,
              phonee: branchData.companyContact?.dialCode + branchData.companyContact?.phoneNumber,
            }}
          >
            {current === 0 && (
              <>
                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('partners.generalInfo')}:</h4>
                <Row>
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', lang.ar, 'name']}
                      label={<LableText>{t('common.name_ar')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
                        },
                      ]}
                    >
                      <Input />
                    </BaseForm.Item>
                  </Col>
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', lang.en, 'name']}
                      label={<LableText>{t('common.name_en')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
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
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', lang.ar, 'bio']}
                      label={<LableText>{t('common.bio_ar')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
                        },
                      ]}
                    >
                      <TextArea />
                    </BaseForm.Item>
                  </Col>
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', lang.en, 'bio']}
                      label={<LableText>{t('common.bio_en')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
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
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', lang.ar, 'address']}
                      label={<LableText>{t('common.address_ar')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                        {
                          pattern: /^[\u0600-\u06FF 0-9'"\/\|\-\`:;!@~#$%^&*?><=+_\(\){}\[\].,\\]+$/,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyArabicCharacters')}</p>,
                        },
                      ]}
                    >
                      <Input />
                    </BaseForm.Item>
                  </Col>
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      name={['translations', lang.en, 'address']}
                      label={<LableText>{t('common.address_en')}</LableText>}
                      style={{ marginTop: '-1rem' }}
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
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
                  label={<LableText>{t('companies.country')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select onChange={ChangeCountryHandler} defaultValue={branchData?.region?.city?.country?.name}>
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
                  <Select onChange={ChangeCityHandler} defaultValue={branchData?.region?.city?.name}>
                    {citiesData?.data?.result?.items.map((city: any) => (
                      <Option key={city.name} value={city.id}>
                        {city?.name}
                      </Option>
                    ))}
                  </Select>
                </BaseForm.Item>

                <BaseForm.Item
                  name={['regions']}
                  label={<LableText>{t('companies.region')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select onChange={ChangeRegionHandler} defaultValue={branchData?.region?.name}>
                    {RegionsData?.data?.result?.items.map((Region: any) => (
                      <Option key={Region?.name} value={Region.id}>
                        {Region?.name}
                      </Option>
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
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseForm.Item
                      label={<LableText>{t('common.emailAddress')}</LableText>}
                      name={['companyContact', 'emailAddress']}
                      style={{ marginTop: '-1rem' }}
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
                  </Col>
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
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
                      <Input />
                    </BaseForm.Item>
                  </Col>
                </Row>

                <Row style={{ justifyContent: 'space-around' }}>
                  <Col
                    style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                  >
                    <BaseButtonsForm.Item
                      name={['companyContact', 'phoneNumber']}
                      key={current}
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
                        isDesktop || isTablet ? { width: '100%', margin: 'auto' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Input
                        key={1}
                        addonBefore={PHONE_NUMBER_CODE}
                        maxLength={PHONE_NUMBER_LENGTH}
                        value={branchData.companyContact?.phoneNumber}
                        onChange={(e) => {
                          if (validationInputNumber(e.target.value)) {
                            form.setFieldValue(['companyContact', 'phoneNumber'], e.target.value);
                          } else form.setFieldValue(['companyContact', 'phoneNumber'], '');
                        }}
                      />
                    </BaseButtonsForm.Item>
                  </Col>
                </Row>

                <Row style={{ justifyContent: 'flex-start', margin: '1rem 5%' }}>
                  <Col span={24}>
                    <BaseForm.Item label={<LableText>{t('common.workTimes')}</LableText>}>
                      <WorkTimes selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
                    </BaseForm.Item>
                  </Col>
                </Row>
              </>
            )}

            {current === 1 && (
              <>
                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.typeMove')}:</h4>

                <BaseForm.Item
                  name={['serviceType']}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Radio.Group
                    style={{ display: 'flex', width: '100%' }}
                    onChange={(event) => {
                      form.setFieldsValue({ ['serviceType']: event.target.value });
                      setValueRadio(event.target.value);
                    }}
                    defaultValue={branchData.serviceType}
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
                  name="availableCountries"
                  label={<LableText>{t('companies.country')}</LableText>}
                  style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Select
                    onChange={(e: any) => {
                      setCountryIdForAvailableCities(e);
                    }}
                    defaultValue={branchData?.availableCities.map((city: any) => city?.country.name)}
                  >
                    {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
                      <Option key={country.id} value={country.id}>
                        {country?.name}
                      </Option>
                    ))}
                  </Select>
                </BaseForm.Item>

                <Spin spinning={isLoadingAvailableCities}>
                  <BaseForm.Item
                    label={<LableText>{t('companies.availableCities')}</LableText>}
                    style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    {!isLoadingAvailableCities && (
                      <Select
                        mode="multiple"
                        onChange={(cities: any) => setSelectedCityValues(cities)}
                        defaultValue={
                          countryIdForAvailableCities == branchData?.availableCities[0]?.countryId
                            ? branchData?.availableCities.map((city: any) => city?.id)
                            : []
                        }
                      >
                        {availableCitiesData?.data?.result?.items.map((city: any) => (
                          <Option key={city.id} value={city.id}>
                            {city.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </BaseForm.Item>
                </Spin>
              </>
            )}

            {current === 2 && (
              <>
                <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('branch.selectService')} :</h4>
                <BaseForm.Item key="100" name={['services']}>
                  <Tree
                    style={treeStyle}
                    checkable
                    defaultExpandAll={true}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={(checkedKeysValue: any, info: any) => {
                      setSelectedServices(checkedKeysValue);
                      requestServicesArray = [...checkedKeysValue];
                    }}
                    defaultCheckedKeys={selectedServices}
                    checkedKeys={selectedServices}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                  />
                </BaseForm.Item>
              </>
            )}
          </BaseForm>
        )}
      </Spin>
    </Card>
  );
};
