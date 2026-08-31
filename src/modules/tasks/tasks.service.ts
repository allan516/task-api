import { prisma } from '../../database/prisma.js';

import { createTaskNotFoundError } from '../../errors/task-not-found-error.js';

export async function createTask(title: string) {
  return prisma.task.create({
    data: {
      title,
    },
  });
}

export async function findAllTasks() {
  return prisma.task.findMany();
}

export async function findTaskById(id: number) {
  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    throw createTaskNotFoundError();
  }

  return task;
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    completed?: boolean;
  },
) {
  return prisma.task.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({
    where: {
      id,
    },
  });
}
