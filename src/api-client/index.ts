import { AuthUser } from "@/type/auth";
import { ConfigType } from "@/type/config-type";
import { EventType } from "@/type/event-type";
import { PaginatedResponse } from "@/type/paginated-response";
import { User, UserPayload, UserRole } from "@/type/user";
import { apiUrls } from "./apiUrls";
import HttpClient from "./http-client";

class ApiClient {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL;
  private baseUrl: string = `${this.apiUrl}/api/v1`;

  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(this.baseUrl);
  }

  // Example functions
  public async getUserData(userId: number): Promise<any> {
    return this.httpClient.request<any>(`/users/${userId}`);
  }

  public async postData(endpoint: string, data: any): Promise<any> {
    return this.httpClient.request<any>(endpoint, "POST", {}, data);
  }

  //AUTHENTICATION
  public async login(data: any): Promise<AuthUser> {
    return this.httpClient.unauthenticatedRequest<AuthUser>(
      apiUrls.auth.login,
      "POST",
      {},
      data
    );
  }

  //USERS
  public async getUsers(data: {
    page: number;
    size: number;
    portalId?: string;
    roleFilter?: UserRole;
  }): Promise<PaginatedResponse<User>> {
    const { page, size, portalId, roleFilter } = data;
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("size", String(size));
    if (portalId) params.set("portalId", portalId);
    if (roleFilter) params.set("roleFilter", roleFilter);

    return this.httpClient.request<PaginatedResponse<User>>(
      `${apiUrls.users.get}?${params.toString()}`
    );
  }

  public async getMe(): Promise<User> {
    return this.httpClient.request<User>(apiUrls.users.me);
  }

  public async postUser(data: UserPayload): Promise<User> {
    return this.httpClient.request<User>(apiUrls.users.post, "POST", {}, data);
  }

  public async deleteUser(data: { userId: string }): Promise<void> {
    const { userId } = data;
    return this.httpClient.request(
      `${apiUrls.users.delete}/${userId}`,
      "DELETE"
    );
  }

  public async toggleUserAccess(data: { userId: string }): Promise<void> {
    const { userId } = data;
    const url = apiUrls.users.toggleAccess(userId);
    return this.httpClient.request(url, "PUT");
  }

  public async changePassword(data: {
    userId: string;
    newPassword: string;
  }): Promise<User> {
    const { newPassword, userId } = data;
    return this.httpClient.request<User>(
      `${apiUrls.users.changePassword}?newPassword=${newPassword}&userId=${userId}`,
      "PUT"
    );
  }

  //EVENTS
  public async getEvents(): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(apiUrls.events.get);
  }

  public async getMsDynamicEvents(): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(apiUrls.msdynamicEvents.get);
  }

  public async getAllEvents(): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(
      apiUrls.events.getEventDefinitions
    );
  }

  public async importEvent(payload: EventType): Promise<void> {
    return this.httpClient.request<void>(
      apiUrls.events.importEvent,
      "POST",
      {},
      payload
    );
  }

  public async deleteEventById(eventId: string): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(
      apiUrls.events.deleteEventById(eventId),
      "DELETE"
    );
  }

  public async updateEventConfig(
    eventId: string,
    payload: EventType
  ): Promise<void> {
    return this.httpClient.request<void>(
      apiUrls.events.updateConfig(eventId),
      "PUT",
      {},
      payload
    );
  }

  public async getConfigs(): Promise<ConfigType[]> {
    return this.httpClient.request<ConfigType[]>(apiUrls.configs.get);
  }

  public async createConfig(data: Partial<ConfigType>): Promise<ConfigType> {
    return this.httpClient.request<ConfigType>(
      apiUrls.configs.post,
      "POST",
      {},
      data
    );
  }

  public async updateConfig(
    id: string,
    data: Omit<ConfigType, "id">
  ): Promise<ConfigType> {
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

  public async updateMemberCategory(eventId: string): Promise<void> {
    const url = `${apiUrls.msdynamicEvents.updateMemberCategory}?eventId=${eventId}`;
    return this.httpClient.request<void>(url, "GET");
  }

  public async updateGroupMemberCategory(
    eventId: string,
    group: string
  ): Promise<void> {
    const url = `${apiUrls.msdynamicEvents.updateGroupMemberCategory}?eventId=${eventId}&group=${group}`;
    return this.httpClient.request<void>(url, "GET");
  }

  public async updateIndividualMemberCategory(
    eventId: string,
    contactId: string
  ): Promise<void> {
    const url = `${apiUrls.msdynamicEvents.updateIndividualMemberCategory}?eventId=${eventId}&contactId=${contactId}`;
    return this.httpClient.request<void>(url, "GET");
  }

  public async getContacts(
    eventId: string,
    email: string
  ): Promise<Array<{ id: string; email: string }>> {
    const url = `${apiUrls.msdynamicEvents.contacts}?eventId=${eventId}&email=${email}`;
    return this.httpClient.request<any>(url);
  }

  public async getGroups(
    eventId: string,
    group: string
  ): Promise<{ coordinatorId: string; groupName: string }[]> {
    const url = `${apiUrls.msdynamicEvents.groups}?eventId=${eventId}&group=${group}`;
    return this.httpClient.request<any>(url);
  }
}

export default ApiClient;
