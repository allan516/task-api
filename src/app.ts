import Fastify from 'fastify';
import { prisma } from './database/prisma.js';
import { tasksRoutes } from './modules/tasks/tasks.routes.js';

export const app = Fastify({
  logger: true,
});

app.get('/health', async () => {
  await prisma.$queryRaw`SELECT 1`;

  return {
    status: 'ok',
    database: 'connected',
  };
});

app.register(tasksRoutes);
