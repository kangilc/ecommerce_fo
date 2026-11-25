export interface ProductRequest {
  name: string;
  price: number;
  stockQuantity: number;
  sellerId: number;
  description?: string;
  tags?: string[];
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  sellerId: number;
  description?: string;
  tags?: string[];
}

export interface ProductCopyRequest {
  name: string;
  price?: number;
  keywords?: string;
  tone?: string;
}

export interface ProductCopyResponse {
  description: string;
  highlights: string[];
  tags: string[];
}

export interface ProductQaRequest {
  question: string;
  previousInteractionId?: string;
  productName?: string;
  price?: number;
  stockQuantity?: number;
  description?: string;
  tags?: string[];
}

export interface ProductQaResponse {
  answer: string;
  interactionId?: string;
}
