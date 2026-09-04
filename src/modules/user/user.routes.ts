import type { FastifyInstance } from 'fastify';

import { authenticate } from '../../security/authenticate.js';
import { deleteMeController } from './controller/deleteMeController.js';
import { getMeController } from './controller/getMeController.js';
import { updateMeController } from './controller/updateMeController.js';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: authenticate }, getMeController);
  app.patch('/users/me', { preHandler: authenticate }, updateMeController);
  app.delete('/users/me', { preHandler: authenticate }, deleteMeController);
}
