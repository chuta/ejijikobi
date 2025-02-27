'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentData {
  payment_method: 'stripe' | 'pay-on-delivery';
  delivery_address?: string;
  phone_number?: string;
}

interface CheckoutFormProps {
  totalAmount: number;
  onSuccess: (data: PaymentData) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export default function CheckoutForm({ totalAmount, onSuccess, onCancel, isProcessing = false }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'pay-on-delivery'>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (paymentMethod === 'pay-on-delivery') {
      // Handle Pay on Delivery
      try {
        setLoading(true);
        
        // Call the success callback with pay-on-delivery details
        onSuccess({
          payment_method: 'pay-on-delivery',
          delivery_address: deliveryAddress,
          phone_number: phoneNumber
        });
      } catch (err) {
        console.error('Error processing pay-on-delivery order:', err);
        setError('Failed to process pay-on-delivery order. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? 'An unexpected error occurred.');
      setLoading(false);
    }
    // Payment confirmation will redirect to return_url
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-playfair font-bold mb-6">Checkout</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`flex-1 py-3 px-4 rounded-full border ${
              paymentMethod === 'stripe'
                ? 'border-[rgb(200,162,84)] bg-[rgb(200,162,84)] text-white'
                : 'border-gray-300'
            }`}
          >
            Pay with Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('pay-on-delivery')}
            className={`flex-1 py-3 px-4 rounded-full border ${
              paymentMethod === 'pay-on-delivery'
                ? 'border-[rgb(200,162,84)] bg-[rgb(200,162,84)] text-white'
                : 'border-gray-300'
            }`}
          >
            Pay on Delivery
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {paymentMethod === 'stripe' ? (
            <motion.div
              key="stripe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <PaymentElement />
            </motion.div>
          ) : (
            <motion.div
              key="pay-on-delivery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                  placeholder="Enter your complete delivery address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                  placeholder="Enter your phone number"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold">
            Total: ₦{totalAmount.toLocaleString()}
          </p>
          <button
            type="submit"
            disabled={(!stripe && paymentMethod === 'stripe') || loading || isProcessing}
            className="w-full bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || isProcessing ? 'Processing...' : 'Complete Order'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full px-8 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 