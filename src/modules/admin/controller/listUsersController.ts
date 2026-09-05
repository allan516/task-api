import type { FastifyReply, FastifyRequest } from 'fastify';

import { listUsers } from '../service/listUsers.js';

export async function listUsersController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await listUsers();

  return reply.status(200).send(users);
}
