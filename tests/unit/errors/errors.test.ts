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

    expect(request.log.error).toHaveBeenCalledWith(error);

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

    expect(request.log.error).toHaveBeenCalledWith(error);

    expect(reply.status).toHaveBeenCalledWith(400);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    });
  });

  it('should return 500 for known Prisma errors', () => {
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

    expect(request.log.error).toHaveBeenCalledWith(error);

    expect(reply.status).toHaveBeenCalledWith(500);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Database error',
    });
  });

  it('should return the AppError status and message', () => {
    const error = {
      type: 'AppError',
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
      statusCode: 404,
    };

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

    expect(request.log.error).toHaveBeenCalledWith(error);

    expect(reply.status).toHaveBeenCalledWith(404);

    expect(reply.send).toHaveBeenCalledWith({
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });
  });
});
