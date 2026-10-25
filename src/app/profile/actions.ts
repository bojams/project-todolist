'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function updateProfile(data: { name?: string; discordId?: string; password?: string }) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.discordId) updateData.discordId = data.discordId;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  return await prisma.user.update({
    where: { email: session.user.email },
    data: updateData,
  });
}
