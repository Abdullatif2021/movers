import React from 'react';
import { Radio, Space } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { RadioBtn } from '../SettingsOverlay/SettingsOverlay.styles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useTranslation } from 'react-i18next';

export const LanguagePicker: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div style={{ margin: '-1rem 0 -.65rem 0' }}>
      <Radio.Group
        defaultValue={language}
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
      >
        <Space direction="vertical">
          <RadioBtn value="en">
            <Space align="center">
              {t('header.english')}
              <ReactCountryFlag svg countryCode="GB" />
            </Space>
          </RadioBtn>
          <RadioBtn value="ar">
            <Space align="center">
              {t('header.arabic')}
              <ReactCountryFlag svg countryCode="SY" />
            </Space>
          </RadioBtn>
        </Space>
      </Radio.Group>
    </div>
  );
};
