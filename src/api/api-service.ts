import ApiProvider from '@app/api/api-provider';
import HttpMethod from '@app/constants/enums/http-method';

export default class ApiService {
  private provider: ApiProvider;

  constructor(config: any) {
    this.provider = new ApiProvider(config);
  }

  protected get(url: string, config?: any): Promise<any> {
    const method = HttpMethod.GET;
    return this.provider.request({ method, url, ...config });
  }

  protected delete(url: string, config?: any): Promise<any> {
    const method = HttpMethod.DELETE;
    return this.provider.request({ method, url, ...config });
  }

  protected post(url: string, data?: any, config?: any): Promise<any> {
    const method = HttpMethod.POST;
    return this.provider.request({
      method,
      url,
      data,
      ...config,
    });
  }

  protected put(url: string, data?: any, config?: any): Promise<any> {
    const method = HttpMethod.PUT;
    return this.provider.request({
      method,
      url,
      data,
      ...config,
    });
  }

  protected patch(url: string, data?: any, config?: any): Promise<any> {
    const method = HttpMethod.PATCH;
    return this.provider.request({
      method,
      url,
      data,
      ...config,
    });
  }
}
