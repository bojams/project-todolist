'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TodoSchema } from '@/lib/schema';
import { createTodo } from '@/app/actions';
import { Plus, Calendar, Paperclip } from 'lucide-react';
import { useTransition } from 'react';

export default function TodoForm() {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(TodoSchema),
    defaultValues: { title: '', deadline: '' }
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.deadline) formData.append('deadline', data.deadline);
      
      const fileInput = document.querySelector('input[name="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('file', fileInput.files[0]);
      }

      await createTodo(formData);
      reset({ title: '', deadline: '' });
      if (fileInput) fileInput.value = '';
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-2xl bg-neutral-900/80 backdrop-blur-md p-3 shadow-lg ring-1 ring-neutral-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <input 
        {...register('title')} 
        placeholder="What needs to be done?" 
        className="w-full bg-transparent px-4 py-2 outline-none placeholder:text-neutral-500 text-neutral-100 text-sm md:text-base"
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-neutral-800 pt-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Calendar size={18} className="text-neutral-500 shrink-0" />
          <input 
            {...register('deadline')} 
            type="datetime-local" 
            className="w-full bg-transparent text-neutral-300 text-xs sm:text-sm outline-none cursor-pointer [color-scheme:dark]"
          />
        </div>
        <label className="cursor-pointer text-neutral-500 hover:text-blue-400 p-2">
          <Paperclip size={18} />
          <input name="file" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*" />
        </label>
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
        >
          <Plus size={18} /> 
          <span>Add Task</span>
        </button>
      </div>
    </form>
  );
}
