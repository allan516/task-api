import { prisma } from '../../../database/prisma.js';
import { hashRefreshToken } from '../../../security/refresh-token.js';

export async function revokeRefreshToken(refreshToken: string) {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: refreshTokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
