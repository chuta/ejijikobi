'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/app/types';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      await loadProducts(); // Reload the list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleBulkUpload = () => {
    router.push('/admin/products/bulk-upload');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-playfair font-bold">Product Management</h1>
            <div className="flex gap-4">
              <button
                onClick={handleBulkUpload}
                className="px-4 py-2 border border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-300"
              >
                Bulk Upload
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
              >
                Add Product
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.is_new && (
                    <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-sm">
                      New
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[rgb(200,162,84)]">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1 text-sm border border-red-300 text-red-500 rounded-full hover:bg-red-50 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600 mb-4">No products found</h3>
              <p className="text-gray-500 mb-8">Start by adding your first product or use bulk upload.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleBulkUpload}
                  className="px-6 py-2 border border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-300"
                >
                  Bulk Upload
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
                >
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 