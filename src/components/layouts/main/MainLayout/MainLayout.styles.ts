import styled, { css } from 'styled-components';
import { Layout } from 'antd';
import { media } from '@app/styles/themes/constants';

interface LayoutMainI {
  $isStudent: boolean;
}

export const LayoutMaster = styled(Layout)`
  height: 100vh;
`;

export const LayoutMain = styled(Layout)<LayoutMainI>`
  @media only screen and ${media.md} {
    ${({ $isStudent }) =>
      css`
        margin-left: ${$isStudent ? 'unset' : '80px'};
      `};
  }

  @media only screen and ${media.xl} {
    margin-left: unset;
  }
`;
