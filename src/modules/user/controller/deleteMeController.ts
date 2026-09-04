import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { deleteUser } from '../service/deleteUser.js';

export async function deleteMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  await deleteUser(userId);

  return reply.status(204).send();
}
