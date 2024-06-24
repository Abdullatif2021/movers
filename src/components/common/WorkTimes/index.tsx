import { SetStateAction } from 'jotai';
import moment from 'moment';
import React, { Dispatch } from 'react';
import { Checkbox, Col, Row, TimePicker } from 'antd';
import { DAYS_OF_WEEK_NAME, DEFAULT_END_DATE, DEFAULT_START_DATE, TIME_HOURS } from '@app/constants/appConstants';
import { TimeworksProps } from '@app/interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@app/hooks/useResponsive';

export interface WorkTimesProps {
  selectedDays: Array<TimeworksProps>;
  setSelectedDays: Dispatch<SetStateAction<any>>;
}

const WorkTimes: React.FC<WorkTimesProps> = ({ selectedDays, setSelectedDays }) => {
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();

  const handleTimeChange = (day: number, time: any, isStartDate: boolean) => {
    const data = new Date(time);
    const updatedDays = selectedDays.map((selectedDay: any) => {
      if (selectedDays.length > 0 && selectedDay.day === day) {
        return {
          ...selectedDay,
          [isStartDate ? 'startDate' : 'endDate']: data.getHours(),
        };
      }
      return selectedDay;
    });
    setSelectedDays(updatedDays);
  };

  const getTimeValue = (day: number, isStartDate: boolean) => {
    const dayDate = selectedDays.find((item: any) => item.day === day);
    switch (isStartDate) {
      case true:
        return moment(new Date().setHours(dayDate?.startDate ?? 0));
      case false:
        return moment(new Date().setHours(dayDate?.endDate ?? 0));
    }
  };

  const getDefaultWorksDays = (selectedDay: number) => {
    const selected = selectedDays && selectedDays.find((item: any) => item?.day === selectedDay);
    return selected ? true : false;
  };

  return (
    <>
      {DAYS_OF_WEEK_NAME.map((day: any, index: number) => {
        return (
          <Row
            align={'middle'}
            key={index}
            style={isDesktop || isTablet ? { margin: '2% 5%' } : { width: '100%', margin: '2% 10%' }}
          >
            <Col span={4} lg={4} sm={24} xs={24}>
              <Checkbox
                checked={getDefaultWorksDays(day.day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDays([
                      ...selectedDays,
                      { day: day.day, startDate: DEFAULT_START_DATE, endDate: DEFAULT_END_DATE },
                    ]);
                  } else {
                    setSelectedDays(selectedDays.filter((selectedDay: any) => selectedDay.day !== day.day));
                  }
                }}
              >
                {t(`contactUs.daysOfWeek.${day.dayName}`)}
              </Checkbox>
            </Col>
            {selectedDays.some((selectedDay: any) => selectedDay.day === day.day) && (
              <Row gutter={[10, 10]} justify={'center'} align={'middle'}>
                <Col span={3} lg={3} sm={4} xs={4}>
                  <p>{t('common.from')}</p>
                </Col>
                <Col span={6} lg={6} sm={8} xs={8}>
                  <TimePicker
                    format={TIME_HOURS}
                    value={getTimeValue(day.day, true)}
                    onChange={(time) => handleTimeChange(day.day, time, true)}
                  />
                </Col>
                <Col span={3} lg={3} sm={4} xs={4}>
                  <p>{t('common.to')}</p>
                </Col>
                <Col span={6} lg={6} sm={8} xs={8}>
                  <TimePicker
                    format={TIME_HOURS}
                    value={getTimeValue(day.day, false)}
                    onChange={(time) => handleTimeChange(day.day, time, false)}
                  />
                </Col>
              </Row>
            )}
          </Row>
        );
      })}
    </>
  );
};

export default WorkTimes;
