import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterInput, registerSchema } from '../auth.schema.js';
import { registerUser } from '../service/registerUser.js';

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
