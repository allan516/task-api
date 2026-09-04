import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { deleteTask } from '../service/deleteTask.js';
import { taskParamsSchema } from '../tasks.schema.js';

export async function deleteTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const userId = getAuthenticatedUserId(request);

  await deleteTask(userId, id);

  return reply.status(204).send();
}
