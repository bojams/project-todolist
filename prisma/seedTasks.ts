import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function seedTestTasks() {
  // 1. Pastikan user ada
  const user = await prisma.user.findFirst({ where: { email: 'test@example.com' } });
  if (!user) {
    console.log('User tidak ditemukan, jalankan seed.ts dulu!');
    return;
  }

  // 2. Waktu sekarang (UTC)
  const now = new Date();
  
  // 3. Buat tugas jatuh tempo 10 menit dari sekarang (untuk tes reminder)
  const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
  
  // 4. Buat tugas jatuh tempo 1 menit lalu (untuk tes overdue)
  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);

  await prisma.todo.createMany({
    data: [
      {
        title: 'Tugas Tes: Reminder (10 menit lagi)',
        deadline: tenMinutesLater,
        userId: user.id,
        completed: false
      },
      {
        title: 'Tugas Tes: Overdue (sudah lewat)',
        deadline: oneMinuteAgo,
        userId: user.id,
        completed: false
      }
    ]
  });

  console.log('Data tes berhasil dibuat!');
}

seedTestTasks()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
