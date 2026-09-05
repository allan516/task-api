import Fastify from 'fastify';
import cookie from '@fastify/cookie';

import { tasksRoutes } from './modules/tasks/tasks.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { errorHandler } from './errors/error-handler.js';
import { userRoutes } from './modules/user/user.routes.js';
import { adminRoutes } from './modules/admin/admin.route.js';

export const app = Fastify({
  logger: true,

  ajv: {
    customOptions: {
      coerceTypes: false,
    },
  },
});

app.setErrorHandler(errorHandler);

app.register(cookie);

app.register(tasksRoutes);

app.register(userRoutes);

app.register(authRoutes);

app.register(adminRoutes);
