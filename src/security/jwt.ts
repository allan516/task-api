import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(userId: number) {
  return jwt.sign(
    {
      sub: userId,
    },
    JWT_SECRET!,
    {
      expiresIn: '15m',
    },
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET!);
}
