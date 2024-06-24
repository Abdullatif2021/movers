import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { Typography } from 'antd';
import { InputNumber as In } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Modal as M } from '@app/components/common/Modal/Modal';
import { Table as T } from '@app/components/common/Table/Table';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Input as Inp, TextArea as TA } from '@app/components/common/inputs/Input/Input';

export const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const InputNumber = styled(In)`
  font-size: ${FONT_SIZE.xs};
  display: block;
  width: 100%;
  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.sm};
  }
  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xm};
  }
`;

export const TextBack = styled.div`
  font-size: 1rem;
  font-weight: 400;
`;

export const Text = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.xs};
  height: 0;
  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.md};
  }

  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xm};
  }
`;

export const labelStyle = {
  marginBottom: '1rem',
  color: 'var(--primary-color)',
  display: 'flex',
  justifyContent: 'space-between',
};

export const LableText = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.sm};
  height: 0;
  color: inherit;
  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.md};
  }
  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xm};
  }
`;

export const Modal = styled(M)`
  & .ant-modal-content,
  .ant-modal-body {
    box-shadow: none;
    border: none;
    display: flex;
    justify-content: center;
  }
`;

export const Image = styled.img`
  width: auto;
  height: 35px;
  cursor: pointer;
  object-fit: contain;
  &:hover {
    transform: scale(0.9);
  }
`;

export const CreateButtonText = styled.p`
  font-size: ${FONT_SIZE.sm};
  font-weight: ${FONT_WEIGHT.regular};
  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.md};
  }
  @media only screen and ${media.xl} {
    font-size: ${FONT_SIZE.xm};
    font-weight: ${FONT_WEIGHT.medium};
  }
`;

export const Header = styled(Typography.Paragraph)`
  &.ant-typography {
    font-weight: ${FONT_WEIGHT.medium};
    font-size: 0.894rem;
    margin-bottom: 0;
    color: inherit;
    @media only screen and ${media.md} {
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.medium};
    }
    @media only screen and ${media.xl} {
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.medium};
    }
  }
`;

export const Table = styled(T)`
  .ant-table-tbody > tr > td {
    height: 4.7rem;
  }
`;

export const TableButton = styled(Button)`
  height: 2.4rem;
  width: 2.4rem;
`;

export const treeStyle = {
  width: '100%',
  marginTop: '1rem',
  padding: '0.5rem',
  borderRadius: '0.25rem',
  border: '1px solid #d9d9d9',
  backgroundColor: '#fff',
};

export const DetailsRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const DetailsTitle = styled.div`
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  margin-right: 0.5rem;
  width: 35%;
`;

export const DetailsValue = styled.div`
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
  overflow-wrap: anywhere;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 1.25rem 0.5rem;
`;

export const Input = styled(Inp)`
  font-size: 1rem;
  display: block;
  width: 100%;
  @media only screen and ${media.md} {
    font-size: 1.09rem;
  }
  @media only screen and ${media.xl} {
    font-size: 1.12rem;
  }
`;

export const TextArea = styled(TA)`
  font-size: 1rem;
  display: block;
  width: 100%;
  @media only screen and ${media.md} {
    font-size: 1.09rem;
  }
  @media only screen and ${media.xl} {
    font-size: 1.12rem;
  }
`;
