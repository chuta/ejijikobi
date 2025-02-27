'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import StripeProvider from '../components/StripeProvider';
import { supabase } from '../lib/supabase';

function CheckoutContent() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const productId = searchParams.get('product_id');
  const size = searchParams.get('size');
  const quantity = searchParams.get('quantity');

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!amount || !productId || !size || !quantity) {
        setError('Invalid checkout parameters');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: 'ngn',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error initializing checkout:', err);
        setError('Failed to initialize checkout');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    initializeCheckout();
  }, [amount, productId, size, quantity, user, router]);

  const handleSuccess = async (paymentData?: { payment_method: string; delivery_address?: string; phone_number?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      console.log('Session found:', { 
        hasAccessToken: !!session.access_token,
        tokenLength: session.access_token?.length 
      });

      console.log('Creating order with data:', {
        userId: user?.id,
        productId,
        size,
        quantity,
        payment_method: paymentData?.payment_method || 'stripe',
        delivery_address: paymentData?.delivery_address,
        phone_number: paymentData?.phone_number,
        status: paymentData?.payment_method === 'pay-on-delivery' ? 'pending' : 'processing'
      });

      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          userId: user?.id,
          productId,
          size,
          quantity: parseInt(quantity!),
          payment_method: paymentData?.payment_method || 'stripe',
          delivery_address: paymentData?.delivery_address,
          phone_number: paymentData?.phone_number,
          status: paymentData?.payment_method === 'pay-on-delivery' ? 'pending' : 'processing'
        }),
      });

      // Add response debugging
      const responseText = await response.text();
      console.log('Raw API Response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.error('Response content:', responseText);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        console.error('Order creation failed:', data);
        throw new Error(data.message || 'Failed to create order');
      }

      console.log('Order created successfully:', data);

      // Redirect to success page
      router.push('/order-confirmation');
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/collections');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/collections')}
          className="bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-4xl font-playfair font-bold text-center mb-8">
        Checkout
      </h1>
      <StripeProvider clientSecret={clientSecret}>
        <CheckoutForm
          totalAmount={parseFloat(amount!)}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isProcessing={loading}
        />
      </StripeProvider>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
} 