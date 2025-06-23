import { MUser, MLoginCredentials, MRegisterData, MAuthResponse } from '../../domain/models/Auth';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { ApiClient, API_ENDPOINTS } from '../api/client';

export class AuthRepository implements IAuthRepository {
  async login(credentials: MLoginCredentials): Promise<MAuthResponse> {
    return await ApiClient.post<MAuthResponse>(API_ENDPOINTS.LOGIN, credentials);
  }

  async register(userData: MRegisterData): Promise<MAuthResponse> {
    return await ApiClient.post<MAuthResponse>(API_ENDPOINTS.REGISTER, userData);
  }

  async getProfile(): Promise<MUser> {
    return await ApiClient.get<MUser>(API_ENDPOINTS.PROFILE);
  }

  async logout(): Promise<void> {
    await ApiClient.post(API_ENDPOINTS.LOGOUT, {});
  }
}
