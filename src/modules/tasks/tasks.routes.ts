import type { FastifyInstance } from 'fastify';

import {
  createTaskController,
  findAllTasksController,
  findTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from './tasks.controller.js';

import { authenticate } from '../../security/authenticate.js';

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', { preHandler: authenticate }, createTaskController);
  app.get('/tasks', { preHandler: authenticate }, findAllTasksController);
  app.get('/tasks/:id', { preHandler: authenticate }, findTaskByIdController);
  app.patch('/tasks/:id', { preHandler: authenticate }, updateTaskController);
  app.delete('/tasks/:id', { preHandler: authenticate }, deleteTaskController);
}
