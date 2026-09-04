import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '../../../src/database/prisma.js';

import {
  comparePassword,
  hashPassword,
} from '../../../src/security/password.js';

import { deleteUser } from '../../../src/modules/user/service/deleteUser.js';
import { findUserById } from '../../../src/modules/user/service/findUserById.js';
import { updateMe } from '../../../src/modules/user/service/updateMe.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('../../../src/security/password.js', () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

describe('user.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const user = await findUserById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
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

      expect(user).toEqual({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        emailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return null when user does not exist', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const user = await findUserById(999);

      expect(user).toBeNull();
    });
  });

  describe('updateMe', () => {
    it('should update name and email', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        passwordHash: 'hashed-password',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      jest.mocked(prisma.user.update).mockResolvedValue({
        id: 1,
        name: 'Allan Mendes',
        email: 'allan.new@example.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const user = await updateMe(1, {
        name: 'Allan Mendes',
        email: 'allan.new@example.com',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: 'Allan Mendes',
          email: 'allan.new@example.com',
          passwordHash: undefined,
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

      expect(user?.name).toBe('Allan Mendes');
      expect(user?.email).toBe('allan.new@example.com');
    });

    it('should update password when current password is correct', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        passwordHash: 'old-hash',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      jest.mocked(comparePassword).mockResolvedValue(true);

      jest.mocked(hashPassword).mockResolvedValue('new-hash');

      jest.mocked(prisma.user.update).mockResolvedValue({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      await updateMe(1, {
        currentPassword: 'old-password',
        password: 'new-password',
      });

      expect(comparePassword).toHaveBeenCalledWith('old-password', 'old-hash');

      expect(hashPassword).toHaveBeenCalledWith('new-password');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: undefined,
          email: undefined,
          passwordHash: 'new-hash',
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
    });

    it('should reject when current password is incorrect', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        passwordHash: 'old-hash',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      jest.mocked(comparePassword).mockResolvedValue(false);

      await expect(
        updateMe(1, {
          currentPassword: 'wrong-password',
          password: 'new-password',
        }),
      ).rejects.toThrow('Invalid current password');

      expect(hashPassword).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      jest.mocked(prisma.user.delete).mockResolvedValue({
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        passwordHash: 'hashed-password',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      await deleteUser(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });
  });
});
