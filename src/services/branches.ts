import { httpApi } from '@app/api/httpApi';
import { BranchModel } from '@app/interfaces/interfaces';
import apiPrefix from '@app/constants/apiPrefix';

const getAllBranches = async (CompanyId: string | undefined, page: number, pageSize: number, search: string) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.branches}/GetAll?CompanyId=${CompanyId}&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}`,
  );
};

const getAllBranchesThatBoughtInfo = async (
  page: number,
  pageSize: number,
  search: string,
  type?: string,
  requestId?: string | undefined,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.branches}/GetAll`, {
    params: {
      SkipCount: skip,
      MaxResultCount: pageSize,
      KeyWord: search,
      RequestId: type === 'companiesThatBoughtInfo' ? requestId : undefined,
      WhichBoughtInfoContact: type === 'companiesThatBoughtInfo' ? true : false,
    },
  });
};

const getAllBranchesWithoutCompany = async (page: number, pageSize: number, search: string, statues?: number) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(`${apiPrefix.branches}/GetAll`, {
    params: {
      SkipCount: skip,
      MaxResultCount: pageSize,
      KeyWord: search,
      GetBranchesWithoutCompany: true,
      BranchStatues: statues,
    },
  });
};

const getAllSuitableBranches = async (type: string | undefined, requestId: string | undefined) => {
  return await httpApi.get(
    `${apiPrefix.branches}/GetAll?GetCompnyBranchesWithRequest=false&statues=2&RequestId=${requestId}&IsForFilter=true&AcceptRequests=true`,
  );
};

const getSuitableBranches = async (
  type: string | undefined,
  page: number,
  pageSize: number,
  search: string,
  requestId: string | undefined,
) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.branches}/GetAll?GetCompnyBranchesWithRequest=${
      type == '2' ? 'true' : 'false'
    }&statues=2&SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&AcceptRequests=true&RequestId=${requestId}&IsForFilter=${
      type == '2' ? 'false' : 'true'
    }`,
  );
};

const getBranch = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.branches}/Get?Id=${id}`);
};

const GetReviewDetailsByBranchId = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.branches}/GetReviewDetailsById?Id=${id}`);
};

const createBranch = async (data: BranchModel) => {
  return await httpApi.post(`${apiPrefix.branches}/Create`, data);
};

const ChangeAcceptRequestOrPossibleRequestForBranch = async (data: any) => {
  return await httpApi.put(`${apiPrefix.branches}/ChangeAcceptRequestOrPossibleRequestForCompanyBranch`, data);
};

const confirmBranch = async (data: any) => {
  return await httpApi.put(`${apiPrefix.branches}/ConfirmCompanyBranchByAdmin`, data);
};

const UpdateBranch = async (data: any) => {
  return await httpApi.put(`${apiPrefix.branches}/Update`, data);
};

const DeleteBranch = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.branches}/Delete?Id=${id}`);
};

export {
  getAllBranches,
  getAllBranchesThatBoughtInfo,
  getAllBranchesWithoutCompany,
  getAllSuitableBranches,
  getSuitableBranches,
  getBranch,
  GetReviewDetailsByBranchId,
  createBranch,
  ChangeAcceptRequestOrPossibleRequestForBranch,
  confirmBranch,
  UpdateBranch,
  DeleteBranch,
};
