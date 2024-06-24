import { httpApi } from '@app/api/httpApi';
import { Code, Partner, UserModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllPartner = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.partner}/GetAll?`;
  if (isActive !== undefined) {
    url += `IsActive=${isActive}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const getPartner = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.partner}/Get?Id=${id}`);
};

const DeletePartner = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.partner}/Delete?Id=${id}`);
};

const DeleteCode = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.partner}/DeleteCodeFromPatner?Id=${id}`);
};

const DeleteNumber = async (data: any) => {
  return await httpApi.delete(`${apiPrefix.partner}/DeleteNumberFromCode`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  });
};

const CreatePartner = async (data: Partner) => {
  return await httpApi.post(`${apiPrefix.partner}/Create`, data);
};

const CreateCode = async (data: any) => {
  return await httpApi.post(`${apiPrefix.partner}/AddNewCodeToPatner`, data);
};

const CreateNumber = async (data: any) => {
  return await httpApi.post(`${apiPrefix.partner}/AddNumberToCode`, data);
};

const UpdatePartner = async (data: Partner) => {
  return await httpApi.put(`${apiPrefix.partner}/Update`, data);
};

const ActivatePartner = async (id: number) => {
  return await httpApi.post(`${apiPrefix.partner}/Activate`, { id });
};

const DeActivatePartner = async (id: number) => {
  return await httpApi.post(`${apiPrefix.partner}/DeActivate`, { id });
};

export {
  getAllPartner,
  getPartner,
  CreatePartner,
  CreateCode,
  CreateNumber,
  UpdatePartner,
  DeletePartner,
  DeleteCode,
  DeleteNumber,
  ActivatePartner,
  DeActivatePartner,
};
