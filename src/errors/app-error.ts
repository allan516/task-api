export type AppError = {
  type: 'AppError';
  code: string;
  message: string;
  statusCode: number;
};

export function createAppError(
  code: string,
  message: string,
  statusCode: number,
): AppError {
  return {
    type: 'AppError',
    code,
    message,
    statusCode,
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
    typeof error.message === 'string' &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  );
}
