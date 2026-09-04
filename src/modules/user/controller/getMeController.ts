import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { findUserById } from '../service/findUserById.js';

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const user = await findUserById(userId);

  return reply.status(200).send(user);
}
