import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>LinkSaver - Save and Summarize Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 text-[#212121] dark:text-[#E0E0E0]">
          Welcome to <span className="text-[#007BFF] dark:text-[#66B2FF]">LinkSaver!</span>
        </h1>

        <p className="mt-3 text-lg sm:text-xl lg:text-2xl text-[#757575] dark:text-[#A0A0A0] max-w-3xl mx-auto">
          Your ultimate tool to save and summarize links effortlessly. Organize, access, and understand your web content like never before.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {!session ? (
            <>
              <Button size="lg" as={Link} href="/auth/signup" className="w-full sm:w-auto">
                Get Started
              </Button>
              <Button size="lg" variant="secondary" as={Link} href="/auth/login" className="w-full sm:w-auto">
                Login
              </Button>
            </>
          ) : (
            <Button size="lg" as={Link} href="/dashboard" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}