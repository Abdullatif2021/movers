import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

export const uploadAttachment = async (data: FormData) => {
  return await httpApi.post(`${apiPrefix.attachment}/Upload`, data);
};

export const UploadMultiAttachment = async (data: FormData) => {
  return await httpApi.post(`${apiPrefix.attachment}/UploadMultiAttachment`, data);
};
