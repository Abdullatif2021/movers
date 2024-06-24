import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const GetStatisticsNumbers = async () => {
  return await httpApi.get(`${apiPrefix.statictics}/GetStatisticsNumbers`);
};

const GetUsrsStatistics = async (selectedYear?: any) => {
  return await httpApi.get(`${apiPrefix.users}/GetStatisticalNumbers${selectedYear ? `?Year=${selectedYear}` : ''}`);
};

const GetCompaniesStatistics = async () => {
  return await httpApi.get(`${apiPrefix.companies}/GetInfoAboutRequestsCount`);
};

const GetBranchesStatistics = async () => {
  return await httpApi.get(`${apiPrefix.branches}/GetInfoAboutRequestsCount`);
};

const GetServiceStatistics = async () => {
  return await httpApi.get(`${apiPrefix.requests}/GetServiceStatistics`);
};

const GetCitiesStatistics = async () => {
  return await httpApi.get(`${apiPrefix.requests}/GetCitiesStatistics`);
};

const GetRequestsStatistics = async (startDate?: any, endDate?: any) => {
  return await httpApi.get(
    `${apiPrefix.requests}/GetStatisticalNumbers?${startDate ? `DateFrom=${startDate}&` : ''}&${
      endDate ? `DateTo=${endDate}` : ''
    }`,
  );
};

const GetUsersViaBrokersStatistics = async () => {
  return await httpApi.get(`${apiPrefix.Mediator}/StatisticsRegisteredUsersViaBrokers`);
};

export {
  GetStatisticsNumbers,
  GetUsrsStatistics,
  GetCompaniesStatistics,
  GetBranchesStatistics,
  GetServiceStatistics,
  GetCitiesStatistics,
  GetRequestsStatistics,
  GetUsersViaBrokersStatistics,
};
