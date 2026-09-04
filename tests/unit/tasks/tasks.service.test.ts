import { beforeEach, describe, expect, it, jest } from '@jest/globals';

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
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createTask', () => {
  it('should create a task', async () => {
    const task = {
      id: 1,
      title: 'Comprar pão',
      completed: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.create).mockResolvedValue(task);

    const result = await createTask(1, 'Comprar pão');

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: 'Comprar pão',
        userId: 1,
      },
    });

    expect(result).toEqual(task);
  });
});

describe('findAllTasks', () => {
  it('should return all tasks from the user', async () => {
    const tasks = [
      {
        id: 1,
        title: 'Comprar pão',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Estudar Jest',
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.mocked(prisma.task.findMany).mockResolvedValue(tasks);

    const result = await findAllTasks(1);

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId: 1,
      },
    });

    expect(result).toEqual(tasks);
  });
});

describe('findTaskById', () => {
  it('should return a task by id belonging to the user', async () => {
    const task = {
      id: 1,
      title: 'Comprar pão',
      completed: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.findFirst).mockResolvedValue(task);

    const result = await findTaskById(1, 1);

    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        userId: 1,
      },
    });

    expect(result).toEqual(task);
  });

  it('should throw TASK_NOT_FOUND when task does not exist', async () => {
    jest.mocked(prisma.task.findFirst).mockResolvedValue(null);

    await expect(findTaskById(1, 999)).rejects.toEqual({
      type: 'AppError',
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });
  });
});

describe('updateTask', () => {
  it('should update a task belonging to the user', async () => {
    const existingTask = {
      id: 1,
      title: 'Comprar pão',
      completed: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask = {
      id: 1,
      title: 'Comprar leite',
      completed: true,
      userId: 1,
      createdAt: existingTask.createdAt,
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.findFirst).mockResolvedValue(existingTask);

    jest.mocked(prisma.task.update).mockResolvedValue(updatedTask);

    const result = await updateTask(1, 1, {
      title: 'Comprar leite',
      completed: true,
    });

    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        userId: 1,
      },
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

    expect(result).toEqual(updatedTask);
  });

  it('should throw TASK_NOT_FOUND when task does not belong to the user', async () => {
    jest.mocked(prisma.task.findFirst).mockResolvedValue(null);

    await expect(
      updateTask(2, 1, {
        title: 'Comprar leite',
        completed: true,
      }),
    ).rejects.toEqual({
      type: 'AppError',
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });

    expect(prisma.task.update).not.toHaveBeenCalled();
  });
});

describe('deleteTask', () => {
  it('should delete a task belonging to the user', async () => {
    const task = {
      id: 1,
      title: 'Comprar leite',
      completed: true,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.task.findFirst).mockResolvedValue(task);

    jest.mocked(prisma.task.delete).mockResolvedValue(task);

    const result = await deleteTask(1, 1);

    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: 1,
        userId: 1,
      },
    });

    expect(prisma.task.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });

    expect(result).toEqual(task);
  });

  it('should throw TASK_NOT_FOUND when task does not belong to the user', async () => {
    jest.mocked(prisma.task.findFirst).mockResolvedValue(null);

    await expect(deleteTask(2, 1)).rejects.toEqual({
      type: 'AppError',
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });

    expect(prisma.task.delete).not.toHaveBeenCalled();
  });
});
