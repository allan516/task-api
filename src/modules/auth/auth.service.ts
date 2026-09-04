import { prisma } from '../../database/prisma.js';

import { hashPassword, comparePassword } from '../../security/password.js';

import { createInvalidCredentialsError } from '../../errors/invalid-credentials-error.js';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

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

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
