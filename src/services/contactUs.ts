import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';
import { ContactUsModel } from '@app/interfaces/interfaces';

const getContactUs = async () => {
  return await httpApi.get(`${apiPrefix.contactUs}/Get`);
};

const AddCotactUs = async (data: ContactUsModel) => {
  return await httpApi.post(`${apiPrefix.contactUs}/Create`, data);
};

const UpdateContactUs = async (data: any) => {
  return await httpApi.put(`${apiPrefix.contactUs}/Update`, data);
};

export { getContactUs, AddCotactUs, UpdateContactUs };
