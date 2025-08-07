import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    supabaseAccessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  interface User {
    supabaseAccessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    supabaseAccessToken?: string;
    refreshToken?: string;
  }
}
