import { prisma } from '../../../database/prisma.js';

export async function createTask(userId: number, title: string) {
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
}
