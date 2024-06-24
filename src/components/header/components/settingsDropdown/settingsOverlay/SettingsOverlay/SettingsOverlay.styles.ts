import styled from 'styled-components';
import { DropdownMenu } from '@app/components/header/Header.styles';
import { Radio } from 'antd';
import { media } from '@app/styles/themes/constants';

export const SettingsOverlayMenu = styled(DropdownMenu)`
  width: 9rem;
  @media only screen and ${media.xs || media.md} {
    width: 10rem;
  }
  @media only screen and ${media.lg || media.xl} {
    width: 12.5rem;
  }
  &.ant-dropdown-menu {
    box-shadow: var(--box-shadow);
  }
`;

export const RadioBtn = styled(Radio)`
  font-size: 0.875rem;
`;
