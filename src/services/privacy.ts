import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';
import { PrivacyPolicyModal } from '@app/interfaces/interfaces';

const getAllprivacy = async (page: number, pageSize: number, search: string, IsForMoney: boolean) => {
  const skip = (page - 1) * pageSize;
  return await httpApi.get(
    `${apiPrefix.privacyPolicy}/GetAll?SkipCount=${skip}&MaxResultCount=${pageSize}&KeyWord=${search}&IsForMoney=${IsForMoney}`,
  );
};

const createPrivacy = async (data: PrivacyPolicyModal) => {
  return await httpApi.post(`${apiPrefix.privacyPolicy}/Create`, data);
};

const Deleteprivacy = async (id: number) => {
  return await httpApi.delete(`${apiPrefix.privacyPolicy}/Delete?Id=${id}`);
};

const Updateprivacy = async (data: PrivacyPolicyModal) => {
  return await httpApi.put(`${apiPrefix.privacyPolicy}/Update`, data);
};

const Activation = async (countryId: number | undefined) => {
  return await httpApi.put(`${apiPrefix.privacyPolicy}/SwitchActivation`, { id: countryId, isActive: true });
};

const DeActivate = async (id: number) => {
  return await httpApi.put(`${apiPrefix.privacyPolicy}/SwitchActivation`, { id: id, isActive: false });
};

export { getAllprivacy, createPrivacy, Deleteprivacy, Updateprivacy, Activation, DeActivate };
