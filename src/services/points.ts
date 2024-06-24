import { httpApi } from '@app/api/httpApi';
import { Point } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllPoints = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.points}/GetAll?`;
  if (isActive !== undefined) {
    url += `IsActive=${isActive}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const CreatePoint = async (data: Point) => {
  return await httpApi.post(`${apiPrefix.points}/Create`, data);
};

const DeletePoint = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.points}/Delete?Id=${id}`);
};

const UpdatePoint = async (data: Point) => {
  return await httpApi.put(`${apiPrefix.points}/Update`, data);
};

const ActivatePoint = async (id: number) => {
  return await httpApi.put(`${apiPrefix.points}/SwitchActivation`, { id, isActive: true });
};

const DeActivatePoint = async (id: number) => {
  return await httpApi.put(`${apiPrefix.points}/SwitchActivation`, { id, isActive: false });
};

export { getAllPoints, CreatePoint, UpdatePoint, DeletePoint, ActivatePoint, DeActivatePoint };
