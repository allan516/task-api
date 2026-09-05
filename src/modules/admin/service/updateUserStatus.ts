import { prisma } from '../../../database/prisma.js';

import { createCannotUpdateStatusError } from '../../../errors/cannot-update-status-error.js';

type UpdateUserStatusInput = {
  userId: number;
  authenticatedUserId: number;
  status: 'ACTIVE' | 'BLOCKED';
};

export async function updateUserStatus({
  userId,
  authenticatedUserId,
  status,
}: UpdateUserStatusInput) {
  if (userId === authenticatedUserId) {
    throw createCannotUpdateStatusError();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
}
