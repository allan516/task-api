import { createAppError } from './app-error.js';

export function createCannotUpdateStatusError() {
  return createAppError(
    'CANNOT_UPDATE_STATUS',
    'Admin cannot update their own status',
    403,
  );
}
