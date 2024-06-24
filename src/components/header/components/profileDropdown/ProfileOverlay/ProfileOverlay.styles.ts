import styled from 'styled-components';
import { Typography, Divider } from 'antd';
import { MenuItem as MenuItemBase } from '@app/components/common/Menu/Menu';
import { media } from '@app/styles/themes/constants';

export const Text = styled(Typography.Text)`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--main-text-color);

  @media only screen and ${media.md} {
    font-size: 1rem;
  }
`;

export const MenuItem = styled(MenuItemBase)`
  height: 50px;
  :hover {
    color: var(--secondary-color);
  }
`;

export const ItemsDivider = styled(Divider).withConfig({
  shouldForwardProp: (prop) => !['eventKey', 'warnKey'].includes(prop),
})`
  margin: 0;
`;
