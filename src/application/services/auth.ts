import { MUser, MLoginCredentials, MRegisterData, MAuthResponse } from "@models/Auth";
import { IAuthRepository } from "@repositories/IAuthRepository";

export class SAuth {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async login(credentials: MLoginCredentials): Promise<MAuthResponse> {
    return await this.authRepository.login(credentials);
  }

  async register(userData: MRegisterData): Promise<MAuthResponse> {
    return await this.authRepository.register(userData);
  }

  async getProfile(): Promise<MUser> {
    return await this.authRepository.getProfile();
  }

  async logout(): Promise<void> {
    await this.authRepository.logout();
  }
}
