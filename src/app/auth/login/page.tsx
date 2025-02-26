'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, loginWithSocial } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      router.push(redirectTo);
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithSocial('google');
    } catch (err) {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-playfair font-bold text-center mb-8">
        Welcome Back
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(200,162,84)]"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-300"
          >
            <FaGoogle className="w-5 h-5 mr-2" />
            Google
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/register"
          className="text-[rgb(200,162,84)] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
} 