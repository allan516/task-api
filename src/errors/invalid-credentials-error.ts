import { createAppError } from './app-error.js';

export function createInvalidCredentialsError() {
  return createAppError(
    'INVALID_CREDENTIALS',
    'Invalid email or password',
    401,
  );
}
