import { Product } from '@/entities';

export interface ProductsRepository {
  listAll(): Promise<Product[]>;
  listAllByCategoryId(categoryId: string): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
