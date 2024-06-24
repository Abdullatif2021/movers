import { httpApi } from '@app/api/httpApi';
import { UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllUsers = async (
  page: number,
  pageSize: number,
  GetAdminsAndCustomerServices: boolean,
  GetBasicUserAndCompanyUsers: boolean,
  search: string,
  userType?: any,
  isActive?: boolean,
  MediatorCode?: string | undefined,
) => {
  const skip = (page - 1) * pageSize;

  let url = `${apiPrefix.users}/GetAll?`;
  if (MediatorCode !== undefined) {
    url += `MediatorCode=${MediatorCode}&`;
  } else {
    url += `UserType=${userType}&GetAdminsAndCustomerServices=${GetAdminsAndCustomerServices}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  if (isActive !== undefined) {
    url += `&IsActive=${isActive}`;
  }
  return await httpApi.get(url);
};

const getAllUsersForAddRequest = async (search: string) => {
  return await httpApi.get(`${apiPrefix.users}/GetAll?GetBasicUserAndBrokerUsers=true&KeyWord=${search}`);
};

const Delete = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.users}/Delete?Id=${id}`);
};

const Create = async (data: UserModel) => {
  return await httpApi.post(`${apiPrefix.users}/Create`, data);
};

const Update = async (data: UserModel) => {
  return await httpApi.put(`${apiPrefix.users}/Update`, data);
};

const Activate = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/Activate`, { id });
};

const DeActivate = async (id: number) => {
  return await httpApi.post(`${apiPrefix.users}/DeActivate`, { id });
};

export { getAllUsers, getAllUsersForAddRequest, Create, Update, Delete, Activate, DeActivate };
