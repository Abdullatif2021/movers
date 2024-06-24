import { httpApi } from '@app/api/httpApi';
import { CompanyModal } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllCompanies = async (
  page: number,
  pageSize: number,
  search: string,
  type?: string,
  requestId?: string | undefined,
  statues?: number,
  GetCompaniesThatNeedToUpdate?: boolean,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.companies}/GetAll`, {
    params: {
      KeyWord: search,
      SkipCount: skip,
      MaxResultCount: pageSize,
      statues: GetCompaniesThatNeedToUpdate ? 1 : statues,
      RequestId: type === 'companiesThatBoughtInfo' ? requestId : undefined,
      WhichBoughtInfoContact: type === 'companiesThatBoughtInfo' ? true : false,
      GetCompaniesThatNeedToUpdate: GetCompaniesThatNeedToUpdate,
    },
  });
};

const getAllSuitableCompanies = async (type: string | undefined, requestId: string | undefined) => {
  return await httpApi.get(
    `${apiPrefix.companies}/GetAll?GetCompaniesWithRequest=false&statues=2&RequestId=${requestId}&IsForFilter=true&AcceptRequests=true&MaxResultCount=10000`,
  );
};

const getSuitableCompanies = async (
  type: string | undefined,
  page: number,
  pageSize: number,
  search: string,
  requestId: string | undefined,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.companies}/GetAll?GetCompaniesWithRequest=${
      type == '2' ? 'true' : 'false'
    }&statues=2&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&AcceptRequests=true&RequestId=${requestId}&IsForFilter=${
      type == '2' ? 'false' : 'true'
    }`,
  );
};

const getCompanyById = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.companies}/Get?Id=${id}`);
};

const GetCompaniesToCompare = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.companies}/GetCompaniesToCompare?newCompanyId=${id}`);
};

const GetReviewDetailsByCompanyId = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.companies}/GetReviewDetailsById?Id=${id}`);
};

const DeleteCompany = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.companies}/Delete?Id=${id}`);
};

const createCompany = async (data: CompanyModal) => {
  return await httpApi.post(`${apiPrefix.companies}/Create`, data);
};

const ChangeAcceptRequestOrPossibleRequestForCompany = async (data: any) => {
  return await httpApi.put(`${apiPrefix.companies}/ChangeAcceptRequestOrPossibleRequestForCompany`, data);
};

const updateCompany = async (data: CompanyModal) => {
  return await httpApi.put(`${apiPrefix.companies}/Update`, data);
};

const confirmCompany = async (data: any) => {
  return await httpApi.post(`${apiPrefix.companies}/ConfirmCompanyByAdmin`, data);
};

const approveUpdateCompany = async (data: any) => {
  return await httpApi.post(`${apiPrefix.companies}/ApproveUpdateCompany`, data);
};

export {
  getAllCompanies,
  getAllSuitableCompanies,
  getSuitableCompanies,
  getCompanyById,
  GetCompaniesToCompare,
  GetReviewDetailsByCompanyId,
  createCompany,
  ChangeAcceptRequestOrPossibleRequestForCompany,
  updateCompany,
  DeleteCompany,
  confirmCompany,
  approveUpdateCompany,
};
