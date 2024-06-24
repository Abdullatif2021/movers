import React, { useState } from 'react';
import { Space, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { TextArea } from '../../components/GeneralStyles';
import { SendRejectReasons } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const SendRejectReason: React.FC<SendRejectReasons> = ({ visible, onCancel, onCreate, isLoading, type }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: any) => {
    onCreate(info);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {type == 'rejectRequest'
            ? t('requests.sendRejectRequestReason')
            : type == 'returnRequest'
            ? t('requests.sendReturnRequestReason')
            : type == 'returnOffer'
            ? t('requests.sendReturnOfferReason')
            : type == 'returnCompany'
            ? t('requests.sendReturnCompanyReason')
            : type == 'returnBranch'
            ? t('branch.sendReturnBranchReason')
            : type == 'rejectCompany'
            ? t('companies.sendRejectCompanyReason')
            : type == 'rejectBranch'
            ? t('branch.sendRejectBranchReason')
            : ''}
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
              <P1>
                {type == 'rejectRequest'
                  ? t('requests.sendRejectRequestReason')
                  : type == 'returnRequest'
                  ? t('requests.sendReturnRequestReason')
                  : type == 'returnOffer'
                  ? t('requests.sendReturnOfferReason')
                  : type == 'returnCompany'
                  ? t('requests.sendReturnCompanyReason')
                  : type == 'returnBranch'
                  ? t('branch.sendReturnBranchReason')
                  : type == 'rejectCompany'
                  ? t('companies.sendRejectCompanyReason')
                  : type == 'rejectBranch'
                  ? t('branch.sendRejectBranchReason')
                  : ''}
              </P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="SearchForUserForm">
        <BaseForm.Item
          name="reasonRefuse"
          label={
            <LableText>
              {type == 'rejectRequest'
                ? t(`requests.reasonRefuseRequest`)
                : type == 'returnRequest'
                ? t('requests.reasonReturnRequest')
                : type == 'returnOffer'
                ? t('requests.reasonReturnOffer')
                : type == 'returnCompany'
                ? t('requests.reasonReturnCompany')
                : type == 'returnBranch'
                ? t('branch.reasonReturnBranch')
                : type == 'rejectCompany'
                ? t('companies.reasonRejectCompany')
                : type == 'rejectBranch'
                ? t('branch.reasonRejectBranch')
                : ''}
            </LableText>
          }
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <TextArea style={{ textAlign: 'left', direction: 'ltr' }} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
