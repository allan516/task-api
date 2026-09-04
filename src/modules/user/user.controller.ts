import type { FastifyReply, FastifyRequest } from 'fastify';

import { createUserSchema, type CreateUserInput } from './user.schema.js';

import { createUser } from './user.service.js';

export async function createUserController(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply,
) {
  const body = createUserSchema.parse(request.body);

  const user = await createUser(body);

  return reply.status(201).send(user);
}
