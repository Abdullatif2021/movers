import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { readToken } from '@app/services/localStorage';
import { ApiError } from './ApiError';
import { ApiErrorData } from './httpApi';

export default class ApiProvider {
  private api: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    this.api = axios.create(config);

    this.api.interceptors.request.use((config) => {
      config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };
      return config;
    });
  }

  public async request(config: any): Promise<any> {
    try {
      const response = await this.api.request<any>(config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new ApiError<ApiErrorData>(error.message || error.response?.data?.message);
    }
  }
}
