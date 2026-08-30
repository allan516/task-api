import type { FastifyInstance } from 'fastify';
import { prisma } from '../../database/prisma.js';

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', async (request, reply) => {
    const { title } = request.body as {
      title: string;
    };

    const task = await prisma.task.create({
      data: {
        title,
      },
    });

    return reply.status(201).send(task);
  });

  app.get('/tasks', async () => {
    const tasks = await prisma.task.findMany();

    return tasks;
  });

  app.get('/tasks/:id', async (request, reply) => {
    const { id } = request.params as {
      id: string;
    };

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return reply.status(404).send({
        message: 'Task not found',
      });
    }

    return task;
  });

  app.patch('/tasks/:id', async (request, reply) => {
    const { id } = request.params as {
      id: string;
    };

    const { title, completed } = request.body as {
      title?: string;
      completed?: boolean;
    };

    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        completed,
      },
    });

    return task;
  });

  app.delete('/tasks/:id', async (request, reply) => {
    const { id } = request.params as {
      id: string;
    };

    const task = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    return reply.status(204).send();
  });
}
