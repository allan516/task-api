import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { findAllTasks } from '../service/findAllTasks.js';

export async function findAllTasksController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const tasks = await findAllTasks(userId);

  return reply.status(200).send(tasks);
}
