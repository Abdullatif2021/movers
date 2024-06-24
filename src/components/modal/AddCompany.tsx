import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText, treeStyle, Text } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CompanyModal, TimeworksProps } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { uploadAttachment } from '@app/services/Attachment';
import {
  BankOutlined,
  ClearOutlined,
  FileAddOutlined,
  HomeOutlined,
  PictureOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { message, Alert, Button, Col, Input, Modal, Radio, Row, Steps, Upload, Tree, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { getCities, getCountries, getRegions, GetUAE } from '@app/services/locations';
import { useNavigate } from 'react-router-dom';
import { getServicesForCompany } from '@app/services/services';
import { createCompany } from '@app/services/companies';
import { Card } from '@app/components/common/Card/Card';
import { TextArea } from '../../components/GeneralStyles';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { RcFile, UploadFile } from 'antd/es/upload';
import type { DataNode } from 'antd/es/tree';
import { useLanguage } from '@app/hooks/useLanguage';
import CustomPasswordInput from '../common/inputs/InputPassword/CustomPasswordInput';
import { validationInputNumber } from '../functions/ValidateInputNumber';
import { PHONE_NUMBER_CODE } from '@app/constants/appConstants';
import WorkTimes from '../common/WorkTimes';

const { Step } = Steps;
let requestServicesArray: any = [];
const requestServices: any = [];
const steps = [
  {
    title: 'companyInfo',
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
  {
    title: 'attachments',
  },
];
let companyInfo: any = {
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
  comment: 'string',
  serviceType: 0,
  userDto: {
    dialCode: '963',
    phoneNumber: '0997829849',
    password: '865fghjk',
  },
  companyProfilePhotoId: 0,
  companyOwnerIdentityIds: [],
  companyCommercialRegisterIds: [],
  additionalAttachmentIds: [],
  availableCitiesIds: [],
};
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const AddCompany: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();

  const [selectedCityIDs, setSelectedCityIDs] = useState<number[]>([]);
  const [selectedCityNames, setSelectedCityNames] = useState<string[]>([]);
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState<string>('0');
  const [regionId, setRegionId] = useState<string>('0');
  const [valueRadio, setValueRadio] = useState(1);
  const [current, setCurrent] = useState(0);
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');
  const [logo, setLogo] = useState();
  const [OwnerIdentityIds, setOwnerIdentityIds] = useState();
  const [CommercialRegisterIds, setCommercialRegisterIds] = useState();
  const [additionalAttachmentIds, setAdditionalAttachmentIds] = useState();
  const [formData, setFormData] = useState<CompanyModal>(companyInfo);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageLogoList, setImageLogoList] = useState([]);
  const [fileOwnerList, setFileOwnerList] = useState([]);
  const [imageOwnerList, setImageOwnerList] = useState([]);
  const [fileCommercialList, setFileCommercialList] = useState([]);
  const [imageCommercialList, setImageCommercialList] = useState([]);
  const [fileOtherList, setFileOtherList] = useState([]);
  const [imageOtherList, setImageOtherList] = useState([]);
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [countryIdForAvailableCities, setCountryIdForAvailableCities] = useState<string>('0');
  const [selectedDays, setSelectedDays] = useState<Array<TimeworksProps>>([]);

  const { data, refetch, isRefetching } = useQuery('getServicesForCompany', getServicesForCompany);

  const GetAllCountries = useQuery('GetAllCountries', getCountries);

  const GetUAECountry = useQuery('GetUAECountry', GetUAE);

  const {
    data: availableCitiesData,
    refetch: availableCitiesRefetch,
    isFetching: isLoadingAvailableCities,
  } = useQuery('getCitiesForAvailabel', () => getCities(countryIdForAvailableCities), {
    enabled: countryIdForAvailableCities !== '0' && countryIdForAvailableCities != undefined,
  });
  const { data: citiesData, refetch: citiesRefetch } = useQuery('getCities', () => getCities(countryId), {
    enabled: countryId != '0',
  });

  const { data: RegionsData, refetch: RegionsRefetch } = useQuery('getRegions', () => getRegions(cityId), {
    enabled: cityId !== '0',
  });
  const addCompany = useMutation((data: CompanyModal) =>
    createCompany(data)
      .then((data: any) => {
        notificationController.success({ message: t('companies.addCompanySuccessMessage') });
        queryClient.invalidateQueries('AllCompanies');
        navigate('/companies');
        requestServicesArray = [];
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        requestServicesArray = [];
      }),
  );

  const uploadImage = useMutation((data: FormData) =>
    uploadAttachment(data)
      .then((response) => {
        response.data.success &&
          (setAttachmentId(response.data.result?.id), setUrlAfterUpload(response.data.result?.url));
        const photoId = response.data.result.id;
        const refType = response.data.result.refType;
        setFormData((prevFormData) => {
          let updatedFormData = { ...prevFormData };
          if (refType === 9) {
            updatedFormData = {
              ...updatedFormData,
              companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
            };
            setOwnerIdentityIds(photoId);
          } else if (refType === 10) {
            updatedFormData = {
              ...updatedFormData,
              companyCommercialRegisterIds: [...updatedFormData.companyCommercialRegisterIds, photoId],
            };
            setCommercialRegisterIds(photoId);
          } else if (refType === 11) {
            updatedFormData = {
              ...updatedFormData,
              additionalAttachmentIds: [...updatedFormData.additionalAttachmentIds, photoId],
            };
            setAdditionalAttachmentIds(photoId);
          } else if (refType === 8) {
            updatedFormData = {
              ...updatedFormData,

              companyProfilePhotoId: photoId,
            };
            setLogo(photoId);
          }
          return updatedFormData;
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
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

  useEffect(() => {
    if (countryIdForAvailableCities !== '0' && countryIdForAvailableCities != undefined) {
      availableCitiesRefetch();
    }
  }, [countryIdForAvailableCities]);

  useEffect(() => {
    refetch();
  }, [language, refetch]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
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

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

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
    companyInfo = {
      ...companyInfo,
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
        isForBranchCompany: false,
      },
      userDto: {
        dialCode: PHONE_NUMBER_CODE,
        phoneNumber: form.getFieldValue(['userDto', 'phoneNumber']),
        emailAddress: form.getFieldValue(['userDto', 'emailAddress']),
        password: form.getFieldValue(['userDto', 'password']),
      },
      serviceType: valueRadio,
      services: requestServices,
      companyProfilePhotoId: logo,
      additionalAttachmentIds: updatedFormData.additionalAttachmentIds,
      companyOwnerIdentityIds: updatedFormData.companyOwnerIdentityIds,
      companyCommercialRegisterIds: updatedFormData.companyCommercialRegisterIds,
      comment: form.getFieldValue('comment'),
      regionId: regionId,
      availableCitiesIds: selectedCityIDs,
      timeworks: selectedDays,
    };

    updatedFormData.translations = companyInfo.translations;
    updatedFormData.additionalAttachmentIds = updatedFormData.additionalAttachmentIds.filter((id: any) => id !== 0);
    if (requestServices.length == 0) {
      message.open({
        content: <Alert message={t('requests.atLeastOneService')} type={`error`} showIcon />,
      });
      return;
    }

    // if (companyInfo.companyOwnerIdentityIds == 0) {
    //   message.open({
    //     content: <Alert message={t('companies.atLeastOneOwnerAttachment')} type={`error`} showIcon />,
    //   });
    //   setEnableEdit(false);
    //   return;
    // }
    // if (companyInfo.companyCommercialRegisterIds == 0) {
    //   message.open({
    //     content: <Alert message={t('companies.atLeastOneCommercialAttachment')} type={`error`} showIcon />,
    //   });
    //   setEnableEdit(false);
    //   return;
    // }

    addCompany.mutate(companyInfo);
  };

  const uploadImageButton = (
    <div style={{ color: '#40aaff' }}>
      <PictureOutlined />
      <div className="ant-upload-text">Upload Image</div>
    </div>
  );

  const uploadLogoButton = (
    <div style={{ color: '#40aaff' }}>
      <PictureOutlined />
      <div className="ant-upload-text">Upload Logo</div>
    </div>
  );

  const uploadFileButton = (
    <div style={{ color: 'rgb(14 190 21)' }}>
      <div>
        <FileAddOutlined />
      </div>
      <div className="ant-upload-text">Upload File</div>
    </div>
  );

  const treeData: any = data?.data?.result?.items?.map((service: any) => {
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

  return (
    <Card title={t('companies.addCompany')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'end'} style={{ width: '100%' }}>
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
            disabled={addCompany.isLoading || uploadImage.isLoading}
            onClick={() => onFinish(form.getFieldsValue())}
          >
            {t('common.done')}
          </Button>
        )}
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
              ) : index === 4 ? (
                <PictureOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <BaseForm
        form={form}
        onFinish={onFinish}
        name="AddCompanyForm"
        style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
      >
        {current === 0 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('partners.generalInfo')}:</h4>
            <Row style={{ display: 'flex', justifyContent: 'space-around', margin: '0 0 2rem' }}>
              <Col>
                <Upload
                  maxCount={1}
                  key="image-logo"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  accept=".jpeg,.png,.jpg"
                  disabled={uploadImage.isLoading ? true : false}
                  fileList={imageLogoList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '8');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageLogoList(e.fileList)}
                >
                  {imageLogoList.length >= 1 ? null : uploadLogoButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
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
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
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
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
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
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
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
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'address']}
                  label={<LableText>{t('common.address_ar')}</LableText>}
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
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'address']}
                  label={<LableText>{t('common.address_en')}</LableText>}
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

            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('companies.companyContact')}:</h4>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
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
              <Col style={isDesktop || isTablet ? { width: '46%', margin: '0 2%' } : { width: '80%', margin: '0 10%' }}>
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
                  <Input value={companyInfo?.companyContact?.webSite} />
                </BaseForm.Item>
              </Col>
            </Row>
            <BaseButtonsForm.Item
              key={current}
              name={['companyContact', 'phoneNumber']}
              label={t('common.phoneNumber')}
              rules={[
                { required: true, message: t('common.requiredField') },
                () => ({
                  validator(_, value) {
                    if (!value || isValidPhoneNumber(value)) {
                      return Promise.resolve();
                    }
                    if (value.length > 9) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                    } else if (value.length < 9) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                    }
                  },
                }),
              ]}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
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
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('common.workTimes')}</h4>
            <BaseForm.Item>
              <WorkTimes selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
            </BaseForm.Item>
          </>
        )}
        {current === 1 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('companies.companyUser')}:</h4>
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
                    if (value.length > 9) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                    } else if (value.length < 9) {
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
              >
                {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
                  <Option key={country.id} value={country.id}>
                    {country?.name}
                  </Option>
                ))}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item
              name="citiesAvailable"
              label={<LableText>{t('companies.availableCities')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                {
                  required: true,
                  message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                },
              ]}
            >
              <Select
                mode="multiple"
                onChange={(selectedCities: any, selectedCityOptions) => {
                  setSelectedCityNames(selectedCityOptions.map((item: any) => item.children));
                  setSelectedCityIDs(selectedCityOptions.map((item: any) => item.key));
                }}
                value={selectedCityNames}
              >
                {availableCitiesData?.data?.result?.items.map((city: any) => (
                  <Option key={city.id} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </BaseForm.Item>
          </>
        )}
        {current === 3 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('branch.selectService')} :</h4>
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
                    // defaultCheckedKeys={serviceKeys}
                    checkedKeys={serviceKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={[serviceTreeData]}
                  />
                );
              })}
            </BaseForm.Item>

            <BaseForm.Item key={88} name="comment">
              <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
            </BaseForm.Item>
          </>
        )}
        {current === 4 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('companies.attachments')} :</h4>
            <Text
              style={{
                color: '#01509A',
                fontSize: FONT_SIZE.md,
                marginBottom: '3rem',
                paddingTop: '17px',
                textAlign: 'center',
              }}
            >
              {t('companies.companyOwnerIdentity')}
            </Text>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Col>
                <Upload
                  key="image-owner"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={imageOwnerList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '9');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageOwnerList(e.fileList)}
                  maxCount={1}
                >
                  {imageOwnerList.length >= 1 ? null : uploadImageButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
              <Col>
                <Upload
                  key="file-owner"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".Pdf"
                  listType="picture-card"
                  fileList={fileOwnerList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '9');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setFileOwnerList(e.fileList)}
                  maxCount={1}
                >
                  {fileOwnerList.length >= 1 ? null : uploadFileButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>

            <Text
              style={{
                color: '#01509A',
                fontSize: FONT_SIZE.md,
                marginBottom: '3rem',
                paddingTop: '16px',
                textAlign: 'center',
              }}
            >
              {t('companies.companyCommercialRegister')}
            </Text>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Col>
                <Upload
                  key="image-commercial "
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={imageCommercialList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '10');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageCommercialList(e.fileList)}
                  maxCount={1}
                >
                  {imageCommercialList.length >= 1 ? null : uploadImageButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
              <Col>
                <Upload
                  key="file-commercial "
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".Pdf"
                  listType="picture-card"
                  fileList={fileCommercialList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '10');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setFileCommercialList(e.fileList)}
                  maxCount={1}
                >
                  {fileCommercialList.length >= 1 ? null : uploadFileButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>

            <Text
              style={{
                color: '#01509A',
                fontSize: FONT_SIZE.md,
                marginBottom: '3rem',
                paddingTop: '16px',
                textAlign: 'center',
              }}
            >
              {t('companies.additionalAttachment')}
            </Text>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Col>
                <Upload
                  key="image-other"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={imageOtherList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '11');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageOtherList(e.fileList)}
                  maxCount={3}
                >
                  {imageOtherList.length >= 3 ? null : uploadImageButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
              <Col>
                <Upload
                  key="file-other"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".Pdf"
                  listType="picture-card"
                  fileList={fileOtherList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '11');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setFileOtherList(e.fileList)}
                  maxCount={3}
                >
                  {fileOtherList.length >= 3 ? null : uploadFileButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>
    </Card>
  );
};
