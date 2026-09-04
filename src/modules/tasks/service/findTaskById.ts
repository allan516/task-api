import { prisma } from '../../../database/prisma.js';
import { createTaskNotFoundError } from '../../../errors/task-not-found-error.js';

export async function findTaskById(userId: number, id: number) {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    throw createTaskNotFoundError();
  }

  return task;
}
