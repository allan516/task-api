import { describe, expect, it } from '@jest/globals';

import { registerSchema } from '../../../src/modules/auth/auth.schema.js';

describe('registerSchema', () => {
  it('should accept valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Allan',
      email: 'allan@email.com',
      password: '12345678',
    });

    expect(result.success).toBe(true);
  });

  it('should reject an empty name', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'allan@email.com',
      password: '12345678',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Allan',
      email: 'allan-email',
      password: '12345678',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a password with less than 8 characters', () => {
    const result = registerSchema.safeParse({
      name: 'Allan',
      email: 'allan@email.com',
      password: '1234567',
    });

    expect(result.success).toBe(false);
  });
});
