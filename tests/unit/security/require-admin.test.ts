import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../../../src/database/prisma.js';

import { requireAdmin } from '../../../src/security/require-admin.js';

import { getAuthenticatedUserId } from '../../../src/security/authenticate.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../../src/security/authenticate.js', () => ({
  getAuthenticatedUserId: jest.fn(),
}));

describe('requireAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createRequest() {
    return {} as unknown as FastifyRequest;
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

  it('should allow an ADMIN user', async () => {
    const request = createRequest();
    const reply = createReply();

    jest.mocked(getAuthenticatedUserId).mockReturnValue(1);

    jest.mocked(prisma.user.findUnique).mockResolvedValue({
      role: 'ADMIN',
    } as never);

    await requireAdmin(request, reply);

    expect(getAuthenticatedUserId).toHaveBeenCalledWith(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      select: {
        role: true,
      },
    });

    expect(reply.status).not.toHaveBeenCalled();
    expect(reply.send).not.toHaveBeenCalled();
  });

  it('should return 403 when the user is not an ADMIN', async () => {
    const request = createRequest();
    const reply = createReply();

    jest.mocked(getAuthenticatedUserId).mockReturnValue(1);

    jest.mocked(prisma.user.findUnique).mockResolvedValue({
      role: 'USER',
    } as never);

    await requireAdmin(request, reply);

    expect(getAuthenticatedUserId).toHaveBeenCalledWith(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      select: {
        role: true,
      },
    });

    expect(reply.status).toHaveBeenCalledWith(403);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Forbidden',
    });
  });

  it('should return 403 when the authenticated user does not exist', async () => {
    const request = createRequest();
    const reply = createReply();

    jest.mocked(getAuthenticatedUserId).mockReturnValue(999);

    jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await requireAdmin(request, reply);

    expect(getAuthenticatedUserId).toHaveBeenCalledWith(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 999,
      },
      select: {
        role: true,
      },
    });

    expect(reply.status).toHaveBeenCalledWith(403);

    expect(reply.send).toHaveBeenCalledWith({
      message: 'Forbidden',
    });
  });
});
