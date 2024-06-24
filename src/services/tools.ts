import { SourceTypeModel } from './../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllTools = async (subServiceId: string | undefined, page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.tools}/GetAll?SubServiceId=${subServiceId}&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getTools = async (subServiceId: string | undefined) => {
  return await httpApi.get(`${apiPrefix.tools}/GetAll?SubServiceId=${subServiceId}`);
};

const createTool = async (data: SourceTypeModel) => {
  return await httpApi.post(`${apiPrefix.tools}/Create`, data);
};

const DeleteTool = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.tools}/Delete?Id=${id}`);
};

const UpdateTool = async (data: any) => {
  return await httpApi.put(`${apiPrefix.tools}/Update`, data);
};

export { getAllTools, getTools, createTool, DeleteTool, UpdateTool };
