'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getOrder } from '../lib/supabase';
import { Order } from '../types/order';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      setError('Order not found. Please check the order ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status) + 1;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">
          Track Your Order
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-2 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}
        </form>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-playfair font-bold mb-2">
                Order #{order.id}
              </h2>
              <p className="text-gray-600">
                Ordered on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[rgb(200,162,84)] rounded-full transition-all duration-500"
                    style={{
                      width: `${(getStatusStep(order.status) / 4) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map(
                    (step, index) => (
                      <div
                        key={step}
                        className={`text-center ${
                          index < getStatusStep(order.status)
                            ? 'text-[rgb(200,162,84)]'
                            : 'text-gray-400'
                        }`}
                      >
                        <div className="text-sm font-medium">{step}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {order.tracking_number && (
                <div>
                  <h3 className="font-semibold mb-2">Tracking Information</h3>
                  <p>Tracking Number: {order.tracking_number}</p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(200,162,84)] hover:underline"
                    >
                      Track with Carrier
                    </a>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Quantity: {item.quantity}
                        </p>
                      </div>
                      <p>₦{(item.price / 100).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>₦{(order.subtotal / 100).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Shipping</p>
                      <p>₦{(order.shipping_fee / 100).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between font-bold mt-2">
                      <p>Total</p>
                      <p>₦{(order.total / 100).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 