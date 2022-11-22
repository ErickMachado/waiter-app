import { initTestApp } from '@tests/utils/initTestApp';
import mongoose from 'mongoose';

describe('GET /orders', () => {
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('Should return a list of orders', async () => {
    //Arrange
    const { app } = await initTestApp();

    // Act
    const { statusCode, body } = await app.get('/orders');

    // Assert
    expect(statusCode).toBe(200);
    expect(body).toEqual([]);
  });
});
