'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateTodo(id: string, data: { title: string; deadline?: Date | null }) {
  await prisma.todo.update({
    where: { id },
    data: {
      title: data.title,
      // Date object sudah otomatis dikonversi ke UTC oleh Prisma
      deadline: data.deadline,
    },
  });
  revalidatePath('/');
}
