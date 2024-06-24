import { httpApi } from '@app/api/httpApi';
import { Broker } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllBrokers = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.Mediator}/GetAll?`;
  if (isActive !== undefined) {
    url += `IsActive=${isActive}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const getBrokerById = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.Mediator}/Get?Id=${id}`);
};

const DeleteBroker = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.Mediator}/Delete?Id=${id}`);
};

const CreateBroker = async (data: Broker) => {
  return await httpApi.post(`${apiPrefix.Mediator}/Create`, data);
};

const UpdateBroker = async (data: Broker) => {
  return await httpApi.put(`${apiPrefix.Mediator}/Update`, data);
};

export { getAllBrokers, getBrokerById, CreateBroker, UpdateBroker, DeleteBroker };
