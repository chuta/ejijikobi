'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { parse, unparse, ParseConfig, ParseResult } from 'papaparse';

interface CSVProduct {
  name: string;
  description: string;
  price: string;
  category: string;
  gender: string;
  sizes: string;
  stock_quantity: string;
  is_featured: string;
  is_new: string;
  images: string;
}

const sampleProducts = [
  {
    name: 'Ankara Print Blazer',
    description: 'Modern cut blazer with traditional Ankara print, perfect for formal occasions',
    price: '25999',
    category: 'formal',
    gender: 'male',
    sizes: 'S,M,L,XL',
    stock_quantity: '50',
    is_featured: 'true',
    is_new: 'true',
    images: '/products/ankara-blazer-1.jpg,/products/ankara-blazer-2.jpg'
  },
  {
    name: 'Adire Maxi Dress',
    description: 'Elegant maxi dress featuring traditional Adire patterns, suitable for special events',
    price: '18999',
    category: 'traditional',
    gender: 'female',
    sizes: 'S,M,L',
    stock_quantity: '30',
    is_featured: 'true',
    is_new: 'false',
    images: '/products/adire-dress-1.jpg,/products/adire-dress-2.jpg'
  }
];

export default function BulkUpload() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const config: ParseConfig<CSVProduct> = {
        header: true,
        complete: async (results: ParseResult<CSVProduct>) => {
          try {
            const products = results.data.map(row => ({
              name: row.name,
              description: row.description,
              price: parseInt(row.price),
              category: row.category,
              gender: row.gender,
              sizes: row.sizes.split(',').map(s => s.trim()),
              stock_quantity: parseInt(row.stock_quantity),
              is_featured: row.is_featured.toLowerCase() === 'true',
              is_new: row.is_new.toLowerCase() === 'true',
              images: row.images.split(',').map(img => img.trim())
            }));

            const { error } = await supabase
              .from('products')
              .insert(products);

            if (error) throw error;

            setSuccess(`Successfully imported ${products.length} products`);
            setTimeout(() => {
              router.push('/admin/products');
            }, 2000);
          } catch (error: unknown) {
            console.error('Error processing CSV:', error);
            setError('Failed to process CSV file. Please check the format.');
          }
        }
      };

      parse(text, config);
    } catch (error: unknown) {
      console.error('File reading error:', error);
      setError('Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = unparse(sampleProducts);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ejiji_products_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-center mb-2">
            Bulk Upload Products
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Upload multiple products at once using our CSV template
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Format Instructions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Required Fields:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>name (text): Product name</li>
                  <li>description (text): Product description</li>
                  <li>price (number): Price in kobo (e.g., 25999 = ₦259.99)</li>
                  <li>category: casual, formal, traditional, or accessories</li>
                  <li>gender: male, female, or unisex</li>
                  <li>sizes: Comma-separated (e.g., "S,M,L")</li>
                  <li>stock_quantity (number): Available stock</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Optional Fields:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>is_featured (true/false): Featured product</li>
                  <li>is_new (true/false): New arrival</li>
                  <li>images: Comma-separated image URLs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleDownloadTemplate}
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Template</span>
              </button>
              <p className="text-sm text-gray-500">
                Download our sample template with example products
              </p>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Your CSV File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[rgb(200,162,84)] transition-colors duration-300">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-[rgb(200,162,84)] hover:text-[rgb(180,142,64)] focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        disabled={loading}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-6 py-2 border border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
} 