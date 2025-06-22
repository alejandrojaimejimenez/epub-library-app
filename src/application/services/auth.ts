import { User, LoginCredentials, RegisterData, AuthResponse } from "../../domain/models/Auth";
import { ApiClient, API_ENDPOINTS } from "../../infrastructure/api/client";

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Llamada directa a la API de login que devuelve {token, user}
    const response = await ApiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
    return response;
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    // Llamada directa a la API de registro que devuelve {token, user}
    const response = await ApiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData);
    return response;
  }

  static async getProfile(): Promise<User> {
    // La API de perfil podría devolver {user} o estar dentro de una respuesta ApiResponse
    const response = await ApiClient.get<User>(API_ENDPOINTS.PROFILE);
    return response;
  }
}
