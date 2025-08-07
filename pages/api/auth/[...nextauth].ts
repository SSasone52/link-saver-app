import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'Type', type: 'text' }, // 'login' or 'signup'
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password || !credentials?.type) {
          throw new Error('Missing credentials');
        }

        if (credentials.type === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            throw new Error(error.message);
          }
          if (data.user) {
            // Optionally insert user into your public.users table if needed
            const { error: insertError } = await supabase
              .from('users')
              .insert({ id: data.user.id, email: data.user.email });

            if (insertError) {
              // Handle error, maybe delete the Supabase auth user if public.users insert fails
              throw new Error(insertError.message);
            }
            return { id: data.user.id, email: data.user.email };
          }
        } else if (credentials.type === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            throw new Error(error.message);
          }
          if (data.user) {
            return { id: data.user.id, email: data.user.email };
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: any, user: any, account: any }) {
      if (account?.provider === 'google' && user) {
        // Check if user exists in public.users, if not, insert them
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') { // No rows found
          const { error: insertError } = await supabase
            .from('users')
            .insert({ id: user.id, email: user.email });

          if (insertError) {
            console.error('Error inserting Google user into public.users:', insertError);
          }
        }

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = user.id;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.supabaseAccessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);