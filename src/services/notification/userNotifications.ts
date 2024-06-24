import { httpApi } from '@app/api/httpApi';

const baseURL = `/api/services/app/Notification`;
// eslint-disable-next-line
const GetUserNotifications = async (page: number, pageSize: number) => {
  const skip = (page - 1) * 5;
  return await httpApi.get(`${baseURL}/GetUserNotifications?skip=${skip}&MaxResultCount=${pageSize}`);
};
// eslint-disable-next-line
const MarkNotificationAsRead = async (id: number) => {
  return await httpApi.post(`${baseURL}/MarkNotificationAsRead`, { id });
};
// eslint-disable-next-line
const GetNumberOfUnReadUserNotifications = async () => {
  return await httpApi.get(`${baseURL}/GetNumberOfUnReadUserNotifications`);
};
// eslint-disable-next-line
const MarkAllNoteficationAsRead = async () => {
  return await httpApi.post(`${baseURL}/MarkAllNoteficationAsRead`);
};

export { GetUserNotifications, MarkNotificationAsRead, MarkAllNoteficationAsRead, GetNumberOfUnReadUserNotifications };
