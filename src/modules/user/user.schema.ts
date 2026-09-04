import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const updateMeSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    currentPassword: z.string().optional(),
    password: z.string().min(8).optional(),
  })
  .refine(
    (data) => data.password === undefined || data.currentPassword !== undefined,
    {
      message: 'Current password is required',
      path: ['currentPassword'],
    },
  )
  .refine(
    (data) => data.currentPassword === undefined || data.password !== undefined,
    {
      message: 'Password is required',
      path: ['password'],
    },
  );

export type UpdateMeInput = z.infer<typeof updateMeSchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;
