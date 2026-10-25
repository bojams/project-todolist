import { z } from 'zod';

export const TodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  // Biarkan deadline sebagai string, jangan transform ke Date di sini
  deadline: z.string().optional().nullable(),
});
