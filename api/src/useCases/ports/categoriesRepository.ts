import { Category } from '@/entities';

export interface CategoriesRepository {
  exists(name: string): Promise<boolean>;
  listAll(): Promise<Category[]>;
  save(category: Category): Promise<void>;
}
