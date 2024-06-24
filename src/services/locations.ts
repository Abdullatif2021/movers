import { CountryModel, CityModel, RegionModel } from './../interfaces/interfaces';
import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

// ------------ Countries
const getAllCountries = async (page: number, pageSize: number, search: string, countryStatus?: number) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.countries}/GetAll?`;
  if (countryStatus !== undefined) {
    url += `IsActive=${countryStatus}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const getCountries = async () => {
  return await httpApi.get(`${apiPrefix.countries}/GetAll?IsActive=true`);
};

const GetUAE = async () => {
  return await httpApi.get(`${apiPrefix.countries}/GetAll?IsActive=true&type=1`);
};

const createCountry = async (data: CountryModel) => {
  return await httpApi.post(`${apiPrefix.countries}/Create`, data);
};

const Update = async (data: any) => {
  return await httpApi.put(`${apiPrefix.countries}/Update`, data);
};

const Delete = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.countries}/Delete?Id=${id}`);
};

const ActivationCountry = async (countryId: number | undefined) => {
  return await httpApi.put(`${apiPrefix.countries}/SwitchActivation`, { id: countryId, isActive: true });
};

const DeActivateCountry = async (id: number) => {
  return await httpApi.put(`${apiPrefix.countries}/SwitchActivation`, { id: id, isActive: false });
};

// --------------- Cities
const getAllCities = async (
  id: string | undefined,
  page: number,
  pageSize: number,
  search: string,
  countryStatus?: number,
) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.cities}/GetAll?CountryId=${id}&`;
  if (countryStatus !== undefined) {
    url += `IsActive=${countryStatus}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const getAllCity = async () => {
  return await httpApi.get(`${apiPrefix.cities}/GetAll`);
};

const getCities = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.cities}/GetAll?CountryId=${id}&IsActive=true`);
};

const createCity = async (data: CityModel) => {
  return await httpApi.post(`${apiPrefix.cities}/Create`, data);
};

const DeleteCity = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.cities}/Delete?Id=${id}`);
};

const UpdateCity = async (data: any) => {
  return await httpApi.put(`${apiPrefix.cities}/Update`, data);
};

const ActivationCity = async (cityId: number | undefined) => {
  return await httpApi.put(`${apiPrefix.cities}/SwitchActivation`, { id: cityId, isActive: true });
};

const DeActivateCity = async (id: number) => {
  return await httpApi.put(`${apiPrefix.cities}/SwitchActivation`, { id: id, isActive: false });
};

// --------------- Regions
const getAllRegions = async (
  id: string | undefined,
  page: number,
  pageSize: number,
  search: string,
  countryStatus?: number,
) => {
  const skip = (page - 1) * pageSize;
  let url = `${apiPrefix.regions}/GetAll?CityId=${id}&`;
  if (countryStatus !== undefined) {
    url += `IsActive=${countryStatus}&`;
  }
  url += `SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`;
  return await httpApi.get(url);
};

const getRegions = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.regions}/GetAll?CityId=${id}&IsActive=true`);
};

const createRegion = async (data: RegionModel) => {
  return await httpApi.post(`${apiPrefix.regions}/Create`, data);
};

const DeleteRegion = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.regions}/Delete?Id=${id}`);
};

const UpdateRegion = async (data: any) => {
  return await httpApi.put(`${apiPrefix.regions}/Update`, data);
};

const ActivationRegion = async (regionId: number | undefined) => {
  return await httpApi.put(`${apiPrefix.regions}/SwitchActivation`, { id: regionId, isActive: true });
};

const DeActivateRegion = async (id: number) => {
  return await httpApi.put(`${apiPrefix.regions}/SwitchActivation`, { id: id, isActive: false });
};

export {
  getAllCountries,
  GetUAE,
  getCountries,
  createCountry,
  Update,
  Delete,
  ActivationCountry,
  DeActivateCountry,
  getAllCities,
  getCities,
  getRegions,
  createCity,
  DeleteCity,
  UpdateCity,
  ActivationCity,
  DeActivateCity,
  getAllRegions,
  createRegion,
  DeleteRegion,
  getAllCity,
  UpdateRegion,
  ActivationRegion,
  DeActivateRegion,
};
