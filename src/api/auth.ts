import client from './client';
import type { UserRegisterRequest, UserRegisterResponse } from '../types/auth';

export const login = async (data: Record<string, any>): Promise<any> => {
  const response = await client.post<any>('/auth/login', data);
  return response.data; // 응답으로 accessToken, refreshToken, userInfo 등이 온다고 가정
};

export const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
};

export const register = async (data: UserRegisterRequest): Promise<UserRegisterResponse> => {
  const response = await client.post<any>('/buyers', data);
  return response.data.data;
};

export const findAll = async (): Promise<UserRegisterResponse[]> => {
  const response = await client.get<any>('/buyers');
  return response.data.data;
};

export const findById = async (id: string | number): Promise<UserRegisterResponse> => {
  const response = await client.get<any>(`/buyers/${id}`);
  return response.data.data;
};

export const update = async (id: string | number, data: Partial<UserRegisterRequest>): Promise<UserRegisterResponse> => {
  const response = await client.put<any>(`/buyers/${id}`, data);
  return response.data.data;
};
