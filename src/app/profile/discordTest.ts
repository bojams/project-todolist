'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function testDiscordNotification() {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.discordId) throw new Error('Discord ID/Username belum diatur di profile');

  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('DISCORD_BOT_TOKEN belum diatur di file .env');

  try {
    // 1. Buat DM channel dengan user
    const cleanId = user.discordId.trim();
    if (!/^\d+$/.test(cleanId)) {
      throw new Error('Discord ID harus berupa deretan angka saja. Jangan gunakan username atau tag.');
    }

    const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_id: cleanId }),
    });

    const dmChannel = await dmRes.json();
    if (!dmRes.ok) {
      throw new Error(`Gagal membuka DM: ${dmChannel.message || 'Pastikan Discord ID valid (berupa angka ID, bukan tag username)'}`);
    }

    // 2. Kirim pesan ke channel DM tersebut
    const msgRes = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `🔔 **Test Notifikasi Discord!**\nHalo ${user.name || 'User'}, bot berhasil terhubung dan siap mengirimkan pengingat deadline tugas Anda.`,
      }),
    });

    if (!msgRes.ok) {
      const errData = await msgRes.json();
      throw new Error(`Gagal kirim pesan: ${errData.message}`);
    }

    return { success: true, message: 'Pesan test berhasil dikirim ke DM Discord Anda!' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
