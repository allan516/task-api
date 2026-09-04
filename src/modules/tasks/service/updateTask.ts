import { prisma } from '../../../database/prisma.js';
import { createTaskNotFoundError } from '../../../errors/task-not-found-error.js';

export async function updateTask(
  userId: number,
  id: number,
  data: {
    title?: string;
    completed?: boolean;
  },
) {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    throw createTaskNotFoundError();
  }

  return prisma.task.update({
    where: {
      id,
    },
    data,
  });
}
