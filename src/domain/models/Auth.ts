export interface MUser {
  id: number;
  username: string;
  email: string;
}

export interface MLoginCredentials {
  username: string;
  password: string;
}

export interface MRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface MAuthResponse {
  token: string;
  user: MUser;
}
