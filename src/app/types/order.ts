export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ShippingMethod = 
  | 'standard'
  | 'express'
  | 'same_day';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  price: number;
  size: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    gender: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'stripe' | 'pay_on_delivery';
  shipping_method: ShippingMethod;
  shipping_address: {
    full_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  tracking_number?: string;
  tracking_url?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingRate {
  id: string;
  method: ShippingMethod;
  name: string;
  description: string;
  base_price: number;
  estimated_days: {
    min: number;
    max: number;
  };
} 