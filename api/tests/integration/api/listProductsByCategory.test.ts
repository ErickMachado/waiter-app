import { faker } from '@faker-js/faker';
import { mockCategoryData } from '@tests/mocks';
import { createProduct } from '@tests/utils/createProduct';
import { createUploadsFolder, initTestApp } from '@tests/utils/initTestApp';
import mongoose from 'mongoose';

describe('GET /category/:categoryId/products', () => {
  beforeAll(async () => {
    await createUploadsFolder();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('Should return 404 when category does not exists', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const response = await app.get(
      `/categories/${faker.datatype.uuid()}/products`
    );

    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: 'Category does not exists.',
      type: 'CategoryNotFoundError',
    });
  });

  it('Should return 200 with a list of product related with provided category id', async () => {
    // Arrange
    const { app } = await initTestApp();
    const categoryA = await app.post('/categories').send(mockCategoryData());
    const categoryB = await app.post('/categories').send(mockCategoryData());

    await createProduct(app, { categoryId: categoryA.body.id });
    await createProduct(app, { categoryId: categoryB.body.id });

    // Act
    const response = await app.get(`/categories/${categoryA.body.id}/products`);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].categoryId).toBe(categoryA.body.id);
  });
});
