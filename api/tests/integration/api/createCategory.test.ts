import { mockCategoryData } from '@tests/mocks';
import { faker } from '@faker-js/faker';
import { CategorySchema } from '@/external/schemas/Category';
import { createUploadsFolder, initTestApp } from '@tests/utils/initTestApp';
import mongoose from 'mongoose';

describe('POST /categories', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    await createUploadsFolder();
  });

  it('Should return 400 when name is missing', async () => {
    // Act
    const { app } = await initTestApp();
    const response = await app
      .post('/categories')
      .send(mockCategoryData({ name: '' }));

    // Assert
    expect(response.status).toBe(400);
  });

  it('Should return 400 when icon is missing', async () => {
    // Act
    const { app } = await initTestApp();
    const response = await app
      .post('/categories')
      .send(mockCategoryData({ icon: '' }));

    // Assert
    expect(response.status).toBe(400);
  });

  it('Should return 422 when icon contains letters', async () => {
    // Act
    const { app } = await initTestApp();
    const response = await app
      .post('/categories')
      .send(mockCategoryData({ icon: faker.lorem.word() }));

    // Assert
    expect(response.status).toBe(422);
  });

  it('Should return 422 when icon contains more than two emojis', async () => {
    // Act
    const { app } = await initTestApp();
    const response = await app
      .post('/categories')
      .send(mockCategoryData({ icon: '🍔🍻' }));

    // Assert
    expect(response.status).toBe(422);
  });

  it('Should save new category on database', async () => {
    // Act
    const { app } = await initTestApp();
    const payload = mockCategoryData();
    const response = await app.post('/categories').send(payload);

    const savedCategory = await CategorySchema.findOne().where({
      id: response.body.id,
    });

    // Assert
    expect(savedCategory?.icon).toBe(payload.icon);
    expect(savedCategory?.name).toBe(payload.name);
    expect(response.status).toBe(201);
  });
});
