import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GoogleSignInButton from './GoogleSignInButton';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      type,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border border-[#E0E0E0] dark:border-[#2C2C2C] rounded-xl shadow-2xl bg-[#FFFFFF] dark:bg-[#1E1E1E]">
      <h2 className="text-4xl font-extrabold text-center mb-8 capitalize text-[#212121] dark:text-[#E0E0E0]">
        {type}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@example.com"
            label="Email"
          />
        </div>
        <div>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
            label="Password"
          />
        </div>
        {error && <p className="text-[#DC3545] text-sm text-center">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading} size="lg">
          {loading ? 'Loading...' : type === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-[#E0E0E0] dark:border-[#2C2C2C]"></div>
        <span className="flex-shrink mx-4 text-[#757575] dark:text-[#A0A0A0]">OR</span>
        <div className="flex-grow border-t border-[#E0E0E0] dark:border-[#2C2C2C]"></div>
      </div>
      <GoogleSignInButton />
      <div className="mt-6 text-center text-base">
        {type === 'login' ? (
          <p className="text-[#212121] dark:text-[#E0E0E0]">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#007BFF] hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-[#212121] dark:text-[#E0E0E0]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#007BFF] hover:underline font-medium">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;