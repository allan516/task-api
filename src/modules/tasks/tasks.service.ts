import { prisma } from '../../database/prisma.js';

import { createTaskNotFoundError } from '../../errors/task-not-found-error.js';

export async function createTask(
  userId: number,
  title: string,
) {
  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
}

export async function findAllTasks(userId: number) {
  return prisma.task.findMany({
    where: {
      userId,
    },
  });
}

export async function findTaskById(
  userId: number,
  id: number,
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

  return task;
}

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

export async function deleteTask(
  userId: number,
  id: number,
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

  return prisma.task.delete({
    where: {
      id,
    },
  });
}