import type { FastifyInstance } from 'fastify';

import { authenticate } from '../../security/authenticate.js';
import { createTaskController } from './controller/createTaskController.js';
import { deleteTaskController } from './controller/deleteTaskController.js';
import { findAllTasksController } from './controller/findAllTasksController.js';
import { findTaskByIdController } from './controller/findTaskByIdController.js';
import { updateTaskController } from './controller/updateTaskController.js';

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/tasks', { preHandler: authenticate }, createTaskController);
  app.get('/tasks', { preHandler: authenticate }, findAllTasksController);
  app.get('/tasks/:id', { preHandler: authenticate }, findTaskByIdController);
  app.patch('/tasks/:id', { preHandler: authenticate }, updateTaskController);
  app.delete('/tasks/:id', { preHandler: authenticate }, deleteTaskController);
}
