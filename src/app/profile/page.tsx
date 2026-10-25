import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import Navbar from '@/components/Navbar';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-xl p-4 md:p-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        <ProfileForm user={user} />
      </main>
    </div>
  );
}
