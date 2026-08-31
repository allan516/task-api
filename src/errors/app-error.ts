export type AppError = {
  type: 'AppError';
  code: string;
  message: string;
};

export function createAppError(code: string, message: string): AppError {
  return {
    type: 'AppError',
    code,
    message,
  };
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'AppError' &&
    'code' in error &&
    typeof error.code === 'string' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}
