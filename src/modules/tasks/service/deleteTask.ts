import { prisma } from '../../../database/prisma.js';
import { createTaskNotFoundError } from '../../../errors/task-not-found-error.js';

export async function deleteTask(userId: number, id: number) {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    throw createTaskNotFoundError();
  }

  return prisma.task.delete({
    where: {
      id,
    },
  });
}
