import styled from 'styled-components';
import { Typography } from 'antd';
import { FONT_SIZE, media } from '@app/styles/themes/constants';

export const Text = styled(Typography.Paragraph)`
  &.ant-typography {
    font-weight: 450;
    font-size: ${FONT_SIZE.sm};
    margin-bottom: 0;
    margin-top: 0;
    color: inherit;

    @media only screen and ${media.md} {
      font-size: ${FONT_SIZE.md};
    }
    @media only screen and ${media.xl} {
      font-size: 1.0125rem;
      margin: 0;
    }
  }
`;
