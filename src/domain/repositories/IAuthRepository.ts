import { MUser, MLoginCredentials, MRegisterData, MAuthResponse } from '@models/Auth';

export interface IAuthRepository {
  login(credentials: MLoginCredentials): Promise<MAuthResponse>;
  register(userData: MRegisterData): Promise<MAuthResponse>;
  getProfile(): Promise<MUser>;
  logout(): Promise<void>;
}
