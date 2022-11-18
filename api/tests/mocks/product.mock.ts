import { ProductData } from '@/entities';
import { faker } from '@faker-js/faker';
import cuid from 'cuid';

interface Options extends ProductData {
  ingredientIcon: string;
  ingredientName: string;
}

export const mockProductData = (data?: Partial<Options>): ProductData => ({
  categoryId: cuid(),
  description: data?.description ?? faker.lorem.words(),
  imageName: faker.system.fileName(),
  name: data?.name ?? faker.lorem.word(),
  price: faker.datatype.number(),
  ingredients: [
    {
      icon: data?.ingredientIcon ?? '🧀',
      name: data?.ingredientName ?? faker.lorem.word(),
    },
  ],
});
