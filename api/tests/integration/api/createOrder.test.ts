import { mockCategoryData, mockOrderData } from '@tests/mocks';
import { createProduct } from '@tests/utils/createProduct';
import { createUploadsFolder, initTestApp } from '@tests/utils/initTestApp';
import mongoose from 'mongoose';

describe('POST /products', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    await createUploadsFolder();
  });

  it('Should return 400 when table is missing in request', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { body, statusCode } = await app
      .post('/orders')
      .send(mockOrderData({ table: '' }));

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: table',
      type: 'MissingParamError',
    });
  });

  it('Should return 400 when items is missing in request', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { body, statusCode } = await app
      .post('/orders')
      .send(mockOrderData({ numberOfItems: 0 }));

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: items',
      type: 'MissingParamError',
    });
  });

  it('Should return 404 when product in items does not exists', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { body, statusCode } = await app
      .post('/orders')
      .send(mockOrderData());

    // Assert
    expect(statusCode).toBe(404);
    expect(body).toStrictEqual({
      error: 'Product does not exists.',
      type: 'ProductNotFoundError',
    });
  });

  it('Should return 422 when order items length is grater than 10', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());
    const productId = await createProduct(app, {
      categoryId: category.body.id,
    });

    // Act
    const { body, statusCode } = await app
      .post('/orders')
      .send(mockOrderData({ productId, numberOfItems: 11 }));

    // Assert
    expect(statusCode).toBe(422);
    expect(body).toStrictEqual({
      error: 'Only 10 items is available per order.',
      type: 'OrderItemsLengthError',
    });
  });

  it('Should return 201 when order is successfully created', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());
    const productId = await createProduct(app, {
      categoryId: category.body.id,
    });

    // Act
    const { statusCode } = await app
      .post('/orders')
      .send(mockOrderData({ productId }));

    // Assert
    expect(statusCode).toBe(201);
  });
});
