import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { updateMe } from '../service/updateMe.js';
import { updateMeSchema } from '../user.schema.js';

export async function updateMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const body = updateMeSchema.parse(request.body);

  const user = await updateMe(userId, body);

  return reply.status(200).send(user);
}
