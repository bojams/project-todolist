import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'test@example.com';
  const password = await bcrypt.hash('123456', 10);
  
  await prisma.user.upsert({
    where: { email },
    update: { password },
    create: {
      email,
      name: 'Test User',
      password,
    },
  });
  console.log('Test user created/updated successfully: test@example.com / 123456');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
