import client from './client';
import { UserRegisterRequest, UserRegisterResponse } from '../types/auth';

export const register = async (data: UserRegisterRequest): Promise<UserRegisterResponse> => {
  const response = await client.post<UserRegisterResponse>('/users', data);
  return response.data;
};
