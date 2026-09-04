import { prisma } from '../../../database/prisma.js';

export async function findAllTasks(userId: number) {
  return prisma.task.findMany({
    where: {
      userId,
    },
  });
}
