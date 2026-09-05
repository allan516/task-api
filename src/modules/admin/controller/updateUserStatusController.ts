import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedUserId } from '../../../security/authenticate.js';

import { updateUserStatusSchema, userIdParamsSchema } from '../admin.schema.js';

import { updateUserStatus } from '../service/updateUserStatus.js';

export async function updateUserStatusController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: userId } = userIdParamsSchema.parse(request.params);

  const { status } = updateUserStatusSchema.parse(request.body);

  const authenticatedUserId = getAuthenticatedUserId(request);

  const user = await updateUserStatus({
    userId,
    authenticatedUserId,
    status,
  });

  if (!user) {
    return reply.status(404).send({
      message: 'User not found',
    });
  }

  return reply.status(200).send(user);
}
