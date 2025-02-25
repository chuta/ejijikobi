'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/config';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      // Get the ?redirectTo query param from the URL
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirectTo') || '/';

      if (error) {
        console.error('Error during auth callback:', error);
        router.push('/auth/login');
        return;
      }

      // Redirect to the intended destination or home page
      router.push(redirectTo);
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
    </div>
  );
} 