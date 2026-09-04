import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { prisma } from '../../../src/database/prisma.js';

import {
  hashPassword,
  comparePassword,
} from '../../../src/security/password.js';

import { signToken } from '../../../src/security/jwt.js';

import {
  generateRefreshToken,
  hashRefreshToken,
} from '../../../src/security/refresh-token.js';

import { loginUser } from '../../../src/modules/auth/service/loginUser.js';
import { registerUser } from '../../../src/modules/auth/service/registerUser.js';

jest.mock('../../../src/database/prisma.js', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },

    refreshToken: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../src/security/password.js', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock('../../../src/security/jwt.js', () => ({
  signToken: jest.fn(),
}));

jest.mock('../../../src/security/refresh-token.js', () => ({
  generateRefreshToken: jest.fn(),
  hashRefreshToken: jest.fn(),
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

    jest.mocked(prisma.user.findUnique).mockReset();
    jest.mocked(comparePassword).mockReset();
    jest.mocked(signToken).mockReset();

    jest.mocked(generateRefreshToken).mockReset();
    jest.mocked(hashRefreshToken).mockReset();
    jest.mocked(prisma.refreshToken.create).mockReset();
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

    jest.mocked(signToken).mockReturnValue('fake-jwt-token');

    jest.mocked(generateRefreshToken).mockReturnValue('fake-refresh-token');

    jest.mocked(hashRefreshToken).mockReturnValue('hashed-refresh-token');

    jest.mocked(prisma.refreshToken.create).mockResolvedValue({
      id: 1,
      tokenHash: 'hashed-refresh-token',
      userId: 1,
      expiresAt: new Date(),
      createdAt: new Date(),
      revokedAt: null,
    } as never);

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

    expect(signToken).toHaveBeenCalledWith(1);

    expect(generateRefreshToken).toHaveBeenCalled();

    expect(hashRefreshToken).toHaveBeenCalledWith('fake-refresh-token');

    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: {
        tokenHash: 'hashed-refresh-token',
        userId: 1,
        expiresAt: expect.any(Date),
      },
    });

    expect(result).toEqual({
      user: {
        id: 1,
        name: 'Allan',
        email: 'allan@email.com',
        emailVerified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },

      token: 'fake-jwt-token',

      refreshToken: 'fake-refresh-token',
    });
  });

  it('should reject when the user does not exist', async () => {
    jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      loginUser({
        email: 'allan@email.com',
        password: '12345678',
      }),
    ).rejects.toMatchObject({
      type: 'AppError',
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    });

    expect(comparePassword).not.toHaveBeenCalled();

    expect(signToken).not.toHaveBeenCalled();
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
    ).rejects.toMatchObject({
      type: 'AppError',
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    });

    expect(comparePassword).toHaveBeenCalledWith(
      'wrong-password',
      'hashed-password',
    );

    expect(signToken).not.toHaveBeenCalled();
  });
});
