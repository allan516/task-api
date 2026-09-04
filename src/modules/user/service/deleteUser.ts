import { prisma } from '../../../database/prisma.js';

export async function deleteUser(userId: number) {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
