import { DaysOfWeek } from '../../constants/enums/dayOfWeek';

export const getDayName = (dayValue: number, t: any) => {
  const dayName = Object.keys(DaysOfWeek).find((key: any) => +DaysOfWeek[key] === dayValue);
  return dayName ? t(`${dayName}`) : '';
};
