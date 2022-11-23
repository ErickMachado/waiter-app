import { OrderSchema } from '@/external/schemas/Order';
import { faker } from '@faker-js/faker';
import { mockCategoryData, mockOrderData } from '@tests/mocks';
import { createProduct } from '@tests/utils/createProduct';
import { createUploadsFolder, initTestApp } from '@tests/utils/initTestApp';
import mongoose from 'mongoose';

describe('GET /categories', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    await createUploadsFolder();
  });

  it('Should return 200', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());
    const productId = await createProduct(app, {
      categoryId: category.body.id,
    });
    const order = await app.post('/orders').send(mockOrderData({ productId }));

    // Act
    const response = await app
      .patch(`/orders/${order.body.id}`)
      .send({ status: 'InProduction' });

    // Assert
    expect(response.status).toBe(200);
  });

  it('Should update order status in database', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());
    const productId = await createProduct(app, {
      categoryId: category.body.id,
    });
    const order = await app.post('/orders').send(mockOrderData({ productId }));

    // Act
    const response = await app
      .patch(`/orders/${order.body.id}`)
      .send({ status: 'InProduction' });

    const updatedOrder = await OrderSchema.findOne().where({
      id: response.body.id,
    });

    // Assert
    expect(updatedOrder?.status).toBe('InProduction');
  });

  it('Should 400 when status is not provided in request body', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const response = await app.patch(`/orders/${faker.datatype.uuid()}`);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      error: 'Missing param: status',
      type: 'MissingParamError',
    });
  });

  it('Should return 422 when status is not accepted', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const response = await app
      .patch(`/orders/${faker.datatype.uuid()}`)
      .send({ status: faker.lorem.word() });

    // Assert
    expect(response.statusCode).toBe(422);
    expect(response.body).toStrictEqual({
      error: 'Status is not valid.',
      type: 'InvalidOrderStatusError',
    });
  });

  it('Should return 404 when order does not exists', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const response = await app
      .patch(`/orders/${faker.datatype.uuid()}`)
      .send({ status: 'InProduction' });

    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      error: 'Order does not exists.',
      type: 'OrderNotFoundError',
    });
  });
});
