import { describe, expect, it, jest } from '@jest/globals';
import { errorHandler } from '../../../src/errors/error-handler.js';
import z from 'zod';
import { Prisma } from '../../../src/generated/prisma/client.js';

jest.mock('../../../src/generated/prisma/client.js', () => {
  class PrismaClientKnownRequestError extends Error {
    code: string;

    constructor(
      message: string,
      options: {
        code: string;
        clientVersion: string;
      },
    ) {
      super(message);
      this.code = options.code;
      this.name = 'PrismaClientKnownRequestError';
    }
  }

  return {
    Prisma: {
      PrismaClientKnownRequestError,
    },
  };
});

describe('errorHandler', () => {
  it('should return 500 for unknown errors', () => {
    const error = new Error('Something went wrong');

    const request = {
      log: {
        error: jest.fn(),
      },
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    errorHandler(error, request as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(500);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
  });

  it('should return 400 for validation errors', () => {
    const error = new z.ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        path: ['title'],
        message: 'Invalid input: expected string, received number',
      },
    ]);

    const request = {
      log: {
        error: jest.fn(),
      },
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    errorHandler(error, request as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(400);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    });
  });

  it('should return 404 for Prisma P2025 errors', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '7.10.0',
    });

    const request = {
      log: {
        error: jest.fn(),
      },
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    errorHandler(error, request as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(404);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Resource not found',
    });
  });

  it('should return 409 for Prisma P2002 errors', () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '7.10.0',
      },
    );

    const request = {
      log: {
        error: jest.fn(),
      },
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    errorHandler(error, request as never, reply as never);

    expect(reply.status).toHaveBeenCalledWith(409);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Resource already exists',
    });
  });
});
