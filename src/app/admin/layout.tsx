'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminRoute from '../components/AdminRoute';
import { FaBox, FaUpload, FaUsers, FaChartBar, FaShoppingBag } from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FaChartBar },
    { name: 'Manage Products', href: '/admin/products', icon: FaBox },
    { name: 'Bulk Upload', href: '/admin/products/bulk-upload', icon: FaUpload },
    { name: 'Orders', href: '/admin/orders', icon: FaShoppingBag },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-colors duration-300 ${
                          isActive
                            ? 'bg-black text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 