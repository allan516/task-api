import Fastify from 'fastify';

import { tasksRoutes } from './modules/tasks/tasks.routes.js';
import { errorHandler } from './errors/error-handler.js';

export const app = Fastify({
  logger: true,

  ajv: {
    customOptions: {
      coerceTypes: false,
    },
  },
});

app.setErrorHandler(errorHandler);

app.register(tasksRoutes);
