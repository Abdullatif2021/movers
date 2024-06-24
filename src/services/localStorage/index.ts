import { UserModel } from '@app/interfaces/interfaces';

interface userModel extends UserModel {
  userId: number;
}

export const persistToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const readToken = (): string => {
  return localStorage.getItem('accessToken') || 'bearerToken';
};

export const persistUser = (user: userModel) => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      userId: user?.userId,
      userType: user?.userType,
    }),
  );
};

export const persistUserInfo = (userInfo: any) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const readUser = (): any => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : '';
};

export const readUserInfo = (): any => {
  const userStr = localStorage.getItem('userInfo');
  return userStr ? JSON.parse(userStr) : '';
};

export const deleteToken = (): void => localStorage.removeItem('accessToken');

export const deleteUser = (): void => {
  localStorage.removeItem('user');
};

export const persistPermissions = (permissions: string[]): void => {
  localStorage.setItem('permissions', JSON.stringify(permissions));
};

export const readPermissions = (): string[] => {
  const permissionsStr = localStorage.getItem('permissions');
  return permissionsStr ? JSON.parse(permissionsStr) : [];
};

export const deletePermissions = (): void => {
  localStorage.removeItem('permissions');
};
