import { httpApi } from '@app/api/httpApi';
import apiPrefix from '@app/constants/apiPrefix';

export interface LoginRequest {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
}

export const login = (loginPayload: LoginRequest): Promise<any> =>
  httpApi.post<any>(`${apiPrefix.auth}/Authenticate`, { ...loginPayload }).then(({ data }) => data);

export const GetProfileInfo = (): Promise<any> => httpApi.get<any>(`${apiPrefix.account}/GetProfileInfo`);
