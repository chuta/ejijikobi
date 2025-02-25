'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-playfair text-2xl font-bold">EJIJI KOBI</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/collections" 
                className="hover:text-[rgb(200,162,84)] px-3 py-2 text-sm font-medium"
              >
                Collections
              </Link>
              <Link 
                href="/about" 
                className="hover:text-[rgb(200,162,84)] px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-[rgb(200,162,84)] px-3 py-2 text-sm font-medium"
              >
                Contact
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center space-x-1 hover:text-[rgb(200,162,84)] px-3 py-2 text-sm font-medium ${
                        isActive('/dashboard') || isActive('/admin/products') || isActive('/admin/products/bulk-upload')
                          ? 'text-[rgb(200,162,84)]'
                          : ''
                      }`}
                    >
                      <span>Dashboard</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                        <Link
                          href="/dashboard"
                          className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                            isActive('/dashboard') ? 'text-[rgb(200,162,84)]' : ''
                          }`}
                        >
                          Overview
                        </Link>
                        <Link
                          href="/admin/products"
                          className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                            isActive('/admin/products') ? 'text-[rgb(200,162,84)]' : ''
                          }`}
                        >
                          Manage Products
                        </Link>
                        <Link
                          href="/admin/products/bulk-upload"
                          className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                            isActive('/admin/products/bulk-upload') ? 'text-[rgb(200,162,84)]' : ''
                          }`}
                        >
                          Bulk Upload
                        </Link>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => logout()}
                    className="hover:text-[rgb(200,162,84)] px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/auth/login" 
                    className="hover:text-[rgb(200,162,84)] px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-[rgb(200,162,84)] transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 