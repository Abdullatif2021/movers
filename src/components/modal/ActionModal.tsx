import React from 'react';
import { Modal, Space } from 'antd';
import { ActionModalProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { Button } from '../common/buttons/Button/Button';
import { modalSizes } from '@app/constants/modalSizes';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
export const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  onCancel,
  title,
  okText,
  onOK,
  cancelText,
  description,
  okButtonType,
  isDanger,
  isLoading,
  element,
  isHiddenOkButton,
  isHiddenCancelButton,
  ModalSize,
  onHideFooter,
  ...props
}) => {
  const { isDesktop, isTablet } = useResponsive();

  const modalSize = Object.entries(modalSizes).find((sz) => sz[0] === ModalSize)?.[1];
  const ModalFontSizeTitle = isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.xm;
  const ModalFontSizeDescription = isDesktop || isTablet ? FONT_SIZE.lg : FONT_SIZE.md;

  return (
    <Modal
      open={visible}
      title={<div style={{ fontSize: ModalFontSizeTitle }}>{title}</div>}
      onCancel={onCancel}
      maskClosable={true}
      width={modalSize}
      {...props}
      footer={
        !onHideFooter ? (
          <Space style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
            {isHiddenCancelButton ? null : (
              <Button key="cancel" type="ghost" onClick={onCancel} style={{ height: 'auto' }}>
                <P1>{cancelText}</P1>
              </Button>
            )}
            {!isHiddenOkButton ? (
              <Button
                loading={isLoading}
                danger={isDanger ? true : false}
                type={okButtonType}
                onClick={onOK}
                style={{ height: 'auto' }}
              >
                <P1>{okText}</P1>
              </Button>
            ) : null}
          </Space>
        ) : null
      }
    >
      <p style={{ fontSize: ModalFontSizeDescription }}>{description}</p>
      <>{element}</>
    </Modal>
  );
};
