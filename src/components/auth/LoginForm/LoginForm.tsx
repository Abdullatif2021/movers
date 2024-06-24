import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { doLogin } from '@app/store/slices/authSlice';
import { LoginRequest } from '@app/services/auth';
import { Link } from 'react-router-dom';
import CustomPasswordInput from '@app/components/common/inputs/InputPassword/CustomPasswordInput';

const initValues: LoginRequest = {
  userNameOrEmailAddress: '',
  password: '',
  rememberClient: false,
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: LoginRequest) => {
    setLoading(true);

    dispatch(doLogin(values))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        notificationController.error({
          message: t('common.error'),
          description: error.message || error.error?.message,
        });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.FormTitle>{t('auth.logIn')}</Auth.FormTitle>
        <S.LoginDescription>
          <Trans i18nKey={'auth.loginInfo'} />
        </S.LoginDescription>

        <Auth.FormItem
          name="userNameOrEmailAddress"
          label={t('auth.userName')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('auth.userNameorEmail')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('auth.password')}
          name="password"
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <CustomPasswordInput placeholder={t('auth.password')} />
        </Auth.FormItem>

        <Auth.ActionsWrapper>
          <BaseForm.Item name="rememberClient" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <S.RememberMeText>{t('auth.rememberMe')}</S.RememberMeText>
            </Auth.FormCheckbox>
          </BaseForm.Item>
        </Auth.ActionsWrapper>

        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('auth.logIn')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
