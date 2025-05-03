export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  total_bottles_delivered: number;
  total_bottles_returned: number;
  price_per_bottle: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  address: string;
  price_per_bottle: number;
} 