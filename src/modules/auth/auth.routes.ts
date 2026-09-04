import type { FastifyInstance } from 'fastify';

import { registerController, loginController } from './auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController);

  app.post('/auth/login', loginController);
}
