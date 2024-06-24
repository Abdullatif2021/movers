import { useResponsive } from '@app/hooks/useResponsive';
import { BASE_COLORS, FONT_SIZE } from '@app/styles/themes/constants';
import { useTimer } from 'react-timer-hook';
import styled from 'styled-components';

interface Timer {
  tempTimer: number;
  callBackFunction: () => void;
  isAddedTime: boolean;
}

export const Timer: React.FC<Timer> = ({ tempTimer, callBackFunction, isAddedTime }) => {
  const { isDesktop } = useResponsive();

  const LableTable = styled.div`
    font-size: ${isDesktop ? FONT_SIZE.sm : FONT_SIZE.xs};
    display: inline;
  `;
  const timer1 = new Date();
  timer1.setSeconds(timer1.getSeconds() + tempTimer);

  const { hours, minutes, seconds } = useTimer({
    expiryTimestamp: timer1,
    onExpire: () => {
      callBackFunction();
    },
  });

  return (
    <LableTable style={{ color: isAddedTime ? BASE_COLORS.red : 'inherit' }}>
      {hours + ' : ' + minutes + ' : ' + seconds}
    </LableTable>
  );
};
