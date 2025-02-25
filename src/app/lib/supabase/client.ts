import { Database } from '@/types/supabase';
import supabase from '@/lib/supabase/config';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type ShippingRate = Database['public']['Tables']['shipping_rates']['Row'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

// Auth helpers
export async function signUp(email: string, password: string, metadata: { full_name: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Profile helpers
export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Product helpers
export async function getProducts(options: {
  category?: string;
  gender?: string;
  featured?: boolean;
  isNew?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  if (options.category) {
    query = query.eq('category', options.category);
  }
  if (options.gender) {
    query = query.eq('gender', options.gender);
  }
  if (options.featured !== undefined) {
    query = query.eq('is_featured', options.featured);
  }
  if (options.isNew !== undefined) {
    query = query.eq('is_new', options.isNew);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProduct(productId: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  if (error) throw error;
  return data;
}

// Cart helpers
export type CartItemWithProduct = CartItem & { product: Product };

export async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  size: string
): Promise<CartItem> {
  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: userId,
      product_id: productId,
      quantity,
      size,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeFromCart(userId: string, cartItemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', userId);
  if (error) throw error;
}

// Order helpers
export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export async function createOrder(orderData: Database['public']['Tables']['orders']['Insert']): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrders(userId: string): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrder(orderId: string): Promise<OrderWithItems> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('id', orderId)
    .single();
  if (error) throw error;
  return data;
}

// Shipping helpers
export async function getShippingRates(): Promise<ShippingRate[]> {
  const { data, error } = await supabase
    .from('shipping_rates')
    .select('*')
    .order('base_price');
  if (error) throw error;
  return data;
}

// Export supabase client for direct usage
export { supabase }; 