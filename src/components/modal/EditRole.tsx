import React from 'react';
import { Modal, Space } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { EditRoleProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { LableText } from '../GeneralStyles';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { RoleModel } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { GetAllPermissions } from '../../services/role';
import { useQuery } from 'react-query';

export const EditRole: React.FC<EditRoleProps> = ({ visible, onCancel, values, onEdit, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const GetAllPermission = useQuery('getAllPermissions', GetAllPermissions);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: RoleModel) => {
    info = Object.assign({}, info, { displayName: info.name, normalizedName: info.name.toUpperCase() });
    onEdit(info);
  };

  return (
    <Modal
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      open={visible}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('roles.editRoleModalTitle')}
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
      <BaseForm form={form} initialValues={values} layout="vertical" onFinish={onFinish} name="CitiesForm">
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
