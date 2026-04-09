import client from './client';
import type { ProductRequest, ProductResponse } from '../types/product';

export const findAllProducts = async (): Promise<ProductResponse[]> => {
  const response = await client.get<any>('/products');
  return response.data.data;
};

export const findProductById = async (id: string | number): Promise<ProductResponse> => {
  const response = await client.get<any>(`/products/${id}`);
  return response.data.data;
};

export const registerProduct = async (data: ProductRequest): Promise<ProductResponse> => {
  const response = await client.post<any>('/products', data);
  return response.data.data;
};

export const updateProduct = async (id: string | number, data: Partial<ProductRequest>): Promise<ProductResponse> => {
  const response = await client.put<any>(`/products/${id}`, data);
  return response.data.data;
};
