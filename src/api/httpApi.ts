import axios, { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '../services/localStorage';
import i18next from 'i18next';

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    'Accept-Language': i18next.language,
    Authorization: `Bearer ${readToken()}`,
  };
  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  error.message === 'Network Error' && (error.message = i18next.t('networkError'));
  error.message === 'timeout exceeded' && (error.message = i18next.t('timeoutExceeded'));
  const errorMessage = error.response?.data?.error?.message || error.message;
  throw new ApiError<ApiErrorData>(errorMessage);
});

export interface ApiErrorData {
  message: string;
}
