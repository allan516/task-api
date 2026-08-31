import type { FastifyInstance } from 'fastify';

import {
  createTaskController,
  findAllTasksController,
  findTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from './tasks.controller.js';

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', createTaskController);

  app.get('/tasks', findAllTasksController);

  app.get('/tasks/:id', findTaskByIdController);

  app.patch('/tasks/:id', updateTaskController);

  app.delete('/tasks/:id', deleteTaskController);
}
