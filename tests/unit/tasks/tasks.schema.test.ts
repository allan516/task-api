import { describe, expect, it } from '@jest/globals';

import {
  createTaskSchema,
  updateTaskSchema,
  taskParamsSchema,
} from '../../../src/modules/tasks/tasks.schema.js';

describe('createTaskSchema', () => {
  it('should accept a valid task title', () => {
    const result = createTaskSchema.safeParse({
      title: 'Comprar pão',
    });

    expect(result.success).toBe(true);
  });

  it('should reject a title shorter than 2 characters', () => {
    const result = createTaskSchema.safeParse({
      title: 'A',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an empty title', () => {
    const result = createTaskSchema.safeParse({
      title: '',
    });

    expect(result.success).toBe(false);
  });

  it('should reject when title is missing', () => {
    const result = createTaskSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('should reject a non-string title', () => {
    const result = createTaskSchema.safeParse({
      title: 123,
    });

    expect(result.success).toBe(false);
  });
});

describe('updateTaskSchema', () => {
  it('should accept an update with title', () => {
    const result = updateTaskSchema.safeParse({
      title: 'Comprar leite',
    });

    expect(result.success).toBe(true);
  });

  it('should accept an update with completed', () => {
    const result = updateTaskSchema.safeParse({
      completed: true,
    });

    expect(result.success).toBe(true);
  });

  it('should accept an update with title and completed', () => {
    const result = updateTaskSchema.safeParse({
      title: 'Comprar leite',
      completed: true,
    });

    expect(result.success).toBe(true);
  });

  it('should reject an empty update', () => {
    const result = updateTaskSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('should reject a title shorter than 2 characters', () => {
    const result = updateTaskSchema.safeParse({
      title: 'A',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a non-boolean completed value', () => {
    const result = updateTaskSchema.safeParse({
      completed: 'true',
    });

    expect(result.success).toBe(false);
  });
});

describe('taskParamsSchema', () => {
  it('should accept a valid numeric id', () => {
    const result = taskParamsSchema.safeParse({
      id: 1,
    });

    expect(result.success).toBe(true);
  });

  it('should coerce a string id into a number', () => {
    const result = taskParamsSchema.safeParse({
      id: '1',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe(1);
    }
  });

  it('should reject an id equal to zero', () => {
    const result = taskParamsSchema.safeParse({
      id: 0,
    });

    expect(result.success).toBe(false);
  });

  it('should reject a negative id', () => {
    const result = taskParamsSchema.safeParse({
      id: -1,
    });

    expect(result.success).toBe(false);
  });

  it('should reject a non-numeric id', () => {
    const result = taskParamsSchema.safeParse({
      id: 'abc',
    });

    expect(result.success).toBe(false);
  });
});
