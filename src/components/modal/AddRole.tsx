import React from 'react';
import { Space, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { CreateRoleModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { RoleModel } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { GetAllPermissions } from '../../services/role';
import { useQuery } from 'react-query';

export const AddRole: React.FC<CreateRoleModalProps> = ({ visible, onCancel, onCreate, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const GetAllPermission = useQuery('getAllPermissions', GetAllPermissions);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: RoleModel) => {
    info = Object.assign({}, info, { displayName: info.name, normalizedName: info.name.toUpperCase() });
    onCreate(info);
  };

  return (
    <Modal
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('roles.addRoleModalTitle')}
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
              <P1>{t('roles.addRoleModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="managerForm">
        <BaseForm.Item
          name="name"
          label={<LableText>{t('roles.Name')}</LableText>}
          style={{ marginTop: '-1rem' }}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="grantedPermissions"
          label={<LableText>{t('roles.GrantedPermissions')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0 -.5rem 0' }}
        >
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) => option!.children?.toLowerCase().includes(input?.toLowerCase())}
            filterSort={(optionA: any, optionB: any) =>
              optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
            }
          >
            {GetAllPermission?.data?.data?.result?.items?.map((ele: any) => {
              return (
                <Option value={ele.name} key={ele?.id}>
                  {ele.displayName}
                </Option>
              );
            })}
          </Select>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
