import type { FastifyInstance } from 'fastify';
import { loginController } from './controller/loginController.js';
import { logoutController } from './controller/logoutController.js';
import { refreshController } from './controller/refreshController.js';
import { registerController } from './controller/registerController.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController);
  app.post('/auth/login', loginController);
  app.post('/auth/refresh', refreshController);
  app.post('/auth/logout', logoutController);
}
