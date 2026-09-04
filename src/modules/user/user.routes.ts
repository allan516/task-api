import type { FastifyInstance } from 'fastify';

import { createUserController } from './user.controller.js';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', createUserController);
}
