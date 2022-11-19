import { Router } from 'express';
import {
  buildCreateCategoriesHandler,
  buildListCategoriesHandler,
} from '@/main/factories/category';
import { buildCreateProductHandler } from '@/main/factories/product';
import { ProductData } from '@/entities';
import { upload } from '@/main/app/middlewares';

const router = Router();

// Categories
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

// Products
router.post('/products', upload.single('image'), async (request, response) => {
  const handler = buildCreateProductHandler();
  const payload: ProductData = {
    categoryId: request.body.categoryId,
    description: request.body.description,
    imageName: request.file?.filename ?? '',
    name: request.body.name,
    price: request.body.price,
    ingredients: JSON.parse(request.body.ingredients ?? []),
  };

  const { body, statusCode } = await handler.handle({ body: payload });

  return response.status(statusCode).json(body);
});

export { router };
