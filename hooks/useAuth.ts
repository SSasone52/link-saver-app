import { useSession } from 'next-auth/react';
import { User } from '@/lib/types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const user: User | null = session?.user
    ? { id: session.user.id as string, email: session.user.email as string }
    : null;
  const isLoading = status === 'loading';

  return {
    isAuthenticated,
    user,
    isLoading,
  };
};

export default useAuth;
