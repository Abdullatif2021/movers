import React from 'react';
import { Col, Row } from 'antd';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { LogoutOutlined } from '@ant-design/icons';

export const ProfileDropdown: React.FC = () => {
  const { isTablet, isMobile, isDesktop, mobileOnly } = useResponsive();

  return (
    <>
      <Dropdown overlay={<ProfileOverlay />} trigger={['click']}>
        <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
          <Col>
            <LogoutOutlined style={{ fontSize: '1.625rem' }} size={mobileOnly ? 32 : 35} />
          </Col>
        </S.ProfileDropdownHeader>
      </Dropdown>
    </>
  );
};
