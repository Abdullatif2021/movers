import { ServiceModel } from '../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

// Services
const getAllServices = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.services}/GetAll?`;
  if (isActive !== undefined) {
    url += `Active=${isActive}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const getServicesForCompany = async () => {
  return await httpApi.get(`${apiPrefix.services}/GetAll?Active=true`);
};

const getServicesForRequest = async (IsForStorage?: boolean | undefined, IsForTruck?: boolean | undefined) => {
  return await httpApi.get(`${apiPrefix.services}/GetAll`, {
    params: {
      Active: true,
      IsForStorage: IsForStorage,
      IsForTruck: IsForTruck,
    },
  });
};

const createService = async (data: ServiceModel) => {
  return await httpApi.post(`${apiPrefix.services}/Create`, data);
};

const DeleteService = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.services}/Delete?Id=${id}`);
};

const UpdateService = async (data: any) => {
  return await httpApi.put(`${apiPrefix.services}/Update`, data);
};

const ActivateService = async (id: number) => {
  return await httpApi.put(`${apiPrefix.services}/SwitchActivation`, { id, isActive: true });
};

const DeActivateService = async (id: number) => {
  return await httpApi.put(`${apiPrefix.services}/SwitchActivation`, { id, isActive: false });
};

// Sub Services
const getAllSubServices = async (id: string | undefined, page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.subServices}/GetAll?ServiceId=${id}&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getSubServices = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.subServices}/GetAll?ServiceId=${id}`);
};

const createSubService = async (data: ServiceModel) => {
  return await httpApi.post(`${apiPrefix.subServices}/Create`, data);
};

const DeleteSubService = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.subServices}/Delete?Id=${id}`);
};

const UpdateSubService = async (data: any) => {
  return await httpApi.put(`${apiPrefix.subServices}/Update`, data);
};

export {
  getAllServices,
  getServicesForCompany,
  getServicesForRequest,
  createService,
  DeleteService,
  UpdateService,
  ActivateService,
  DeActivateService,
  getAllSubServices,
  getSubServices,
  createSubService,
  DeleteSubService,
  UpdateSubService,
};
