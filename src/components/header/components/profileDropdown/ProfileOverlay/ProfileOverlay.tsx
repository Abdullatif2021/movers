import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as S from './ProfileOverlay.styles';
import { DropdownMenu } from '@app/components/header/Header.styles';
import { useSelector } from 'react-redux';

export const ProfileOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();
  const userInfo: any = useSelector((state) => state);

  return (
    <DropdownMenu selectable={false} {...props} style={{ textAlign: 'center', borderRadius: '20px' }}>
      <S.MenuItem
        style={{
          backgroundColor: 'var(--primary-color)',
          cursor: 'default',
          color: 'white',
          borderTopLeftRadius: '20px',
        }}
        key={0}
      >
        {userInfo.user.userInfo.name}
      </S.MenuItem>
      <S.ItemsDivider />
      <S.MenuItem key={1}>
        <S.Text>
          <Link to="/logout">{t('header.logout')}</Link>
        </S.Text>
      </S.MenuItem>
    </DropdownMenu>
  );
};
