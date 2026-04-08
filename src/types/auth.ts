export interface UserRegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UserRegisterResponse {
  success: boolean;
  message: string;
}
