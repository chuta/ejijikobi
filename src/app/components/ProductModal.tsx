'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '../types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    // Close the modal
    onClose();

    // Navigate to checkout with the product details
    const searchParams = new URLSearchParams({
      amount: product.price.toString(),
      product_id: product.id,
      size: selectedSize,
      quantity: '1'
    });

    router.push(`/checkout?${searchParams.toString()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60"
            />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-white rounded-lg shadow-xl relative"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-black z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {product.is_new && (
                    <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-sm">
                      New
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h2 className="text-2xl font-playfair font-bold">{product.name}</h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Size</h3>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 rounded-full border ${
                            selectedSize === size
                              ? 'border-[rgb(200,162,84)] bg-[rgb(200,162,84)] text-white'
                              : 'border-gray-300 hover:border-[rgb(200,162,84)]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Details</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Category: {product.category}</li>
                      <li>• Gender: {product.gender === 'male' ? 'Men' : 'Women'}</li>
                      <li>• Material: Premium African fabric</li>
                      <li>• Care: Dry clean only</li>
                    </ul>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-[rgb(200,162,84)]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">In Stock</span>
                    </div>
                    
                    <button
                      onClick={handleBuyNow}
                      disabled={!selectedSize}
                      className={`w-full py-3 px-6 rounded-full text-white font-medium transition-colors duration-300 ${
                        selectedSize
                          ? 'bg-black hover:bg-[rgb(200,162,84)]'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {selectedSize ? 'Buy Now' : 'Select a Size'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 