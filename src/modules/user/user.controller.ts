import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedUserId } from '../../security/authenticate.js';

import { deleteUser, findUserById, updateMe } from './user.service.js';

import { updateMeSchema } from './user.schema.js';

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const user = await findUserById(userId);

  return reply.status(200).send(user);
}

export async function updateMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const body = updateMeSchema.parse(request.body);

  const user = await updateMe(userId, body);

  return reply.status(200).send(user);
}

export async function deleteMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  await deleteUser(userId);

  return reply.status(204).send();
}
