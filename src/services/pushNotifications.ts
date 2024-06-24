import { httpApi } from '@app/api/httpApi';
import { Notification } from '@app/components/Admin/Notifications';
import apiPrefix from '@app/constants/apiPrefix';

const getAllPushNotification = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.pushNotifications}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const sendPushNotification = async (data: Notification) => {
  return await httpApi.post(`${apiPrefix.pushNotifications}/Create`, data);
};

const DeletePushNotification = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.pushNotifications}/Delete?Id=${id}`);
};

const ResendPushNotification = async (id: number) => {
  return await httpApi.post(`${apiPrefix.pushNotifications}/ResendPushNotification?pushNotificationId=${id}`);
};

export { getAllPushNotification, sendPushNotification, DeletePushNotification, ResendPushNotification };
