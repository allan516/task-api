import { FastifyRequest, FastifyReply } from 'fastify';
import { revokeRefreshToken } from '../service/revokeRefreshToken.js';

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refresh_token;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  reply.clearCookie('access_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  reply.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  return reply.status(204).send();
}
