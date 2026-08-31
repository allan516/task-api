import type { FastifyReply, FastifyRequest } from 'fastify';

import { z } from 'zod';

import { Prisma } from '../generated/prisma/client.js';

import { isAppError } from './app-error.js';

export function errorHandler(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  // Erros de validação
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    });
  }

  // Erros conhecidos do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return reply.status(404).send({
        message: 'Resource not found',
      });
    }

    if (error.code === 'P2002') {
      return reply.status(409).send({
        message: 'Resource already exists',
      });
    }
  }

  // Erros conhecidos da aplicação
  if (isAppError(error)) {
    if (error.code === 'TASK_NOT_FOUND') {
      return reply.status(404).send({
        message: error.message,
      });
    }
  }

  // Fallback
  return reply.status(500).send({
    message: 'Internal server error',
  });
}
