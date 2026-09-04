import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '../../../src/database/prisma.js';

import { refreshAccessToken } from '../../../src/modules/auth/service/refreshAccessToken.js';

import { hashRefreshToken } from '../../../src/security/refresh-token.js';
import { revokeRefreshToken } from '../../../src/modules/auth/service/revokeRefreshToken.js';
import { signToken } from '../../../src/security/jwt.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    refreshToken: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

jest.mock('../../../src/security/refresh-token.js', () => ({
  hashRefreshToken: jest.fn(),
}));

jest.mock('../../../src/security/jwt.js', () => ({
  signToken: jest.fn(),
}));

describe('refresh token service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (hashRefreshToken as jest.Mock).mockReset();
    (signToken as jest.Mock).mockReset();
  });

  it('should generate a new access token from a valid refresh token', async () => {
    const refreshToken = 'valid-refresh-token';

    (hashRefreshToken as jest.Mock).mockReturnValue('hashed-token');

    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      tokenHash: 'hashed-token',
      userId: 10,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      revokedAt: null,
    } as never);

    (signToken as jest.Mock).mockReturnValue('new-access-token');

    const token = await refreshAccessToken(refreshToken);

    expect(hashRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(signToken).toHaveBeenCalledWith(10);
    expect(token).toBe('new-access-token');
  });

  it('should reject a refresh token that does not exist', async () => {
    (hashRefreshToken as jest.Mock).mockReturnValue('unknown-hash');

    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(
      null as never,
    );

    await expect(refreshAccessToken('unknown-token')).rejects.toMatchObject({
      type: 'AppError',
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('should reject a revoked refresh token', async () => {
    (hashRefreshToken as jest.Mock).mockReturnValue('revoked-hash');

    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      tokenHash: 'revoked-hash',
      userId: 10,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      revokedAt: new Date(),
    } as never);

    await expect(refreshAccessToken('revoked-token')).rejects.toMatchObject({
      type: 'AppError',
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('should reject an expired refresh token', async () => {
    (hashRefreshToken as jest.Mock).mockReturnValue('expired-hash');

    (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      tokenHash: 'expired-hash',
      userId: 10,
      expiresAt: new Date(Date.now() - 60_000),
      createdAt: new Date(),
      revokedAt: null,
    } as never);

    await expect(refreshAccessToken('expired-token')).rejects.toMatchObject({
      type: 'AppError',
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('should revoke a refresh token', async () => {
    (hashRefreshToken as jest.Mock).mockReturnValue('hashed-token');

    (prisma.refreshToken.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    } as never);

    await revokeRefreshToken('refresh-token');

    expect(hashRefreshToken).toHaveBeenCalledWith('refresh-token');

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: {
        tokenHash: 'hashed-token',
        revokedAt: null,
      },
      data: {
        revokedAt: expect.any(Date),
      },
    });
  });
});
