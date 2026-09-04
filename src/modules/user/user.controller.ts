import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedUserId } from '../../security/authenticate.js';
import { findUserById } from './user.service.js';

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const user = await findUserById(userId);

  return reply.status(200).send(user);
}
