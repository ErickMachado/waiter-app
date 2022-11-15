import { faker } from '@faker-js/faker';
import { CategoryData } from '@/entities';

interface CategoryDataMockOptions {
  icon?: string;
  name?: string;
}

export const mockCategoryData = (
  options?: CategoryDataMockOptions
): CategoryData => ({
  icon: options?.icon ?? '🍎',
  name: options?.name ?? faker.lorem.word(),
});
