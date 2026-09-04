import type { FastifyInstance } from 'fastify';

import { authenticate } from '../../security/authenticate.js';

import {
  deleteMeController,
  getMeController,
  updateMeController,
} from './user.controller.js';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: authenticate }, getMeController);
  app.patch('/users/me', { preHandler: authenticate }, updateMeController);
  app.delete('/users/me', { preHandler: authenticate }, deleteMeController);
}
