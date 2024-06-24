import { httpApi } from '@app/api/httpApi';
import { ApplicationsVersion } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllApplicationsVersions = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.applicationsVersions}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const CreateApplicationVersion = async (data: ApplicationsVersion) => {
  return await httpApi.post(`${apiPrefix.applicationsVersions}/Create`, data);
};

const UpdateApplicationVersion = async (data: ApplicationsVersion) => {
  return await httpApi.put(`${apiPrefix.applicationsVersions}/Update`, data);
};

const ChangeOptionsForApplicationVersion = async (data: ApplicationsVersion) => {
  return await httpApi.post(`${apiPrefix.applicationsVersions}/ChangeUpdateOptionsForApk`, data);
};

export {
  getAllApplicationsVersions,
  CreateApplicationVersion,
  UpdateApplicationVersion,
  ChangeOptionsForApplicationVersion,
};
