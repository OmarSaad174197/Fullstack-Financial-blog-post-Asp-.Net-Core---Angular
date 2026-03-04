export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  userName: string;
  email: string;
  password: string;
}

export interface NewUser {
  userName: string;
  email: string;
  token: string;
}
