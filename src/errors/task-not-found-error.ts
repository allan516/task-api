import { createAppError } from './app-error.js';

export function createTaskNotFoundError() {
  return createAppError('TASK_NOT_FOUND', 'Task not found');
}
