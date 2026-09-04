import { prisma } from '../../database/prisma.js';
import { hashPassword } from '../../security/password.js';

export async function createUser(data: {
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
