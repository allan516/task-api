import type { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../database/prisma.js';
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

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        status: true,
      },
    });

    if (!user || user.status === 'BLOCKED') {
      return reply.status(401).send({
        message: 'Unauthorized',
      });
    }

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
