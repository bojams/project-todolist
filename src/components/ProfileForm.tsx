'use client';

import { useState, useTransition } from 'react';
import { updateProfile } from '@/app/profile/actions';
import { testDiscordNotification } from '@/app/profile/discordTest';
import { Send } from 'lucide-react';

export default function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const discordId = formData.get('discordId') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    startTransition(async () => {
      try {
        await updateProfile({ name, discordId, password: password || undefined });
        setMessage('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile');
      }
    });
  };

  const handleTestDiscord = () => {
    setTestResult('Mengirim pesan test ke Discord...');
    startTransition(async () => {
      const res = await testDiscordNotification();
      if (res.success) {
        setTestResult(res.message || 'Berhasil!');
      } else {
        setTestResult(`Gagal: ${res.error}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Email (Read-only)</label>
          <input type="email" disabled value={user?.email || ''} className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-500 text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Name</label>
          <input name="name" defaultValue={user?.name || ''} className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Discord User ID (Wajib berupa Angka ID, bukan tag)</label>
          <input 
            name="discordId" 
            defaultValue={user?.discordId || ''} 
            placeholder="Contoh: 314159265358979323" 
            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm" 
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Cara ambil: Aktifkan <b>Developer Mode</b> di Discord Settings {'>'} Advanced, lalu klik kanan profil akun Anda {'>'} pilih <b>Copy User ID</b>.
          </p>
        </div>

        <hr className="border-neutral-800 my-4" />

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">New Password (leave blank to keep current)</label>
          <input name="password" type="password" placeholder="••••••••" className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Confirm New Password</label>
          <input name="confirmPassword" type="password" placeholder="••••••••" className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm" />
        </div>

        <button type="submit" disabled={isPending} className="w-full p-3 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-500 disabled:opacity-50 transition">
          Save Changes
        </button>
      </form>

      {/* Card Uji Notifikasi Discord */}
      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-3">
        <h3 className="text-sm font-semibold text-white">Test Notifikasi Discord DM</h3>
        <p className="text-xs text-neutral-400">
          Pastikan Anda sudah menyimpan <b>Discord User ID</b> di atas dan bot berada di server yang sama dengan akun Anda (atau DM terbuka).
        </p>
        <button 
          onClick={handleTestDiscord}
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white text-sm font-medium transition"
        >
          <Send size={16} /> Test Kirim Pesan DM Discord
        </button>
        {testResult && (
          <p className={`text-xs mt-2 ${testResult.startsWith('Gagal') ? 'text-red-400' : 'text-green-400'}`}>
            {testResult}
          </p>
        )}
      </div>
    </div>
  );
}
