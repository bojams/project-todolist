import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from '@/lib/db';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import Navbar from '@/components/Navbar';
import { Suspense } from 'react';

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");

  async function TodoContent() {
    const todos = await prisma.todo.findMany({ 
      where: { userId: session?.user?.id },
      orderBy: { createdAt: 'desc' } 
    });
    return <TodoList initialTodos={todos} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-xl p-4 md:p-6 pb-20">
        <TodoForm />
        <Suspense fallback={<div>Loading...</div>}>
          <TodoContent />
        </Suspense>
      </main>
    </div>
  );
}