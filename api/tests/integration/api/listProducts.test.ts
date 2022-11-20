import path from 'node:path';
import { initTestApp } from '@tests/utils/initTestApp';
import { mockCategoryData } from '@tests/mocks';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

const IMAGE_TEST_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'mocks',
  'test.jpg'
);

describe('GET /products', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
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

    await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('name', faker.lorem.word())
      .field('categoryId', category.body.id)
      .field('price', faker.datatype.number().toString());

    // Act
    const { body, statusCode } = await app.get('/products');

    // Assert
    expect(statusCode).toBe(200);
    expect(body.length).toBe(1);
  });
});
