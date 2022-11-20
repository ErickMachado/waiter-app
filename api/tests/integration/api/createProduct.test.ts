import path from 'node:path';
import { faker } from '@faker-js/faker';
import { initTestApp } from '@tests/utils/initTestApp';
import mongoose from 'mongoose';
import { mockCategoryData } from '@tests/mocks';
import { ProductSchema } from '@/external/schemas/Product';

const IMAGE_TEST_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'mocks',
  'test.jpg'
);

describe('POST /products', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('Should return 400 when description is missing', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('name', faker.lorem.word())
      .field('categoryId', faker.datatype.uuid())
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify({ icon: '🧀', name: faker.lorem.word() })
      );

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: description',
      type: 'MissingParamError',
    });
  });

  it('Should return 422 when description length is greater than 255 characters', async () => {
    // Arrange
    const { app } = await initTestApp();
    const response = await app.post('/categories').send(mockCategoryData());

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words(256))
      .field('name', faker.lorem.word())
      .field('categoryId', response.body.id)
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify([{ icon: '🧀', name: faker.lorem.word() }])
      );

    // Assert
    expect(statusCode).toBe(422);
    expect(body).toStrictEqual({
      error: 'Max description length is 255 characters.',
      type: 'InvalidDescriptionLengthError',
    });
  });

  it('Should return 400 when name is missing', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('categoryId', faker.datatype.uuid())
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify([{ icon: '🧀', name: faker.lorem.word() }])
      );

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: name',
      type: 'MissingParamError',
    });
  });

  it('Should return 400 when imageName is missing', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .field('description', faker.lorem.words())
      .field('categoryId', faker.datatype.uuid())
      .field('name', faker.lorem.word())
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify([{ icon: '🧀', name: faker.lorem.word() }])
      );

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: imageName',
      type: 'MissingParamError',
    });
  });

  it('Should return 400 when price is missing', async () => {
    // Arrange
    const { app } = await initTestApp();

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('name', faker.lorem.word())
      .field('categoryId', faker.datatype.uuid())
      .field(
        'ingredients',
        JSON.stringify([{ icon: '🧀', name: faker.lorem.word() }])
      );

    // Assert
    expect(statusCode).toBe(400);
    expect(body).toStrictEqual({
      error: 'Missing param: price',
      type: 'MissingParamError',
    });
  });

  it('Should return 422 when ingredient icon contains any letter', async () => {
    // Arrange
    const { app } = await initTestApp();
    const response = await app.post('/categories').send(mockCategoryData());

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('name', faker.lorem.word())
      .field('categoryId', response.body.id)
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify([{ icon: faker.lorem.word(), name: faker.lorem.word() }])
      );

    // Assert
    expect(statusCode).toBe(422);
    expect(body).toStrictEqual({
      error:
        'Icon must be an emoji character. Try to send a single emoji character.',
      type: 'InvalidIconError',
    });
  });

  it('Should return 422 when ingredient icon contains more than a single emoji', async () => {
    // Arrange
    const { app } = await initTestApp();
    const response = await app.post('/categories').send(mockCategoryData());

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('name', faker.lorem.word())
      .field('categoryId', response.body.id)
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify([{ icon: '🧀🍕', name: faker.lorem.word() }])
      );

    // Assert
    expect(statusCode).toBe(422);
    expect(body).toStrictEqual({
      error: 'Icon should be a single emoji. Received 🧀🍕 instead',
      type: 'InvalidIconLength',
    });
  });

  it('Should store product in the database', async () => {
    // Arrange
    const { app } = await initTestApp();
    const response = await app.post('/categories').send(mockCategoryData());

    // Act
    const { statusCode, body } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('name', faker.lorem.word())
      .field('categoryId', response.body.id)
      .field('price', faker.datatype.number().toString())
      .field(
        'ingredients',
        JSON.stringify([{ icon: '🧀', name: faker.lorem.word() }])
      );

    // Assert
    const savedProduct = await ProductSchema.findOne({ id: body.id });

    expect(statusCode).toBe(201);
    expect(savedProduct).not.toBeNull();
  });

  it('Should should create a product without ingredients', async () => {
    // Arrange
    const { app } = await initTestApp();
    const response = await app.post('/categories').send(mockCategoryData());

    // Act
    const { statusCode } = await app
      .post('/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', IMAGE_TEST_PATH)
      .field('description', faker.lorem.words())
      .field('name', faker.lorem.word())
      .field('categoryId', response.body.id)
      .field('price', faker.datatype.number().toString());

    // Assert
    expect(statusCode).toBe(201);
  });
});
