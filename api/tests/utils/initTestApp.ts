import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '@/main/app/app';
import cuid from 'cuid';
import fs from 'node:fs';
import path from 'node:path';

export async function createUploadsFolder() {
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'uploads_test'))) {
    return;
  }

  fs.mkdirSync(path.resolve(__dirname, '..', '..', 'uploads_test'));
}

export interface TestApp {
  app: supertest.SuperTest<supertest.Test>;
}

export async function initTestApp(): Promise<TestApp> {
  const databaseName = cuid();
  await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);

  return {
    app: supertest(app),
  };
}
