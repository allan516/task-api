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

export async function createTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTaskSchema.parse(request.body);

  const task = await createTask(1, body.title);

  return reply.status(201).send(task);
}

export async function findAllTasksController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tasks = await findAllTasks(1);

  return reply.status(200).send(tasks);
}

export async function findTaskByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const task = await findTaskById(1, id);

  return reply.status(200).send(task);
}

export async function updateTaskController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = taskParamsSchema.parse(request.params);

  const { title, completed } = updateTaskSchema.parse(request.body);

  const task = await updateTask(1, id, {
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

  await deleteTask(1, id);

  return reply.status(204).send();
}
