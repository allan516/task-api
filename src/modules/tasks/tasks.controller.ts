import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  createTask,
  findAllTasks,
  findTaskById,
  updateTask,
  deleteTask,
} from './tasks.service.js';

import {
  createTaskSchema,
  taskParamsSchema,
  updateTaskSchema,
} from './tasks.schema.js';

import { getAuthenticatedUserId } from '../../security/authenticate.js';

export async function createTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTaskSchema.parse(request.body);

  const userId = getAuthenticatedUserId(request);

  const task = await createTask(userId, body.title);

  return reply.status(201).send(task);
}

export async function findAllTasksController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = getAuthenticatedUserId(request);

  const tasks = await findAllTasks(userId);

  return reply.status(200).send(tasks);
}

export async function findTaskByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const userId = getAuthenticatedUserId(request);

  const task = await findTaskById(userId, id);

  return reply.status(200).send(task);
}

export async function updateTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const { title, completed } = updateTaskSchema.parse(request.body);

  const userId = getAuthenticatedUserId(request);

  const task = await updateTask(userId, id, {
    title,
    completed,
  });

  return reply.status(200).send(task);
}

export async function deleteTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const userId = getAuthenticatedUserId(request);

  await deleteTask(userId, id);

  return reply.status(204).send();
}
