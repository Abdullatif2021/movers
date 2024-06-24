import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

const getAllAsks = async (statusType?: any) => {
  return await httpApi.get(`${apiPrefix.ask}/GetAllAskForHelps?Statues=${statusType}`);
};

const confirmAsks = async (id: number) => {
  return await httpApi.post(`${apiPrefix.ask}/ConfirmFollowedForAskingForHelp?id=${id}`);
};

export { getAllAsks, confirmAsks };
