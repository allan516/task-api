import { z } from 'zod';

export const userIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'BLOCKED']),
});

export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
