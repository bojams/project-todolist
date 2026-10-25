'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (res?.error) setError('Invalid email or password');
    else router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-sm p-8 bg-neutral-900 rounded-2xl border border-neutral-800">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white" />
          <input name="password" type="password" placeholder="Password" required className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white" />
          <button type="submit" className="w-full p-3 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-500">Login</button>
        </form>
        <p className="mt-6 text-sm text-neutral-500 text-center">
          Belum punya akun? <a href="/register" className="font-medium text-blue-500 hover:underline">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
}
