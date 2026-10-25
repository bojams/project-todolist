'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import path from 'path';

// Fungsi khusus mengirim DM ke User Discord berdasarkan ID mereka
async function sendDiscordDM(discordId: string, message: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || !discordId) return;

  try {
    // 1. Buka jalur DM (Create DM Channel)
    const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_id: discordId.trim() }),
    });

    if (!dmRes.ok) {
      console.error('Gagal membuka DM Discord:', await dmRes.text());
      return;
    }

    const dmChannel = await dmRes.json();

    // 2. Kirim pesan ke channel DM tersebut
    await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
  } catch (e) {
    console.error('Failed to send Discord DM:', e);
  }
}

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string;
  const deadlineStr = formData.get('deadline') as string;
  const file = formData.get('file') as File | null;

  let attachmentPath = null;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    attachmentPath = `/uploads/${filename}`;
    await writeFile(path.join(process.cwd(), 'public/uploads', filename), buffer);
  }

  let deadlineDate = null;
  if (deadlineStr) {
    const localDate = new Date(deadlineStr);
    deadlineDate = new Date(localDate.getTime() - (8 * 60 * 60 * 1000));
  }

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'default@user.com', name: 'Default User', password: '' },
    });
  }

  const todo = await prisma.todo.create({ 
    data: {
      title,
      deadline: deadlineDate,
      attachment: attachmentPath,
      userId: user.id,
    }
  });

  const deadlineText = deadlineDate 
    ? ` pada ${new Date(deadlineDate.getTime() + (8 * 60 * 60 * 1000)).toLocaleString('id-ID', { hour12: false })} WITA` 
    : ' tanpa deadline';
    
  const msg = `✅ **Tugas Baru Ditambahkan!**\n> **${todo.title}**\nBatas Pengumpulan:${deadlineText}`;
  
  if (user.discordId) {
    await sendDiscordDM(user.discordId, msg);
  }
  
  revalidatePath('/');
  return todo;
}

export async function toggleTodo(id: string, completed: boolean) {
  const todo = await prisma.todo.update({
    where: { id },
    data: { completed },
    include: { user: true },
  });
  
  const msg = `🔄 **Status Tugas Berubah!**\nTugas **"${todo.title}"** sekarang ${completed ? '✅ Selesai' : '⏳ Belum Selesai'}`;
  if (todo.user?.discordId) {
    await sendDiscordDM(todo.user.discordId, msg);
  }
  
  revalidatePath('/');
  return todo;
}

export async function deleteTodo(id: string) {
  const todo = await prisma.todo.findUnique({ 
    where: { id },
    include: { user: true }
  });
  
  await prisma.todo.delete({ where: { id } });
  
  if (todo?.user?.discordId) {
    const msg = `🗑️ **Tugas Dihapus!**\nTugas **"${todo.title}"** telah dihapus dari daftar.`;
    await sendDiscordDM(todo.user.discordId, msg);
  }

  revalidatePath('/');
}
