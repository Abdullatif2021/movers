import styled from 'styled-components';
import { Table as AntdTable } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BORDER_RADIUS } from '@app/styles/themes/constants';

export const Table = styled(AntdTable)`
  & thead .ant-table-cell {
    color: var(--primary-color);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;

    & .anticon {
      color: var(--primary-color);
    }
  }

  & tbody .ant-table-cell {
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;
  }

  & tbody .ant-table-row-expand-icon {
    min-height: 1.25rem;
    min-width: 1.25rem;
    border-radius: 0.1875rem;
    margin-top: 0;
  }

  &
    .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    background-color: var(--primary-color);
    width: 0.5px;
  }

  // .ant-table-wrapper-rtl
  //   .ant-table-thead
  //   > tr
  //   > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
  //   width: 1px !important;
  // }

  & .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next,
  .ant-pagination-item {
    min-width: 2.0625rem;
    height: 2.0625rem;
    & .anticon {
      vertical-align: 0.1rem;
    }

    line-height: 2.0625rem;
    border-radius: ${BORDER_RADIUS};
    font-size: ${FONT_SIZE.xs};
  }

  & .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    border-radius: ${BORDER_RADIUS};
  }

  & .ant-checkbox-inner {
    border-radius: 0.1875rem;
    height: 1.25rem;
    width: 1.25rem;
    border: 1px solid var(--primary-color);
  }

  & .editable-row .ant-form-item-explain {
    position: absolute;
    top: 100%;
    font-size: 0.75rem;
  }

  .ant-table-column-sort {
    background-color: transparent;
  }

  .ant-pagination-item-container .ant-pagination-item-ellipsis {
    color: var(--disabled-color);
  }

  .ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }

  .ant-pagination.ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }

  .ant-pagination-options {
    font-size: ${FONT_SIZE.xs};
    .ant-pagination-options-quick-jumper {
      height: 0;
      line-height: 0;
    }
    .ant-pagination-options-size-changer {
      min-width: 2.0625rem;
      font-size: ${FONT_SIZE.xs};
      .ant-select-selector {
        height: 2.0625rem;
        .ant-select-selection-item {
          line-height: 2.0625rem;
        }
      }
    }
    & input {
      font-size: ${FONT_SIZE.xs};
      // font-weight:${FONT_WEIGHT.bold}
      min-width: 2.0625rem;
      height: 2.0625rem;
    }
  }

  .ant-pagination-total-text {
    font-size: ${FONT_SIZE.xs};
    height: 0;
    line-height: 2.0625rem;
    margin-right: 1.5rem;
  }
`;
