import { InputNumber as AntInputNumber } from 'antd';
import styled from 'styled-components';

interface InputNumberProps {
  $block?: boolean;
}

export const InputNumber = styled(AntInputNumber).withConfig({
  shouldForwardProp: (prop) => !['block'].includes(prop),
})<InputNumberProps>`
  ${(props) => props.$block && 'display: block; width: 100%'};

  .ant-input-number-rtl,
  .ant-input-number-handler-wrap {
    border-radius: 50px;
  }
`;
