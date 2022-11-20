import { Product } from '@/entities';

export interface ProductsRepository {
  listAll(): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
