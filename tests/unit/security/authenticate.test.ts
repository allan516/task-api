import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../../../src/database/prisma.js';

import {
  authenticate,
  getAuthenticatedUserId,
} from '../../../src/security/authenticate.js';

import { verifyToken } from '../../../src/security/jwt.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../../src/security/jwt.js', () => ({
  verifyToken: jest.fn(),
}));

describe('authenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createRequest(token?: string) {
    return {
      cookies: token
        ? {
            access_token: token,
          }
        : {},
    } as unknown as FastifyRequest;
  }

  function createReply() {
    const reply = {
      status: jest.fn(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    jest.mocked(reply.status).mockReturnValue(reply);
    jest.mocked(reply.send).mockReturnValue(reply);

    return reply;
  }

  it('should return 401 when access token is missing', async () => {
    const request = createRequest();
    const reply = createReply();

    await authenticate(request, reply);

    expect(reply.status).toHaveBeenCalledWith(401);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Unauthorized',
    });

    expect(verifyToken).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('should return 401 when access token is invalid', async () => {
    const request = createRequest('invalid-token');
    const reply = createReply();

    jest.mocked(verifyToken).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authenticate(request, reply);

    expect(verifyToken).toHaveBeenCalledWith('invalid-token');

    expect(reply.status).toHaveBeenCalledWith(401);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Unauthorized',
    });

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('should return 401 when the authenticated user does not exist', async () => {
    const request = createRequest('valid-token');
    const reply = createReply();

    jest.mocked(verifyToken).mockReturnValue({
      sub: '999',
    } as never);

    jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await authenticate(request, reply);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 999,
      },
      select: {
        status: true,
      },
    });

    expect(reply.status).toHaveBeenCalledWith(401);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Unauthorized',
    });
  });

  it('should return 401 when the authenticated user is blocked', async () => {
    const request = createRequest('valid-token');
    const reply = createReply();

    jest.mocked(verifyToken).mockReturnValue({
      sub: '1',
    } as never);

    jest.mocked(prisma.user.findUnique).mockResolvedValue({
      status: 'BLOCKED',
    } as never);

    await authenticate(request, reply);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      select: {
        status: true,
      },
    });

    expect(reply.status).toHaveBeenCalledWith(401);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Unauthorized',
    });
  });

  it('should authenticate an active user', async () => {
    const request = createRequest('valid-token');
    const reply = createReply();

    jest.mocked(verifyToken).mockReturnValue({
      sub: '1',
    } as never);

    jest.mocked(prisma.user.findUnique).mockResolvedValue({
      status: 'ACTIVE',
    } as never);

    await authenticate(request, reply);

    expect(verifyToken).toHaveBeenCalledWith('valid-token');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      select: {
        status: true,
      },
    });

    expect(reply.status).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();

    expect(getAuthenticatedUserId(request)).toBe(1);
  });
});

describe('getAuthenticatedUserId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when the request is not authenticated', () => {
    const request = {
      cookies: {},
    } as unknown as FastifyRequest;

    expect(() => getAuthenticatedUserId(request)).toThrow(
      'Authenticated user not found',
    );
  });
});
