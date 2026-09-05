import { describe, expect, it } from '@jest/globals';

import {
  updateUserStatusSchema,
  userIdParamsSchema,
} from '../../../src/modules/admin/admin.schema.js';

describe('admin.schema', () => {
  describe('userIdParamsSchema', () => {
    it('should accept a positive integer', () => {
      const result = userIdParamsSchema.parse({
        id: 10,
      });

      expect(result).toEqual({
        id: 10,
      });
    });

    it('should coerce a string id into a number', () => {
      const result = userIdParamsSchema.parse({
        id: '10',
      });

      expect(result).toEqual({
        id: 10,
      });
    });

    it('should reject zero', () => {
      expect(() =>
        userIdParamsSchema.parse({
          id: 0,
        }),
      ).toThrow();
    });

    it('should reject negative numbers', () => {
      expect(() =>
        userIdParamsSchema.parse({
          id: -1,
        }),
      ).toThrow();
    });

    it('should reject decimal numbers', () => {
      expect(() =>
        userIdParamsSchema.parse({
          id: 1.5,
        }),
      ).toThrow();
    });
  });

  describe('updateUserStatusSchema', () => {
    it('should accept ACTIVE status', () => {
      const result = updateUserStatusSchema.parse({
        status: 'ACTIVE',
      });

      expect(result).toEqual({
        status: 'ACTIVE',
      });
    });

    it('should accept BLOCKED status', () => {
      const result = updateUserStatusSchema.parse({
        status: 'BLOCKED',
      });

      expect(result).toEqual({
        status: 'BLOCKED',
      });
    });

    it('should reject an invalid status', () => {
      expect(() =>
        updateUserStatusSchema.parse({
          status: 'INVALID',
        }),
      ).toThrow();
    });
  });
});
