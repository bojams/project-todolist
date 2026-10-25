'use client';

import { useState } from 'react';
import { updateTodo } from '@/app/updateAction';
import { Todo } from '@prisma/client';

export default function EditTodoModal({ todo, onClose }: { todo: Todo; onClose: () => void }) {
  const [title, setTitle] = useState(todo.title);
  
  // Perbaikan: Jangan tambahkan offset saat membaca dari DB (karena JS Date sudah menghitung offset lokal)
  // Input datetime-local mengharapkan format string lokal (YYYY-MM-DDThh:mm)
  const getLocalDateString = (date: Date) => {
    const d = new Date(date);
    // Menggunakan timezone lokal browser secara native
    const offset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [deadline, setDeadline] = useState(todo.deadline ? getLocalDateString(todo.deadline) : '');

  const handleUpdate = async () => {
    // Saat simpan, buat Date object dari string lokal
    // JS akan mengonversi string ini menjadi UTC secara otomatis di database
    const finalDate = deadline ? new Date(deadline) : null;
    
    await updateTodo(todo.id, { title, deadline: finalDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-sm border border-neutral-800 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Edit Task</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 mb-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white outline-none" />
        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-3 mb-4 rounded-xl bg-neutral-950 border border-neutral-700 text-white outline-none" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 p-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700">Cancel</button>
          <button onClick={handleUpdate} className="flex-1 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}
