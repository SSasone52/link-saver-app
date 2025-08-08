import React from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface GoogleSignInButtonProps {
  onClick: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="w-full mt-4 flex items-center justify-center py-3 text-lg bg-[#F8F8F8] hover:bg-[#E0E0E0] text-[#212121] focus:ring-[#757575] dark:bg-[#1E1E1E] dark:hover:bg-[#2C2C2C] dark:text-[#E0E0E0]"
    >
      <Image src="/google-icon.svg" alt="Google Icon" width={24} height={24} className="mr-3" />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;