import { prisma } from '../../../database/prisma.js';
import { createInvalidCredentialsError } from '../../../errors/invalid-credentials-error.js';
import { signToken } from '../../../security/jwt.js';
import { comparePassword } from '../../../security/password.js';
import {
  generateRefreshToken,
  hashRefreshToken,
} from '../../../security/refresh-token.js';

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw createInvalidCredentialsError();
  }

  const passwordMatches = await comparePassword(
    data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw createInvalidCredentialsError();
  }

  const token = signToken(user.id);

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
    refreshToken,
  };
}
