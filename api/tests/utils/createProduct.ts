import supertest from 'supertest';
import path from 'node:path';
import { faker } from '@faker-js/faker';
import { ProductData } from '@/entities';

const IMAGE_TEST_PATH = path.resolve(__dirname, '..', 'mocks', 'test.jpg');

export async function createProduct(
  app: supertest.SuperTest<supertest.Test>,
  data?: Partial<ProductData>
) {
  await app
    .post('/products')
    .set('Content-Type', 'multipart/form-data')
    .attach('image', IMAGE_TEST_PATH)
    .field('description', faker.lorem.words())
    .field('name', faker.lorem.word())
    .field('categoryId', data?.categoryId || faker.datatype.uuid())
    .field('price', faker.datatype.number().toString())
    .field(
      'ingredients',
      JSON.stringify([{ icon: '🧀', name: faker.lorem.word() }])
    );
}
