import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '@/main/app/app';
import cuid from 'cuid';

export interface TestApp {
  app: supertest.SuperTest<supertest.Test>;
  connection: typeof mongoose;
  databaseName: string;
}

export async function initTestApp(): Promise<TestApp> {
  const databaseName = cuid();
  const connection = await mongoose.connect(
    `mongodb://localhost:27017/${databaseName}`
  );

  return {
    connection,
    databaseName,
    app: supertest(app),
  };
}
