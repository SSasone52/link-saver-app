import React from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import GoogleSignInButton from './GoogleSignInButton';

const AuthForm: React.FC = () => {
  const supabase = createSupabaseBrowserClient();

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border border-[#E0E0E0] dark:border-[#2C2C2C] rounded-xl shadow-2xl bg-[#FFFFFF] dark:bg-[#1E1E1E]">
      <h2 className="text-4xl font-extrabold text-center mb-8 capitalize text-[#212121] dark:text-[#E0E0E0]">
        Sign In
      </h2>
      <GoogleSignInButton onClick={handleGoogleSignIn} />
    </div>
  );
};

export default AuthForm;