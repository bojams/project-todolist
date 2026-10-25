'use client';

import { Bell, CheckCircle, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-between p-4 md:px-0 md:py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-inner">
            <CheckCircle size={18} />
          </div>
          <span className="font-bold tracking-tight text-neutral-100">Taskify</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-neutral-950" />
          </button>
          
          <Link href="/profile" title="Profile" className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors">
            <UserIcon size={20} />
          </Link>

          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign Out"
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
