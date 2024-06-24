import React from 'react';
import { BORDER_RADIUS, FONT_SIZE } from '@app/styles/themes/constants';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Typography } from 'antd';
import { useAppSelector } from '@app/hooks/reduxHooks';
type NotificationProps = {
  id?: any;
  message?: string;
  dateTime?: string;
  state?: 0 | 1;
};

const NotificationText = styled(Typography.Text)`
  font-size: ${FONT_SIZE.xs};
`;
const Notificationdate = styled(Typography.Text)`
  font-size: 0.65rem;
`;

export const Notification: React.FC<NotificationProps> = ({ message, dateTime, state }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const backgroundColor = theme === 'light' ? 'rgb(242,246,250)' : 'rgb(35,42,79)';

  return (
    <>
      <div
        style={{
          backgroundColor: state === 0 ? backgroundColor : 'inherit',
          borderRadius: BORDER_RADIUS,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
          <NotificationText>{message}</NotificationText>
          {/* <NotificationText>{state === 0 ? <EyeInvisibleOutlined /> : <EyeOutlined />}</NotificationText> */}
        </div>
        <Notificationdate style={{ padding: '0 .25rem' }}>{dateTime}</Notificationdate>
      </div>
      <div style={{ margin: '1.1rem' }} />
    </>
  );
};
