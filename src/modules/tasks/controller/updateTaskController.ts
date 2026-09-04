import { FastifyRequest, FastifyReply } from 'fastify';
import { getAuthenticatedUserId } from '../../../security/authenticate.js';
import { updateTask } from '../service/updateTask.js';
import { taskParamsSchema, updateTaskSchema } from '../tasks.schema.js';

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
