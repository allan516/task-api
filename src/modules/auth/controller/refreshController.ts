import { FastifyRequest, FastifyReply } from 'fastify';
import { refreshAccessToken } from '../service/refreshAccessToken.js';

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refresh_token;

  if (!refreshToken) {
    return reply.status(401).send({
      message: 'Unauthorized',
    });
  }

  const token = await refreshAccessToken(refreshToken);

  reply.setCookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  return reply.status(200).send({
    message: 'Access token refreshed',
  });
}
