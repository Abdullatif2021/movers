import React, { useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditOfferProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { offerModel } from '@app/interfaces/interfaces';
import { LableText } from '../GeneralStyles';
import { notificationController } from '@app/controllers/notificationController';
import { useQuery } from 'react-query';
import { getOfferById } from '@app/services/offers';

interface Service {
  id: number;
  subServices: SubService[];
}

interface SubService {
  id: number;
  tools: Tool[];
}

interface Tool {
  id: number;
  amount: number;
}

interface TransformedData {
  serviceValueForOffers: Array<{
    serviceId: number;
    subServiceId: number;
    toolId: number;
    amount: number;
  }>;
}

export const EditOffer: React.FC<EditOfferProps> = ({ visible, onCancel, values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [dataSource, setDataSource] = useState<any>(undefined);
  const [lang, setLang] = useState<any>({
    en: undefined,
    ar: undefined,
  });

  const {
    data: dataRequest,
    status,
    refetch: refetchRequest,
    isRefetching: isRefetchingRequest,
  } = useQuery(['GetRequestById'], () =>
    getOfferById(values?.id)
      .then((data) => {
        const result = data.data?.result;
        setDataSource(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  const dataSourceServiceValueForOffers = dataSource?.serviceValueForOffers || [];
  const originalData: { serviceValueForOffers: Service[] } = {
    serviceValueForOffers: dataSourceServiceValueForOffers,
  };
  const transformedData: TransformedData = {
    serviceValueForOffers: [],
  };

  originalData.serviceValueForOffers.forEach((service) => {
    const serviceId = service.id;
    service.subServices.forEach((subService) => {
      const subServiceId = subService.id;
      subService.tools.forEach((tool) => {
        const toolId = tool.id;
        const amount = tool.amount;
        transformedData.serviceValueForOffers.push({
          serviceId,
          subServiceId,
          toolId,
          amount,
        });
      });
    });
  });

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: offerModel) => {
    const my_data: offerModel = {
      note: info.note,
      isExtendStorage: dataSource.isExtendStorage,
      priceForOnDayStorage: dataSource.priceForOnDayStorage,
      serviceValueForOffers: transformedData.serviceValueForOffers,
    };
    onEdit(my_data);
  };

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('offers.editOfferModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="editOfferForm">
        <BaseForm.Item
          name={['note']}
          label={<LableText>{t('requests.comment')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
