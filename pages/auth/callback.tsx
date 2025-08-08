import { useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/router';

const AuthCallback = () => {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard');
      }
    };

    handleAuthCallback();
  }, [supabase, router]);

  return <div>Loading...</div>;
};

export default AuthCallback;