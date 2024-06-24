import { httpApi } from '@app/api/httpApi';
import { Point } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllFeaturedBundles = async (page: number, pageSize: number, search: string, isActive?: boolean) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.FeaturedBundles}/GetAll?`;
  if (isActive !== undefined) {
    url += `IsActive=${isActive}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&IsForFeature=true`;
  return await httpApi.get(url);
};

const CreateFeaturedBundle = async (data: Point) => {
  return await httpApi.post(`${apiPrefix.FeaturedBundles}/Create`, data);
};

const DeleteFeaturedBundle = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.FeaturedBundles}/Delete?Id=${id}`);
};

const UpdateFeaturedBundle = async (data: Point) => {
  return await httpApi.put(`${apiPrefix.FeaturedBundles}/Update`, data);
};

const ActivateFeaturedBundle = async (id: number) => {
  return await httpApi.put(`${apiPrefix.FeaturedBundles}/SwitchActivation`, { id, isActive: true });
};

const DeActivateFeaturedBundle = async (id: number) => {
  return await httpApi.put(`${apiPrefix.FeaturedBundles}/SwitchActivation`, { id, isActive: false });
};

export {
  getAllFeaturedBundles,
  CreateFeaturedBundle,
  UpdateFeaturedBundle,
  DeleteFeaturedBundle,
  ActivateFeaturedBundle,
  DeActivateFeaturedBundle,
};
