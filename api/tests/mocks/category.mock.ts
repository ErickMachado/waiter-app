import { faker } from '@faker-js/faker';
import { CategoryData } from '@/entities';

export const mockCategoryData = (
  data?: Partial<CategoryData>
): CategoryData => ({
  icon: data?.icon ?? '🍎',
  name: data?.name ?? faker.lorem.word(),
});
