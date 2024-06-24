import React, { useState } from 'react';
import { Space, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { CreateUserModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { InputPassword } from '../common/inputs/InputPassword/InputPassword.styles';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { UserModel } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { Text } from '../GeneralStyles';
import { useQuery } from 'react-query';
import { getRoles } from '@app/services/role';

export const AddManager: React.FC<CreateUserModalProps> = ({ visible, onCancel, onCreateManager, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [managerType, setManagerType] = useState<number>();
  const [roleName, setRoleName] = useState<string>('');

  const getAllRoles = useQuery('getAllRoles', getRoles);

  const onOk = () => {
    form.submit();
  };

  const onFinish = (managerInfo: UserModel) => {
    managerInfo = Object.assign({}, managerInfo, { isActive: true, type: managerType, roleNames: [roleName] });
    onCreateManager(managerInfo);
  };

  return (
    <Modal
      style={{ marginTop: '-6rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('managers.addManagerModalTitle')}
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
              <P1>{t('managers.addManagerModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="managerForm">
        <BaseForm.Item
          name="userName"
          label={<LableText>{t('common.userName')}</LableText>}
          style={{ marginTop: '-1rem' }}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="name"
          label={<LableText>{t('common.firstName')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="surname"
          label={<LableText>{t('common.lastName')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="emailAddress"
          label={<LableText>{t('common.emailAddress')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input />
        </BaseForm.Item>
        <BaseForm.Item
          name="password"
          label={<LableText>{t('auth.password')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '-.5rem 0 -.5rem 0' }}
        >
          <InputPassword />
        </BaseForm.Item>
        <BaseForm.Item
          label={<LableText>{t('roles.roleName')}</LableText>}
          style={{ margin: '1rem 0 -0.5rem 0px' }}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
        >
          <Select onChange={(e: any) => setRoleName(e)}>
            {getAllRoles?.data?.data?.result?.items.map((role: any) => (
              <Option key={role.id} value={role.name}>
                {role?.name}
              </Option>
            ))}
          </Select>
        </BaseForm.Item>
        <BaseForm.Item
          name="type"
          label={<LableText>{t('managers.type')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ margin: '1rem 0px 0' }}
        >
          <Select
            onChange={(type: any) => {
              setManagerType(type);
            }}
          >
            <Option value={1}>
              <Text>{t('managers.admin')}</Text>
            </Option>
            <Option value={4}>
              <Text>{t('managers.employee')}</Text>
            </Option>
          </Select>
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
