import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';
import { TermModal } from '@app/interfaces/interfaces';

const getAllTerm = async (page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.term}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`);
};

const createTerm = async (data: TermModal) => {
  return await httpApi.post(`${apiPrefix.term}/Create`, data);
};

const DeleteTerm = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.term}/Delete?Id=${id}`);
};

const UpdateTerm = async (data: TermModal) => {
  return await httpApi.put(`${apiPrefix.term}/Update`, data);
};

const Activation = async (countryId: number | undefined) => {
  return await httpApi.put(`${apiPrefix.term}/SwitchActivation`, { id: countryId, isActive: true });
};

const DeActivate = async (id: number) => {
  return await httpApi.put(`${apiPrefix.term}/SwitchActivation`, { id: id, isActive: false });
};

export { getAllTerm, createTerm, DeleteTerm, UpdateTerm, Activation, DeActivate };
