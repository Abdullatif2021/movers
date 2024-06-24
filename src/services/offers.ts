import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllOffers = async (
  page: number,
  pageSize: number,
  search: string,
  requestId?: string | undefined,
  companyId?: string | undefined,
  branchId?: string | undefined,
  statues?: string | undefined,
) => {
  const skip = page && pageSize ? (page - 1) * pageSize : undefined;
  return await httpApi.get(`${apiPrefix.offers}/GetAll`, {
    params: {
      SkipCount: skip,
      MaxResultCount: pageSize,
      KeyWord: search,
      RequestId: requestId,
      CompanyId: companyId,
      CompanyBranchId: branchId,
      Statues: statues,
    },
  });
};

const getrejectedOffers = async (page: number, pageSize: number, search: string, requestId: string | undefined) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.offers}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&RequestId=${requestId}&Statues=5`,
  );
};

const getOfferById = async (id: string | undefined) => {
  return await httpApi.get(`${apiPrefix.offers}/Get?Id=${id}`);
};

const sendForUser = async (data: any) => {
  return await httpApi.post(`${apiPrefix.offers}/ApproveOfferToSendItToUser`, data);
};

const returnOfferToProvider = async (data: any) => {
  return await httpApi.post(`${apiPrefix.offers}/RejectOfferToEditItByAdmin`, data);
};

const updateOfferToProvider = async (data: any) => {
  return await httpApi.put(`${apiPrefix.offers}/Update`, data);
};

export { getAllOffers, getrejectedOffers, getOfferById, sendForUser, returnOfferToProvider, updateOfferToProvider };
