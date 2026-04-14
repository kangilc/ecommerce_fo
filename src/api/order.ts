import client, { getAccessToken } from './client';

export interface OrderRequest {
  buyerId: number;
  productId: number;
  quantity: number;
  amount: number;
}

export const createOrder = async (data: OrderRequest) => {
  const token = getAccessToken();
  console.log('[Order API] 현재 프론트엔드가 가진 Access Token:', token);
  
  if (!token) {
    alert('인증 토큰이 발급되지(복구되지) 않았습니다! 새로고침 후 로그인을 다시 확인해주세요.');
    throw new Error('No access token available');
  }

  const response = await client.post('/orders', data);
  return response.data;
};
