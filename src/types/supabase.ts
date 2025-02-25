export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          images: string[]
          category: string
          gender: string | null
          sizes: string[]
          stock_quantity: number
          is_featured: boolean
          is_new: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          images: string[]
          category: string
          gender?: string | null
          sizes: string[]
          stock_quantity?: number
          is_featured?: boolean
          is_new?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          images?: string[]
          category?: string
          gender?: string | null
          sizes?: string[]
          stock_quantity?: number
          is_featured?: boolean
          is_new?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          payment_status: string
          payment_method: string
          payment_intent_id: string | null
          shipping_method: string
          shipping_address: Json
          tracking_number: string | null
          tracking_url: string | null
          subtotal: number
          shipping_fee: number
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          payment_status?: string
          payment_method: string
          payment_intent_id?: string | null
          shipping_method: string
          shipping_address: Json
          tracking_number?: string | null
          tracking_url?: string | null
          subtotal: number
          shipping_fee: number
          total: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          payment_status?: string
          payment_method?: string
          payment_intent_id?: string | null
          shipping_method?: string
          shipping_address?: Json
          tracking_number?: string | null
          tracking_url?: string | null
          subtotal?: number
          shipping_fee?: number
          total?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          size: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          size: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          size?: string
          price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          size: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          size: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          size?: string
          created_at?: string
        }
      }
      shipping_rates: {
        Row: {
          id: string
          method: string
          name: string
          description: string | null
          base_price: number
          min_days: number
          max_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          method: string
          name: string
          description?: string | null
          base_price: number
          min_days: number
          max_days: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          method?: string
          name?: string
          description?: string | null
          base_price?: number
          min_days?: number
          max_days?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 