import { OrderSchema } from '@/external/schemas/Order';
import { faker } from '@faker-js/faker';
import { mockCategoryData } from '@tests/mocks';
import { createProduct } from '@tests/utils/createProduct';
import { createUploadsFolder, initTestApp } from '@tests/utils/initTestApp';
import cuid from 'cuid';
import mongoose from 'mongoose';

describe('Route DELETE /orders -> Cancel order', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    await createUploadsFolder();
  });

  it('When order does not exists in database, expect the response to have status code equal to 404 along with error message', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { body, statusCode } = await app.delete(`/orders/${cuid()}`);

    // Assert
    expect(statusCode).toBe(404);
    expect(body).toStrictEqual({
      error: 'Order does not exists.',
      type: 'OrderNotFoundError',
    });
  });

  it('When order exists in database, expect the response status code to be 204 with no body', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());
    const productId = await createProduct(app, {
      categoryId: category.body.id,
    });
    const order = await app.post('/orders').send({
      table: faker.datatype.number(),
      items: [{ productId: productId, quantity: 1 }],
    });

    // Act
    const { body, statusCode } = await app.delete(`/orders/${order.body.id}`);

    // Assert
    expect(statusCode).toBe(204);
    expect(body).toEqual({});
  });

  it('When request is successfully processed, expect the order to have been deleted from database', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());
    const productId = await createProduct(app, {
      categoryId: category.body.id,
    });
    const order = await app.post('/orders').send({
      table: faker.datatype.number(),
      items: [{ productId: productId, quantity: 1 }],
    });

    // Act
    await app.delete(`/orders/${order.body.id}`);

    const result = await OrderSchema.findOne().where({ id: order.body.id });

    // Assert
    expect(result).toBeNull();
  });
});
