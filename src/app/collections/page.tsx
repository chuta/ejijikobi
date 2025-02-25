'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories, products } from '../data/collections';
import ProductCard from '../components/ProductCard';

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const genderMatch = selectedGender === 'all' || product.gender === selectedGender;
    return categoryMatch && genderMatch;
  });

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-center mb-4">
            Our Collections
          </h1>
          <p className="text-gray-300 text-center max-w-2xl mx-auto">
            Discover our curated collection of modern African fashion, where traditional craftsmanship meets contemporary design.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as 'all' | 'male' | 'female')}
              className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
            >
              <option value="all">All Gender</option>
              <option value="male">Men</option>
              <option value="female">Women</option>
            </select>
          </div>
          <p className="text-gray-600">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {/* Product Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-playfair font-bold mb-2">No items found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 