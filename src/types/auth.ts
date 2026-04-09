export interface UserRegisterRequest {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  countryCode?: string;
  countryName?: string;
  buyerStatus?: string;
}

export interface UserRegisterResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  countryCode: string | null;
  countryName: string | null;
  buyerStatus: string;
  success?: boolean; // Keep for internal logic if needed
  message?: string;
}
