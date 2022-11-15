import { Category } from '@/entities';

export interface CategoriesRepository {
  exists(name: string): Promise<boolean>;
  save(category: Category): Promise<void>;
}
