import { describe, expect, it } from '@jest/globals';

import { updateMeSchema } from '../../../src/modules/user/user.schema.js';

describe('updateMeSchema', () => {
  it('should accept name only', () => {
    const result = updateMeSchema.safeParse({
      name: 'Allan Mendes',
    });

    expect(result.success).toBe(true);
  });

  it('should accept email only', () => {
    const result = updateMeSchema.safeParse({
      email: 'allan@example.com',
    });

    expect(result.success).toBe(true);
  });

  it('should accept currentPassword and password', () => {
    const result = updateMeSchema.safeParse({
      currentPassword: 'old-password',
      password: 'new-password',
    });

    expect(result.success).toBe(true);
  });

  it('should reject password without currentPassword', () => {
    const result = updateMeSchema.safeParse({
      password: 'new-password',
    });

    expect(result.success).toBe(false);
  });

  it('should reject currentPassword without password', () => {
    const result = updateMeSchema.safeParse({
      currentPassword: 'old-password',
    });

    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = updateMeSchema.safeParse({
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
  });

  it('should reject password shorter than 8 characters', () => {
    const result = updateMeSchema.safeParse({
      currentPassword: 'old-password',
      password: '1234567',
    });

    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = updateMeSchema.safeParse({
      name: '',
    });

    expect(result.success).toBe(false);
  });
});
