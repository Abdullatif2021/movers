import React, { useState } from 'react';
import { Modal, Space, message } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { SourceTypeModel, LanguageType } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { UploadDragger } from '@app/components/common/Upload/Upload';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadAttachment } from '@app/services/Attachment';
import { useMutation } from 'react-query';
import { Alert } from '../common/Alert/Alert';

export const EditTool: React.FC<EditProps> = ({ visible, onCancel, values, onEdit, isLoading, iconId }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [attachmentId, setAttachmentId] = useState<number>(iconId);
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

  const onFinish = (info: SourceTypeModel) => {
    const my_data = {
      attachmentId,
      translations: info.translations?.map((_, i) => ({
        ...info.translations[i],
        language: i === 1 ? ('en' as LanguageType) : ('ar' as LanguageType),
      })),
    };
    info = Object.assign({}, info, my_data);
    onEdit(info);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('tools.editToolModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="SurceTypesForm">
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
        <BaseForm.Item name="image" label={<LableText>{t('common.image')}</LableText>} style={{ marginTop: '-1rem' }}>
          <UploadDragger
            maxCount={1}
            showUploadList={false}
            disabled={uploadImage.isLoading ? true : false}
            listType="text"
            accept=".jpeg,.png,.jpg"
            customRequest={({ file }) => {
              const formData = new FormData();
              formData.append('RefType', '13');
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
                  // height={42}
                  // width={45}
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
        {/* <BaseForm.Item
          name={'attachment'}
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
              formData.append('RefType', '5');
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
                // <InboxOutlined>
                <img
                  src={values?.attachment?.url}
                  style={{
                    color: 'var(--primary-color)',
                    fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                  }}
                />
                // </InboxOutlined>
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
        </BaseForm.Item> */}
      </BaseForm>
    </Modal>
  );
};
