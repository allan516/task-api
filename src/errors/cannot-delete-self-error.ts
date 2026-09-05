import { createAppError } from './app-error.js';

export function createCannotDeleteSelfError() {
  return createAppError(
    'CANNOT_DELETE_SELF',
    'Admin cannot delete their own account',
    403,
  );
}
