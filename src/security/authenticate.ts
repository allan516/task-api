import type { FastifyReply, FastifyRequest } from 'fastify';

import { verifyToken } from './jwt.js';

const authenticatedUsers = new WeakMap<FastifyRequest, number>();

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.access_token;

  if (!token) {
    return reply.status(401).send({
      message: 'Unauthorized',
    });
  }

  try {
    const payload = verifyToken(token);

    const userId = Number(payload.sub);

    authenticatedUsers.set(request, userId);
  } catch {
    return reply.status(401).send({
      message: 'Unauthorized',
    });
  }
}

export function getAuthenticatedUserId(request: FastifyRequest) {
  const userId = authenticatedUsers.get(request);

  if (!userId) {
    throw new Error('Authenticated user not found');
  }

  return userId;
}
