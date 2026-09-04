import { describe, expect, it, jest } from '@jest/globals';

describe('signToken', () => {
  it('should generate a token', async () => {
    process.env.JWT_SECRET = 'test-secret';

    jest.resetModules();

    const { signToken } = await import('../../../src/security/jwt.js');

    const token = signToken(1);

    expect(token).toEqual(expect.any(String));
  });
});

describe('verifyToken', () => {
  it('should verify a valid token', async () => {
    process.env.JWT_SECRET = 'test-secret';

    jest.resetModules();

    const { signToken, verifyToken } =
      await import('../../../src/security/jwt.js');

    const token = signToken(1);

    const payload = verifyToken(token);

    expect(payload).toEqual(
      expect.objectContaining({
        sub: 1,
      }),
    );
  });

  it('should reject a tampered token', async () => {
    process.env.JWT_SECRET = 'test-secret';

    jest.resetModules();

    const { signToken, verifyToken } =
      await import('../../../src/security/jwt.js');

    const token = signToken(1);

    const tamperedToken = `${token}tampered`;

    expect(() => verifyToken(tamperedToken)).toThrow();
  });

  it('should reject an expired token', async () => {
    process.env.JWT_SECRET = 'test-secret';

    jest.resetModules();

    const { verifyToken } = await import('../../../src/security/jwt.js');

    const jwt = await import('jsonwebtoken');

    const expiredToken = jwt.default.sign(
      {
        sub: 1,
      },
      'test-secret',
      {
        expiresIn: '0s',
      },
    );

    expect(() => verifyToken(expiredToken)).toThrow();
  });
});
