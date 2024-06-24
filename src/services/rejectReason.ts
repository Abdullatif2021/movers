import { httpApi } from '@app/api/httpApi';
import { RejectReason } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllRejectReasons = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.rejectReason}/GetAll?`;
  if (isActive !== undefined) {
    url += `IsActive=${isActive}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const CreateRejectReason = async (data: RejectReason) => {
  return await httpApi.post(`${apiPrefix.rejectReason}/Create`, data);
};

const DeleteRejectReason = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.rejectReason}/Delete?Id=${id}`);
};

const UpdateRejectReason = async (data: RejectReason) => {
  return await httpApi.put(`${apiPrefix.rejectReason}/Update`, data);
};

const ActivateRejectReason = async (id: number) => {
  return await httpApi.put(`${apiPrefix.rejectReason}/SwitchActivation`, { id, isActive: true });
};

const DeActivateRejectReason = async (id: number) => {
  return await httpApi.put(`${apiPrefix.rejectReason}/SwitchActivation`, { id, isActive: false });
};

export {
  getAllRejectReasons,
  CreateRejectReason,
  UpdateRejectReason,
  DeleteRejectReason,
  ActivateRejectReason,
  DeActivateRejectReason,
};
