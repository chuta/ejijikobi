'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const redirect = searchParams.get('redirect_status');

  useEffect(() => {
    if (!paymentIntent && !redirect) {
      router.push('/');
    }
  }, [paymentIntent, redirect, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="mb-8">
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

        <h1 className="text-4xl font-playfair font-bold mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We&apos;ll send you a confirmation email with your order details.
        </p>

        <div className="space-y-4">
          <Link
            href="/collections"
            className="block w-full bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="block w-full px-8 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-300"
          >
            View Order History
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  );
} 