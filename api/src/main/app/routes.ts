import { Router } from 'express';
import {
  buildCreateCategoriesHandler,
  buildListCategoriesHandler,
  buildListProductsByCategory,
} from '@/main/factories/category';
import {
  buildCreateProductHandler,
  buildListProductsHandler,
} from '@/main/factories/product';
import { ProductData } from '@/entities';
import { upload } from '@/main/app/middlewares';
import {
  buildChangeOrderStatusHandler,
  buildCreateOrderHandler,
  buildListOrdersHandler,
} from '@/main/factories/order';

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

router.get('/categories/:categoryId/products', async (request, response) => {
  const handler = buildListProductsByCategory();

  const { body, statusCode } = await handler.handle({
    params: {
      categoryId: request.params.categoryId,
    },
  });

  return response.status(statusCode).json(body);
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
    ingredients: request.body.ingredients
      ? JSON.parse(request.body.ingredients)
      : undefined,
  };

  const { body, statusCode } = await handler.handle({ body: payload });

  return response.status(statusCode).json(body);
});

router.get('/products', async (request, response) => {
  const handler = buildListProductsHandler();

  const { body, statusCode } = await handler.handle();

  return response.status(statusCode).json(body);
});

// Orders
router.post('/orders', async (request, response) => {
  const handler = buildCreateOrderHandler();

  const { body, statusCode } = await handler.handle({
    body: request.body,
  });

  return response.status(statusCode).json(body);
});

router.get('/orders', async (request, response) => {
  const handler = buildListOrdersHandler();

  const { body, statusCode } = await handler.handle();

  return response.status(statusCode).json(body);
});

router.patch('/orders/:orderId', async (request, response) => {
  const handler = buildChangeOrderStatusHandler();

  const { body, statusCode } = await handler.handle({
    body: {
      orderId: request.params.orderId,
      status: request.body.status,
    },
  });

  return response.status(statusCode).json(body);
});

export { router };
