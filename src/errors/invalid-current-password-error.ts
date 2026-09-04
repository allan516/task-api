import { createAppError } from './app-error.js';

export function createInvalidCurrentPasswordError() {
  return createAppError(
    'INVALID_CURRENT_PASSWORD',
    'Invalid current password',
    401,
  );
}
