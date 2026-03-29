'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-print7-primary to-print7-secondary flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-print7-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P7</span>
          </div>
          <h1 className="text-3xl font-bold text-print7-dark">Sign In</h1>
          <p className="text-gray-600 mt-2">Welcome back to Print7</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            type="submit"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mb-6">
          <Button variant="outline" size="lg" className="w-full">
            Sign in with Google
          </Button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-print7-primary hover:underline font-semibold">
              Create one
            </Link>
          </p>
          <Link href="#" className="text-print7-primary hover:underline text-sm block">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
