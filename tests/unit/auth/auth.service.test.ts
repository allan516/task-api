import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '../../../src/database/prisma.js';

import {
  hashPassword,
  comparePassword,
} from '../../../src/security/password.js';

import {
  registerUser,
  loginUser,
} from '../../../src/modules/auth/auth.service.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../../src/security/password.js', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with a hashed password', async () => {
    jest.mocked(hashPassword).mockResolvedValue('hashed-password');

    jest.mocked(prisma.user.create).mockResolvedValue({
      id: 1,
      name: 'Allan',
      email: 'allan@email.com',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const result = await registerUser({
      name: 'Allan',
      email: 'allan@email.com',
      password: '123456',
    });

    expect(hashPassword).toHaveBeenCalledWith('123456');

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Allan',
        email: 'allan@email.com',
        passwordHash: 'hashed-password',
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

    expect(result).toEqual({
      id: 1,
      name: 'Allan',
      email: 'allan@email.com',
      emailVerified: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should propagate errors when creating a user fails', async () => {
    jest
      .mocked(prisma.user.create)
      .mockRejectedValue(new Error('Unique constraint failed'));

    await expect(
      registerUser({
        name: 'Allan',
        email: 'allan@email.com',
        password: '123456',
      }),
    ).rejects.toThrow('Unique constraint failed');
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate a user with valid credentials', async () => {
    const user = {
      id: 1,
      name: 'Allan',
      email: 'allan@email.com',
      passwordHash: 'hashed-password',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.user.findUnique).mockResolvedValue(user);

    jest.mocked(comparePassword).mockResolvedValue(true);

    const result = await loginUser({
      email: 'allan@email.com',
      password: '12345678',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'allan@email.com',
      },
    });

    expect(comparePassword).toHaveBeenCalledWith('12345678', 'hashed-password');

    expect(result).toEqual({
      id: 1,
      name: 'Allan',
      email: 'allan@email.com',
      emailVerified: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should reject when the user does not exist', async () => {
    jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      loginUser({
        email: 'allan@email.com',
        password: '12345678',
      }),
    ).rejects.toThrow('Invalid email or password');

    expect(comparePassword).not.toHaveBeenCalled();
  });

  it('should reject when the password is incorrect', async () => {
    const user = {
      id: 1,
      name: 'Allan',
      email: 'allan@email.com',
      passwordHash: 'hashed-password',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(prisma.user.findUnique).mockResolvedValue(user);

    jest.mocked(comparePassword).mockResolvedValue(false);

    await expect(
      loginUser({
        email: 'allan@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });
});
