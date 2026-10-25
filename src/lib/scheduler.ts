import cron from 'node-cron';
import { prisma } from '@/lib/db';

// Tambahkan definisi global untuk cronInitialized
declare global {
  var cronInitialized: boolean | undefined;
}

async function sendDiscordDM(discordId: string, message: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || !discordId || discordId === 'default') {
    console.log('Skipping Discord DM: Token atau Discord ID belum valid.');
    return;
  }

  try {
    const cleanId = discordId.trim();
    console.log(`Mencoba membuka jalur DM ke User ID: ${cleanId}`);

    const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_id: cleanId }),
    });

    if (!dmRes.ok) {
      const errText = await dmRes.text();
      console.error(`Gagal buka DM Discord (${dmRes.status}):`, errText);
      return;
    }

    const dmChannel = await dmRes.json();

    const msgRes = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });

    if (msgRes.ok) {
      console.log(`Berhasil mengirim DM Discord ke ID: ${cleanId}`);
    } else {
      console.error(`Gagal mengirim pesan DM (${msgRes.status}):`, await msgRes.text());
    }
  } catch (e) {
    console.error('Exception saat mengirim Discord DM:', e);
  }
}

async function checkDeadlines() {
  console.log('--- [Cron Job] Memeriksa deadline tugas ---');
  const now = new Date();
  
  const todos = await prisma.todo.findMany({
    where: { completed: false, deadline: { not: null } },
    include: { user: true }
  });

  for (const todo of todos) {
    if (!todo.deadline) continue;
    
    const diffMs = todo.deadline.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffMinutes = diffMs / (1000 * 60);

    console.log(`[Task: "${todo.title}"] Sisa waktu: ${diffMinutes.toFixed(1)} menit`);

    // 1. Reminder Harian: 24 jam sebelum
    if (diffHours >= 23.9 && diffHours <= 24.1) {
      const msg = `📅 **Pengingat Harian:** Tugas "${todo.title}" tersisa 24 jam lagi!`;
      if (todo.user?.discordId) await sendDiscordDM(todo.user.discordId, msg);
    }
    // 2. Reminder Setiap 1 Jam (jika < 24 jam)
    else if (diffHours > 0 && diffHours < 24 && Math.abs(diffMinutes % 60) < 1) {
      const msg = `⏳ **Pengingat Mendesak:** Tugas "${todo.title}" tersisa ${Math.round(diffHours)} jam lagi!`;
      if (todo.user?.discordId) await sendDiscordDM(todo.user.discordId, msg);
    }
    // 3. Jatuh Tempo
    else if (diffMinutes <= 0 && diffMinutes > -1) {
      const msg = `⚠️ **Jatuh Tempo!** Tugas "${todo.title}" sudah lewat waktu!`;
      if (todo.user?.discordId) await sendDiscordDM(todo.user.discordId, msg);
    }
  }
}

if (!global.cronInitialized) {
  cron.schedule('* * * * *', checkDeadlines);
  global.cronInitialized = true;
  console.log('--- [Scheduler] Cron job terdaftar dan aktif ---');
}
