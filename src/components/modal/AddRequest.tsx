import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { message, Steps, Radio, Image, Row, Space, Tree, DatePicker, Col } from 'antd';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Card } from '@app/components/common/Card/Card';
import { CreateButtonText, treeStyle, LableText, TextBack } from '../GeneralStyles';
import { Input } from '../../components/GeneralStyles';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Checkbox } from '../common/Checkbox/Checkbox';
import { BankOutlined, ClearOutlined, LeftOutlined, PushpinOutlined, UserOutlined } from '@ant-design/icons';
import { useResponsive } from '@app/hooks/useResponsive';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { TextArea } from '../../components/GeneralStyles';
import { useQuery } from 'react-query';
import { getServicesForRequest } from '@app/services/services';
import { getChildAttributeChoice, getAttributeForSourceTypes, getSourceTypes } from '@app/services/sourceTypes';
import type { DataNode } from 'antd/es/tree';
import { createRequest } from '@app/services/requests';
import { useMutation } from 'react-query';
import { Select, Option } from '../common/selects/Select/Select';
import { getCountries, getCities, GetUAE } from '@app/services/locations';
import { Alert } from '../common/Alert/Alert';
import { uploadAttachment, UploadMultiAttachment } from '@app/services/Attachment';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { useLanguage } from '@app/hooks/useLanguage';
import { validationInputNumber } from '../functions/ValidateInputNumber';
import Map from '../Admin/ReusableComponents/Map';
import { PHONE_NUMBER_CODE } from '@app/constants/appConstants';
import { LocationServicesValues } from '@app/constants/enums/locationServicesType';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { Step } = Steps;
let requestData = {};
let requestServicesArray: any = [];
const requestServices: any = [];
const lang = localStorage.getItem('Go Movaro-lang');
interface DisabledState {
  [key: string]: boolean;
}

export const AddRequest: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const { userId } = useParams();
  const Navigate = useNavigate();
  const { language } = useLanguage();

  const sourceLat = 25.15658048160557;
  const sourceLng = 55.34100848084654;
  const destinationLat = 25.180801685212185;
  const destinationLng = 55.281956967174665;

  const [current, setCurrent] = useState(0);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [sourcePosition, setSourcePosition] = useState({ lat: sourceLat, lng: sourceLng });
  const [destinationPosition, setDestinationPosition] = useState({ lat: destinationLat, lng: destinationLng });
  const [centerSource, setCenterSource] = useState({
    lat: 25.15658048160557,
    lng: 55.34100848084654,
  });
  const [centerDestination, setCenterDestination] = useState({
    lat: 25.15658048160557,
    lng: 55.34100848084654,
  });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [valueRadio, setValueRadio] = useState(0);
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState({ source: '0', destination: '0' });
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [selectedSourceType, setSelectedSourceType] = useState('0');
  const [sourceType, setSourceType] = useState('0');
  const [selectedChoices, setSelectedChoices] = useState<{ sourceTypeId: number; attributeChoiceId: number }[]>([]);
  const [disabledState, setDisabledState] = useState<DisabledState>({});
  const [disabledUpload, setDisabledUpload] = useState<DisabledState>({});

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [validations, setValidations] = useState(false);
  const [childAttributeChoices, setChildAttributeChoices] = useState<any>();
  const [parentAttributeChoiceIdValue, setParentAttributeChoiceIdValue] = useState<any>();
  const [attributeForSourceTypeId, setAttributeForSourceTypeId] = useState(0);
  const [imagesLists, setImagesLists] = useState<Array<Array<Array<any>>>>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
  const [selectedRadios, setSelectedRadios] = useState<{ [key: number]: number }>({});
  const [itemId, setItemId] = useState(0);
  const [needStorage, setNeedStorage] = useState(false);
  const [attributeChoiceAndAttachments, setAttributeChoiceAndAttachments] = useState<
    Array<{ attributeChoiceId: number; attachmentIds: number[] }>
  >([]);
  const [fileListLength, setFileListLength] = useState(0);
  const [picturesList, setPicturesList] = useState<any[]>([]);
  const updatedAttributeChoiceAndAttachments = attributeChoiceAndAttachments.map((entry) => ({
    ...entry,
    statusOfAttributeChoiceId: disabledUpload[entry.attributeChoiceId] === true,
  }));

  const outputArray = selectedCheckboxes.map((checkboxId) => ({
    attributeForSourcTypeId: checkboxId,
    attributeChoiceId: selectedRadios[checkboxId] || 0,
  }));

  const setImagesListAtIndex = (
    sourceTypeIndex: number,
    parentAttributeChoiceIndex: number,
    childAttributeChoiceIndex: number,
    fileList: any[],
  ) => {
    setImagesLists((prevLists) => {
      const newLists = [...prevLists];
      if (!newLists[sourceTypeIndex]) {
        newLists[sourceTypeIndex] = [];
      }
      if (!newLists[sourceTypeIndex][parentAttributeChoiceIndex]) {
        newLists[sourceTypeIndex][parentAttributeChoiceIndex] = [];
      }
      newLists[sourceTypeIndex][parentAttributeChoiceIndex][childAttributeChoiceIndex] = fileList;
      return newLists;
    });
  };

  const handlePreview = (
    sourceTypeIndex: number,
    parentAttributeChoiceIndex: number,
    childAttributeChoiceIndex: number,
    file: any,
  ) => {
    const imagesListForComponent =
      imagesLists[sourceTypeIndex]?.[parentAttributeChoiceIndex]?.[childAttributeChoiceIndex];
    if (imagesListForComponent) {
      const fileIndex = imagesListForComponent.findIndex((item: any) => item.uid === file.uid);
      if (fileIndex !== -1) {
        const fileToPreview = imagesListForComponent[fileIndex];
        setPreviewOpen(true);
        setPreviewImage(fileToPreview.url);
        setPreviewTitle(fileToPreview.name);
      }
    }
  };

  useEffect(() => {
    if (parentAttributeChoiceIdValue) {
      getChildAttributeChoice(parentAttributeChoiceIdValue)
        .then((data) => {
          const items = data?.data?.result?.items || [];
          setChildAttributeChoices(items);
        })
        .catch((error) => {
          message.open(error);
        });
    }
  }, [parentAttributeChoiceIdValue]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreviews = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const uploadImage = useMutation((data: any) => uploadAttachment(data), {
    onSuccess: (data: any) => {
      if (data.data.success) {
        const newId = data.data.result?.id;
        setPreviewImage(data.data.result?.url);
        setAttributeChoiceAndAttachments((prevAttributes) => {
          const existingObjectIndex = prevAttributes.findIndex((obj) => obj.attributeChoiceId === itemId);
          if (existingObjectIndex !== -1) {
            const updatedAttributes = [...prevAttributes];
            const attachmentIds = updatedAttributes[existingObjectIndex].attachmentIds;
            if (!attachmentIds.includes(newId)) {
              attachmentIds.push(newId);
            }
            return updatedAttributes;
          } else {
            return [
              ...prevAttributes,
              {
                attributeChoiceId: itemId,
                attachmentIds: [newId],
              },
            ];
          }
        });
      } else {
        message.open({
          content: <Alert message={data.data.error?.message || 'Upload failed'} type={'error'} showIcon />,
        });
      }
    },
    onError: (error: any) => {
      message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
    },
  });

  const GetAllServices = useQuery(['getServicesForRequest', needStorage], () =>
    getServicesForRequest(needStorage ? undefined : false, false),
  );
  const GetAllSourceType = useQuery('GetAllSourceType', getSourceTypes);
  const GetAllCountry = useQuery('GetAllCountry', getCountries);
  const UAE = useQuery('GetUAE', GetUAE);
  const {
    data: cityData,
    refetch,
    isRefetching,
  } = useQuery('GetAllCity', () => getCities(countryId), {
    enabled: countryId !== '0',
  });

  const {
    data: attributeForSourceTypesData,
    refetch: AttributeForSourceTypesRefetch,
    isRefetching: attributeForSourceTypesIsRefetching,
    isLoading: attributeForSourceTypesIsLoading,
  } = useQuery('AttributeForSourceTypes', () => getAttributeForSourceTypes(selectedSourceType), {
    refetchOnWindowFocus: false,
    enabled: Number(selectedSourceType) !== 0,
  });

  useEffect(() => {
    refetch();
  }, [countryId]);

  useEffect(() => {
    AttributeForSourceTypesRefetch();
  }, [selectedSourceType, sourceType, disabledUpload]);

  useEffect(() => {
    setSelectedCheckboxes([]);
  }, [selectedSourceType]);

  useEffect(() => {
    GetAllSourceType.refetch();
    AttributeForSourceTypesRefetch();
    GetAllServices.refetch();
  }, [language]);

  const handleMapClick = (event: any, positionType: 'source' | 'destination') => {
    if (event.latLng) {
      const newLat = event.latLng.lat;
      const newLng = event.latLng.lng;

      if (positionType === 'source') {
        setSourcePosition({ lat: newLat, lng: newLng });
      } else if (positionType === 'destination') {
        setDestinationPosition({ lat: newLat, lng: newLng });
      }
    }
  };

  const steps = [
    {
      title: 'SourceType',
    },
    {
      title: 'Location',
    },
    {
      title: 'Contact',
    },
    {
      title: 'Services',
    },
  ];

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
            subService?.tools?.length > 0 ? `${subService?.id}` : `onlySub service${service?.id} sub${subService?.id}`,
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

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const ChangeCountryHandler = (e: any, positionType: 'source' | 'destination') => {
    setCountryId(e);
    if (positionType === 'source') {
      form.setFieldValue('sourceCity', '');
    } else if (positionType === 'destination') {
      form.setFieldValue('destinationCity', '');
    }
  };

  const ChangeCityHandler = (e: any, positionType: 'source' | 'destination') => {
    if (positionType === 'source') {
      setCityId((prevCityId) => ({ ...prevCityId, source: e }));
    } else if (positionType === 'destination') {
      setCityId((prevCityId) => ({ ...prevCityId, destination: e }));
    }
  };

  const createRequestMutation = useMutation((id: any) =>
    createRequest(id)
      .then((data) => {
        data.data?.success &&
          message.open({
            content: <Alert message={t('requests.addRequestSuccessMessage')} type={`success`} showIcon />,
          });
        requestServicesArray = [];
        setAttributeChoiceAndAttachments([]);
        Navigate(`/requests`);
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
        requestServicesArray = [];
      }),
  );

  const onFinish = async (values: any) => {
    const sourceContact = {
      dailCode: PHONE_NUMBER_CODE,
      phoneNumber: form.getFieldValue(['requestForQuotationContacts', 0, 'phoneNumber']),
      fullName: form.getFieldValue(['requestForQuotationContacts', 0, 'fullName']),
      requestForQuotationContactType: 1,
    };
    const destinationContact = {
      dailCode: PHONE_NUMBER_CODE,
      phoneNumber: form.getFieldValue(['requestForQuotationContacts', 1, 'phoneNumber']),
      fullName: form.getFieldValue(['requestForQuotationContacts', 1, 'fullName']),
      requestForQuotationContactType: 2,
    };
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

    const filteredAttributeChoiceAndAttachments = updatedAttributeChoiceAndAttachments.filter(
      (entry) => entry.statusOfAttributeChoiceId === true,
    );

    const attributeChoiceAndAttachmentsToSend = filteredAttributeChoiceAndAttachments.map(
      ({ statusOfAttributeChoiceId, ...rest }) => rest,
    );

    const attachmentIds = fileList.map((file) => file.uid);
    const y = [
      {
        attributeChoiceId: null,
        attachmentIds: attachmentIds,
      },
    ];

    const allAttachments = [...y, ...attributeChoiceAndAttachmentsToSend];

    requestData = {
      sourceCityId: cityId.source,
      sourceAddress: form.getFieldValue('sourceAddress'),
      sourceLongitude: sourcePosition.lng,
      sourceLatitude: sourcePosition.lat,
      moveAtUtc: form.getFieldValue('moveAtUtc'),

      destinationCityId: cityId.destination,
      destinationAddress: form.getFieldValue('destinationAddress'),
      destinationLongitude: destinationPosition.lng,
      destinationLatitude: destinationPosition.lat,
      arrivalAtUtc: needStorage ? form.getFieldValue('arrivalAtUtc') : null,

      requestForQuotationContacts: [sourceContact, destinationContact],
      serviceType: valueRadio,
      comment: form.getFieldValue('comment'),
      services: requestServices,

      sourceTypeId: selectedSourceType,
      attributeForSourceTypeValues: outputArray,
      attributeChoiceAndAttachments: allAttachments,
      userId: userId ? userId : '0',
    };
    setValidations(true);

    if (attachmentIds.length == 0 && attributeChoiceAndAttachmentsToSend.length == 0) {
      message.open({
        content: <Alert message={t('addRequest.atLeastOneAttachment')} type={`error`} showIcon />,
      });
      setValidations(false);
      return;
    }
  };

  useEffect(() => {
    if (validations) {
      const showError = (messageText: string) => {
        message.open({
          content: <Alert message={messageText} type={`error`} showIcon />,
        });
        setValidations(false);
      };

      const checkField = (fieldName: any, messageText: string) => {
        if (form.getFieldValue(fieldName) === undefined) {
          showError(messageText);
          return false;
        }
        return true;
      };

      if (selectedSourceType === '0') {
        showError(t('addRequest.selectSourceType'));
      } else if (requestServices.length === 0) {
        showError(t('requests.atLeastOneService'));
      } else if (valueRadio === 0) {
        showError(t('addRequest.selectServiceType'));
      } else if (
        !checkField(['requestForQuotationContacts', 0, 'phoneNumber'], t('addRequest.enterPhoneNumber')) ||
        !checkField(['requestForQuotationContacts', 1, 'phoneNumber'], t('addRequest.enterPhoneNumber')) ||
        !checkField(['requestForQuotationContacts', 0, 'fullName'], t('addRequest.enterFullName')) ||
        !checkField(['requestForQuotationContacts', 1, 'fullName'], t('addRequest.enterFullName')) ||
        !checkField('sourceAddress', t('addRequest.enterAddress')) ||
        !checkField('destinationAddress', t('addRequest.enterAddress')) ||
        !checkField('moveAtUtc', t('addRequest.enterDate')) ||
        (needStorage && !checkField('arrivalAtUtc', t('addRequest.enterDate')))
      ) {
        return;
      } else if (cityId.source === '0' || cityId.destination === '0') {
        showError(t('addRequest.enterCity'));
      } else {
        createRequestMutation.mutateAsync(requestData);
        setValidations(false);
      }
    }
  }, [validations]);

  const uploadButtonForAttribute = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const uploadButtonForAllRequest = (
    <div onClick={() => setItemId(-10)}>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const toggleDisable = (sourceTypeId: string) => {
    setDisabledState((prevState) => ({
      ...prevState,
      [sourceTypeId]: prevState[sourceTypeId] === undefined ? true : !prevState[sourceTypeId],
    }));
  };

  const uploadDisable = (itemId: string) => {
    setDisabledUpload((prevState) => ({
      ...prevState,
      [itemId]: prevState[itemId] === undefined ? true : !prevState[itemId],
    }));
  };

  const UploadAttachments = async (options: any) => {
    const { file } = options;

    if (typeof file?.uid === 'string') picturesList?.push(file);

    if (picturesList?.length === fileListLength) {
      const formData = new FormData();
      picturesList?.forEach((item) => {
        formData.append('files', item);
      });
      formData.append('RefType', '2');
      const result = await UploadMultiAttachment(formData);
      const x: any[] = [];
      result?.data?.result?.map((res: any) => {
        x.push({
          uid: res?.id,
          status: 'done',
          url: res?.url,
        });
      });
      setPicturesList([]);
      setFileListLength(0);

      setFileList(fileList.concat(x));
    }
  };

  const handleMovingTypeChange = (event: any) => {
    form.setFieldsValue({ ['serviceType']: event.target.value });
    setValueRadio(event.target.value);
  };

  return (
    <Card title={t('addRequest.addRequest')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'space-between'} style={{ width: '100%' }}>
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
              onClick={onFinish}
              loading={createRequestMutation.isLoading || uploadImage.isLoading}
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
            title={t(`addRequest.${step.title}`)}
            icon={
              index === 0 ? (
                <BankOutlined />
              ) : index === 1 ? (
                <PushpinOutlined />
              ) : index === 2 ? (
                <UserOutlined />
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
        name="addRequestForm"
        style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
      >
        {current === 0 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.whatMoving')}</h4>
            <BaseForm.Item
              name={['sourceTypeId']}
              label={<LableText>{t('addRequest.sourceType')}</LableText>}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : isMobile ? { width: '100%' } : {}}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(e: any) => {
                  setSelectedSourceType(e);
                  setSourceType('1');
                }}
              >
                {GetAllSourceType?.data?.data?.result?.items?.map((ele: any) => {
                  return (
                    <Option value={ele.id} key={ele?.id}>
                      <Space>
                        <span role="img" aria-label={ele.name} style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={ele?.icon?.url} width={27} height={27} style={{ margin: '0 1.5rem 0 0.3rem' }} />
                          {ele.name}
                        </span>
                      </Space>
                    </Option>
                  );
                })}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item name={['attributeForSourceTypeValues']}>
              {sourceType == '0' ? (
                <p>{t('addRequest.chooseOption')}</p>
              ) : attributeForSourceTypesData?.data?.result?.items.length == 0 ? (
                <p>{t('addRequest.sourceTypeDoesntHaveAttribute')}</p>
              ) : attributeForSourceTypesData?.data?.result?.items.length > 0 && sourceType == '1' ? (
                <div>
                  {attributeForSourceTypesData?.data?.result?.items.map((sourceTypeItem: any) => (
                    <Card key={sourceTypeItem.id} style={{ margin: '3rem 0' }}>
                      <div style={{ margin: '1rem' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '3rem' }}>
                          <BaseForm.Item name={sourceTypeItem.name} valuePropName="checked">
                            <Checkbox
                              key={sourceTypeItem.id}
                              onClick={() => {
                                toggleDisable(sourceTypeItem.id);
                              }}
                              onChange={(CheckboxChangeEvent) => {
                                const isChecked = CheckboxChangeEvent.target.checked;

                                if (isChecked) {
                                  setSelectedCheckboxes((prevSelectedCheckboxes) => [
                                    ...prevSelectedCheckboxes,
                                    sourceTypeItem.id,
                                  ]);
                                } else {
                                  setSelectedCheckboxes((prevSelectedCheckboxes) =>
                                    prevSelectedCheckboxes.filter((id) => id !== sourceTypeItem.id),
                                  );
                                }
                              }}
                            >
                              {sourceTypeItem.name}
                            </Checkbox>
                          </BaseForm.Item>
                        </p>
                        <Radio.Group
                          className="radios"
                          style={{ display: 'flex', justifyContent: 'space-around' }}
                          onChange={(e) => {
                            const sourceTypeId = sourceTypeItem.id;
                            setAttributeForSourceTypeId(sourceTypeId);
                            setSelectedChoices((prevSelectedChoices) => ({
                              ...prevSelectedChoices,
                              [sourceTypeId]: e.target.value,
                            }));
                            setSelectedRadios((prevSelectedRadios) => ({
                              ...prevSelectedRadios,
                              [sourceTypeId]: e.target.value.id,
                            }));
                          }}
                          value={selectedChoices[sourceTypeItem.id]}
                        >
                          {sourceTypeItem.attributeChoices.map((parentAttributeChoice: any) => (
                            <>
                              <Radio
                                disabled={!disabledState[sourceTypeItem.id]}
                                key={parentAttributeChoice.id}
                                value={parentAttributeChoice}
                                onChange={(e) => {
                                  setParentAttributeChoiceIdValue(parentAttributeChoice.id);
                                }}
                                style={{ height: '30px' }}
                              >
                                {parentAttributeChoice.name}
                              </Radio>
                              <Row style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {childAttributeChoices?.map(
                                  (item: any, index: number) =>
                                    parentAttributeChoice?.id === item?.attributeChociceParentId && (
                                      <div key={item.id} style={{ margin: '1rem' }} onClick={() => setItemId(item.id)}>
                                        <BaseForm.Item key={index} name={item.name} valuePropName="checked">
                                          <Checkbox
                                            onClick={() => {
                                              uploadDisable(item?.id);
                                            }}
                                          >
                                            <p>{item.name}</p>
                                          </Checkbox>
                                        </BaseForm.Item>
                                        <Upload
                                          key={item.id}
                                          disabled={!disabledUpload[item?.id]}
                                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                          accept=".jpeg,.png,.jpg"
                                          listType="picture-card"
                                          fileList={
                                            imagesLists[attributeForSourceTypeId]?.[parentAttributeChoiceIdValue]?.[
                                              item.id
                                            ]
                                          }
                                          onPreview={(file) =>
                                            handlePreview(
                                              attributeForSourceTypeId,
                                              parentAttributeChoiceIdValue,
                                              item.id,
                                              file,
                                            )
                                          }
                                          beforeUpload={(file) => {
                                            const formData = new FormData();
                                            formData.append('RefType', '2');
                                            formData.append('file', file);
                                            uploadImage.mutate(formData);

                                            return false;
                                          }}
                                          onChange={(e: any) => {
                                            setImagesListAtIndex(
                                              attributeForSourceTypeId,
                                              parentAttributeChoiceIdValue,
                                              item.id,
                                              e.fileList,
                                            );
                                          }}
                                          maxCount={20}
                                        >
                                          {imagesLists[index]?.length >= 20 ? null : uploadButtonForAttribute}
                                        </Upload>
                                        <Modal
                                          open={previewOpen}
                                          title={previewTitle}
                                          footer={null}
                                          onCancel={handleCancel}
                                        >
                                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                      </div>
                                    ),
                                )}
                              </Row>
                            </>
                          ))}
                        </Radio.Group>
                      </div>
                    </Card>
                  ))}
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".jpeg,.png,.jpg"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreviews}
                    maxCount={10}
                    multiple
                    onChange={(item) => {
                      setFileListLength(item.fileList?.filter((item) => typeof item.uid === 'string')?.length);
                    }}
                    onRemove={(file) => {
                      setFileList((prev: any[]) => {
                        const test = prev.filter((item: any) => item?.uid !== file?.uid);

                        return test;
                      });
                      return;
                    }}
                    customRequest={UploadAttachments}
                  >
                    {fileList.length >= 8 ? null : uploadButtonForAllRequest}
                  </Upload>
                  <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              ) : (
                ''
              )}
            </BaseForm.Item>
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
                onChange={(event) => handleMovingTypeChange(event)}
              >
                <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  {t('requests.Internal')}
                </Radio>
                <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  {t('requests.External')}
                </Radio>
              </Radio.Group>
            </BaseForm.Item>

            <h4 style={{ margin: '4rem 0', fontWeight: '700' }}>{t('addRequest.sourceLocations')}:</h4>
            <Row style={{ justifyContent: 'space-around' }}>
              <Col span={12}>
                <BaseForm.Item
                  label={<LableText>{t('addRequest.country')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet ? { margin: '0 2% 3rem', width: '98%' } : isMobile ? { width: '100%' } : {}
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children?.toLowerCase().includes(input?.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                    }
                    onChange={(e) => ChangeCountryHandler(e, 'source')}
                  >
                    {UAE?.data?.data?.result?.items?.map((ele: any) => {
                      return (
                        <Option value={ele.id} key={ele?.id}>
                          {ele.name}
                        </Option>
                      );
                    })}
                  </Select>
                </BaseForm.Item>
                <BaseForm.Item
                  name={['sourceCityId']}
                  label={<LableText>{t('addRequest.city')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet ? { margin: '0 2% 3rem', width: '98%' } : isMobile ? { width: '100%' } : {}
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children?.toLowerCase().includes(input?.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                    }
                    onChange={(e) => ChangeCityHandler(e, 'source')}
                  >
                    {cityData?.data?.result?.items?.map((ele: any) => {
                      return (
                        <Option value={ele.id} key={ele?.id}>
                          {ele.name}
                        </Option>
                      );
                    })}
                  </Select>
                </BaseForm.Item>
              </Col>
              <Col span={12}>
                <BaseForm.Item
                  name="sourceAddress"
                  label={<LableText>{t('addRequest.sourceAddress')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet
                      ? { margin: '0 2% 3rem', display: 'inline-block', width: '98%' }
                      : isMobile
                      ? { width: '100%', display: 'block' }
                      : {}
                  }
                >
                  <Input />
                </BaseForm.Item>
                <BaseForm.Item
                  name="moveAtUtc"
                  label={<LableText>{t('addRequest.date')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet
                      ? { margin: '0 2% 3rem', width: '98%' }
                      : isMobile
                      ? { width: '100%', marginBottom: '5rem' }
                      : {}
                  }
                  valuePropName="data"
                >
                  <DatePicker style={{ width: '100%' }} />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row>
              <div style={{ width: '100%', height: '350px' }}>
                <Map
                  field="source"
                  value={sourcePosition}
                  handleChange={(name: any, position: any) =>
                    handleMapClick({ latLng: { lat: position[0], lng: position[1] } }, 'source')
                  }
                />
              </div>
            </Row>

            <Row justify={'space-around'} style={{ margin: '3rem' }}>
              <Checkbox onClick={() => setNeedStorage(!needStorage)}>
                <h4 style={{ fontWeight: '700' }}>{t('addRequest.needStorage')}</h4>
              </Checkbox>
            </Row>

            <h4 style={{ margin: '5rem 0 2rem', fontWeight: '700' }}>{t('addRequest.destinationLocations')}:</h4>
            <Row style={{ justifyContent: 'space-around' }}>
              <Col span={12}>
                <BaseForm.Item
                  label={<LableText>{t('addRequest.country')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet ? { margin: '0 2% 3rem', width: '98%' } : isMobile ? { width: '100%' } : {}
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children?.toLowerCase().includes(input?.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                    }
                    onChange={(e) => ChangeCountryHandler(e, 'destination')}
                  >
                    {(valueRadio === LocationServicesValues.Internal
                      ? UAE
                      : GetAllCountry
                    )?.data?.data?.result?.items?.map((ele: any) => {
                      return (
                        <Option value={ele.id} key={ele?.id}>
                          {ele.name}
                        </Option>
                      );
                    })}
                  </Select>
                </BaseForm.Item>
                <BaseForm.Item
                  name={['destinationCityId']}
                  label={<LableText>{t('addRequest.city')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet ? { margin: '0 2% 3rem', width: '98%' } : isMobile ? { width: '100%' } : {}
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option!.children?.toLowerCase().includes(input?.toLowerCase())
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                    }
                    onChange={(e) => ChangeCityHandler(e, 'destination')}
                  >
                    {cityData?.data?.result?.items?.map((ele: any) => {
                      return (
                        <Option value={ele.id} key={ele?.id}>
                          {ele.name}
                        </Option>
                      );
                    })}
                  </Select>
                </BaseForm.Item>
              </Col>
              <Col span={12}>
                <BaseForm.Item
                  name="destinationAddress"
                  label={<LableText>{t('addRequest.destinationAddress')}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  style={
                    isDesktop || isTablet
                      ? { margin: '0 2% 3rem', display: 'inline-block', width: '98%' }
                      : isMobile
                      ? { width: '100%', display: 'block' }
                      : {}
                  }
                >
                  <Input />
                </BaseForm.Item>
                {needStorage && (
                  <BaseForm.Item
                    name="arrivalAtUtc"
                    label={<LableText>{t('addRequest.date')}</LableText>}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                    style={
                      isDesktop || isTablet
                        ? { margin: '0 2% 3rem', width: '98%' }
                        : isMobile
                        ? { width: '100%', marginBottom: '5rem' }
                        : {}
                    }
                    valuePropName="data"
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </BaseForm.Item>
                )}
              </Col>
            </Row>
            <Row>
              <div style={{ width: '100%', height: '350px' }}>
                <Map
                  field="destination"
                  value={destinationPosition}
                  handleChange={(name: any, position: any) =>
                    handleMapClick({ latLng: { lat: position[0], lng: position[1] } }, 'destination')
                  }
                />
              </div>
            </Row>
          </>
        )}

        {current === 2 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.ForSource')}:</h4>
            <BaseForm.Item
              name={['requestForQuotationContacts', 0, 'fullName']}
              label={<LableText>{t('common.fullName')}</LableText>}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
            >
              <Input />
            </BaseForm.Item>
            <BaseForm.Item
              key={current}
              name={['requestForQuotationContacts', 0, 'phoneNumber']}
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
                addonBefore={'+971'}
                onChange={(e) => {
                  if (validationInputNumber(e.target.value)) {
                    form.setFieldValue(['requestForQuotationContacts', 0, 'phoneNumber'], e.target.value);
                  } else form.setFieldValue(['requestForQuotationContacts', 0, 'phoneNumber'], '');
                }}
                maxLength={9}
                style={{ width: '100%' }}
              />
            </BaseForm.Item>

            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.ForDestination')}:</h4>
            <BaseForm.Item
              name={['requestForQuotationContacts', 1, 'fullName']}
              label={<LableText>{t('common.fullName')}</LableText>}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
            >
              <Input />
            </BaseForm.Item>
            <BaseForm.Item
              key={current}
              name={['requestForQuotationContacts', 1, 'phoneNumber']}
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
                addonBefore={'+971'}
                onChange={(e) => {
                  if (validationInputNumber(e.target.value)) {
                    form.setFieldValue(['requestForQuotationContacts', 1, 'phoneNumber'], e.target.value);
                  } else form.setFieldValue(['requestForQuotationContacts', 1, 'phoneNumber'], '');
                }}
                maxLength={9}
                style={{ width: '100%' }}
              />
            </BaseForm.Item>
          </>
        )}

        {current === 3 && (
          <>
            <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.selectService')} :</h4>
            <BaseForm.Item name={['services']}>
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

            <BaseForm.Item name={['comment']}>
              <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
            </BaseForm.Item>
          </>
        )}
      </BaseForm>
    </Card>
  );
};
