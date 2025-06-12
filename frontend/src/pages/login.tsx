// pages/login.tsx (VERSI BARU YANG DIPERBAIKI)

import { useState } from 'react';
import Link from 'next/link';
import { GoogleIcon, GithubIcon } from '@/components/Icons';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: '/' });
    setIsLoading(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-xl border border-gray-200 shadow-lg bg-white">
        <div className="flex flex-col items-center mb-8">
          <img src="/placeholder-logo.svg" alt="Logo" className="h-10 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Log in to your account</h1>
        </div>
        <button
          onClick={() => handleSocialLogin('github')}
          className="flex items-center justify-center w-full mb-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium text-base transition"
          disabled={!!isLoading}
        >
          <GithubIcon className="mr-2 h-5 w-5" /> Continue with GitHub
        </button>
        <button
          onClick={() => handleSocialLogin('gumroad')}
          className="flex items-center justify-center w-full mb-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium text-base transition"
          disabled={!!isLoading}
        >
          <span className="mr-2">🛒</span> Continue with Gumroad
        </button>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;