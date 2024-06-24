import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllPayments = async (
  page: number,
  pageSize: number,
  search: string,
  paidProvider: number,
  paidStatues: number,
  reasonOfPaid: number,
) => {
  const skip = (page - 1) * pageSize;

  return await httpApi.get(
    `${apiPrefix.payments}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}` +
      (paidProvider !== 0 ? `&PaidProvider=${paidProvider}` : '') +
      (reasonOfPaid !== 0 ? `&ReasonOfPaid=${reasonOfPaid}` : ''),
  );
};

const getPaymentById = async (id: number) => {
  return await httpApi.get(`${apiPrefix.payments}/ConfirmFollowedForAskingForHelp?id=${id}`);
};

export { getAllPayments, getPaymentById };
