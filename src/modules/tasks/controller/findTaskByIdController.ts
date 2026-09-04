import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { findTaskById } from '../service/findTaskById.js';
import { taskParamsSchema } from '../tasks.schema.js';

export async function findTaskByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const userId = getAuthenticatedUserId(request);

  const task = await findTaskById(userId, id);

  return reply.status(200).send(task);
}
