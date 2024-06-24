import React, { useState } from 'react';
import { Space, Modal, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { ChangeAcceptRequestOrPotentialClientProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const ChangeAcceptRequestOrPotentialClient: React.FC<ChangeAcceptRequestOrPotentialClientProps> = ({
  visible,
  onCancel,
  onEdit,
  isLoading,
  values,
  title,
}) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [valueRadioAcceptRequests, setValueRadioAcceptRequests] = useState(values.acceptRequests);
  const [valueRadioAcceptPossibleRequests, setValueRadioAcceptPossibleRequests] = useState(
    values.acceptPossibleRequests,
  );

  const onOk = () => {
    form.submit();
  };

  const onFinish = (value: any) => {
    value = Object.assign({}, value, {
      acceptRequests: valueRadioAcceptRequests,
      acceptPossibleRequests: valueRadioAcceptPossibleRequests,
    });
    onEdit(value);
  };

  return (
    <Modal
      style={{ marginTop: '1rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {title == 'company'
            ? t('companies.ChangeAcceptRequestOrPotentialClient')
            : t('branch.ChangeAcceptRequestOrPotentialClient')}
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
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm
        form={form}
        onFinish={onFinish}
        initialValues={values}
        name="ChangeAcceptRequestOrPossibleRequestForCompanyForm"
      >
        <BaseForm.Item
          name={['acceptRequests']}
          label={<LableText>{t(`companies.acceptRequests`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group
            style={{ display: 'flex', width: '100%' }}
            onChange={(event) => {
              setValueRadioAcceptRequests(event.target.value);
            }}
          >
            <Radio value={true} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('common.true')}
            </Radio>
            <Radio value={false} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('common.false')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>

        <BaseForm.Item
          name={['acceptPossibleRequests']}
          label={<LableText>{t(`companies.acceptPossibleRequests`)}</LableText>}
          rules={[
            {
              required: true,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Radio.Group
            style={{ display: 'flex', width: '100%' }}
            onChange={(event) => {
              setValueRadioAcceptPossibleRequests(event.target.value);
            }}
          >
            <Radio value={true} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('common.true')}
            </Radio>
            <Radio value={false} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
              {t('common.false')}
            </Radio>
          </Radio.Group>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
