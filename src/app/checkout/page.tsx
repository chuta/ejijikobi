'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import StripeProvider from '../components/StripeProvider';
import CheckoutForm from '../components/CheckoutForm';
import { supabase } from '../lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface OrderDetails {
  amount: number;
  productId: string;
  size: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [clientSecret, setClientSecret] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Check authentication first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !isAuthenticated) {
          const currentPath = window.location.pathname + window.location.search;
          router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        // Get order details from URL parameters
        const amount = Number(searchParams.get('amount')) || 0;
        const productId = searchParams.get('product_id');
        const size = searchParams.get('size');
        const quantity = Number(searchParams.get('quantity')) || 1;

        if (!amount || !productId || !size) {
          router.push('/collections');
          return;
        }

        setOrderDetails({ amount, productId, size, quantity });

        // Create PaymentIntent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Checkout initialization error:', err);
        setError('Failed to initialize checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [searchParams, router, isAuthenticated]);

  const handleSuccess = async () => {
    try {
      if (!user || !orderDetails) {
        console.error('Missing user or order details');
        setError('Unable to process order. Please try again.');
        return;
      }

      // Verify product exists and is valid
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', orderDetails.productId)
        .single();

      if (productError) {
        console.error('Product verification failed:', {
          error: productError.message,
          details: productError.details,
          hint: productError.hint,
          code: productError.code
        });
        setError(`Invalid product selected (${productError.message}). Please try again.`);
        return;
      }

      if (!product) {
        console.error('Product not found:', orderDetails.productId);
        setError('Product not found. Please try again.');
        return;
      }

      // Verify size is valid
      if (!product.sizes.includes(orderDetails.size)) {
        setError('Invalid size selected. Please try again.');
        return;
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'stripe',
          shipping_method: 'standard',
          shipping_address: {
            // Add shipping address details here
            full_name: user.name,
            email: user.email,
            phone: user.phone,
            address: 'To be added',
            city: 'To be added',
            state: 'To be added',
            postal_code: 'To be added',
            country: 'Nigeria'
          },
          subtotal: orderDetails.amount,
          shipping_fee: 0,
          total: orderDetails.amount
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error('Order creation failed:', orderError);
        setError('Failed to create order. Please try again.');
        return;
      }

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: orderDetails.productId,
          quantity: orderDetails.quantity,
          size: orderDetails.size,
          price: orderDetails.amount
        });

      if (itemError) {
        // If order item creation fails, delete the order and show error
        await supabase.from('orders').delete().eq('id', order.id);
        console.error('Order item creation failed:', itemError);
        setError('Failed to process order items. Please try again.');
        return;
      }

      // Success! Set success state and redirect
      setShowSuccess(true);
      router.push('/order-confirmation');
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/collections');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-500 max-w-md mx-auto">
          {error}
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto"
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-playfair font-bold mb-4">
            Order Successful!
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="space-y-4">
            <Link
              href="/collections"
              className="block w-full bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="block w-full px-8 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-300"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!clientSecret || !orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-center mb-8">
          Checkout
        </h1>
        <StripeProvider clientSecret={clientSecret}>
          <CheckoutForm
            totalAmount={orderDetails.amount}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </StripeProvider>
      </div>
    </div>
  );
} 