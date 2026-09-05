import type { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../database/prisma.js';
import { getAuthenticatedUserId } from './authenticate.js';

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user || user.role !== 'ADMIN') {
    return reply.status(403).send({
      message: 'Forbidden',
    });
  }
}
