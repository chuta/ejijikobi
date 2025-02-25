'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase/client';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Address {
  id: string;
  full_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    full_name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nigeria',
    phone: '',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (fetchError) throw fetchError;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingAddress) {
        // Update existing address
        const { error: updateError } = await supabase
          .from('addresses')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id);

        if (updateError) throw updateError;
      } else {
        // Create new address
        const { error: insertError } = await supabase
          .from('addresses')
          .insert({
            ...formData,
            user_id: user?.id,
          });

        if (insertError) throw insertError;
      }

      // Refresh addresses list
      await fetchAddresses();
      resetForm();
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (deleteError) throw deleteError;
      await fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Nigeria',
      phone: '',
      is_default: false,
    });
    setEditingAddress(null);
    setIsAddingNew(false);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">My Addresses</h1>
        {!isAddingNew && !editingAddress && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {(isAddingNew || editingAddress) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-playfair font-bold mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                  className="rounded text-[rgb(200,162,84)] focus:ring-[rgb(200,162,84)]"
                />
                <span className="text-sm text-gray-700">
                  Set as default address
                </span>
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-full hover:border-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">
                  {address.full_name}
                  {address.is_default && (
                    <span className="ml-2 text-sm text-[rgb(200,162,84)]">
                      (Default)
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{address.phone}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingAddress(address);
                    setFormData(address);
                    setIsAddingNew(false);
                  }}
                  className="p-2 text-gray-500 hover:text-[rgb(200,162,84)]"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 text-gray-500 hover:text-red-500"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-gray-600">
              <p>{address.address}</p>
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {addresses.length === 0 && !isAddingNew && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No addresses saved yet.</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Your First Address</span>
          </button>
        </div>
      )}
    </div>
  );
} 