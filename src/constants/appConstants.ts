import { CompanyStatus } from './enums/companyStatues';
import { DayOfWeek } from './enums/dayOfWeek';
import { RequestStatus } from './enums/requestStatus';

export const AR = 'ar';
export const EN = 'en';

export const PHONE_NUMBER_LENGTH = 9;
export const PHONE_NUMBER_CODE = '+971';

export const DAYS_OF_WEEK_NAME = [
  { day: DayOfWeek?.Sunday, dayName: 'Sunday' },
  { day: DayOfWeek?.Monday, dayName: 'Monday' },
  { day: DayOfWeek?.Tuesday, dayName: 'Tuesday' },
  { day: DayOfWeek?.Wednesday, dayName: 'Wednesday' },
  { day: DayOfWeek?.Thursday, dayName: 'Thursday' },
  { day: DayOfWeek?.Friday, dayName: 'Friday' },
  { day: DayOfWeek?.Saturday, dayName: 'Saturday' },
];

export const TIME_HOURS_MINUTES = 'HH:mm:ss';
export const TIME_HOURS = 'HH';
export const DATE_TIME = 'YYYY-MM-DD HH:mm:ss';

export const REQUEST_STATUS = [
  { type: RequestStatus.Checking, name: 'checking' },
  { type: RequestStatus.Approved, name: 'approved' },
  { type: RequestStatus.Rejected, name: 'rejected' },
  { type: RequestStatus.Possible, name: 'possible' },
  { type: RequestStatus.HasOffers, name: 'hasOffers' },
  { type: RequestStatus.InProcess, name: 'inProcess' },
  { type: RequestStatus.FinishByCompany, name: 'FinishByCompany' },
  { type: RequestStatus.FinishByUser, name: 'FinishByUser' },
  { type: RequestStatus.NotFinishByUser, name: 'NotFinishByUser' },
  { type: RequestStatus.Finished, name: 'Finished' },
  { type: RequestStatus.Canceled, name: 'canceled' },
  { type: RequestStatus.CanceledAfterRejectOffers, name: 'CanceledAfterRejectOffers' },
  { type: RequestStatus.OutOfPossible, name: 'OutOfPossible' },
  { type: RequestStatus.CanceledAfterInProcess, name: 'CanceledAfterInProcess' },
  { type: RequestStatus.RejectedNeedToEdit, name: 'RejectedNeedToEdit' },
];

export const COMPANY_STATUS_NAMES = [
  { value: CompanyStatus.Checking, name: 'checking' },
  { value: CompanyStatus.Approved, name: 'approved' },
  { value: CompanyStatus.Rejected, name: 'rejected' },
  { value: CompanyStatus.RejectedNeedToEdit, name: 'RejectedNeedToEdit' },
];

export const NEED_TO_UPDATE = 'needToUpate';

export const DEFAULT_START_DATE = 9;
export const DEFAULT_END_DATE = 5;
