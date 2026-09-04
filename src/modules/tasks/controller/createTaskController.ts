import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { createTask } from '../service/createTask.js';
import { createTaskSchema } from '../tasks.schema.js';

export async function createTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTaskSchema.parse(request.body);

  const userId = getAuthenticatedUserId(request);

  const task = await createTask(userId, body.title);

  return reply.status(201).send(task);
}
