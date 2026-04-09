import client from './client';
import type { UserRegisterRequest, UserRegisterResponse } from '../types/auth';

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
