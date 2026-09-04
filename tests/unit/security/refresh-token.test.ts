import { describe, expect, it } from '@jest/globals';

import {
  generateRefreshToken,
  hashRefreshToken,
} from '../../../src/security/refresh-token.js';

describe('refresh token', () => {
  it('should generate a secure random token', () => {
    const token = generateRefreshToken();

    expect(token).toHaveLength(128);
    expect(typeof token).toBe('string');
  });

  it('should generate different tokens', () => {
    const tokenA = generateRefreshToken();
    const tokenB = generateRefreshToken();

    expect(tokenA).not.toBe(tokenB);
  });

  it('should generate a consistent hash', () => {
    const token = generateRefreshToken();

    const hashA = hashRefreshToken(token);
    const hashB = hashRefreshToken(token);

    expect(hashA).toBe(hashB);
    expect(hashA).toHaveLength(64);
  });

  it('should generate different hashes for different tokens', () => {
    const tokenA = generateRefreshToken();
    const tokenB = generateRefreshToken();

    const hashA = hashRefreshToken(tokenA);
    const hashB = hashRefreshToken(tokenB);

    expect(hashA).not.toBe(hashB);
  });
});
