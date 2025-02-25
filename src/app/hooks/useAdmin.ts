import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase/client';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking admin status for user:', user.id);
        
        // Call the is_admin function using RPC
        const { data: isAdminResult, error: rpcError } = await supabase
          .rpc('is_admin', {
            user_id: user.id
          });

        if (rpcError) {
          console.error('RPC Error checking admin status:', rpcError);
          setIsAdmin(false);
        } else {
          console.log('RPC admin check result:', isAdminResult);
          setIsAdmin(!!isAdminResult);
        }
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isLoading };
} 