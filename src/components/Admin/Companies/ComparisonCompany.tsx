import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Card as Cardd } from '@app/components/common/Card/Card';
import { Row, Tree, Image, Tag, Col, Input, Alert, message } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { GetCompaniesToCompare, approveUpdateCompany, confirmCompany } from '@app/services/companies';
import { FONT_WEIGHT } from '@app/styles/themes/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { DataNode } from 'antd/es/tree';
import { Button } from '@app/components/common/buttons/Button/Button';
import { LeftOutlined } from '@ant-design/icons';
import { CreateButtonText, LableText, TextBack } from '@app/components/GeneralStyles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { SendRejectReason } from '@app/components/modal/SendRejectReason';
import { getDayName } from '@app/components/functions/GetDayName';
import { useAppSelector } from '@app/hooks/reduxHooks';

const treeStyle = {
  width: '96%',
  margin: '0 2%',
  padding: '0.5rem',
  borderRadius: '0.25rem',
  border: '1px solid #d9d9d9',
  backgroundColor: '#fff',
};

let oldTreeData: DataNode[] = [];
let newTreeData: DataNode[] = [];

const ComparisonCompany: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { companyId } = useParams();
  const { isDesktop, isTablet, desktopOnly, mobileOnly } = useResponsive();
  const [form] = BaseForm.useForm();
  const Navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [oldCompanyData, setOldCompanyData] = useState<any>();
  const [newCompanyData, setNewCompanyData] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState({
    changeStatus: false,
  });

  const userPermissions = useAppSelector((state) => state.auth.permissions);

  useEffect(() => {
    if (userPermissions.includes('Company.Get')) {
      setHasPermissions((prevPermissions) => ({
        ...prevPermissions,
        changeStatus: true,
      }));
    }
  }, [userPermissions]);

  const { refetch, isRefetching } = useQuery(['GetCompaniesToCompare'], () =>
    GetCompaniesToCompare(companyId)
      .then((data) => {
        const result = data.data?.result;
        setOldCompanyData(result.oldCompany);
        setNewCompanyData(result.newCompany);
        setLoading(!data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        setLoading(false);
      }),
  );

  const confirmUpdateCompany = useMutation((data: string[]) =>
    approveUpdateCompany(data)
      .then((res) => {
        res.data?.success &&
          message.open({
            content: <Alert message={t('companies.approveCompanySuccessMessage')} type={`success`} showIcon />,
          });
        Navigate('/companies');
      })
      .catch((error) =>
        message.open({ content: <Alert message={error.message || error.error?.message} type={`error`} showIcon /> }),
      ),
  );

  const rejectCompany = useMutation((data: any) =>
    confirmCompany(data)
      .then((data) => {
        data.data?.success &&
          message.open({
            content: <Alert message={t('companies.rejectCompanySuccessMessage')} type={`success`} showIcon />,
          });
        Navigate('/companies');
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
      })
      .finally(() => setVisible(false)),
  );

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  if (oldCompanyData && oldCompanyData?.services) {
    oldTreeData = oldCompanyData?.services.map((service: any) => ({
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={27} height={27} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service ${service?.id}`,
      children: service?.subServices.map((subService: any) => ({
        title: (
          <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <Image src={subService?.attachment?.url} width={27} height={27} />
            {subService?.name}
          </span>
        ),
        key: `subService ${subService?.id}`,
        children: subService?.tools.map((tool: any) => ({
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={tool?.attachment?.url} width={27} height={27} />
              {tool?.name}
            </span>
          ),
          key: `tool ${tool?.id}`,
        })),
      })),
    }));
  }

  if (newCompanyData && newCompanyData?.services) {
    newTreeData = newCompanyData?.services.map((service: any) => ({
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={27} height={27} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service ${service?.id}`,

      children: service?.subServices.map((subService: any) => ({
        title: (
          <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
            <Image src={subService?.attachment?.url} width={27} height={27} />
            {subService?.name}
          </span>
        ),
        key: `subService ${subService?.id}`,
        children: subService?.tools.map((tool: any) => ({
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={tool?.attachment?.url} width={27} height={27} />
              {tool?.name}
            </span>
          ),
          key: `tool ${tool?.id}`,
        })),
      })),
    }));
  }

  useEffect(() => {
    if (isRefetching) {
      setLoading(true);
    } else setLoading(false);
  }, [isRefetching, refetch]);

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [refetch, language]);

  return (
    <>
      <PageTitle>{t('companies.companyProfile')}</PageTitle>
      <Row justify={'end'}>
        <Button
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
        </Button>
      </Row>

      <Row>
        <Col style={{ width: '44%', margin: '3%' }}>
          <Cardd
            title={t('companies.oldCompany')}
            padding="0 1.25rem 1rem 1.25rem"
            style={{ width: '100%', height: 'auto', display: 'inline-block' }}
          >
            <Spinner spinning={loading}>
              <BaseForm form={form} name="OldCompanyForm">
                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.companyProfile')} :
                </h3>
                <Row style={{ margin: '2rem auto', justifyContent: 'space-around' }}>
                  <Image
                    key={oldCompanyData?.companyProfile?.id}
                    src={oldCompanyData?.companyProfile?.url}
                    style={{ width: '150px', height: '140px' }}
                  />
                </Row>
                <BaseForm.Item label={<LableText>{t('common.name_ar')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.translations.find((item: any) => item.language == 'ar').name}
                    readOnly
                    status={
                      oldCompanyData?.translations.find((item: any) => item.language == 'ar').name !=
                      newCompanyData?.translations.find((item: any) => item.language == 'ar').name
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.name_en')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.translations.find((item: any) => item.language == 'en').name}
                    readOnly
                    status={
                      oldCompanyData?.translations.find((item: any) => item.language == 'en').name !=
                      newCompanyData?.translations.find((item: any) => item.language == 'en').name
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.bio_ar')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.translations.find((item: any) => item.language == 'ar').bio}
                    readOnly
                    status={
                      oldCompanyData?.translations.find((item: any) => item.language == 'ar').bio !=
                      newCompanyData?.translations.find((item: any) => item.language == 'ar').bio
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.bio_en')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.translations.find((item: any) => item.language == 'en').bio}
                    readOnly
                    status={
                      oldCompanyData?.translations.find((item: any) => item.language == 'en').bio !=
                      newCompanyData?.translations.find((item: any) => item.language == 'en').bio
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.address_ar')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.translations.find((item: any) => item.language == 'ar').address}
                    readOnly
                    status={
                      oldCompanyData?.translations.find((item: any) => item.language == 'ar').address !=
                      newCompanyData?.translations.find((item: any) => item.language == 'ar').address
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.address_en')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.translations.find((item: any) => item.language == 'en').address}
                    readOnly
                    status={
                      oldCompanyData?.translations.find((item: any) => item.language == 'en').address !=
                      newCompanyData?.translations.find((item: any) => item.language == 'en').address
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.country')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.region?.city?.country?.name}
                    readOnly
                    status={
                      oldCompanyData?.region?.city?.country?.name != newCompanyData?.region?.city?.country?.name
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.city')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.region?.city?.name}
                    readOnly
                    status={oldCompanyData?.region?.city?.name != newCompanyData?.region?.city?.name ? 'error' : ''}
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.region')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.region?.name}
                    readOnly
                    status={oldCompanyData?.region?.name != newCompanyData?.region?.name ? 'error' : ''}
                  />
                </BaseForm.Item>

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.availableCities')} :
                </h3>
                <BaseForm.Item
                  label={<LableText>{t('companies.availableCities')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  {oldCompanyData?.availableCities.map((newCity: any) => {
                    const isCityInOldCompany = newCompanyData?.availableCities.some(
                      (oldCity: any) => oldCity.id === newCity.id,
                    );

                    const tagColor = isCityInOldCompany ? '' : 'error';

                    return (
                      <Tag key={newCity.id} color={tagColor}>
                        {newCity.name}
                      </Tag>
                    );
                  })}
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('requests.comment')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.comment}
                    readOnly
                    status={oldCompanyData?.comment != newCompanyData?.comment ? 'error' : ''}
                  />
                </BaseForm.Item>

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.companyInfo')} :
                </h3>
                <BaseForm.Item label={<LableText>{t('common.phoneNumber')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    addonBefore={oldCompanyData?.companyContact?.dialCode}
                    value={oldCompanyData?.companyContact?.phoneNumber}
                    readOnly
                    status={
                      oldCompanyData?.companyContact?.phoneNumber != newCompanyData?.companyContact?.phoneNumber
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('common.emailAddress')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  <Input
                    value={oldCompanyData?.companyContact?.emailAddress}
                    readOnly
                    status={
                      oldCompanyData?.companyContact?.emailAddress != newCompanyData?.companyContact?.emailAddress
                        ? 'error'
                        : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.webSite')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={oldCompanyData?.companyContact?.webSite}
                    readOnly
                    status={
                      oldCompanyData?.companyContact?.webSite != newCompanyData?.companyContact?.webSite ? 'error' : ''
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('requests.serviceType')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  <Tag color={oldCompanyData?.serviceType != newCompanyData?.serviceType ? 'error' : ''}>
                    {oldCompanyData?.serviceType == 1
                      ? t('requests.Internal')
                      : oldCompanyData?.serviceType == 2
                      ? t('requests.External')
                      : oldCompanyData?.serviceType == 3
                      ? t('requests.both')
                      : ''}
                  </Tag>
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('companies.timeOfWorks')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  {oldCompanyData?.timeOfWorks.map((item: any) => {
                    const isTimeInOldCompany = newCompanyData?.timeOfWorks.some(
                      (oldTime: any) =>
                        oldTime.day === item.day &&
                        oldTime.startDate === item.startDate &&
                        oldTime.endDate === item.endDate,
                    );

                    const tagColor = isTimeInOldCompany ? '' : 'success';

                    return (
                      <Tag key={item.id} color={tagColor}>
                        {getDayName(item.day, t)} : {item.startDate} - {item.endDate}
                      </Tag>
                    );
                  })}
                </BaseForm.Item>

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.services')} :
                </h3>
                <Tree
                  className="specialTree"
                  key={100}
                  style={treeStyle}
                  defaultExpandAll
                  defaultExpandParent
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onExpand={onExpand}
                  treeData={oldTreeData as DataNode[]}
                />

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.attachments')} :
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h5>{t('companies.companyOwnerIdentity')}</h5>
                  <Row>
                    {oldCompanyData?.companyOwnerIdentity.map((attachment: any) => (
                      <div key={attachment?.id}>
                        {attachment.url.includes('.pdf') ? (
                          <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                            <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                          </a>
                        ) : (
                          <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                        )}
                      </div>
                    ))}
                  </Row>
                  <h5>{t('companies.companyCommercialRegister')}</h5>
                  <Row>
                    {oldCompanyData?.companyCommercialRegister.map((attachment: any) => (
                      <div key={attachment?.id}>
                        {attachment.url.includes('.pdf') ? (
                          <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                            <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                          </a>
                        ) : (
                          <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                        )}
                      </div>
                    ))}
                  </Row>
                  {oldCompanyData?.additionalAttachment.length > 0 && (
                    <>
                      <h5>{t('companies.additionalAttachment')}</h5>
                      <Row>
                        {oldCompanyData?.additionalAttachment.map((attachment: any) => (
                          <div key={attachment?.id}>
                            {attachment.url.includes('.pdf') ? (
                              <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                                <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                              </a>
                            ) : (
                              <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                            )}
                          </div>
                        ))}
                      </Row>
                    </>
                  )}
                </div>
              </BaseForm>
            </Spinner>
          </Cardd>
        </Col>

        <Col style={{ width: '44%', margin: '3%' }}>
          <Cardd
            title={t('companies.newCompany')}
            padding="0 1.25rem 1rem 1.25rem"
            style={{ width: '100%', height: 'auto', display: 'inline-block' }}
          >
            <Spinner spinning={loading}>
              <BaseForm form={form} name="NewCompanyForm">
                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.companyProfile')} :
                </h3>
                <Row style={{ margin: '2rem auto', justifyContent: 'space-around' }}>
                  <Image
                    key={newCompanyData?.companyProfile?.id}
                    src={newCompanyData?.companyProfile?.url}
                    style={{ width: '150px', height: '140px' }}
                  />
                </Row>
                <BaseForm.Item label={<LableText>{t('common.name_ar')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.translations.find((item: any) => item.language == 'ar').name}
                    readOnly
                    style={
                      oldCompanyData?.translations.find((item: any) => item.language == 'ar').name !=
                      newCompanyData?.translations.find((item: any) => item.language == 'ar').name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.name_en')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.translations.find((item: any) => item.language == 'en').name}
                    readOnly
                    style={
                      oldCompanyData?.translations.find((item: any) => item.language == 'en').name !=
                      newCompanyData?.translations.find((item: any) => item.language == 'en').name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.bio_ar')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.translations.find((item: any) => item.language == 'ar').bio}
                    readOnly
                    style={
                      oldCompanyData?.translations.find((item: any) => item.language == 'ar').bio !=
                      newCompanyData?.translations.find((item: any) => item.language == 'ar').bio
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.bio_en')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.translations.find((item: any) => item.language == 'en').bio}
                    readOnly
                    style={
                      oldCompanyData?.translations.find((item: any) => item.language == 'en').bio !=
                      newCompanyData?.translations.find((item: any) => item.language == 'en').bio
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.address_ar')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.translations.find((item: any) => item.language == 'ar').address}
                    readOnly
                    style={
                      oldCompanyData?.translations.find((item: any) => item.language == 'ar').address !=
                      newCompanyData?.translations.find((item: any) => item.language == 'ar').address
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('common.address_en')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.translations.find((item: any) => item.language == 'en').address}
                    readOnly
                    style={
                      oldCompanyData?.translations.find((item: any) => item.language == 'en').address !=
                      newCompanyData?.translations.find((item: any) => item.language == 'en').address
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.country')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.region?.city?.country?.name}
                    readOnly
                    style={
                      oldCompanyData?.region?.city?.country?.name != newCompanyData?.region?.city?.country?.name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.city')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.region?.city?.name}
                    readOnly
                    style={
                      oldCompanyData?.region?.city?.name != newCompanyData?.region?.city?.name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.region')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.region?.name}
                    readOnly
                    style={
                      oldCompanyData?.region?.name != newCompanyData?.region?.name
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.availableCities')} :
                </h3>
                <BaseForm.Item
                  label={<LableText>{t('companies.availableCities')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  {newCompanyData?.availableCities.map((newCity: any) => {
                    const isCityInOldCompany = oldCompanyData?.availableCities.some(
                      (oldCity: any) => oldCity.id === newCity.id,
                    );

                    const tagColor = isCityInOldCompany ? '' : 'success';

                    return (
                      <Tag key={newCity.id} color={tagColor}>
                        {newCity.name}
                      </Tag>
                    );
                  })}
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('requests.comment')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.comment}
                    readOnly
                    style={
                      oldCompanyData?.comment != newCompanyData?.comment
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.companyInfo')} :
                </h3>
                <BaseForm.Item label={<LableText>{t('common.phoneNumber')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    addonBefore={newCompanyData?.companyContact?.dialCode}
                    value={newCompanyData?.companyContact?.phoneNumber}
                    readOnly
                    style={
                      oldCompanyData?.companyContact?.phoneNumber != newCompanyData?.companyContact?.phoneNumber
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('common.emailAddress')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  <Input
                    value={newCompanyData?.companyContact?.emailAddress}
                    readOnly
                    style={
                      oldCompanyData?.companyContact?.emailAddress != newCompanyData?.companyContact?.emailAddress
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item label={<LableText>{t('companies.webSite')}</LableText>} style={{ marginTop: '-.5rem' }}>
                  <Input
                    value={newCompanyData?.companyContact?.webSite}
                    readOnly
                    style={
                      oldCompanyData?.companyContact?.webSite != newCompanyData?.companyContact?.webSite
                        ? { borderColor: 'var(--ant-success-color)' }
                        : {}
                    }
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('requests.serviceType')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  <Tag color={newCompanyData?.serviceType != oldCompanyData?.serviceType ? 'success' : ''}>
                    {newCompanyData?.serviceType == 1
                      ? t('requests.Internal')
                      : newCompanyData?.serviceType == 2
                      ? t('requests.External')
                      : newCompanyData?.serviceType == 3
                      ? t('requests.both')
                      : ''}
                  </Tag>
                </BaseForm.Item>
                <BaseForm.Item
                  label={<LableText>{t('companies.timeOfWorks')}</LableText>}
                  style={{ marginTop: '-.5rem' }}
                >
                  {newCompanyData?.timeOfWorks.map((item: any) => {
                    const isTimeInOldCompany = oldCompanyData?.timeOfWorks.some(
                      (oldTime: any) =>
                        oldTime.day === item.day &&
                        oldTime.startDate === item.startDate &&
                        oldTime.endDate === item.endDate,
                    );

                    const tagColor = isTimeInOldCompany ? '' : 'success';

                    return (
                      <Tag key={item.id} color={tagColor}>
                        {getDayName(item.day, t)} : {item.startDate} - {item.endDate}
                      </Tag>
                    );
                  })}
                </BaseForm.Item>

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.services')} :
                </h3>
                <Tree
                  className="specialTree"
                  key={100}
                  style={treeStyle}
                  defaultExpandAll
                  defaultExpandParent
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onExpand={onExpand}
                  treeData={newTreeData as DataNode[]}
                />

                <h3 style={{ borderTop: '1px solid', paddingTop: '2rem', margin: '0 2% 1rem' }}>
                  {t('companies.attachments')} :
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h5>{t('companies.companyOwnerIdentity')}</h5>
                  <Row>
                    {newCompanyData?.companyOwnerIdentity.map((attachment: any) => (
                      <div key={attachment?.id}>
                        {attachment.url.includes('.pdf') ? (
                          <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                            <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                          </a>
                        ) : (
                          <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                        )}
                      </div>
                    ))}
                  </Row>
                  <h5>{t('companies.companyCommercialRegister')}</h5>
                  <Row>
                    {newCompanyData?.companyCommercialRegister.map((attachment: any) => (
                      <div key={attachment?.id}>
                        {attachment.url.includes('.pdf') ? (
                          <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                            <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                          </a>
                        ) : (
                          <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                        )}
                      </div>
                    ))}
                  </Row>
                  {newCompanyData?.additionalAttachment.length > 0 && (
                    <>
                      <h5>{t('companies.additionalAttachment')}</h5>
                      <Row>
                        {newCompanyData?.additionalAttachment.map((attachment: any) => (
                          <div key={attachment?.id}>
                            {attachment.url.includes('.pdf') ? (
                              <a href={attachment?.url} target="_blank" rel="noopener noreferrer">
                                <img src="/pdf.jfif" style={{ width: '150px', height: '140px' }} />
                              </a>
                            ) : (
                              <Image src={attachment?.url} style={{ width: '150px', height: '140px' }} />
                            )}
                          </div>
                        ))}
                      </Row>
                    </>
                  )}
                </div>
              </BaseForm>
            </Spinner>
          </Cardd>
        </Col>
      </Row>

      {hasPermissions.changeStatus && (
        <Row style={{ margin: '1rem', justifyContent: 'space-evenly' }}>
          <Button
            type="primary"
            style={{
              marginBottom: '.5rem',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => confirmUpdateCompany.mutateAsync(newCompanyData)}
          >
            <CreateButtonText>{t('common.approve')}</CreateButtonText>
          </Button>

          <Button
            type="default"
            style={{
              marginBottom: '.5rem',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => setVisible(true)}
          >
            <CreateButtonText>{t('common.return')}</CreateButtonText>
          </Button>

          <SendRejectReason
            visible={visible}
            onCancel={() => setVisible(false)}
            onCreate={(info) => {
              rejectCompany.mutateAsync({
                companyId: newCompanyData.id,
                statues: 3,
                reasonRefuse: info.reasonRefuse,
              });
            }}
            isLoading={rejectCompany.isLoading}
            type="returnCompany"
          />
        </Row>
      )}
    </>
  );
};

export default ComparisonCompany;
