import { mockCategoryData } from '@tests/mocks';
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

  it('Should return 200 with a list of registered categories', async () => {
    // Arrange
    const { app } = await initTestApp();
    const category = await app.post('/categories').send(mockCategoryData());

    // Act
    const response = await app.get('/categories');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(category.body);
  });
});
