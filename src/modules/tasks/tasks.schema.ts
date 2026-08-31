import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1),
});

export const taskParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: 'At least one field must be provided',
  });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type TaskParams = z.infer<typeof taskParamsSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
