import axios from 'axios';
import client from './client';
import type {
  ProductCopyRequest,
  ProductCopyResponse,
  ProductQaRequest,
  ProductQaResponse,
  ProductRequest,
  ProductResponse,
} from '../types/product';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const extractApiErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message || fallback;
  }
  return fallback;
};

export const findAllProducts = async (): Promise<ProductResponse[]> => {
  const response = await client.get<ApiEnvelope<ProductResponse[]>>('/products');
  return response.data.data;
};

export const findProductById = async (id: string | number): Promise<ProductResponse> => {
  const response = await client.get<ApiEnvelope<ProductResponse>>(`/products/${id}`);
  return response.data.data;
};

export const registerProduct = async (data: ProductRequest): Promise<ProductResponse> => {
  const response = await client.post<ApiEnvelope<ProductResponse>>('/products', data);
  return response.data.data;
};

export const updateProduct = async (id: string | number, data: Partial<ProductRequest>): Promise<ProductResponse> => {
  const response = await client.put<ApiEnvelope<ProductResponse>>(`/products/${id}`, data);
  return response.data.data;
};

export const generateProductCopy = async (data: ProductCopyRequest): Promise<ProductCopyResponse> => {
  const response = await client.post<ApiEnvelope<ProductCopyResponse>>('/products/ai/generate-copy', data);
  return response.data.data;
};

export const askProductQuestion = async (
  id: string | number,
  data: ProductQaRequest
): Promise<ProductQaResponse> => {
  const response = await client.post<ApiEnvelope<ProductQaResponse>>(`/products/${id}/ai/qa`, data);
  return response.data.data;
};

export const askProductQuestionWithContext = async (data: ProductQaRequest): Promise<ProductQaResponse> => {
  const response = await client.post<ApiEnvelope<ProductQaResponse>>('/products/ai/qa', data);
  return response.data.data;
};
