import { describe, expect, it } from '@jest/globals';

import { comparePassword, hashPassword } from '../../../src/security/password';

describe('hashPassword', () => {
  it('should hash a password', async () => {
    const password = '123456';

    const passwordHash = await hashPassword(password);

    expect(passwordHash).toEqual(expect.any(String));
    expect(passwordHash).not.toBe(password);
  });

  it('should generate different hashes for the same password', async () => {
    const password = '123456';

    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it('should return true when the password is correct', async () => {
    const password = '123456';

    const passwordHash = await hashPassword(password);

    const result = await comparePassword(password, passwordHash);

    expect(result).toBe(true);
  });

  it('should return false when the password is incorrect', async () => {
    const password = '123456';
    const wrongPassword = '654321';

    const passwordHash = await hashPassword(password);

    const result = await comparePassword(wrongPassword, passwordHash);

    expect(result).toBe(false);
  });
});
