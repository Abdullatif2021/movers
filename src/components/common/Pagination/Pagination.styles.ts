import styled from 'styled-components';
import { Pagination as AntdPagination } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const Pagination = styled(AntdPagination)`
  .ant-pagination-item-container .ant-pagination-item-ellipsis {
    color: var(--disabled-color);
  }

  .ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }

  &.ant-pagination.ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }
  & .ant-select-arrow {
    color: var(--disabled-color);
  }

  .ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    color: var(--disabled-color);
  }

  .ant-pagination-item-link {
    width: 2.4rem;
    height: 2.4rem;
  }

  .ant-pagination-item {
    width: 2.4rem;
    height: 2.4rem;
    min-width: 0;
    line-height: 35px;
    margin-top: -1.05rem;
    a {
      font-size: 12.6px;
    }
  }

  .ant-pagination-item-link > .anticon,
  .anticon-left > svg {
    margin-bottom: 20px;
  }

  .ant-pagination-item-link > .anticon,
  .anticon-right > svg {
    margin-bottom: 20px;
  }

  .ant-pagination-jump-prev,
  .ant-pagination-prev {
    min-width: 0px;
  }

  .ant-pagination-jump-next,
  .ant-pagination-next {
    min-width: 0px;
  }

  .ant-pagination-options {
    margin-top: -1.05rem;
    .ant-pagination-options-size-changer {
      .ant-select-selector {
        height: 2.4rem;
        .ant-select-selection-item {
          line-height: 2.4rem;
          font-size: 13.6px;
        }
      }
    }
  }
`;
