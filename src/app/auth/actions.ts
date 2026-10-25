'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface AuthData {
  email: string;
  password: string;
}

export async function register(data: AuthData) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: { email: data.email, password: hashedPassword },
  });
}
