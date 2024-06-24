import { httpApi } from '@app/api/httpApi';
import { RoleModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllRoles = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.roles}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`);
};

const getRoles = async () => {
  return await httpApi.get(`${apiPrefix.roles}/GetAll`);
};

const createRole = async (data: RoleModel) => {
  return await httpApi.post(`${apiPrefix.roles}/Create`, data);
};

const GetAllPermissions = async () => {
  return await httpApi.get(`${apiPrefix.roles}/GetAllPermissions`);
};

const DeleteRole = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.roles}/Delete?Id=${id}`);
};

const UpdateRole = async (data: any) => {
  return await httpApi.put(`${apiPrefix.roles}/Update`, data);
};

export { getAllRoles, getRoles, createRole, GetAllPermissions, DeleteRole, UpdateRole };
