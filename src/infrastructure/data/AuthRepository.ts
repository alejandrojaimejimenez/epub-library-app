import { MUser, MLoginCredentials, MRegisterData, MAuthResponse } from '@models/Auth';
import { IAuthRepository } from '@repositories/IAuthRepository';
import { ApiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';

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
    // Como no hay un endpoint específico para logout, podemos manejarlo localmente
    // simplemente eliminando el token almacenado. El backend no necesita ser notificado.
    console.log("Sesión cerrada localmente");
    // La eliminación del token se maneja en el AuthContext
  }
}
