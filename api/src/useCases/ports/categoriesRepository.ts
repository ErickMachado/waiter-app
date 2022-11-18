import { Category } from '@/entities';

export interface CategoriesRepository {
  exists(name: string): Promise<boolean>;
  findById(categoryId: string): Promise<Category | undefined>;
  listAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
}
