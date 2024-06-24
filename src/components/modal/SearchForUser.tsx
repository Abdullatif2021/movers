import React, { useEffect, useState } from 'react';
import { Space, Modal, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '../../components/GeneralStyles';
import { SearchForUserModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { UserModel } from '@app/interfaces/interfaces';
import { useQuery } from 'react-query';
import { getAllUsersForAddRequest } from '@app/services/users';
import { notificationController } from '@app/controllers/notificationController';

export const SearchForUser: React.FC<SearchForUserModalProps> = ({ visible, onCancel, onCreate, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const [userName, setUserName] = useState<string>('0');
  const [userId, setUserId] = useState<number>(0);
  const [dataSource, setDataSource] = useState<UserModel[] | undefined>(undefined);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(true);

  const { data, refetch, isRefetching } = useQuery(
    ['Users'],
    () =>
      getAllUsersForAddRequest(searchString)
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSource(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataSource === undefined,
    },
  );

  const options = dataSource?.map((user: any) => ({
    label: user.userName + ' / ' + user.fullName,
    value: user.userName,
  }));

  const onOk = () => {
    form.submit();
  };

  const onFinish = (info: any) => {
    onCreate(info, userId);
  };

  const onChange = (userName: string) => {
    setUserName(userName);
    const selectedUser = dataSource?.find((user) => user.userName === userName);
    if (selectedUser) {
      setUserId(selectedUser.id);
    }
  };

  const onSearch = (value: string) => {
    setSearchString(value);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    refetch();
  }, [searchString]);

  return (
    <Modal
      style={{ marginTop: '0rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('requests.searchForUserModalTitle')}
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
              <P1>{t('requests.searchForUserModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} onFinish={onFinish} name="SearchForUserForm">
        <BaseForm.Item
          name={'phoneNumber'}
          label={<LableText>{t('requests.userNumber')}</LableText>}
          rules={[{ required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> }]}
          style={{ marginTop: '-.5rem' }}
        >
          <Select
            showSearch
            placeholder={t('requests.searchForUser')}
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={options}
            loading={loading}
          />
        </BaseForm.Item>

        <BaseForm.Item
          name={'pin'}
          label={<LableText>{t('requests.PIN')}</LableText>}
          rules={[
            { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
            {
              pattern: /^[0-9]+$/,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.onlyNumbers')}</p>,
            },
            {
              max: 6,
              message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('requests.only6Number')}</p>,
            },
          ]}
          style={{ marginTop: '-.5rem' }}
        >
          <Input disabled={userName == '0'} />
        </BaseForm.Item>
      </BaseForm>
    </Modal>
  );
};
