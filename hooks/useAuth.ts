import { useSession } from '@supabase/auth-helpers-react';
import { User } from '@/lib/types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const useAuth = (): UseAuthReturn => {
  const session = useSession();

  const isAuthenticated = !!session;
  const user: User | null = session?.user
    ? { id: session.user.id, email: session.user.email || '' }
    : null;
  const isLoading = !session;

  return {
    isAuthenticated,
    user,
    isLoading,
  };
};

export default useAuth;