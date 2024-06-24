import { createGlobalStyle } from 'styled-components';
import { resetCss } from './resetCss';
import { BREAKPOINTS, FONT_SIZE, FONT_WEIGHT, media } from './themes/constants';
import {
  lightThemeVariables,
  darkThemeVariables,
  commonThemeVariables,
  antOverrideCssVariables,
} from './themes/themeVariables';

const isArabic = localStorage.getItem('Go Movaro-lang') === 'ar';

export default createGlobalStyle`

  ${resetCss}

  [data-theme='light'],
  :root {
    ${lightThemeVariables}
  }

  [data-theme='dark'] {
    ${darkThemeVariables}
  }

  :root {
    ${commonThemeVariables};
    ${antOverrideCssVariables};
  } 

  [data-no-transition] * {
    transition: none !important;
  }
  
  .range-picker {
    & .ant-picker-panels {
      @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px) {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .search-dropdown {
    box-shadow: var(--box-shadow);

    @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px)  {
      width: calc(100vw - 16px);
      max-width: 600px;
    }

    @media only screen and ${media.md} {
      max-width: 323px;
    }
  }

  a {
    color: var(--primary-color);
    &:hover,:active {
      color: var(--ant-primary-color-hover);
    }
  }
  
  .d-none {
    display: none;
  }

  .ant-picker-cell {
    color: var(--text-main-color);
  }

  .ant-picker-cell-in-view .ant-picker-calendar-date-value {
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.bold};
  }

  .ant-picker svg {
    color: var(--text-light-color);
  }

  // notifications start
  .ant-notification-notice {
    width: 36rem;
    padding: 2rem;
    min-height: 6rem;
    
    .ant-notification-notice-with-icon .ant-notification-notice-message {
      margin-bottom: 0;
      margin-left: 2.8125rem;
    }

    .ant-notification-notice-with-icon .ant-notification-notice-description {
      margin-left: 4.375rem;
      margin-top: 0;
    }

    .ant-notification-notice-icon {
      font-size: 2.8125rem;
      margin-left: 0
    }

    .ant-notification-notice-close {
      top: 1.25rem;
      right: 1.25rem;
    }

    .ant-notification-notice-close-x {
      display: flex;
      font-size: 0.9375rem;
    }

    .notification-without-description {
      .ant-notification-notice-close {
        top: 1.875rem;
      }
      .ant-notification-notice-with-icon .ant-notification-notice-description  {
        margin-top: 0.625rem;
      }
    }
    
    .title {
      font-size: ${FONT_SIZE.xxl};
      height: 3rem;
      margin-left: 1.5rem;
      display: flex;
      align-items: center;
      font-weight: ${FONT_WEIGHT.bold};

      &.title-only {
        color: var(--text-main-color);
        font-size: ${FONT_SIZE.md};
        height: 2rem;
        line-height: 2rem;
        margin-left: 0.75rem;
        font-weight: ${FONT_WEIGHT.semibold};
      }
  }
  
    .description {
      color: #404040;
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.semibold};
      line-height: 1.375rem;
    }
  
    &.ant-notification-notice-success {
      border: 1px solid var(--success-color);
      background: var(--notification-success-color);
      
      .title {
        color: var(--success-color);
      }
    }
  
    &.ant-notification-notice-info {
      border: 1px solid var(--primary-color);
      background: var(--notification-primary-color);
  
      .title {
        color: var(--primary-color);
      }
    }
  
    &.ant-notification-notice-warning {
      border: 1px solid var(--warning-color);
      background: var(--notification-warning-color);
  
      .title {
        color: var(--warning-color);
      }
    }
  
    &.ant-notification-notice-error {
      border: 1px solid var(--error-color);
      background: var(--notification-error-color);
  
      .title {
        color: var(--error-color);
      }
    }
  
    .success-icon {
      color: var(--success-color);
    }
  
    .info-icon {
      color: var(--primary-color);
    }
  
    .warning-icon {
      color: var(--warning-color);
    }
  
    .error-icon {
      color: var(--error-color);
    }
  }
  // notifications end

  // steps
  .ant-steps-small.ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item:first-child {
    padding: 0 .12rem 0 .85rem;
    text-align: center;
  }

  .ant-steps-rtl.ant-steps-small.ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item:first-child {
    padding: 0 .85rem 0 .15rem;
    text-align: center;
  }

  .ant-steps-rtl.ant-steps-small.ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item {
    padding-right: .6rem;
    text-align: center;
  }
  // steps end
  
  // menu
  .ant-menu-inline, .ant-menu-vertical {
    border-right: 0;
    border-left: 0;
  }
  
  .ant-menu-rtl {
    border-left: none !important;
  }
  // menu end 

  a:hover, a:visited, a:link, a:active {
    text-decoration: none;
  }

  .prevent-select {
    -webkit-user-select: none; 
    -ms-user-select: none; 
    user-select: none; 
  }

  .ant-tree .ant-tree-treenode {
    align-items: center;
  }

  .ant-image {
    margin: 0.5rem;
  }
  
  .ant-tree-switcher {
    top: 16px;
    width: 30px;
  }

  .ant-tree-switcher .ant-tree-switcher-icon {
    font-size: 14px;
  }

  .react-tel-input .form-control {
    padding: 0 40px;
  }

  .react-tel-input .selected-flag {
    padding: 0 8px 0 8px !important;
  }

  .react-tel-input .selected-flag .arrow {
    right: 20px;
  }

  .ant-card-meta-description {
    display: flex
  }

  .formList {
    color: #ff5252;
  }
  
  .formList .ant-form-item-label {
    position: relative;
    max-width: 100%;
    min-height: 1px;
  }
  
  .formList .ant-form-item-control {
    max-width: 90% !important;
  }

  .formList .dynamic-delete-button{
    position: relative;
    top: -50px;
    float: right;
  }

  .Segmented {
    height: 120px
  }

  .ant-segmented-item  {
    height: fit-content;
  }

  .anticon-dropbox,
  .anticon-gift,
  .anticon-dollar {
    position: relative;
    top: -4px;
  }
  
  .radios {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
  }

  .apexcharts-xaxis-label {
    max-width: 20px;
    white-space: normal;
    word-wrap: break-word;
  }

  .ant-card-head-title {
    padding: 20px 0 !important;
  }
  
  .cebviy .ant-card-body {
    padding: 10px 30px !important;
  }

  .ant-input-number-group-wrapper {
    width: 100%
  }

  .discountPercentage {
    width: 80px !important
  }

  /* DragAndDropBoard.css */

  .groupCard {
    box-shadow: 1px 2px 10px rgba(0,0,0,0.3);
    transition: box-shadow 0.3s ease-in-out; 
  }

  .groupCard:hover {
    box-shadow: 1px 8px 12px rgba(0, 0, 0, 0.5);
  }

  .groupCard .ant-card-extra {
    width: 50%;
  }

  .groupCard .ant-card-extra .ant-row {
    display: flex;
    justify-content: space-evenly;
  }
  
  .groupCard .ant-card-head-title {
    font-size: 25px;
  }
  
  .groupCard .ant-card-body {
    padding: 15px 20px;
  }
  
  .drag-and-drop-board .ant-spin-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 2rem;
  }
  
  .drag-and-drop-board .ant-spin-nested-loading {
    width: 100%; 
  }
  
  .drag-and-drop-board .ant-spin-nested-loading > div {
    width: 100%; 
  }

  .feature-row {
    background-color: #d3fcc2;
  }

  .fullContent{
    width:100% !important
  }

  .deleteImageIcon{
    position: absolute;
    right: 1.1rem;
    background-color: #fff;
    padding: 2px 3px;
  }

  .leaflet-geosearch-bar {
    position: relative;
    display: block;
    height: auto;
    width: 400px;
    max-width: calc(100% - 120px);
    margin: 10px auto 0;
    cursor: auto;
    z-index: 1000;
}

  .leaflet-touch .leaflet-geosearch-bar form input {
    height: 30px;
}

  .leaflet-geosearch-bar form input {
    min-width: 100%;
    width: 100%;
}

  .leaflet-control-geosearch form input {
    min-width: 200px;
    width: 100%;
    outline: none;
    margin: 0;
    padding: 0;
    font-size: 12px;
    height: 30px;
    border: none;
    border-radius: 0 4px 4px 0;
    text-indent: 8px;
  }

   .leaflet-control-geosearch .reset {
    color: #000;
    font-weight: 700;
    position: absolute !important;
    padding: 0 8px;
    right: 2%;
    top: 0;
    cursor: pointer;
    border: none;
    text-decoration: none;
    background-color: #fff;
    border-radius: 0 4px 4px 0;
    line-height: 30px;
    font-size: medium;
  }

  .leaflet-top .leaflet-geosearch-bar {
    display: none;
  }

  .leaflet-control-geosearch .results.active {
    background-color: white;
    border-top: 1px solid;
    padding: 0.8rem;
  }

  .leaflet-control-geosearch .results>* {
    line-height: 24px;
    padding: 0 8px;
    border: 1px solid transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: small;
    cursor: pointer
  }

  .leaflet-control-geosearch .results>*:hover {
    background-color: #ccc;
  }

  .leaflet-marker-pane img {
    width: 70px !important;
    height: 70px !important;
  }

  .ant-card-meta-avatar {
    width: 20%;
  }
`;
