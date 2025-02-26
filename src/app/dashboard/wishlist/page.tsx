'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase/client';
import { Product } from '../../types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('wishlist')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', user?.id);

        if (fetchError) throw fetchError;
        setWishlist(data?.map(item => item.product) || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const removeFromWishlist = async (productId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', productId);

      if (deleteError) throw deleteError;
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-playfair font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-8">Save items you love to your wishlist!</p>
        <Link
          href="/collections"
          className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-playfair font-bold mb-8">My Wishlist</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow overflow-hidden group"
          >
            <div className="relative h-64">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors duration-300"
              >
                <FaHeart className="text-red-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  ₦{product.price.toLocaleString()}
                </span>
                <Link
                  href={`/collections/${product.id}`}
                  className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span>Buy Now</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 