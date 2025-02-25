'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FaUsers, FaBox, FaShoppingBag, FaDollarSign } from 'react-icons/fa';

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('admin_dashboard_stats')
          .select('*')
          .single();

        if (error) throw error;
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats?.total_products || 0,
      icon: FaBox,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: FaShoppingBag,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format((stats?.total_revenue || 0) / 100),
      icon: FaDollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-playfair font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
          >
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add more sections like recent orders, top products, etc. */}
    </div>
  );
} 