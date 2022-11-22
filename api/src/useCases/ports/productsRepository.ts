import { Product } from '@/entities';

export interface ProductsRepository {
  exists(productId: string): Promise<boolean>;
  findById(productId: string): Promise<Product | undefined>;
  listAll(): Promise<Product[]>;
  listAllByCategoryId(categoryId: string): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
