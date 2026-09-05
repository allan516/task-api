import type { FastifyReply, FastifyRequest } from 'fastify';

import { userIdParamsSchema } from '../admin.schema.js';
import { getUser } from '../service/getUser.js';

export async function getUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: userId } = userIdParamsSchema.parse(request.params);

  const user = await getUser(userId);

  if (!user) {
    return reply.status(404).send({
      message: 'User not found',
    });
  }

  return reply.status(200).send(user);
}
