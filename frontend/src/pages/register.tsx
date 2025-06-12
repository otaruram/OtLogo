import { useState } from 'react';
import Link from 'next/link';
import { GithubIcon, GumroadIcon } from '@/components/Icons';
import { signIn } from 'next-auth/react';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialRegister = async (provider: string) => {
    setIsLoading(provider);
    // signIn dari next-auth akan otomatis redirect ke halaman register jika provider belum punya akun
    await signIn(provider, { callbackUrl: '/' });
    setIsLoading(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-xl border border-gray-200 shadow-lg bg-white">
        <div className="flex flex-col items-center mb-8">
          <img src="/placeholder-logo.svg" alt="Logo" className="h-10 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Create your account</h1>
        </div>
        <button
          onClick={() => handleSocialRegister('github')}
          className="flex items-center justify-center w-full mb-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium text-base transition"
          disabled={!!isLoading}
        >
          <GithubIcon className="mr-2 h-5 w-5" /> Sign up with GitHub
        </button>
        <button
          onClick={() => handleSocialRegister('gumroad')}
          className="flex items-center justify-center w-full mb-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium text-base transition"
          disabled={!!isLoading}
        >
          <span className="mr-2">🛒</span> Sign up with Gumroad
        </button>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
