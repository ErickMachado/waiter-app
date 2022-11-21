import { createUploadsFolder, initTestApp } from '@tests/utils/initTestApp';
import { mockCategoryData } from '@tests/mocks';
import mongoose from 'mongoose';
import { createProduct } from '@tests/utils/createProduct';

describe('GET /products', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    await createUploadsFolder();
  });

  it('Should return 200 with an empty array', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { body, statusCode } = await app.get('/products');

    // Assert
    expect(statusCode).toBe(200);
    expect(body).toEqual([]);
  });

  it('Should return 200 with an array of products', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());

    await createProduct(app, { categoryId: category.body.id });

    // Act
    const { body, statusCode } = await app.get('/products');

    // Assert
    expect(statusCode).toBe(200);
    expect(body.length).toBe(1);
  });
});
