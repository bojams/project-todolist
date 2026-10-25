'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { toggleTodo, deleteTodo } from '@/app/actions';
import { Todo } from '@prisma/client';
import { Trash2, CheckCircle2, Circle, Calendar, FileText, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import EditTodoModal from './EditTodoModal';

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTodo(id, completed);
  };

  const formatDeadline = (deadline: Date) => {
    return new Date(deadline).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (initialTodos.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
        <p className="text-sm">No tasks yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {initialTodos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-4 shadow-sm transition-all hover:border-neutral-700 hover:bg-neutral-900"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => handleToggle(todo.id, !todo.completed)}
                  className="text-neutral-500 transition-colors hover:text-blue-500 shrink-0"
                >
                  {todo.completed ? <CheckCircle2 className="text-blue-500" /> : <Circle />}
                </button>
                <div className="flex flex-col min-w-0">
                  <span 
                    className={`text-sm font-medium truncate ${todo.completed ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}
                  >
                    {todo.title}
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    {todo.deadline && (
                      <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {/* Render kosong saat server (hydration) agar sinkron, update saat client mounted */}
                        {mounted ? formatDeadline(new Date(todo.deadline)) : ''}
                      </span>
                    )}
                    {todo.attachment && (
                      <a href={todo.attachment} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 flex items-center gap-1 hover:underline">
                        <FileText size={10} /> Attachment
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setEditingTodo(todo)}
                  className="text-neutral-500 hover:text-blue-400 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(todo.id)} 
                  className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {editingTodo && (
        <EditTodoModal todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}
    </>
  );
}
