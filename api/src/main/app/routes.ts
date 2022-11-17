import { Router } from 'express';
import {
  buildCreateCategoriesHandler,
  buildListCategoriesHandler,
} from '@/main/factories/category';

const router = Router();

router.get('/categories', async (request, response) => {
  const handler = buildListCategoriesHandler();

  const { body, statusCode } = await handler.handle();

  return response.status(statusCode).json(body);
});
router.post('/categories', async (request, reply) => {
  const handler = buildCreateCategoriesHandler();

  const response = await handler.handle({ body: request.body });

  reply.status(response.statusCode).json(response.body);
});

export { router };
