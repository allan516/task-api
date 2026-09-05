import { prisma } from '../../../database/prisma.js';

import { createCannotDeleteSelfError } from '../../../errors/cannot-delete-self-error.js';

type DeleteUserInput = {
  userId: number;
  authenticatedUserId: number;
};

export async function deleteUser({
  userId,
  authenticatedUserId,
}: DeleteUserInput) {
  if (userId === authenticatedUserId) {
    throw createCannotDeleteSelfError();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return user;
}
