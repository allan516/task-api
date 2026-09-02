import { describe, expect, it, jest } from '@jest/globals';

import { prisma } from '../../../src/database/prisma.js';
import {
  createTask,
  deleteTask,
  findAllTasks,
  findTaskById,
  updateTask,
} from '../../../src/modules/tasks/tasks.service.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('createTask', () => {
  it('should create a task', async () => {
    const task = {
      id: 1,
      title: 'Comprar pão',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.create).mockResolvedValue(task);

    const result = await createTask('Comprar pão');

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: 'Comprar pão',
      },
    });

    expect(result).toEqual(task);
  });
});

describe('findAllTasks', () => {
  it('should return all tasks', async () => {
    const tasks = [
      {
        id: 1,
        title: 'Comprar pão',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Estudar Jest',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.mocked(prisma.task.findMany).mockResolvedValue(tasks);

    const result = await findAllTasks();

    expect(prisma.task.findMany).toHaveBeenCalledWith();

    expect(result).toEqual(tasks);
  });
});

describe('findTaskById', () => {
  it('should return a task by id', async () => {
    const task = {
      id: 1,
      title: 'Comprar pão',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.findUnique).mockResolvedValue(task);

    const result = await findTaskById(1);

    expect(prisma.task.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(result).toEqual(task);
  });

  it('should throw TASK_NOT_FOUND when task does not exist', async () => {
    jest.mocked(prisma.task.findUnique).mockResolvedValue(null);

    await expect(findTaskById(999)).rejects.toEqual({
      type: 'AppError',
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });
  });
});

describe('updateTask', () => {
  it('should update a task', async () => {
    const task = {
      id: 1,
      title: 'Comprar leite',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.update).mockResolvedValue(task);

    const result = await updateTask(1, {
      title: 'Comprar leite',
      completed: true,
    });

    expect(prisma.task.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        title: 'Comprar leite',
        completed: true,
      },
    });

    expect(result).toEqual(task);
  });
});

describe('deleteTask', () => {
  it('should delete a task', async () => {
    const task = {
      id: 1,
      title: 'Comprar leite',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.delete).mockResolvedValue(task);

    const result = await deleteTask(1);

    expect(prisma.task.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(result).toEqual(task);
  });
});
