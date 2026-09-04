import { prisma } from '../../../database/prisma.js';
import { comparePassword, hashPassword } from '../../../security/password.js';
import { UpdateMeInput } from '../user.schema.js';

export async function updateMe(userId: number, data: UpdateMeInput) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  let passwordHash: string | undefined;

  if (data.password) {
    const passwordMatches = await comparePassword(
      data.currentPassword!,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new Error('Invalid current password');
    }

    passwordHash = await hashPassword(data.password);
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
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
}
