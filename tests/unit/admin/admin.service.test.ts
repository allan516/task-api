import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '../../../src/database/prisma.js';

import { listUsers } from '../../../src/modules/admin/service/listUsers.js';
import { getUser } from '../../../src/modules/admin/service/getUser.js';
import { updateUserStatus } from '../../../src/modules/admin/service/updateUserStatus.js';
import { deleteUser } from '../../../src/modules/admin/service/deleteUser.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('admin.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should list users with safe data and task count', async () => {
      const users = [
        {
          id: 1,
          name: 'Allan',
          email: 'allan@example.com',
          role: 'USER',
          status: 'ACTIVE',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            tasks: 3,
          },
        },
        {
          id: 2,
          name: 'Admin',
          email: 'admin@example.com',
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            tasks: 5,
          },
        },
      ];

      jest.mocked(prisma.user.findMany).mockResolvedValue(users as never);

      const result = await listUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      expect(result).toEqual(users);

      expect(result[0]).not.toHaveProperty('passwordHash');
      expect(result[1]).not.toHaveProperty('passwordHash');
    });

    it('should return an empty list when there are no users', async () => {
      jest.mocked(prisma.user.findMany).mockResolvedValue([]);

      const result = await listUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUser', () => {
    it('should find a user with safe data and task count', async () => {
      const user = {
        id: 1,
        name: 'Allan',
        email: 'allan@example.com',
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          tasks: 3,
        },
      };

      jest.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

      const result = await getUser(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      expect(result).toEqual(user);
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should return null when user does not exist', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUser(999);

      expect(result).toBeNull();

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });
    });
  });

  describe('updateUserStatus', () => {
    it('should update another user status', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 2,
        role: 'USER',
      } as never);

      jest.mocked(prisma.user.update).mockResolvedValue({
        id: 2,
        name: 'User',
        email: 'user@example.com',
        role: 'USER',
        status: 'BLOCKED',
      } as never);

      const result = await updateUserStatus({
        userId: 2,
        authenticatedUserId: 1,
        status: 'BLOCKED',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 2,
        },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: 2,
        },
        data: {
          status: 'BLOCKED',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      expect(result).toEqual({
        id: 2,
        name: 'User',
        email: 'user@example.com',
        role: 'USER',
        status: 'BLOCKED',
      });
    });

    it('should return null when user does not exist', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await updateUserStatus({
        userId: 999,
        authenticatedUserId: 1,
        status: 'BLOCKED',
      });

      expect(result).toBeNull();

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should reject when admin tries to update their own status', async () => {
      await expect(
        updateUserStatus({
          userId: 1,
          authenticatedUserId: 1,
          status: 'BLOCKED',
        }),
      ).rejects.toEqual({
        type: 'AppError',
        code: 'CANNOT_UPDATE_STATUS',
        message: 'Admin cannot update their own status',
        statusCode: 403,
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete another user', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 2,
        role: 'USER',
      } as never);

      jest.mocked(prisma.user.delete).mockResolvedValue({
        id: 2,
        name: 'User',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const result = await deleteUser({
        userId: 2,
        authenticatedUserId: 1,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 2,
        },
      });

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: {
          id: 2,
        },
      });

      expect(result).toEqual({
        id: 2,
        role: 'USER',
      });
    });

    it('should return null when user does not exist', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await deleteUser({
        userId: 999,
        authenticatedUserId: 1,
      });

      expect(result).toBeNull();

      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should reject when admin tries to delete themselves', async () => {
      await expect(
        deleteUser({
          userId: 1,
          authenticatedUserId: 1,
        }),
      ).rejects.toEqual({
        type: 'AppError',
        code: 'CANNOT_DELETE_SELF',
        message: 'Admin cannot delete their own account',
        statusCode: 403,
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
