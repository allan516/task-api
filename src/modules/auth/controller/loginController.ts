import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginInput, loginSchema } from '../auth.schema.js';
import { loginUser } from '../service/loginUser.js';

export async function loginController(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply,
) {
  const body = loginSchema.parse(request.body);

  const { user, token, refreshToken } = await loginUser(body);

  reply.setCookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  reply.setCookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  return reply.status(200).send(user);
}
