import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedUserId } from '../../../security/authenticate.js';

import { userIdParamsSchema } from '../admin.schema.js';
import { deleteUser } from '../service/deleteUser.js';

export async function deleteUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: userId } = userIdParamsSchema.parse(request.params);

  const authenticatedUserId = getAuthenticatedUserId(request);

  const user = await deleteUser({
    userId,
    authenticatedUserId,
  });

  if (!user) {
    return reply.status(404).send({
      message: 'User not found',
    });
  }

  return reply.status(204).send();
}
