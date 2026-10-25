'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/auth/register-action';
import { Plus, Calendar, CheckCircle, Lock, Shield } from 'lucide-react';

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await registerUser({
        name,
        email,
        password,
        confirmPassword,
      });

      if (result.success) {
        setSuccess('Akun berhasil dibuat! Silakan login.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Terjadi kesalahan saat registrasi');
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Daftar Akun Baru</h2>
        
        {error && (
          <p className="text-red-500 mb-4 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mb-4 text-sm">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              name="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Konfirmasi Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full p-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition disabled:opacity-50">
            <Plus size={18} /> Daftar Sekarang
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-500 text-center">
          Sudah punya akun? <a href="/login" className="font-medium text-blue-500 hover:underline">Login di sini</a>
        </p>
      </div>
    </div>
  );
}