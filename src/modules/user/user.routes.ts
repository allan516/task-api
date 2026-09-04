import type { FastifyInstance } from 'fastify';

import { authenticate } from '../../security/authenticate.js';
import { getMeController } from './user.controller.js';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: authenticate }, getMeController);
}
