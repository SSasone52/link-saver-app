import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import Layout from '@/components/common/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const supabaseClient = createSupabaseBrowserClient();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}

export default MyApp;