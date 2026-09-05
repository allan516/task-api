import type { FastifyInstance } from 'fastify';

import { authenticate } from '../../security/authenticate.js';
import { requireAdmin } from '../../security/require-admin.js';

import { getUserController } from './controller/getUserController.js';
import { listUsersController } from './controller/listUsersController.js';
import { updateUserStatusController } from './controller/updateUserStatusController.js';
import { deleteUserController } from './controller/deleteUserController.js';

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    '/admin/users',
    {
      preHandler: [authenticate, requireAdmin],
    },
    listUsersController,
  );

  app.get(
    '/admin/users/:id',
    {
      preHandler: [authenticate, requireAdmin],
    },
    getUserController,
  );

  app.patch(
    '/admin/users/:id',
    {
      preHandler: [authenticate, requireAdmin],
    },
    updateUserStatusController,
  );

  app.delete(
    '/admin/users/:id',
    {
      preHandler: [authenticate, requireAdmin],
    },
    deleteUserController,
  );
}
