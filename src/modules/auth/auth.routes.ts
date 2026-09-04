import type { FastifyInstance } from 'fastify';

import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from './auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController);
  app.post('/auth/login', loginController);
  app.post('/auth/refresh', refreshController);
  app.post('/auth/logout', logoutController);
}
