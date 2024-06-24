import styled from 'styled-components';
import { Typography } from 'antd';
import { media } from '@app/styles/themes/constants';

export const Text = styled(Typography.Paragraph)`
  &.ant-typography {
    margin-bottom: 0;
    color: inherit;
    font-weight: 405;
  }

  @media only screen and ${media.xl} {
    font-size: 1.05rem;
  }
  @media only screen and ${media.md} {
    font-size: 0.9rem;
  }
  @media only screen and ${media.sm} {
    font-size: 0.75rem;
  }
`;
