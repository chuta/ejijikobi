'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../types';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  // Use the first image from the images array, or a fallback if no images
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/images/placeholder.jpg';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_new && (
            <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-sm">
              New
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold font-playfair">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-[rgb(200,162,84)]">
              {formatPrice(product.price)}
            </span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-[rgb(200,162,84)] transition-colors duration-300"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 