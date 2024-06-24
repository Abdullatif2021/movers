import React from 'react';
import * as S from './References.styles';
import { CopyrightOutlined } from '@ant-design/icons';
import { useAppSelector } from '@app/hooks/reduxHooks';
import i18next from 'i18next';
import { BASE_COLORS } from '@app/styles/themes/constants';

export const References: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const color = { color: theme === 'dark' ? BASE_COLORS.lightgrey : '' };

  return (
    <S.ReferencesWrapper>
      <S.Text style={color}></S.Text>
      <S.Icons style={color}>
        <CopyrightOutlined />
        <S.Text style={color}>{i18next.t('footer')}</S.Text>
      </S.Icons>
    </S.ReferencesWrapper>
  );
};
