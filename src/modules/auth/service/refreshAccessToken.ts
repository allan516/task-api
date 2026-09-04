import { prisma } from '../../../database/prisma.js';
import { createInvalidCredentialsError } from '../../../errors/invalid-credentials-error.js';
import { signToken } from '../../../security/jwt.js';
import { hashRefreshToken } from '../../../security/refresh-token.js';

export async function refreshAccessToken(refreshToken: string) {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: refreshTokenHash,
    },
  });

  if (!storedToken) {
    throw createInvalidCredentialsError();
  }

  if (storedToken.revokedAt) {
    throw createInvalidCredentialsError();
  }

  if (storedToken.expiresAt <= new Date()) {
    throw createInvalidCredentialsError();
  }

  return signToken(storedToken.userId);
}
