import React, { useState } from 'react';
import { Space, Modal, message, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { CreateServiceModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { ServiceModel } from '@app/interfaces/interfaces';
import { LanguageType } from '@app/interfaces/interfaces';
import { UploadDragger } from '@app/components/common/Upload/Upload';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMutation } from 'react-query';
import { Alert } from '../common/Alert/Alert';
import { uploadAttachment } from '@app/services/Attachment';

export const AddService: React.FC<CreateServiceModalProps> = ({ visible, onCancel, onCreateService, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');

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
    };
    info = Object.assign({}, info, my_data);
    onCreateService(info);
  };

  return (
    <Modal
      style={{ marginTop: '-4rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('services.addServiceModalTitle')}
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
              <P1>{t('services.addServiceModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="ServicesForm">
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
          name={'image'}
          style={{ marginTop: '-1rem' }}
          label={<LableText>{t(`common.uploadImage`)}</LableText>}
          rules={[{ message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredImage')}</p>, required: true }]}
        >
          <UploadDragger
            maxCount={1}
            listType="text"
            accept=".jpeg,.png,.jpg"
            disabled={uploadImage.isLoading ? true : false}
            showUploadList={false}
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
              ) : urlAfterUpload ? (
                <img src={urlAfterUpload} style={{ width: 'auto', height: isDesktop || isTablet ? '42px' : '35px' }} />
              ) : (
                <InboxOutlined
                  style={{
                    color: 'var(--primary-color)',
                    fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                  }}
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
