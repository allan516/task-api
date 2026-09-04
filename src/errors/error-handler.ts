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

  // Erros conhecidos do banco de dados
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return reply.status(500).send({
      message: 'Database error',
    });
  }

  // Erros conhecidos da aplicação
  if (isAppError(error)) {
    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
    });
  }

  // Fallback
  return reply.status(500).send({
    message: 'Internal server error',
  });
}