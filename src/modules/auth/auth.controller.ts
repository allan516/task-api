import type { FastifyReply, FastifyRequest } from 'fastify';

import { registerSchema, loginSchema } from './auth.schema.js';

import type { RegisterInput, LoginInput } from './auth.schema.js';

import { registerUser, loginUser } from './auth.service.js';

export async function registerController(
  request: FastifyRequest<{
    Body: RegisterInput;
  }>,
  reply: FastifyReply,
) {
  const body = registerSchema.parse(request.body);

  const user = await registerUser(body);

  return reply.status(201).send(user);
}

export async function loginController(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply,
) {
  const body = loginSchema.parse(request.body);

  const user = await loginUser(body);

  return reply.status(200).send(user);
}
