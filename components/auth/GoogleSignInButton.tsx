import React from 'react';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';

import Image from 'next/image';

const GoogleSignInButton: React.FC = () => {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full mt-4 flex items-center justify-center py-3 text-lg bg-[#F8F8F8] hover:bg-[#E0E0E0] text-[#212121] focus:ring-[#757575] dark:bg-[#1E1E1E] dark:hover:bg-[#2C2C2C] dark:text-[#E0E0E0]"
    >
      <Image src="/google-icon.svg" alt="Google Icon" width={24} height={24} className="mr-3" />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;