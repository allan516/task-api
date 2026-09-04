import type { FastifyReply, FastifyRequest } from 'fastify';

import { registerSchema, loginSchema } from './auth.schema.js';

import type { RegisterInput, LoginInput } from './auth.schema.js';

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  revokeRefreshToken,
} from './auth.service.js';

export async function registerController(
  request: FastifyRequest<{
    Body: RegisterInput;
  }>,
  reply: FastifyReply,
) {
  const body = registerSchema.parse(request.body);

  const user = await registerUser(body);

  return reply.status(201).send(user);
}

export async function loginController(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply,
) {
  const body = loginSchema.parse(request.body);

  const { user, token, refreshToken } = await loginUser(body);

  reply.setCookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  reply.setCookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  return reply.status(200).send(user);
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refresh_token;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  reply.clearCookie('access_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  reply.clearCookie('refresh_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  return reply.status(204).send();
}

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refresh_token;

  if (!refreshToken) {
    return reply.status(401).send({
      message: 'Unauthorized',
    });
  }

  const token = await refreshAccessToken(refreshToken);

  reply.setCookie('access_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });

  return reply.status(200).send({
    message: 'Access token refreshed',
  });
}
