'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email: string | null;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
  user_role: string;
  is_admin: boolean;
  total_count: number;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching users with params:', {
        page_number: currentPage,
        items_per_page: 10
      });

      // First check if user is authenticated
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication error: ' + authError.message);
      }

      if (!session) {
        throw new Error('No active session');
      }

      // Then fetch users
      const { data, error: fetchError } = await supabase
        .rpc('get_users_with_roles', {
          page_number: currentPage,
          items_per_page: 10
        });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw new Error(fetchError.message);
      }

      console.log('Users data:', data);

      if (data) {
        setUsers(data);
        if (data.length > 0) {
          setTotalPages(Math.ceil(data[0].total_count / 10));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      console.error('Error fetching users:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdminStatus(userId: string, currentRole?: string) {
    try {
      const { error: toggleError } = await supabase.rpc(
        currentRole === 'admin' ? 'remove_admin' : 'add_admin',
        { target_user_id: userId }
      );

      if (toggleError) throw toggleError;

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle admin status');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-playfair font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4">User</th>
              <th className="text-left py-4 px-4">Email</th>
              <th className="text-left py-4 px-4">Role</th>
              <th className="text-left py-4 px-4">Joined</th>
              <th className="text-left py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>{user.full_name || 'Anonymous'}</span>
                  </div>
                </td>
                <td className="py-4 px-4">{user.email}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.user_role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.user_role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.user_role || 'user'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  {user.user_role !== 'super_admin' && (
                    <button
                      onClick={() => toggleAdminStatus(user.id, user.user_role)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {user.user_role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-full disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-full disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 