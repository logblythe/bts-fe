import { ConfigType } from "@/type/config-type";
import { apiUrls } from "./apiUrls";
import HttpClient from "./http-client";

class ConfigClient {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL;
  private baseUrl: string = `${this.apiUrl}/api/v1`;

  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(this.baseUrl);
  }

  public async getConfigs(): Promise<ConfigType[]> {
    return this.httpClient.request<ConfigType[]>(apiUrls.configs.get);
  }

  public async createConfig(data: ConfigType): Promise<ConfigType> {
    return this.httpClient.request<ConfigType>(
      apiUrls.configs.post,
      "POST",
      {},
      data
    );
  }

  public async updateConfig(id: string, data: ConfigType): Promise<ConfigType> {
    return this.httpClient.request<ConfigType>(
      apiUrls.configs.updateById(id),
      "PUT",
      {},
      data
    );
  }

  public async deleteConfigById(configId: string): Promise<void> {
    return this.httpClient.request<void>(
      apiUrls.configs.deleteById(configId),
      "DELETE"
    );
  }
}

export default ConfigClient;
