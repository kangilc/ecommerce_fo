export interface ProductRequest {
  name: string;
  price: number;
  stockQuantity: number;
  sellerId: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  sellerId: number;
}
