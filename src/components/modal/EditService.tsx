import React, { useEffect, useState } from 'react';
import { Modal, Radio, Space, message } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditServiceProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { ServiceModel, LanguageType } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { UploadDragger } from '@app/components/common/Upload/Upload';
import { useMutation } from 'react-query';
import { uploadAttachment } from '@app/services/Attachment';
import { Alert } from '../common/Alert/Alert';
import { LoadingOutlined } from '@ant-design/icons';
import { AR } from '@app/constants/appConstants';
import { INDEX_ONE, INDEX_TWO } from '@app/constants/indexes';

export const EditService: React.FC<EditServiceProps> = ({
  visible,
  onCancel,
  values,
  onEdit,
  isLoading,
  AttachmentId,
}) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [attachmentId, setAttachmentId] = useState<number>(AttachmentId);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  useEffect(() => {
    if (values) {
      const firstElement = values?.translations[0];
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
  }, [values]);

  const uploadImage = useMutation((data: FormData) =>
    uploadAttachment(data)
      .then((data) => {
        data.data.success && (setAttachmentId(data.data.result?.id), setUrlAfterUpload(data.data.result?.url));
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: ServiceModel) => {
    const my_data = {
      attachmentId,
      translations: info.translations?.map((_, i) => ({
        ...info.translations[i],
        language: i === 1 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
      id: 0,
    };
    info = Object.assign({}, info, my_data);
    onEdit(info);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('services.editServiceModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="ServivesForm">
        <BaseForm.Item
          name={['translations', lang.en, 'name']}
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
          name={['translations', lang.ar, 'name']}
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
          name="isForStorage"
          label={<LableText>{t(`services.isForStorage`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group style={{ display: 'flex', width: '100%' }}>
            <Radio value={true} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('services.isForStorage')}
            </Radio>
            <Radio value={false} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('services.isNotForStorage')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>
        <BaseForm.Item
          name="isForTruck"
          label={<LableText>{t(`services.isForTruck`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group style={{ display: 'flex', width: '100%' }}>
            <Radio value={true} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('services.isForTruck')}
            </Radio>
            <Radio value={false} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('services.isNotForTruck')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>
        <BaseForm.Item
          rules={[{ required: true, message: t('common.requiredImage') }]}
          name="attachment"
          label={<LableText>{t('common.attachment')}</LableText>}
          style={{ marginTop: '-1rem' }}
        >
          <UploadDragger
            maxCount={1}
            showUploadList={false}
            disabled={uploadImage.isLoading ? true : false}
            listType="text"
            accept=".jpeg,.png,.jpg"
            customRequest={({ file }) => {
              const formData = new FormData();
              formData.append('RefType', '7');
              formData.append('File', file);
              uploadImage.mutateAsync(formData);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
              {uploadImage.isLoading ? (
                <LoadingOutlined
                  style={{
                    color: 'var(--primary-color)',
                    fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                  }}
                />
              ) : (
                <img
                  style={{ width: 'auto', height: isDesktop || isTablet ? '42px' : '35px', objectFit: 'contain' }}
                  src={
                    urlAfterUpload !== ''
                      ? urlAfterUpload
                      : values !== undefined
                      ? values.attachment !== undefined
                        ? values.attachment.url
                        : ''
                      : ''
                  }
                />
              )}
              <p
                style={{
                  fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                  color: 'var(--text-main-color)',
                }}
              >
                {uploadImage.isLoading ? t('common.uploading') : t('common.draggerUploadDescription')}
              </p>
            </div>
          </UploadDragger>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
