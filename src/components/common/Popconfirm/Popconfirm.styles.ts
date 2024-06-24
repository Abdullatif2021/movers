import styled, { css } from 'styled-components';
import { Popconfirm as AntPopconfirm } from 'antd';

export const Popconfirm = styled(AntPopconfirm)`
  ${(props) =>
    css`
      ${props.okType === 'primary' &&
      css`
        background: var(--primary-gradient-color);
        &:hover {
          background: var(--secondary-color);
          border-color: var(--secondary-color);
        }
      `}
    `}
`;
